"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"

interface TiptapRendererProps {
    content: any
    className?: string
}

export function TiptapRenderer({ content, className }: TiptapRendererProps) {
    const editor = useEditor({
        editable: false,
        immediatelyRender: false,
        content: content || { type: "doc", content: [] },
        extensions: [
            StarterKit.configure({
                horizontalRule: {},
            }),
            Image,
            TaskList,
            TaskItem,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Highlight.configure({ multicolor: true }),
            Subscript,
            Superscript,
        ],
        editorProps: {
            attributes: {
                class: className || "",
            },
        },
    })

    if (!editor) {
        return null
    }

    return <EditorContent editor={editor} />
}
