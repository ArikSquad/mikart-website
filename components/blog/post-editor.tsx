'use client'

import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import { Plate, useEditorRef, usePlateEditor } from 'platejs/react'
import {
    Bold,
    Code,
    FileText,
    Globe,
    Heading1,
    Heading2,
    Heading3,
    Highlighter,
    Italic,
    Loader2,
    Plus,
    Quote,
    Redo2,
    Save,
    Strikethrough,
    Tag,
    Underline,
    Undo2,
    X
} from 'lucide-react'

import { BasicNodesKit } from '@/components/editor/plugins/basic-nodes-kit'
import { Editor, EditorContainer } from '@/components/ui/editor'
import {
    BulletedListToolbarButton,
    NumberedListToolbarButton,
    TodoListToolbarButton
} from '@/components/ui/list-toolbar-button'
import { MarkToolbarButton } from '@/components/ui/mark-toolbar-button'
import { MediaToolbarButton } from '@/components/ui/media-toolbar-button'
import { Toolbar, ToolbarButton, ToolbarSeparator } from '@/components/ui/toolbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { normalizePlateContent } from '@/lib/plate-content'
import { KEYS } from 'platejs'

export type PostEditorValue = {
    title: string
    description?: string
    content: unknown
    tags?: string[]
    slug: string
    isPublished: boolean
    followupUrl?: string
}

type PostEditorInitialData = PostEditorValue & {
    _id?: string
}

interface PostEditorProps {
    initialData?: PostEditorInitialData
    onSave: (data: PostEditorValue) => Promise<void>
    onCancel: () => void
}

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
}

export function PostEditor({ initialData, onSave, onCancel }: PostEditorProps) {
    const [title, setTitle] = useState(initialData?.title || '')
    const [desc, setDesc] = useState(initialData?.description || '')
    const [slug, setSlug] = useState(initialData?.slug || '')
    const [tags, setTags] = useState<string[]>(initialData?.tags || [])
    const [tagInput, setTagInput] = useState('')
    const [followupUrl, setFollowupUrl] = useState(initialData?.followupUrl || '')
    const [content, setContent] = useState(() => normalizePlateContent(initialData?.content))
    const [isSaving, setIsSaving] = useState(false)
    const [saveAction, setSaveAction] = useState<'publish' | 'draft' | null>(null)

    const initialValue = useMemo(() => normalizePlateContent(initialData?.content), [initialData?.content])
    const editor = usePlateEditor({
        plugins: BasicNodesKit,
        value: initialValue
    })

    useEffect(() => {
        if (!initialData?._id) {
            setSlug(slugify(title))
        }
    }, [title, initialData?._id])

    const handleAddTag = () => {
        const tag = tagInput.trim().toLowerCase()
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag])
            setTagInput('')
        }
    }

    const handleTagKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') return

        event.preventDefault()
        handleAddTag()
    }

    const handleSave = async (publish: boolean) => {
        if (!title.trim() || !slug.trim()) return

        setIsSaving(true)
        setSaveAction(publish ? 'publish' : 'draft')
        try {
            await onSave({
                title: title.trim(),
                description: desc.trim() || undefined,
                content,
                tags: tags.length > 0 ? tags : undefined,
                slug: slugify(slug),
                isPublished: publish,
                followupUrl: followupUrl.trim() || undefined
            })
        } finally {
            setIsSaving(false)
            setSaveAction(null)
        }
    }

    const isFormValid = title.trim().length > 0 && slugify(slug).length > 0

    return (
        <div className="flex h-[calc(100vh-12rem)] min-h-[720px] flex-col overflow-hidden rounded-lg border bg-card">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold">{initialData?._id ? 'Edit Post' : 'New Post'}</h2>
                    {initialData?.isPublished ? (
                        <Badge variant="default" className="border-green-500/20 bg-green-500/10 text-green-600">
                            <Globe className="mr-1 h-3 w-3" />
                            Published
                        </Badge>
                    ) : initialData?._id ? (
                        <Badge variant="secondary">
                            <FileText className="mr-1 h-3 w-3" />
                            Draft
                        </Badge>
                    ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSave(false)}
                        disabled={isSaving || !isFormValid}
                    >
                        {isSaving && saveAction === 'draft' ? (
                            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-1.5 h-4 w-4" />
                        )}
                        Save Draft
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => handleSave(true)}
                        disabled={isSaving || !isFormValid}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {isSaving && saveAction === 'publish' ? (
                            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                        ) : (
                            <Globe className="mr-1.5 h-4 w-4" />
                        )}
                        Publish
                    </Button>
                </div>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-r">
                    <div className="space-y-3 border-b p-4">
                        <Input
                            placeholder="Post title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="h-11 w-full text-lg font-medium"
                        />
                        <Input
                            placeholder="Lead paragraph"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div className="min-h-0 flex-1 overflow-hidden bg-background">
                        <Plate editor={editor} onValueChange={({ value }) => setContent(value as any)}>
                            <PostToolbar />
                            <EditorContainer className="h-[calc(100%-41px)]">
                                <Editor
                                    variant="none"
                                    placeholder="Write your post..."
                                    className="min-h-full max-w-none px-6 py-5 prose prose-sm dark:prose-invert"
                                />
                            </EditorContainer>
                        </Plate>
                    </div>
                </div>

                <aside className="min-h-0 space-y-5 overflow-y-auto bg-muted/20 p-4">
                    <div className="space-y-2">
                        <Label htmlFor="slug" className="flex items-center gap-2 text-sm font-medium">
                            URL Slug
                        </Label>
                        <Input
                            id="slug"
                            placeholder="post-slug"
                            value={slug}
                            onChange={(e) => setSlug(slugify(e.target.value))}
                            className="font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">/blog/{slug || 'your-post-slug'}</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tags" className="flex items-center gap-2 text-sm font-medium">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            Tags
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="tags"
                                placeholder="Add tag..."
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                className="text-sm"
                            />
                            <Button type="button" variant="outline" size="icon" onClick={handleAddTag}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="gap-1 pr-1 text-xs">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => setTags(tags.filter((item) => item !== tag))}
                                        className="rounded-full p-0.5 hover:bg-destructive/10 hover:text-destructive"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="followupUrl" className="text-sm text-muted-foreground">
                            Followup URL
                        </Label>
                        <Input
                            id="followupUrl"
                            placeholder="https://..."
                            value={followupUrl}
                            onChange={(e) => setFollowupUrl(e.target.value)}
                            className="text-sm"
                        />
                        <p className="text-xs text-muted-foreground">Link to a related post or update</p>
                    </div>
                </aside>
            </div>
        </div>
    )
}

