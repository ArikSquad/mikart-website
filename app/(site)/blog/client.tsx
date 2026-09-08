'use client'

import Link from 'next/link'
import { useQuery } from 'convex/react'
import type { Doc } from '@/convex/_generated/dataModel'
import { api } from '@/convex/_generated/api'
import { formatDate } from '@/lib/utils'
import { BlogHeader } from './blog-header'
import { Separator } from '@/components/ui/separator'
import { Fragment } from 'react'

const rowClass =
    'group block rounded-2xl px-4 py-6 transition-colors hover:bg-[#181818] focus-visible:bg-[#181818] focus-visible:outline-none sm:px-6 sm:py-7'

function PostRow({ post }: { post: Doc<'posts'> }) {
    return (
        <Link href={`/blog/${post.slug}`} className={rowClass} transitionTypes={['nav-forward']}>
            <article>
                <time className="text-[11px] text-[#77736d]" dateTime={new Date(post.createdAt).toISOString()}>
                    {formatDate(new Date(post.createdAt).toISOString())}
                </time>
                <h2 className="mt-2.5 text-[clamp(1.35rem,3vw,1.8rem)] leading-[1.2] font-medium tracking-[-0.035em] transition-colors group-hover:text-white">
                    {post.title}
                </h2>
                {post.description && (
                    <p className="mt-3 max-w-170 font-sans text-[15px] leading-[1.6] tracking-normal text-[#97938c]">
                        {post.description}
                    </p>
                )}
                <span className="mt-4 inline-block text-xs text-[#77736d] transition-colors group-hover:text-[#e4e2de]">
                    Read note <span aria-hidden="true">↗</span>
                </span>
            </article>
        </Link>
    )
}

export default function BlogPage() {
    const posts = useQuery(api.posts.listPublished)

    return (
        <main className="min-h-svh bg-[#111111] font-mono text-sm tracking-[-0.015em] text-[#e4e2de]">
            <BlogHeader />
            <div className="mx-auto w-full max-w-257 px-5 sm:px-8">
                <section className="max-w-190 pt-14 pb-20 sm:pt-24 sm:pb-28" aria-labelledby="notes-title">
                    <h1
                        id="notes-title"
                        className="text-[clamp(2.5rem,7vw,4.75rem)] leading-[1.02] font-medium tracking-[-0.06em]"
                    >
                        blog
                    </h1>
                    <p className="mt-5 max-w-135 font-sans text-base leading-[1.65] tracking-normal text-[#97938c] sm:mt-7 sm:text-lg">
                        read something I've posted here
                    </p>
                </section>

                <section className="pb-24 sm:pb-32" aria-labelledby="posts-title">
                    {/*loading skeleton*/}
                    {posts === undefined ? (
                        <div className="space-y-2" aria-busy="true" aria-label="Loading posts">
                            {[0, 1, 2].map((item) => (
                                <div className={`${rowClass} min-h-40 animate-pulse bg-[#171717]/60`} key={item} />
                            ))}
                        </div>
                    ) : posts.length ? (
                        <div className="space-y-2">
                            {posts.map((post, i) => (
                                <Fragment key={post._id}>
                                    <PostRow post={post} />
                                    {i < posts.length - 1 && <Separator />}
                                </Fragment>
                            ))}
                        </div>
                    ) : (
                        <p className="px-4 py-10 text-[#97938c] sm:px-6">
                            no posts are currently available, check again later.
                        </p>
                    )}
                </section>
            </div>
        </main>
    )
}
