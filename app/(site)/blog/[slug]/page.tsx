'use client'

import { useEffect } from 'react'
import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import posthog from 'posthog-js'
import { cn, formatDate } from '@/lib/utils'
import { buttonVariants, Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChevronLeft, CalendarDays, Clock, ExternalLink, Share2, ArrowUp } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TiptapRenderer } from '@/components/blog/tiptap-renderer'
import { CommentSection } from '@/components/blog/comment-section'
import { MainNav } from '@/components/taxomony/main-nav'
import { mainNavItems } from '@/lib/navigation'
import { Separator } from '@/components/ui/separator'

import { toast } from 'sonner'

function BlogHeader() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/40 backdrop-blur-xl border-b border-border/10 shadow-sm">
            <div className="absolute inset-0 bg-linear-to-r from-background/80 via-background/60 to-background/80" />
            <div className="mx-auto max-w-7xl px-4 relative z-10">
                <div className="flex h-20 items-center justify-between py-6">
                    <MainNav items={mainNavItems} />
                </div>
            </div>
        </header>
    )
}

export default function PostPage() {
    const params = useParams()
    const slug = params.slug as string

    const postData = useQuery(api.posts.getBySlugWithAuthor, { slug })
    const comments = useQuery(api.comments.getByPostId, postData?._id ? { postId: postData._id } : 'skip')

    useEffect(() => {
        if (postData?._id) {
            posthog.capture('blog_post_viewed', {
                post_id: postData._id,
                post_slug: postData.slug,
                post_title: postData.title
            })
        }
    }, [postData?._id])

    if (postData === undefined) {
        return <PostPageSkeleton />
    }

    if (postData === null) {
        notFound()
    }

    const post = postData
    const author = postData.author

    const getWordCount = (content: any): number => {
        if (!content || !content.content) return 0

        let wordCount = 0
        const traverse = (nodes: any[]) => {
            for (const node of nodes) {
                if (node.type === 'text' && node.text) {
                    wordCount += node.text.split(/\s+/).length
                }
                if (node.content) {
                    traverse(node.content)
                }
            }
        }
        traverse(content.content)
        return wordCount
    }

    const wordCount = getWordCount(post.content)
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleShare = async () => {
        const url = window.location.href

        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    url
                })
                toast.success('Shared successfully!')
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    await copyToClipboard(url)
                }
            }
        } else {
            await copyToClipboard(url)
        }
    }

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            toast.success('Link copied to clipboard!')
        } catch (err) {
            toast.error('Failed to copy link')
        }
    }

    return (
        <div className="bg-background min-h-screen">
            <BlogHeader />

            {/* Hero Section */}
            <div className="relative overflow-hidden border-b border-border/40">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

                <div className="mx-auto max-w-4xl px-4 pt-28 pb-12 relative">
                    <Link
                        href="/blog"
                        className={cn(
                            buttonVariants({ variant: 'ghost', size: 'sm' }),
                            'mb-8 -ml-2 text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Back to Blogs
                    </Link>

                    {post.followupUrl && (
                        <Alert className="mb-8 border-primary/50 bg-primary/5 backdrop-blur-sm">
                            <ExternalLink className="h-4 w-4" />
                            <AlertDescription className="flex items-center justify-between flex-wrap gap-2">
                                <span className="font-medium">This post has a followup!</span>
                                <Button variant="link" asChild className="p-0 h-auto font-semibold">
                                    <a href={post.followupUrl} target="_blank" rel="noopener noreferrer">
                                        Read the update →
                                    </a>
                                </Button>
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {post.tags.map((tag, index) => (
                                <Badge
                                    key={tag}
                                    variant={index === 0 ? 'default' : 'secondary'}
                                    className="text-sm font-medium px-3 py-1"
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    )}

                    <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-8">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                        {/* Author */}
                        {author && (
                            <Link
                                href={`/profile/${author.clerkId}`}
                                className="flex items-center gap-2 hover:text-foreground transition-colors group"
                            >
                                <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm group-hover:ring-primary/20 transition-all">
                                    <AvatarImage src={author.avatar} />
                                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                        {author.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-muted-foreground/70">Author</p>
                                    <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                                        {author.name}
                                    </span>
                                </div>
                            </Link>
                        )}

                        <div className="flex items-center gap-2">
                            <div className="p-2 rounded-full bg-primary/10">
                                <CalendarDays className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-muted-foreground/70">Published</p>
                                <time
                                    dateTime={new Date(post.createdAt).toISOString()}
                                    className="font-medium text-foreground"
                                >
                                    {formatDate(new Date(post.createdAt).toISOString())}
                                </time>
                            </div>
                        </div>

                        {readingTime > 0 && (
                            <div className="flex items-center gap-2">
                                <div className="p-2 rounded-full bg-primary/10">
                                    <Clock className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-muted-foreground/70">
                                        Read time
                                    </p>
                                    <span className="font-medium text-foreground">{readingTime} min read</span>
                                </div>
                            </div>
                        )}

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleShare}
                            className="ml-auto text-muted-foreground hover:text-foreground"
                        >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <article className="mx-auto max-w-4xl px-4 py-12">
                <div className="prose prose-lg prose-gray dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-headings:font-heading prose-headings:font-bold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-pre:bg-muted">
                    <TiptapRenderer content={post.content} />
                </div>

                <Separator className="my-12" />

                {/* Footer Navigation */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <Link href="/blog" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to all posts
                    </Link>

                    <Button variant="ghost" size="lg" onClick={scrollToTop}>
                        <ArrowUp className="mr-2 h-4 w-4" />
                        Back to top
                    </Button>
                </div>

                {comments !== undefined && (
                    <div className="mt-16">
                        <CommentSection postId={post._id} comments={comments} />
                    </div>
                )}
            </article>
        </div>
    )
}

function PostPageSkeleton() {
    return (
        <div className="bg-background min-h-screen">
            <header className="fixed top-0 left-0 right-0 z-50 bg-background/40 backdrop-blur-xl border-b border-border/10 shadow-sm">
                <div className="absolute inset-0 bg-linear-to-r from-background/80 via-background/60 to-background/80" />
                <div className="mx-auto max-w-7xl px-4 relative z-10">
                    <div className="flex h-20 items-center justify-between py-6">
                        <MainNav items={mainNavItems} />
                    </div>
                </div>
            </header>

            <div className="relative overflow-hidden border-b border-border/40">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10" />
                <div className="mx-auto max-w-4xl px-4 pt-28 pb-12 relative">
                    <Skeleton className="h-8 w-32 mb-8" />
                    <div className="flex gap-2 mb-6">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <Skeleton className="h-12 w-full mb-4" />
                    <Skeleton className="h-12 w-3/4 mb-8" />
                    <div className="flex gap-6">
                        <Skeleton className="h-12 w-32" />
                        <Skeleton className="h-12 w-32" />
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 py-12">
                <div className="space-y-4">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-4/5" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-32 w-full mt-8" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-5/6" />
                </div>
            </div>
        </div>
    )
}
