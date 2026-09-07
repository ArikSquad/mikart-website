'use client'

import { useEffect } from 'react'
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

const textLink = 'text-[#97938c] transition-colors hover:text-[#e4e2de] focus-visible:outline-none'

function countWords(value: unknown): number {
    if (Array.isArray(value)) return value.reduce((total, item) => total + countWords(item), 0)
    if (!value || typeof value !== 'object') return 0

    const node = value as Record<string, unknown>
    const ownWords = typeof node.text === 'string' ? node.text.trim().split(/\s+/).filter(Boolean).length : 0
    return ownWords + countWords(node.content)
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
        <main className="min-h-svh bg-[#111111] font-mono text-sm tracking-[-0.015em] text-[#e4e2de]">
            <BlogHeader />
            <div className="mx-auto w-full max-w-[808px] px-5 sm:px-8">
                <Link
                    href="/blog"
                    className={`${textLink} mt-8 inline-block text-xs sm:mt-12`}
                    transitionTypes={['nav-back']}
                >
                    ← all notes
                </Link>

                <header className="pt-14 pb-12 sm:pt-24 sm:pb-20">
                    <h1 className="text-[clamp(2.125rem,6vw,3.625rem)] leading-[1.04] font-medium tracking-[-0.055em]">
                        {post.title}
                    </h1>
                    {post.description && (
                        <p className="mt-6 max-w-[650px] text-base leading-[1.55] text-[#97938c]">{post.description}</p>
                    )}
                    <div className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-2 text-[11px] text-[#77736d] sm:mt-8">
                        {post.author && (
                            <Link
                                className="hover:text-[#e4e2de]"
                                href={`/profile/${post.author.clerkId}`}
                                transitionTypes={['nav-forward']}
                            >
                                {post.author.name}
                            </Link>
                        )}
                        {post.author && <span aria-hidden="true">·</span>}
                        <time dateTime={new Date(post.createdAt).toISOString()}>
                            {formatDate(new Date(post.createdAt).toISOString())}
                        </time>
                        <span aria-hidden="true">·</span>
                        <span>{readingTime} min read</span>
                        <button
                            className={`${textLink} ml-auto cursor-pointer bg-transparent max-[440px]:mt-3 max-[440px]:ml-0 max-[440px]:w-full max-[440px]:text-left`}
                            type="button"
                            onClick={sharePost}
                        >
                            share
                        </button>
                    </div>
                    {post.followupUrl && (
                        <p className="mt-8 rounded-xl bg-[#181818] px-4 py-3.5 text-[#97938c]">
                            This note has an update.{' '}
                            <a
                                className="text-[#e4e2de] underline underline-offset-4"
                                href={post.followupUrl}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Read the follow-up ↗
                            </a>
                        </p>
                    )}
                </header>

                <article className="pt-6 pb-24 sm:pt-10">
                    <PlateRenderer
                        content={post.content}
                        className="prose-base font-sans leading-[1.78] prose-headings:scroll-mt-24 prose-headings:font-mono prose-headings:font-medium prose-headings:tracking-[-0.035em] prose-a:text-[#e4e2de] prose-a:underline prose-a:decoration-[#97938c] prose-a:underline-offset-4 prose-code:rounded-none prose-pre:rounded-none"
                    />
                    <div className="mt-16 flex justify-between gap-5 text-xs text-[#97938c]">
                        <Link className="hover:text-[#e4e2de]" href="/blog" transitionTypes={['nav-back']}>
                            ← all notes
                        </Link>
                        <button
                            className="cursor-pointer bg-transparent hover:text-[#e4e2de]"
                            type="button"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            back to top ↑
                        </button>
                    </div>
                    {comments !== undefined && (
                        <div className="mt-20">
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
        <main className="min-h-svh bg-[#111111] font-mono text-[#e4e2de]">
            <BlogHeader />
            <div className="mx-auto w-full max-w-[808px] px-5 sm:px-8" aria-busy="true" aria-label="Loading blog post">
                <div className="mt-8 h-4 w-24 animate-pulse rounded bg-[#1a1a19] sm:mt-12" />
                <div className="pt-14 pb-12 sm:pt-24 sm:pb-20">
                    <div className="h-48 animate-pulse rounded-2xl bg-[#171717]" />
                </div>
                <div className="pt-6 pb-24">
                    <div className="h-80 animate-pulse rounded-2xl bg-[#171717]" />
                </div>
            </div>
        </main>
    )
}
