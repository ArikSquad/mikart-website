"use client"

import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { CalendarDays, Clock, Eye } from 'lucide-react'

import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function BlogPage() {
    const posts = useQuery(api.posts.listPublished)

    if (posts === undefined) {
        return (
            <div className="container max-w-6xl py-6 lg:py-10">
                <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
                    <div className="flex-1 space-y-4">
                        <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">Latest Blog Posts</h1>
                        <p className="text-xl text-muted-foreground">
                            Insights, tutorials, and thoughts on development, design, and technology.
                        </p>
                    </div>
                </div>
                <hr className="my-8" />
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="overflow-hidden border-0 shadow-md">
                            <Skeleton className="aspect-[16/9]" />
                            <CardContent className="p-6 space-y-4">
                                <Skeleton className="h-6 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="container max-w-6xl py-6 lg:py-10">
            <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
                <div className="flex-1 space-y-4">
                    <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">Latest Blog Posts</h1>
                    <p className="text-xl text-muted-foreground">
                        Insights, tutorials, and thoughts on development, design, and technology.
                    </p>
                </div>
            </div>
            <hr className="my-8" />

            {posts?.length ? (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <Card
                            key={post._id}
                            className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {/* Tags */}
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {post.tags.slice(0, 3).map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="secondary"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}

                                    <h2 className="text-xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                                        {post.title}
                                    </h2>

                                    {/* Date and views info */}
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <CalendarDays className="h-4 w-4" />
                                            <time dateTime={new Date(post.createdAt).toISOString()}>
                                                {formatDate(new Date(post.createdAt).toISOString())}
                                            </time>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <Eye className="h-4 w-4" />
                                            <span>{post.viewCount.toLocaleString()} views</span>
                                        </div>
                                    </div>

                                    {/* Additional tags */}
                                    {post.tags && post.tags.length > 3 && (
                                        <div className="flex flex-wrap gap-1">
                                            {post.tags.slice(3).map((tag) => (
                                                <Badge key={tag} variant="outline" className="text-xs">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </CardContent>

                            <Link href={`/blog/${post.slug}`} className="absolute inset-0">
                                <span className="sr-only">Read {post.title}</span>
                            </Link>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="rounded-full bg-muted p-4 mb-4">
                        <Clock className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground">Check back soon for new content!</p>
                </div>
            )}
        </div>
    )
}
