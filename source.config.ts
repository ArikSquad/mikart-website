import { defineDocs, defineConfig } from 'fumadocs-mdx/config'
import lastModified from 'fumadocs-mdx/plugins/last-modified'
import jsonSchema from 'fumadocs-mdx/plugins/json-schema'

export const docs = defineDocs({
    dir: 'content/docs',
    docs: {
        async: true,
        postprocess: {
            includeProcessedMarkdown: true,
            extractLinkReferences: true
        }
    }
})

export default defineConfig({
    plugins: [
        jsonSchema({
            insert: true
        }),
        lastModified()
    ]
})
