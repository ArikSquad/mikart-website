import { docs } from 'fumadocs-mdx/collections/server'
import { loader, LoaderPlugin } from 'fumadocs-core/source'
import {lucideIconsPlugin} from "fumadocs-core/source/lucide-icons";

export const source = loader({
    baseUrl: '/docs',
    source: docs.toFumadocsSource(),
    plugins: [pageTreeCodeTitles(), lucideIconsPlugin()]
})

function pageTreeCodeTitles(): LoaderPlugin {
    return {
        transformPageTree: {
            file(node) {
                if (typeof node.name === 'string' && (node.name.endsWith('()') || node.name.match(/^<\w+ \/>$/))) {
                    return {
                        ...node,
                        name: <code className="text-[13px]">{node.name}</code>
                    }
                }
                return node
            }
        }
    }
}