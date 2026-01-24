'use client'

import { useEffect, useRef, useState } from 'react'
import { EditorContent, EditorContext, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Image } from '@tiptap/extension-image'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { TextAlign } from '@tiptap/extension-text-align'
import { Typography } from '@tiptap/extension-typography'
import { Highlight } from '@tiptap/extension-highlight'
import { Subscript } from '@tiptap/extension-subscript'
import { Superscript } from '@tiptap/extension-superscript'
import { Selection } from '@tiptap/extensions'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Spacer } from '@/components/tiptap-ui-primitive/spacer'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/components/tiptap-ui-primitive/toolbar'
import { ImageUploadNode } from '@/components/tiptap-node/image-upload-node/image-upload-node-extension'
import { HorizontalRule } from '@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension'
import { HeadingDropdownMenu } from '@/components/tiptap-ui/heading-dropdown-menu'
import { ImageUploadButton } from '@/components/tiptap-ui/image-upload-button'
import { ListDropdownMenu } from '@/components/tiptap-ui/list-dropdown-menu'
import { BlockquoteButton } from '@/components/tiptap-ui/blockquote-button'
import { CodeBlockButton } from '@/components/tiptap-ui/code-block-button'
import { ColorHighlightPopover } from '@/components/tiptap-ui/color-highlight-popover'
import { LinkPopover } from '@/components/tiptap-ui/link-popover'
import { MarkButton } from '@/components/tiptap-ui/mark-button'
import { TextAlignButton } from '@/components/tiptap-ui/text-align-button'
import { UndoRedoButton } from '@/components/tiptap-ui/undo-redo-button'
import { handleImageUpload, MAX_FILE_SIZE } from '@/lib/tiptap-utils'
import { X, Plus, Save, Globe, FileText, Loader2, Link2, Tag, ChevronDown } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { cn } from '@/lib/utils'

