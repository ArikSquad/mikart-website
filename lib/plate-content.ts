export const MAX_FILE_SIZE = 5 * 1024 * 1024

import type { TElement } from 'platejs'

export type PlateValue = TElement[]

export const emptyPlateValue: PlateValue = [{ type: 'p', children: [{ text: '' }] }]

const markMap: Record<string, string> = {
    bold: 'bold',
    italic: 'italic',
    strike: 'strikethrough',
    code: 'code',
    highlight: 'highlight',
    subscript: 'subscript',
    superscript: 'superscript'
}

export function normalizePlateContent(content: any): PlateValue {
    if (Array.isArray(content)) {
        return content.length > 0 ? content : emptyPlateValue
    }

    if (content?.type === 'doc') {
        const nodes = legacyNodesToPlate(content.content || [])
        return nodes.length > 0 ? nodes : emptyPlateValue
    }

    return emptyPlateValue
}

export function legacyNodesToPlate(nodes: any[]): PlateValue {
    return nodes.flatMap((node) => legacyNodeToPlate(node)).filter(Boolean)
}

function legacyNodeToPlate(node: any): any {
    const children = legacyInlineContentToPlate(node.content || [])

    switch (node.type) {
        case 'paragraph':
            return { type: 'p', align: node.attrs?.textAlign, children: children.length ? children : [{ text: '' }] }
        case 'heading':
            return {
                type: `h${node.attrs?.level || 2}`,
                align: node.attrs?.textAlign,
                children: children.length ? children : [{ text: '' }]
            }
        case 'blockquote':
            return { type: 'blockquote', children: legacyNodesToPlate(node.content || []) }
        case 'codeBlock':
            return {
                type: 'code_block',
                children: [{ type: 'code_line', children: children.length ? children : [{ text: '' }] }]
            }
        case 'bulletList':
            return { type: 'ul', children: legacyNodesToPlate(node.content || []) }
        case 'orderedList':
            return { type: 'ol', children: legacyNodesToPlate(node.content || []) }
        case 'taskList':
            return { type: 'ul', children: legacyNodesToPlate(node.content || []) }
        case 'listItem':
        case 'taskItem':
            return { type: 'li', checked: node.attrs?.checked, children: legacyNodesToPlate(node.content || []) }
        case 'image':
            return { type: 'img', url: node.attrs?.src, alt: node.attrs?.alt || '', children: [{ text: '' }] }
        case 'horizontalRule':
            return { type: 'hr', children: [{ text: '' }] }
        default:
            return { type: 'p', children: children.length ? children : [{ text: '' }] }
    }
}

function legacyInlineContentToPlate(nodes: any[]): any[] {
    return nodes.flatMap((node) => {
        if (node.type === 'text') {
            return { text: node.text || '', ...marksToPlate(node.marks || []) }
        }

        if (node.type === 'hardBreak') {
            return { text: '\n' }
        }

        return legacyNodeToPlate(node)
    })
}

function marksToPlate(marks: any[]) {
    return marks.reduce<Record<string, any>>((acc, mark) => {
        const key = markMap[mark.type]
        if (!key) return acc
        acc[key] = mark.attrs?.color || true
        return acc
    }, {})
}

export const handleImageUpload = async (file: File): Promise<string> => {
    if (!file) {
        throw new Error('No file provided')
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File size exceeds maximum allowed (${MAX_FILE_SIZE / (1024 * 1024)}MB)`)
    }

    const timestamp = Date.now()
    const extension = file.name.split('.').pop() || 'jpg'
    const filename = `blog-images/${timestamp}-${Math.random().toString(36).substring(7)}.${extension}`

    const response = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
        method: 'POST',
        body: file
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to upload image')
    }

    const blob = await response.json()
    return blob.url
}
