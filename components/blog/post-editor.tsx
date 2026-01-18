"use client"

import { useEffect, useRef, useState } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"
import {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import { ColorHighlightPopover } from "@/components/tiptap-ui/color-highlight-popover"
import { LinkPopover } from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"
import { X, Plus, Save, Eye, EyeOff, Loader2 } from "lucide-react"

import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"
import "@/components/tiptap-templates/simple/simple-editor.scss"

interface PostEditorProps {
    initialData?: {
        _id?: string
        title: string
        content: any
        tags?: string[]
        slug: string
        isPublished: boolean
        followupUrl?: string
    }
    onSave: (data: {
        title: string
        content: any
        tags?: string[]
        slug: string
        isPublished: boolean
        followupUrl?: string
    }) => Promise<void>
    onCancel: () => void
}

export function PostEditor({ initialData, onSave, onCancel }: PostEditorProps) {
    const [title, setTitle] = useState(initialData?.title || "")
    const [slug, setSlug] = useState(initialData?.slug || "")
    const [tags, setTags] = useState<string[]>(initialData?.tags || [])
    const [tagInput, setTagInput] = useState("")
    const [isPublished, setIsPublished] = useState(initialData?.isPublished || false)
    const [followupUrl, setFollowupUrl] = useState(initialData?.followupUrl || "")
    const [isSaving, setIsSaving] = useState(false)
    const toolbarRef = useRef<HTMLDivElement>(null)

    const editor = useEditor({
        immediatelyRender: false,
        editorProps: {
            attributes: {
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
                "aria-label": "Post content area",
                class: "simple-editor min-h-[300px]",
            },
        },
        extensions: [
            StarterKit.configure({
                horizontalRule: false,
                link: {
                    openOnClick: false,
                    enableClickSelection: true,
                },
            }),
            HorizontalRule,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Highlight.configure({ multicolor: true }),
            Image,
            Typography,
            Superscript,
            Subscript,
            Selection,
            ImageUploadNode.configure({
                accept: "image/*",
                maxSize: MAX_FILE_SIZE,
                limit: 3,
                upload: handleImageUpload,
                onError: (error) => console.error("Upload failed:", error),
            }),
        ],
        content: initialData?.content || { type: "doc", content: [{ type: "paragraph" }] },
    })

    // Auto-generate slug from title
    useEffect(() => {
        if (!initialData?._id && title) {
            const generatedSlug = title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-")
                .trim()
            setSlug(generatedSlug)
        }
    }, [title, initialData?._id])

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()])
            setTagInput("")
        }
    }

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove))
    }

    const handleSave = async () => {
        if (!title.trim() || !slug.trim()) {
            return
        }

        setIsSaving(true)
        try {
            await onSave({
                title,
                content: editor?.getJSON() || { type: "doc", content: [] },
                tags: tags.length > 0 ? tags : undefined,
                slug,
                isPublished,
                followupUrl: followupUrl.trim() || undefined,
            })
        } catch (error) {
            console.error("Failed to save post:", error)
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 max-h-[80vh] overflow-y-auto">
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        placeholder="Post title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                        id="slug"
                        placeholder="post-slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                    />
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="tags">Tags</Label>
                    <div className="flex gap-2">
                        <Input
                            id="tags"
                            placeholder="Add a tag"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault()
                                    handleAddTag()
                                }
                            }}
                        />
                        <Button type="button" variant="outline" size="icon" onClick={handleAddTag}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                            {tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="gap-1">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="ml-1 hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="followupUrl">Followup URL (optional)</Label>
                    <Input
                        id="followupUrl"
                        placeholder="https://..."
                        value={followupUrl}
                        onChange={(e) => setFollowupUrl(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3">
                    <Switch
                        id="published"
                        checked={isPublished}
                        onCheckedChange={setIsPublished}
                    />
                    <Label htmlFor="published" className="flex items-center gap-2 cursor-pointer">
                        {isPublished ? (
                            <>
                                <Eye className="h-4 w-4" />
                                Published
                            </>
                        ) : (
                            <>
                                <EyeOff className="h-4 w-4" />
                                Draft
                            </>
                        )}
                    </Label>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Content</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="simple-editor-wrapper">
                        <EditorContext.Provider value={{ editor }}>
                            <Toolbar ref={toolbarRef} className="sticky top-0 z-10 border-b">
                                <Spacer />
                                <ToolbarGroup>
                                    <UndoRedoButton action="undo" />
                                    <UndoRedoButton action="redo" />
                                </ToolbarGroup>
                                <ToolbarSeparator />
                                <ToolbarGroup>
                                    <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
                                    <ListDropdownMenu types={["bulletList", "orderedList", "taskList"]} />
                                    <BlockquoteButton />
                                    <CodeBlockButton />
                                </ToolbarGroup>
                                <ToolbarSeparator />
                                <ToolbarGroup>
                                    <MarkButton type="bold" />
                                    <MarkButton type="italic" />
                                    <MarkButton type="strike" />
                                    <MarkButton type="code" />
                                    <MarkButton type="underline" />
                                    <ColorHighlightPopover />
                                    <LinkPopover />
                                </ToolbarGroup>
                                <ToolbarSeparator />
                                <ToolbarGroup>
                                    <MarkButton type="superscript" />
                                    <MarkButton type="subscript" />
                                </ToolbarGroup>
                                <ToolbarSeparator />
                                <ToolbarGroup>
                                    <TextAlignButton align="left" />
                                    <TextAlignButton align="center" />
                                    <TextAlignButton align="right" />
                                    <TextAlignButton align="justify" />
                                </ToolbarGroup>
                                <ToolbarSeparator />
                                <ToolbarGroup>
                                    <ImageUploadButton text="Add" />
                                </ToolbarGroup>
                                <Spacer />
                            </Toolbar>

                            <EditorContent
                                editor={editor}
                                role="presentation"
                                className="simple-editor-content p-4"
                            />
                        </EditorContext.Provider>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving || !title.trim() || !slug.trim()}>
                    {isSaving ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4" />
                            Save Post
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
