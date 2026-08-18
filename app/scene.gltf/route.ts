import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const scene = await readFile(join(process.cwd(), 'scene.gltf'), 'utf8')
        return new NextResponse(scene, {
            headers: {
                'Cache-Control': 'public, max-age=3600',
                'Content-Type': 'model/gltf+json'
            }
        })
    } catch {
        return new NextResponse('scene.gltf is not available in this checkout', { status: 404 })
    }
}
