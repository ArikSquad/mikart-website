'use client'

import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { useQuery } from 'convex/react'
import type { Doc } from '@/convex/_generated/dataModel'
import { api } from '@/convex/_generated/api'
import { formatDate } from '@/lib/utils'
import { BlogHeader } from './blog-header'
import { normalizePlateContent } from '@/lib/plate-content'

function findImage(value: unknown): string | undefined {
    if (Array.isArray(value)) {
        for (const item of value) {
            const image = findImage(item)
            if (image) return image
        }
    } else if (value && typeof value === 'object') {
        const node = value as Record<string, unknown>
        if (node.type === 'img' && typeof node.url === 'string' && /^(https?:\/\/|\/(?!\/))/.test(node.url))
            return node.url
        return findImage(node.children) ?? findImage(node.content)
    }
}

function PostCard({ post, featured = false }: { post: Doc<'posts'>; featured?: boolean }) {
    const image = findImage(normalizePlateContent(post.content))
    return (
        <Link
            href={`/blog/${post.slug}`}
            className={`blog-card${featured ? ' blog-featured' : ''}`}
            transitionTypes={['nav-forward']}
        >
            <article>
                <div className={`blog-card-art${image ? '' : ' blog-card-placeholder'}`}>
                    {image ? (
                        // Content images are hosted by the editor's upload providers.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={image} alt="" loading={featured ? 'eager' : 'lazy'} />
                    ) : (
                        <>
                            <span className="blog-cover-wordmark" aria-hidden="true">
                                mikart<span>journal</span>
                            </span>
                        </>
                    )}
                </div>
                <div className="blog-card-copy">
                    {featured && <span className="blog-eyebrow">Featured article</span>}
                    <h2>{post.title}</h2>
                    {post.description && <p>{post.description}</p>}
                    <div className="blog-card-meta">
                        <time dateTime={new Date(post.createdAt).toISOString()}>
                            {formatDate(new Date(post.createdAt).toISOString())}
                        </time>
                    </div>
                </div>
            </article>
        </Link>
    )
}

export default function BlogPage() {
    const posts = useQuery(api.posts.listPublished)
    return (
        <div className="blog-shell">
            <BlogHeader />
            <main id="main">
                <header className="blog-intro blog-container">
                    <h1>Blog</h1>
                </header>
                {posts === undefined ? (
                    <div className="blog-loading blog-container" aria-busy="true" aria-label="Loading articles">
                        <div className="blog-skeleton blog-skeleton-featured" />
                        <div className="blog-grid">
                            {[0, 1, 2].map((i) => (
                                <div className="blog-skeleton" key={i} />
                            ))}
                        </div>
                    </div>
                ) : posts.length ? (
                    <>
                        <section className="blog-feature-section" aria-label="Featured article">
                            <div className="blog-container">
                                <PostCard post={posts[0]} featured />
                            </div>
                        </section>
                        {posts.length > 1 && (
                            <section className="blog-more blog-container" aria-labelledby="more-articles">
                                <h2 id="more-articles">More articles</h2>
                                <div className="blog-grid">
                                    {posts.slice(1).map((post) => (
                                        <PostCard post={post} key={post._id} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                ) : (
                    <section className="blog-empty blog-container">
                        <BookOpen size={32} aria-hidden="true" />
                        <h2>A little quiet here, for now.</h2>
                        <p>New articles are on the way. Check back soon.</p>
                        <Link href="/">
                            Back to MikArt <span aria-hidden="true">↗</span>
                        </Link>
                    </section>
                )}
                <footer className="blog-footer blog-container">
                    <span>MikArt & ArikSquad</span>
                    <Link href="https://github.com/ArikSquad">Find us on GitHub ↗</Link>
                </footer>
            </main>
        </div>
    )
}
