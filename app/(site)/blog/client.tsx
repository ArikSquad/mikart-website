'use client'

import Link from 'next/link'
import { useQuery } from 'convex/react'
import { ArrowUpRight } from 'lucide-react'
import type { Doc } from '@/convex/_generated/dataModel'
import { api } from '@/convex/_generated/api'
import { formatDate } from '@/lib/utils'
import { BlogHeader } from './blog-header'

const rowClass =
    'group grid grid-cols-[30px_minmax(0,1fr)] items-start gap-3 border-b border-[#343330] py-8 focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-[#97938c] sm:grid-cols-[48px_minmax(0,1fr)_20px] sm:gap-5'

function PostRow({ post, index }: { post: Doc<'posts'>; index: number }) {
    return (
        <Link href={`/blog/${post.slug}`} className={rowClass} transitionTypes={['nav-forward']}>
            <span className="text-[11px] text-[#6e6b66]">{String(index + 1).padStart(2, '0')}</span>
            <article>
                <div className="flex flex-wrap gap-x-4 gap-y-2.5 text-[10px] tracking-[0.05em] text-[#97938c] uppercase">
                    <time dateTime={new Date(post.createdAt).toISOString()}>
                        {formatDate(new Date(post.createdAt).toISOString())}
                    </time>
                    {post.tags?.slice(0, 3).map((tag) => (
                        <span key={tag}>#{tag}</span>
                    ))}
                </div>
                <h2 className="mt-3 text-[clamp(1.25rem,3vw,1.75rem)] leading-[1.15] font-medium tracking-[-0.035em] transition-colors group-hover:text-white">
                    {post.title}
                </h2>
                {post.description && (
                    <p className="mt-3 max-w-[660px] leading-[1.55] text-[#97938c]">{post.description}</p>
                )}
            </article>
            <ArrowUpRight
                className="hidden text-[#97938c] opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block"
                aria-hidden="true"
                size={17}
            />
        </Link>
    )
}

function NotesSkeleton() {
    return (
        <div aria-busy="true" aria-label="Loading posts">
            {[0, 1, 2].map((item) => (
                <div className={`${rowClass} min-h-[132px] animate-pulse bg-[#171717]/40`} key={item} />
            ))}
        </div>
    )
}

export default function BlogPage() {
    const posts = useQuery(api.posts.listPublished)

    return (
        <main className="min-h-svh bg-[#111111] font-mono text-sm tracking-[-0.015em] text-[#e4e2de]">
            <BlogHeader />
            <div className="mx-auto w-full max-w-[1028px] px-4 sm:px-6">
                <section className="max-w-[760px] py-[clamp(5.5rem,13vw,9.375rem)]" aria-labelledby="notes-title">
                    <p className="mb-6 text-[11px] tracking-[0.08em] text-[#97938c] uppercase">writing / field notes</p>
                    <h1
                        id="notes-title"
                        className="text-[clamp(2rem,6vw,3.875rem)] leading-[1.04] font-medium tracking-[-0.055em]"
                    >
                        Notes on building
                        <br />
                        and understanding systems.
                    </h1>
                    <p className="mt-7 max-w-[570px] text-[15px] leading-[1.65] text-[#97938c]">
                        Software, infrastructure, security, and the decisions that make them easier to operate.
                    </p>
                </section>

                <section className="pb-[120px]" aria-labelledby="posts-title">
                    <div className="flex justify-between border-b border-[#343330] pb-3.5 text-[11px] tracking-[0.07em] text-[#97938c] uppercase">
                        <h2 id="posts-title" className="font-[inherit]">
                            all notes
                        </h2>
                        <span>{posts ? `${posts.length} ${posts.length === 1 ? 'entry' : 'entries'}` : '—'}</span>
                    </div>
                    {posts === undefined ? (
                        <NotesSkeleton />
                    ) : posts.length ? (
                        <div>
                            {posts.map((post, index) => (
                                <PostRow key={post._id} post={post} index={index} />
                            ))}
                        </div>
                    ) : (
                        <p className="border-b border-[#343330] py-10 text-[#97938c]">
                            No notes published yet. Check back soon.
                        </p>
                    )}
                </section>
            </div>
        </main>
    )
}
