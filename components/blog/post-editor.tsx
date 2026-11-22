'use client'

import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import { Plate, useEditorRef, usePlateEditor } from 'platejs/react'
import {
    AudioLines,
    Bold,
    Code,
    FileText,
    Film,
    Globe,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    Highlighter,
    Image as ImageIcon,
    Indent,
    Italic,
    Keyboard,
    Loader2,
    Outdent,
    Paperclip,
    Pilcrow,
    Plus,
    Quote,
    Redo2,
    Save,
    SeparatorHorizontal,
    Strikethrough,
    Subscript,
    Superscript,
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
import { IndentToolbarButton, OutdentToolbarButton } from '@/components/ui/indent-toolbar-button'
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
        <div className="flex h-[calc(100svh-14rem)] min-h-[680px] flex-col overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-border/70 border-b px-4 py-3 sm:px-5">
                <div className="flex items-center gap-3">
                    {initialData?.isPublished ? (
                        <Badge
                            variant="outline"
                            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        >
                            <Globe className="size-3" aria-hidden="true" />
                            Published
                        </Badge>
                    ) : initialData?._id ? (
                        <Badge variant="secondary" className="rounded-md">
                            <FileText className="size-3" aria-hidden="true" />
                            Draft
                        </Badge>
                    ) : (
                        <Badge variant="secondary" className="rounded-md">
                            Draft
                        </Badge>
                    )}
                </div>
                <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                    <Button variant="ghost" size="sm" onClick={onCancel} disabled={isSaving}>
                        Cancel
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSave(false)}
                        disabled={isSaving || !isFormValid}
                    >
                        {isSaving && saveAction === 'draft' ? (
                            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                        ) : (
                            <Save className="size-4" aria-hidden="true" />
                        )}
                        Save draft
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => handleSave(true)}
                        disabled={isSaving || !isFormValid}
                        className="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                    >
                        {isSaving && saveAction === 'publish' ? (
                            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                        ) : (
                            <Globe className="size-4" aria-hidden="true" />
                        )}
                        Publish
                    </Button>
                </div>
            </div>

            <div className="shrink-0 space-y-2 border-border/70 border-b bg-background p-4 sm:p-5">
                <div className="mx-auto w-full max-w-[1120px]">
                    <Input
                        aria-label="Post title"
                        placeholder="Untitled post"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        className="h-12 border-transparent bg-transparent px-0 text-2xl font-semibold tracking-tight shadow-none placeholder:text-muted-foreground/50 focus-visible:border-transparent focus-visible:ring-0 sm:text-3xl"
                    />
                    <Input
                        aria-label="Post description"
                        placeholder="Add a short description or lead paragraph"
                        value={desc}
                        onChange={(event) => setDesc(event.target.value)}
                        className="h-8 border-transparent bg-transparent px-0 text-muted-foreground text-sm shadow-none placeholder:text-muted-foreground/60 focus-visible:border-transparent focus-visible:ring-0"
                    />
                </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col">
                <Plate editor={editor} onValueChange={({ value }) => setContent(value as any)}>
                    <div className="shrink-0 border-border/70 border-b bg-muted/20 px-3 py-2 sm:px-4">
                        <PostToolbar />
                    </div>

                    <div className="grid min-h-0 flex-1 overflow-hidden lg:grid-cols-[minmax(0,1fr)_19rem] max-lg:overflow-y-auto">
                        <div className="min-h-[520px] min-w-0 overflow-y-auto bg-muted/20 p-4 sm:p-8 max-lg:overflow-visible">
                            <div className="mx-auto min-h-full w-full max-w-4xl overflow-hidden rounded-lg border border-border/70 bg-background shadow-sm">
                                <EditorContainer className="h-auto min-h-full overflow-visible">
                                    <Editor
                                        variant="none"
                                        placeholder="Start writing your post..."
                                        className="min-h-[540px] max-w-none px-6 py-10 text-base leading-7 prose prose-sm dark:prose-invert sm:px-12"
                                    />
                                </EditorContainer>
                            </div>
                        </div>

                        <aside className="min-h-0 overflow-y-auto border-border/70 border-l bg-background p-4 sm:p-5 max-lg:border-t max-lg:border-l-0">
                            <div className="space-y-6">
                                <section>
                                    <h2 className="font-semibold text-sm">Post details</h2>
                                    <p className="mt-1.5 text-muted-foreground text-xs leading-5">
                                        Set the URL, tags, and related links for this post.
                                    </p>
                                </section>

                                <section className="space-y-2">
                                    <Label htmlFor="slug" className="text-sm font-medium">
                                        URL slug
                                    </Label>
                                    <Input
                                        id="slug"
                                        placeholder="post-slug"
                                        value={slug}
                                        onChange={(event) => setSlug(slugify(event.target.value))}
                                        className="font-mono text-sm"
                                    />
                                    <p className="break-all font-mono text-muted-foreground text-[11px]">
                                        /blog/{slug || 'your-post-slug'}
                                    </p>
                                </section>

                                <section className="space-y-2">
                                    <Label htmlFor="tags" className="flex items-center gap-2 text-sm font-medium">
                                        <Tag className="size-3.5 text-muted-foreground" aria-hidden="true" />
                                        Tags
                                    </Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="tags"
                                            placeholder="Add tag"
                                            value={tagInput}
                                            onChange={(event) => setTagInput(event.target.value)}
                                            onKeyDown={handleTagKeyDown}
                                            className="text-sm"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={handleAddTag}
                                            aria-label="Add tag"
                                        >
                                            <Plus className="size-4" aria-hidden="true" />
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {tags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="secondary"
                                                className="gap-1 rounded-md pr-1 text-xs"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => setTags(tags.filter((item) => item !== tag))}
                                                    className="rounded-full p-0.5 hover:bg-destructive/10 hover:text-destructive"
                                                    aria-label={`Remove ${tag} tag`}
                                                >
                                                    <X className="size-3" aria-hidden="true" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </section>

                                <section className="space-y-2">
                                    <Label htmlFor="followupUrl" className="text-sm font-medium">
                                        Follow-up URL
                                    </Label>
                                    <Input
                                        id="followupUrl"
                                        placeholder="https://..."
                                        value={followupUrl}
                                        onChange={(event) => setFollowupUrl(event.target.value)}
                                        className="text-sm"
                                    />
                                    <p className="text-muted-foreground text-xs leading-5">
                                        Optional link to a related post or update.
                                    </p>
                                </section>
                            </div>
                        </aside>
                    </div>
                </Plate>
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

    const insertHorizontalRule = () => {
        editor.tf.setNodes({ type: KEYS.hr })
        editor.tf.insertNodes({
            children: [{ text: '' }],
            type: KEYS.p
        })
        editor.tf.focus()
    }

    return (
        <Toolbar
            aria-label="Formatting toolbar"
            className="flex min-h-9 w-full flex-wrap items-center gap-0.5 overflow-x-auto rounded-md border border-border/70 bg-background p-1.5 shadow-xs"
        >
            <ToolbarButton type="button" tooltip="Undo" aria-label="Undo" onClick={() => editor.tf.undo()}>
                <Undo2 />
            </ToolbarButton>
            <ToolbarButton type="button" tooltip="Redo" aria-label="Redo" onClick={() => editor.tf.redo()}>
                <Redo2 />
            </ToolbarButton>
            <ToolbarSeparator />

            <ToolbarButton type="button" tooltip="Paragraph" aria-label="Paragraph" onClick={() => toggleBlock(KEYS.p)}>
                <Pilcrow />
            </ToolbarButton>
            <ToolbarButton type="button" tooltip="Heading 1" aria-label="Heading 1" onClick={() => toggleBlock('h1')}>
                <Heading1 />
            </ToolbarButton>
            <ToolbarButton type="button" tooltip="Heading 2" aria-label="Heading 2" onClick={() => toggleBlock('h2')}>
                <Heading2 />
            </ToolbarButton>
            <ToolbarButton type="button" tooltip="Heading 3" aria-label="Heading 3" onClick={() => toggleBlock('h3')}>
                <Heading3 />
            </ToolbarButton>
            <ToolbarButton type="button" tooltip="Heading 4" aria-label="Heading 4" onClick={() => toggleBlock('h4')}>
                <Heading4 />
            </ToolbarButton>
            <ToolbarButton type="button" tooltip="Heading 5" aria-label="Heading 5" onClick={() => toggleBlock('h5')}>
                <Heading5 />
            </ToolbarButton>
            <ToolbarButton type="button" tooltip="Heading 6" aria-label="Heading 6" onClick={() => toggleBlock('h6')}>
                <Heading6 />
            </ToolbarButton>
            <ToolbarButton
                type="button"
                tooltip="Blockquote"
                aria-label="Blockquote"
                onClick={() => toggleBlock(KEYS.blockquote)}
            >
                <Quote />
            </ToolbarButton>
            <ToolbarButton
                type="button"
                tooltip="Horizontal rule"
                aria-label="Horizontal rule"
                onClick={insertHorizontalRule}
            >
                <SeparatorHorizontal />
            </ToolbarButton>

            <ToolbarSeparator />
            <BulletedListToolbarButton />
            <NumberedListToolbarButton />
            <TodoListToolbarButton aria-label="Todo list" />
            <OutdentToolbarButton aria-label="Outdent" />
            <IndentToolbarButton aria-label="Indent" />

            <ToolbarSeparator />
            <MarkToolbarButton nodeType="bold" tooltip="Bold" aria-label="Bold">
                <Bold />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType="italic" tooltip="Italic" aria-label="Italic">
                <Italic />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType="underline" tooltip="Underline" aria-label="Underline">
                <Underline />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType="strikethrough" tooltip="Strikethrough" aria-label="Strikethrough">
                <Strikethrough />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType="code" tooltip="Inline code" aria-label="Inline code">
                <Code />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType="highlight" tooltip="Highlight" aria-label="Highlight">
                <Highlighter />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType="subscript" tooltip="Subscript" aria-label="Subscript">
                <Subscript />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType="superscript" tooltip="Superscript" aria-label="Superscript">
                <Superscript />
            </MarkToolbarButton>
            <MarkToolbarButton nodeType="kbd" tooltip="Keyboard input" aria-label="Keyboard input">
                <Keyboard />
            </MarkToolbarButton>

            <ToolbarSeparator />
            <MediaToolbarButton nodeType={KEYS.img} />
            <MediaToolbarButton nodeType={KEYS.video} />
            <MediaToolbarButton nodeType={KEYS.audio} />
            <MediaToolbarButton nodeType={KEYS.file} />
        </Toolbar>
    )
}
