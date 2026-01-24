'use client'

import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { CalendarDays, Clock, ArrowRight, Sparkles } from 'lucide-react'

import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { MainNav } from '@/components/taxomony/main-nav'
import { mainNavItems } from '@/lib/navigation'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'

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

function HeroSection() {
    return (
        <div className="relative overflow-hidden border-b border-border/40">
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />
            <div className="mx-auto max-w-7xl px-4 pt-32 pb-16 relative">
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        <Sparkles className="h-4 w-4" />
                        Insights & Updates
                    </div>
                    <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl tracking-tight font-bold bg-linear-to-br from-foreground via-foreground to-foreground/70 bg-clip-text">
                        Our Blog
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                        Discover insights, tutorials, and thoughts on development, design, and the latest in technology.
                    </p>
                </div>
            </div>
        </div>
    )
}

function BlogCardSkeleton() {
    return (
        <Card className="group overflow-hidden bg-linear-to-br from-card to-card/80 border border-border/50 h-full">
            <CardContent className="p-6 flex flex-col h-full">
                <div className="flex gap-2 mb-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-7 w-full mb-2" />
                <Skeleton className="h-7 w-3/4 mb-4" />
                <div className="mt-auto pt-4 border-t border-border/50">
                    <Skeleton className="h-4 w-32" />
                </div>
            </CardContent>
        </Card>
    )
}

function BlogCard({ post, featured = false }: { post: any; featured?: boolean }) {
    return (
        <Card
            className={`group relative overflow-hidden bg-linear-to-br from-card to-card/80 border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 h-full ${
                featured ? 'md:col-span-2 md:row-span-2' : ''
            }`}
        >
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardContent className={`relative z-10 flex flex-col h-full ${featured ? 'md:p-5' : ''}`}>
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags && post.tags.length > 0 && (
                        <>
                            {post.tags.slice(0, featured ? 4 : 2).map((tag: string, index: number) => (
                                <Badge
                                    key={tag}
                                    variant={index === 0 ? 'default' : 'secondary'}
                                    className="font-medium"
                                >
                                    {tag}
                                </Badge>
                            ))}
                            {post.tags.length > (featured ? 4 : 2) && (
                                <Badge variant="outline" className="text-xs">
                                    +{post.tags.length - (featured ? 4 : 2)}
                                </Badge>
                            )}
                        </>
                    )}
                </div>

                <h2
                    className={`font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300 mb-3 ${
                        featured ? 'text-2xl md:text-3xl' : 'text-xl'
                    }`}
                >
                    {post.title}
                </h2>

                {post.description && (
                    <p
                        className={`text-muted-foreground mb-6 text-sm flex-1 ${
                            featured ? 'text-lg line-clamp-3' : 'line-clamp-2'
                        } font-mono`}
                    >
                        {post.description}
                    </p>
                )}

                <div className="mt-auto pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            <time dateTime={new Date(post.createdAt).toISOString()}>
                                {formatDate(new Date(post.createdAt).toISOString())}
                            </time>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Read more
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>
            </CardContent>

            <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-20 no-underline">
                <span className="sr-only">Read {post.title}</span>
            </Link>
        </Card>
    )
}

export default function BlogPage() {
    const posts = useQuery(api.posts.listPublished)

    if (posts === undefined) {
        return (
            <div className="bg-background min-h-screen">
                <BlogHeader />
                <HeroSection />
                <div className="mx-auto max-w-7xl px-4 py-16">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <BlogCardSkeleton key={i} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-background min-h-screen">
            <BlogHeader />
            <HeroSection />

            <div className="mx-auto max-w-7xl px-4 py-16">
                {posts?.length ? (
                    <>
                        {posts.length > 0 && (
                            <div className="mb-12">
                                <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-6">
                                    Latest Posts
                                </h2>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <BlogCard post={posts[0]} featured />
                                    {posts.length > 1 && (
                                        <>
                                            {posts.slice(1, 3).map((post) => (
                                                <BlogCard key={post._id} post={post} />
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {posts.length > 3 && (
                            <div>
                                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
                                    More Posts
                                </h2>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {posts.slice(3).map((post) => (
                                        <BlogCard key={post._id} post={post} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Clock />
                            </EmptyMedia>
                            <EmptyTitle>No posts yet</EmptyTitle>
                            <EmptyDescription>Check back soon for new content!</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                )}
            </div>
        </div>
    )
}
