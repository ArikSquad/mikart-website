'use client'

import { useEffect } from 'react'
import { ArrowLeft, ArrowUp, Share2 } from 'lucide-react'
import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery } from 'convex/react'
import posthog from 'posthog-js'
import { toast } from 'sonner'
import { api } from '@/convex/_generated/api'
import { formatDate } from '@/lib/utils'
import { PlateRenderer } from '@/components/blog/plate-renderer'
import { CommentSection } from '@/components/blog/comment-section'
import { BlogHeader } from '../blog-header'

function countWords(value: unknown): number {
    if (Array.isArray(value)) return value.reduce((total, item) => total + countWords(item), 0)
    if (!value || typeof value !== 'object') return 0

    const node = value as Record<string, unknown>
    const ownWords = typeof node.text === 'string' ? node.text.trim().split(/\s+/).filter(Boolean).length : 0
    return ownWords + countWords(node.children) + countWords(node.content)
}

export default function PostPage() {
    const { slug } = useParams<{ slug: string }>()
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
    }, [postData?._id, postData?.slug, postData?.title])

    if (postData === undefined) return <PostPageSkeleton />
    if (postData === null) notFound()

    const post = postData
    const readingTime = Math.max(1, Math.ceil(countWords(post.content) / 200))

    async function sharePost() {
        const url = window.location.href
        if (navigator.share) {
            try {
                await navigator.share({ title: post.title, url })
                return
            } catch (error) {
                if ((error as Error).name === 'AbortError') return
            }
        }

        try {
            await navigator.clipboard.writeText(url)
            toast('Link copied to clipboard')
        } catch {
            toast('Could not copy the link')
        }
    }

    return (
        <main className="blog-shell blog-post">
            <BlogHeader />
            <div className="blog-post-container">
                <div className="blog-post-toolbar">
                    <Link href="/blog" className="blog-action" transitionTypes={['nav-back']}>
                        <ArrowLeft size={16} aria-hidden="true" />
                        Back to blog
                    </Link>
                    <button className="blog-action" type="button" onClick={sharePost}>
                        <Share2 size={15} aria-hidden="true" />
                        Share article
                    </button>
                </div>
                <header className="blog-post-heading">
                    <h1>{post.title}</h1>
                    {post.description && <p className="blog-post-description">{post.description}</p>}
                    <div className="blog-post-byline">
                        {post.author && (
                            <>
                                <Link href={`/profile/${post.author.clerkId}`} transitionTypes={['nav-forward']}>
                                    {post.author.name}
                                </Link>
                                <span aria-hidden="true">·</span>
                            </>
                        )}
                        <time dateTime={new Date(post.createdAt).toISOString()}>
                            {formatDate(new Date(post.createdAt).toISOString())}
                        </time>
                        <span aria-hidden="true">·</span>
                        <span>{readingTime} min read</span>
                    </div>
                    {post.followupUrl && (
                        <p className="blog-followup">
                            This note has an update.{' '}
                            <a href={post.followupUrl} target="_blank" rel="noreferrer">
                                Read the follow-up ↗
                            </a>
                        </p>
                    )}
                </header>

                <article className="blog-post-content">
                    <PlateRenderer content={post.content} className="blog-prose" />
                    <nav className="blog-post-end" aria-label="Article navigation">
                        <Link className="blog-action" href="/blog" transitionTypes={['nav-back']}>
                            <ArrowLeft size={16} aria-hidden="true" />
                            More from the blog
                        </Link>
                        <button
                            className="blog-action"
                            type="button"
                            onClick={() =>
                                window.scrollTo({
                                    top: 0,
                                    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                                        ? 'instant'
                                        : 'smooth'
                                })
                            }
                        >
                            <ArrowUp size={16} aria-hidden="true" />
                            Back to top
                        </button>
                    </nav>
                    {comments !== undefined && (
                        <div className="blog-comments">
                            <CommentSection postId={post._id} comments={comments} />
                        </div>
                    )}
                </article>
            </div>
        </main>
    )
}

function PostPageSkeleton() {
    return (
        <main className="blog-shell blog-post">
            <BlogHeader />
            <div className="mx-auto w-full max-w-[808px] px-5 sm:px-8" aria-busy="true" aria-label="Loading blog post">
                <div className="mt-8 h-4 w-24 animate-pulse rounded bg-[#142338] sm:mt-12" />
                <div className="pt-14 pb-12 sm:pt-24 sm:pb-20">
                    <div className="h-48 animate-pulse rounded-2xl bg-[#142338]" />
                </div>
                <div className="pt-6 pb-24">
                    <div className="h-80 animate-pulse rounded-2xl bg-[#142338]" />
                </div>
            </div>
        </main>
    )
}
