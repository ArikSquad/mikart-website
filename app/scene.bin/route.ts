import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const scene = await readFile(join(process.cwd(), 'scene.bin'))
        return new NextResponse(scene, {
            headers: {
                'Cache-Control': 'public, max-age=3600',
                'Content-Type': 'application/octet-stream'
            }
        })
    } catch {
        return new NextResponse('scene.bin is not available in this checkout', { status: 404 })
    }
}
