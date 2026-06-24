import type { FileRouter } from 'uploadthing/next'

import { createUploadthing } from 'uploadthing/next'

import '@/env.mjs'

const f = createUploadthing()

export const ourFileRouter = {
    editorUploader: f({
        image: { maxFileSize: '8MB', maxFileCount: 8 },
        video: { maxFileSize: '64MB', maxFileCount: 2 },
        audio: { maxFileSize: '32MB', maxFileCount: 2 },
        pdf: { maxFileSize: '16MB', maxFileCount: 4 },
        text: { maxFileSize: '2MB', maxFileCount: 4 },
        blob: { maxFileSize: '16MB', maxFileCount: 4 }
    })
        .middleware(() => ({}))
        .onUploadComplete(({ file }) => ({
            key: file.key,
            name: file.name,
            size: file.size,
            type: file.type,
            url: file.ufsUrl
        }))
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