function PostToolbar() {
    const editor = useEditorRef()

    const toggleBlock = (type: string) => {
        editor.tf.toggleBlock(type)
        editor.tf.focus()
    }

    return (
        <Toolbar className="h-10 shrink-0 gap-1 overflow-x-auto border-b bg-muted/30 px-2">
            <ToolbarButton tooltip="Undo" onClick={() => editor.tf.undo()}>
                <Undo2 />
            </ToolbarButton>
            <ToolbarButton tooltip="Redo" onClick={() => editor.tf.redo()}>
                <Redo2 />
            </ToolbarButton>
            <ToolbarSeparator />
            <ToolbarButton tooltip="Heading 1" onClick={() => toggleBlock('h1')}>
                <Heading1 />
            </ToolbarButton>
            <ToolbarButton tooltip="Heading 2" onClick={() => toggleBlock('h2')}>
                <Heading2 />
            </ToolbarButton>
            <ToolbarButton tooltip="Heading 3" onClick={() => toggleBlock('h3')}>
                <Heading3 />
            </ToolbarButton>
            <ToolbarButton tooltip="Quote" onClick={() => toggleBlock('blockquote')}>
                <Quote />
            </ToolbarButton>
            <BulletedListToolbarButton />
            <NumberedListToolbarButton />
            <TodoListToolbarButton />
            <ToolbarSeparator />
            <MarkToolbarButton nodeType="bold" tooltip="Bold">
                <Bold />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType="italic" tooltip="Italic">
                <Italic />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType="underline" tooltip="Underline">
                <Underline />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType="strikethrough" tooltip="Strikethrough">
                <Strikethrough />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType="code" tooltip="Code">
                <Code />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType="highlight" tooltip="Highlight">
                <Highlighter />
            </MarkToolbarButton>
            <ToolbarSeparator />
            <MediaToolbarButton nodeType={KEYS.img} />
        </Toolbar>
    )
}
