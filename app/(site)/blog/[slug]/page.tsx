"use client"

import { useEffect } from 'react'
import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import posthog from 'posthog-js'
import '@/styles/mdx.css'
import { cn, formatDate } from '@/lib/utils'
import { buttonVariants, Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, CalendarDays, Clock, Eye, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { TiptapRenderer } from '@/components/blog/tiptap-renderer'
import { CommentSection } from '@/components/blog/comment-section'

export default function PostPage() {
    const params = useParams()
    const slug = params.slug as string

    const post = useQuery(api.posts.getBySlug, { slug })
    const comments = useQuery(
        api.comments.getByPostId,
        post?._id ? { postId: post._id } : "skip"
    )
    const incrementViewCount = useMutation(api.posts.incrementViewCount)

    // Track page view and increment view count
    useEffect(() => {
        if (post?._id) {
            // Increment view count in Convex
            incrementViewCount({ id: post._id })

            // Track with PostHog
            posthog.capture('blog_post_viewed', {
                post_id: post._id,
                post_slug: post.slug,
                post_title: post.title,
            })
        }
    }, [post?._id])

    if (post === undefined) {
        return <PostPageSkeleton />
    }

    if (post === null) {
        notFound()
    }

    // Calculate estimated reading time based on content
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

    return (
        <article className="relative">
            <div className="container max-w-4xl">
                <div className="pt-8 pb-4">
                    <Link
                        href="/blog"
                        className={cn(
                            buttonVariants({ variant: 'ghost' }),
                            'mb-6'
                        )}
                    >
                        <ChevronLeft className="mr-2 h-4 w-4" />
                        Back to Blog
                    </Link>

                    <Card className="border-0 shadow-none">
                        <CardContent className="p-0">
                            {/* Followup URL Alert */}
                            {post.followupUrl && (
                                <Alert className="mb-6 border-primary/50 bg-primary/5">
                                    <ExternalLink className="h-4 w-4" />
                                    <AlertDescription className="flex items-center justify-between">
                                        <span>This post has a followup!</span>
                                        <Button variant="link" asChild className="p-0 h-auto">
                                            <a href={post.followupUrl} target="_blank" rel="noopener noreferrer">
                                                Click here to read the update
                                            </a>
                                        </Button>
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="mb-6">
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.map((tag, index) => (
                                            <Badge
                                                key={tag}
                                                variant={index === 0 ? 'default' : 'outline'}
                                                className="text-sm"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <h1 className="font-heading text-3xl leading-tight lg:text-5xl mb-6">{post.title}</h1>

                            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4" />
                                    <time dateTime={new Date(post.createdAt).toISOString()}>
                                        {formatDate(new Date(post.createdAt).toISOString())}
                                    </time>
                                </div>

                                {readingTime > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span>{readingTime} min read</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2">
                                    <Eye className="h-4 w-4" />
                                    <span>{post.viewCount.toLocaleString()} views</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mx-auto max-w-3xl pb-12">
                    <div className="prose prose-gray dark:prose-invert max-w-none">
                        <TiptapRenderer content={post.content} />
                    </div>

                    <div className="mt-16 pt-8 border-t">
                        <div className="flex justify-center">
                            <Link href="/blog" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
                                <ChevronLeft className="mr-2 h-4 w-4" />
                                Back to all posts
                            </Link>
                        </div>
                    </div>

                    {/* Comments Section */}
                    {comments !== undefined && (
                        <CommentSection postId={post._id} comments={comments} />
                    )}
                </div>
            </div>
        </article>
    )
}

function PostPageSkeleton() {
    return (
        <article className="relative">
            <div className="container max-w-4xl">
                <div className="pt-8 pb-4">
                    <Skeleton className="h-10 w-32 mb-6" />
                    <div className="space-y-4">
                        <div className="flex gap-2">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-20" />
                        </div>
                        <Skeleton className="h-12 w-3/4" />
                        <div className="flex gap-4">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-5 w-20" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                    </div>
                </div>
                <div className="mx-auto max-w-3xl pb-12">
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                </div>
            </div>
        </article>
    )
}
