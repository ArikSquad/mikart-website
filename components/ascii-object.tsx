'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'

type AsciiObjectProps = {
    src: string
    className?: string
    accent?: string
    highlight?: string
    cellSize?: number
    contrast?: number
    autoRotate?: boolean
    orbit?: boolean
    zoom?: boolean
    ariaLabel?: string
}

const GLYPHS = ' .:-=+*#%@'

export function AsciiObject({
    src,
    className = '',
    accent = '#c6ff4f',
    highlight = '#5d7cff',
    cellSize = 8,
    contrast = 1.25,
    autoRotate = true,
    orbit = true,
    zoom = false,
    ariaLabel = 'Interactive ASCII object'
}: AsciiObjectProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const context = canvas.getContext('2d')
        if (!context) return
        const targetCanvas = canvas
        const targetContext = context

        let disposed = false
        let renderTarget: THREE.WebGLRenderTarget | null = null
        let renderer: THREE.WebGLRenderer | null = null
        let columns = 1
        let rows = 1
        let pixels = new Uint8Array(4)
        let width = 1
        let height = 1
        let timerId: number | null = null
        let dragging = false
        let lastPointerX = 0
        let lastPointerY = 0
        let yaw = 0.25
        let pitch = 0.05
        let cameraDistance = 4.2
        let model: THREE.Object3D | null = null

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
        camera.position.set(0, 0.05, cameraDistance)

        const objectRoot = new THREE.Group()
        scene.add(objectRoot)

        const ambient = new THREE.HemisphereLight(0xe9ffcc, 0x091108, 2.3)
        scene.add(ambient)

        const keyLight = new THREE.DirectionalLight(0xffffff, 4.1)
        keyLight.position.set(2.4, 4.5, 4)
        scene.add(keyLight)

        const rimLight = new THREE.PointLight(new THREE.Color(highlight), 42, 18, 2)
        rimLight.position.set(-3, 1.5, -2)
        scene.add(rimLight)

        function setMaterialColor(material: THREE.Material) {
            const candidate = material as THREE.MeshStandardMaterial
            if ('color' in candidate && candidate.color instanceof THREE.Color) {
                candidate.color.lerp(new THREE.Color(accent), 0.26)
                candidate.roughness = Math.min(candidate.roughness ?? 0.5, 0.68)
            }
        }

        function disposeObject(object: THREE.Object3D) {
            object.traverse((child) => {
                const mesh = child as THREE.Mesh
                mesh.geometry?.dispose()
                const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
                materials.forEach((material) => material?.dispose())
            })
        }

        function createFallbackObject() {
            const group = new THREE.Group()
            const material = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.46, metalness: 0.08 })
            const darkMaterial = new THREE.MeshStandardMaterial({ color: '#536f37', roughness: 0.6 })

            const body = new THREE.Mesh(new THREE.DodecahedronGeometry(1.05, 1), material)
            body.scale.set(1.08, 0.84, 0.96)
            body.position.y = -0.12
            group.add(body)

            const head = new THREE.Mesh(new THREE.IcosahedronGeometry(0.68, 1), material)
            head.position.set(0.08, 0.84, 0.04)
            group.add(head)

            const beak = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.62, 4), darkMaterial)
            beak.rotation.z = -Math.PI / 2
            beak.position.set(0.68, 0.79, 0.06)
            group.add(beak)

            const wingGeometry = new THREE.SphereGeometry(0.58, 8, 5)
            const wing = new THREE.Mesh(wingGeometry, darkMaterial)
            wing.scale.set(0.35, 0.92, 0.72)
            wing.position.set(-0.85, -0.02, 0.1)
            wing.rotation.z = -0.28
            group.add(wing)

            const eyeGeometry = new THREE.SphereGeometry(0.095, 8, 8)
            const eyeMaterial = new THREE.MeshBasicMaterial({ color: '#11180d' })
            const eye = new THREE.Mesh(eyeGeometry, eyeMaterial)
            eye.position.set(0.53, 1.12, 0.54)
            group.add(eye)
            const otherEye = eye.clone()
            otherEye.position.z = -0.48
            group.add(otherEye)

            return group
        }

        function fitObject(nextModel: THREE.Object3D) {
            if (model) {
                objectRoot.remove(model)
                disposeObject(model)
            }
            model = nextModel
            const box = new THREE.Box3().setFromObject(nextModel)
            const center = box.getCenter(new THREE.Vector3())
            const size = box.getSize(new THREE.Vector3())
            const longestSide = Math.max(size.x, size.y, size.z, 0.001)
            nextModel.position.sub(center)
            nextModel.scale.setScalar(2.5 / longestSide)
            nextModel.traverse((child) => {
                const mesh = child as THREE.Mesh
                const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
                materials.forEach((material) => material && setMaterialColor(material))
            })
            objectRoot.add(nextModel)
        }

        function drawNoWebglFallback() {
            targetContext.clearRect(0, 0, width, height)
            targetContext.font = `${Math.max(10, cellSize)}px var(--font-geist-mono), monospace`
            targetContext.textAlign = 'center'
            targetContext.textBaseline = 'middle'
            targetContext.fillStyle = accent
            targetContext.fillText('WEBGL / READY', width / 2, height / 2)
        }

        try {
            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' })
            renderer.setPixelRatio(1)
            renderer.setClearColor(0x000000, 0)
            renderer.toneMapping = THREE.ACESFilmicToneMapping
            renderer.toneMappingExposure = 1.2
        } catch {
            drawNoWebglFallback()
            return () => {
                disposed = true
            }
        }

        function resize() {
            const rect = targetCanvas.getBoundingClientRect()
            width = Math.max(1, Math.floor(rect.width))
            height = Math.max(1, Math.floor(rect.height))
            columns = Math.max(28, Math.min(100, Math.floor(width / Math.max(5, cellSize * 1.15))))
            rows = Math.max(16, Math.floor(height / Math.max(9, cellSize * 2)))
            renderTarget?.dispose()
            renderTarget = new THREE.WebGLRenderTarget(columns, rows, {
                minFilter: THREE.NearestFilter,
                magFilter: THREE.NearestFilter,
                depthBuffer: true,
                stencilBuffer: false
            })
            pixels = new Uint8Array(columns * rows * 4)
            targetCanvas.width = width
            targetCanvas.height = height
            camera.aspect = columns / rows
            camera.updateProjectionMatrix()
            renderer?.setSize(columns, rows, false)
            targetContext.font = `${Math.max(8, Math.floor((height / rows) * 1.05))}px var(--font-geist-mono), monospace`
            targetContext.textAlign = 'center'
            targetContext.textBaseline = 'top'
        }

        function drawAscii() {
            if (!renderer || !renderTarget) return
            renderer.setRenderTarget(renderTarget)
            renderer.render(scene, camera)
            renderer.readRenderTargetPixels(renderTarget, 0, 0, columns, rows, pixels)
            renderer.setRenderTarget(null)

            targetContext.clearRect(0, 0, width, height)
            const cellWidth = width / columns
            const cellHeight = height / rows
            const scale = Math.max(0.55, Math.min(1.25, contrast))

            for (let y = 0; y < rows; y += 1) {
                for (let x = 0; x < columns; x += 1) {
                    const sourceY = rows - y - 1
                    const pixelIndex = (sourceY * columns + x) * 4
                    const red = pixels[pixelIndex]
                    const green = pixels[pixelIndex + 1]
                    const blue = pixels[pixelIndex + 2]
                    const alpha = pixels[pixelIndex + 3]
                    const luminance = ((red * 0.2126 + green * 0.7152 + blue * 0.0722) / 255) * scale
                    if (alpha < 12 || luminance < 0.035) continue
                    const index = Math.min(GLYPHS.length - 1, Math.max(1, Math.floor(Math.min(0.999, luminance) * GLYPHS.length)))
                    const glyph = GLYPHS[index]
                    if (glyph === ' ') continue
                    if (red + green + blue > 710) {
                        targetContext.fillStyle = '#efffd0'
                    } else {
                        targetContext.fillStyle = `rgb(${Math.min(255, red + 18)}, ${Math.min(255, green + 18)}, ${Math.min(255, blue + 10)})`
                    }
                    targetContext.fillText(glyph, (x + 0.5) * cellWidth, y * cellHeight)
                }
            }
        }

        function animate(time: number) {
            if (disposed) return
            const rect = targetCanvas.getBoundingClientRect()
            if (Math.floor(rect.width) !== width || Math.floor(rect.height) !== height) resize()
            if (model) {
                objectRoot.rotation.y = yaw + (autoRotate ? time * 0.00022 : 0)
                objectRoot.rotation.x = pitch + Math.sin(time * 0.0012) * 0.035
                objectRoot.position.y = Math.sin(time * 0.0014) * 0.08
            }
            drawAscii()
        }

        function startAnimation() {
            if (timerId === null) timerId = window.setInterval(() => animate(performance.now()), 75)
        }

        function onPointerDown(event: PointerEvent) {
            if (!orbit) return
            dragging = true
            lastPointerX = event.clientX
            lastPointerY = event.clientY
            targetCanvas.setPointerCapture(event.pointerId)
        }

        function onPointerMove(event: PointerEvent) {
            if (!dragging || !orbit) return
            yaw += (event.clientX - lastPointerX) * 0.009
            pitch = Math.max(-0.7, Math.min(0.7, pitch + (event.clientY - lastPointerY) * 0.006))
            lastPointerX = event.clientX
            lastPointerY = event.clientY
        }

        function onPointerUp() {
            dragging = false
        }

        function onWheel(event: WheelEvent) {
            if (!zoom) return
            event.preventDefault()
            cameraDistance = Math.max(2.7, Math.min(7.5, cameraDistance + event.deltaY * 0.003))
            camera.position.z = cameraDistance
        }

        const resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(targetCanvas)
        window.addEventListener('resize', resize)
        resize()
        targetCanvas.addEventListener('pointerdown', onPointerDown)
        targetCanvas.addEventListener('pointermove', onPointerMove)
        targetCanvas.addEventListener('pointerup', onPointerUp)
        targetCanvas.addEventListener('pointercancel', onPointerUp)
        targetCanvas.addEventListener('wheel', onWheel, { passive: false })

        const loader = new GLTFLoader()
        loader.load(
            src,
            (gltf) => {
                if (disposed) return
                fitObject(gltf.scene)
                drawAscii()
                startAnimation()
            },
            undefined,
            () => {
                if (disposed) return
                fitObject(createFallbackObject())
                drawAscii()
                startAnimation()
            }
        )

        return () => {
            disposed = true
            if (timerId !== null) window.clearInterval(timerId)
            resizeObserver.disconnect()
            window.removeEventListener('resize', resize)
            targetCanvas.removeEventListener('pointerdown', onPointerDown)
            targetCanvas.removeEventListener('pointermove', onPointerMove)
            targetCanvas.removeEventListener('pointerup', onPointerUp)
            targetCanvas.removeEventListener('pointercancel', onPointerUp)
            targetCanvas.removeEventListener('wheel', onWheel)
            renderTarget?.dispose()
            if (model) disposeObject(model)
            renderer?.dispose()
        }
    }, [accent, autoRotate, cellSize, contrast, highlight, orbit, src, zoom])

    return (
        <div className={className}>
            <canvas ref={canvasRef} aria-label={ariaLabel} role="img" />
        </div>
    )
}