import '@/components/tiptap-node/blockquote-node/blockquote-node.scss'
import '@/components/tiptap-node/code-block-node/code-block-node.scss'
import '@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss'
import '@/components/tiptap-node/list-node/list-node.scss'
import '@/components/tiptap-node/image-node/image-node.scss'
import '@/components/tiptap-node/heading-node/heading-node.scss'
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss'
import '@/components/tiptap-templates/simple/simple-editor.scss'

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
    const [title, setTitle] = useState(initialData?.title || '')
    const [slug, setSlug] = useState(initialData?.slug || '')
    const [tags, setTags] = useState<string[]>(initialData?.tags || [])
    const [tagInput, setTagInput] = useState('')
    const [followupUrl, setFollowupUrl] = useState(initialData?.followupUrl || '')
    const [isSaving, setIsSaving] = useState(false)
    const [saveAction, setSaveAction] = useState<'publish' | 'draft' | null>(null)
    const [isMetadataOpen, setIsMetadataOpen] = useState(true)
    const toolbarRef = useRef<HTMLDivElement>(null)

    const editor = useEditor({
        immediatelyRender: false,
        editorProps: {
            attributes: {
                autocomplete: 'off',
                autocorrect: 'off',
                autocapitalize: 'off',
                'aria-label': 'Post content area',
                class: 'simple-editor min-h-[400px] focus:outline-none'
            }
        },
        extensions: [
            StarterKit.configure({
                horizontalRule: false,
                link: {
                    openOnClick: false,
                    enableClickSelection: true
                }
            }),
            HorizontalRule,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Highlight.configure({ multicolor: true }),
            Image,
            Typography,
            Superscript,
            Subscript,
            Selection,
            ImageUploadNode.configure({
                accept: 'image/*',
                maxSize: MAX_FILE_SIZE,
                limit: 3,
                upload: handleImageUpload,
                onError: (error) => console.error('Upload failed:', error)
            })
        ],
        content: initialData?.content || { type: 'doc', content: [{ type: 'paragraph' }] }
    })

    // Auto-generate slug from title
    useEffect(() => {
        if (!initialData?._id && title) {
            const generatedSlug = title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim()
            setSlug(generatedSlug)
        }
    }, [title, initialData?._id])

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()])
            setTagInput('')
        }
    }

    const handleRemoveTag = (tagToRemove: string) => {
        setTags(tags.filter((tag) => tag !== tagToRemove))
    }

    const handleSave = async (publish: boolean) => {
        if (!title.trim() || !slug.trim()) {
            return
        }

        setIsSaving(true)
        setSaveAction(publish ? 'publish' : 'draft')
        try {
            await onSave({
                title,
                content: editor?.getJSON() || { type: 'doc', content: [] },
                tags: tags.length > 0 ? tags : undefined,
                slug,
                isPublished: publish,
                followupUrl: followupUrl.trim() || undefined
            })
        } catch (error) {
            console.error('Failed to save post:', error)
        } finally {
            setIsSaving(false)
            setSaveAction(null)
        }
    }

    const isFormValid = title.trim() && slug.trim()

    return (
        <div className="flex flex-col h-[85vh]">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold">{initialData?._id ? 'Edit Post' : 'New Post'}</h2>
                    {initialData?.isPublished && (
                        <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
                            <Globe className="h-3 w-3 mr-1" />
                            Published
                        </Badge>
                    )}
                    {initialData?._id && !initialData.isPublished && (
                        <Badge variant="secondary">
                            <FileText className="h-3 w-3 mr-1" />
                            Draft
                        </Badge>
                    )}
                </div>
                <div className="flex items-center gap-2">
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
                            <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                        ) : (
                            <Save className="h-4 w-4 mr-1.5" />
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
                            <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                        ) : (
                            <Globe className="h-4 w-4 mr-1.5" />
                        )}
                        Publish
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex gap-6 pt-4 overflow-hidden">
                <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    <Input
                        placeholder="Post title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="text-2xl font-semibold border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary h-auto py-3 mb-4"
                    />

                    {/* Editor */}
                    <div className="flex-1 overflow-hidden border rounded-lg bg-background">
                        <EditorContext.Provider value={{ editor }}>
                            <Toolbar ref={toolbarRef} className="sticky top-0 z-10 border-b bg-muted/30 px-2">
                                <ToolbarGroup>
                                    <UndoRedoButton action="undo" />
                                    <UndoRedoButton action="redo" />
                                </ToolbarGroup>
                                <ToolbarSeparator />
                                <ToolbarGroup>
                                    <HeadingDropdownMenu levels={[1, 2, 3, 4]} />
                                    <ListDropdownMenu types={['bulletList', 'orderedList', 'taskList']} />
                                    <BlockquoteButton />
                                    <CodeBlockButton />
                                </ToolbarGroup>
                                <ToolbarSeparator />
                                <ToolbarGroup>
                                    <MarkButton type="bold" />
                                    <MarkButton type="italic" />
                                    <MarkButton type="strike" />
                                    <MarkButton type="code" />
                                    <ColorHighlightPopover />
                                    <LinkPopover />
                                </ToolbarGroup>
                                <ToolbarSeparator />
                                <ToolbarGroup>
                                    <TextAlignButton align="left" />
                                    <TextAlignButton align="center" />
                                    <TextAlignButton align="right" />
                                </ToolbarGroup>
                                <ToolbarSeparator />
                                <ToolbarGroup>
                                    <ImageUploadButton text="Image" />
                                </ToolbarGroup>
                                <Spacer />
                            </Toolbar>

                            <div className="overflow-y-auto h-[calc(100%-3rem)]">
                                <EditorContent
                                    editor={editor}
                                    role="presentation"
                                    className="simple-editor-content p-4 prose prose-sm dark:prose-invert max-w-none"
                                />
                            </div>
                        </EditorContext.Provider>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-72 shrink-0 overflow-y-auto space-y-4">
                    {/* Slug */}
                    <div className="space-y-2">
                        <Label htmlFor="slug" className="text-sm font-medium flex items-center gap-2">
                            <Link2 className="h-4 w-4 text-muted-foreground" />
                            URL Slug
                        </Label>
                        <Input
                            id="slug"
                            placeholder="post-slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            className="font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">/blog/{slug || 'your-post-slug'}</p>
                    </div>

                    {/* Tags */}
                    <div className="space-y-2">
                        <Label htmlFor="tags" className="text-sm font-medium flex items-center gap-2">
                            <Tag className="h-4 w-4 text-muted-foreground" />
                            Tags
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="tags"
                                placeholder="Add tag..."
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        handleAddTag()
                                    }
                                }}
                                className="text-sm"
                            />
                            <Button type="button" variant="outline" size="icon" onClick={handleAddTag}>
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                        {tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs gap-1 pr-1">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="ml-0.5 hover:text-destructive rounded-full p-0.5 hover:bg-destructive/10"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Advanced Options */}
                    <Collapsible open={isMetadataOpen} onOpenChange={setIsMetadataOpen}>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-full justify-between text-sm font-medium">
                                Advanced Options
                                <ChevronDown
                                    className={cn('h-4 w-4 transition-transform', isMetadataOpen && 'rotate-180')}
                                />
                            </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2 space-y-3">
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
                        </CollapsibleContent>
                    </Collapsible>
                </div>
            </div>
        </div>
    )
}
