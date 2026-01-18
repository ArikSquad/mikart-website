"use client"

import Link from 'next/link'
import {useQuery} from 'convex/react'
import {api} from '@/convex/_generated/api'
import {CalendarDays, Clock, Eye} from 'lucide-react'

import {formatDate} from '@/lib/utils'
import {Badge} from '@/components/ui/badge'
import {Card, CardContent} from '@/components/ui/card'
import {Skeleton} from '@/components/ui/skeleton'
import {MainNav} from "@/components/taxomony/main-nav";
import {mainNavItems} from "@/lib/navigation";
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"

export default function BlogPage() {
    const posts = useQuery(api.posts.listPublished)

    if (posts === undefined) {
        return (
            <div className="bg-background w-full overflow-hidden">
                <header
                    className="fixed top-0 left-0 right-0 z-50 bg-background/40 backdrop-blur-xl border-b border-border/10 shadow-sm">
                    <div
                        className="absolute inset-0 bg-linear-to-r from-background/80 via-background/60 to-background/80"/>
                    <div className="mx-auto max-w-7xl px-4 relative z-10">
                        <div className="flex h-20 items-center justify-between py-6">
                            <MainNav items={mainNavItems}/>
                        </div>
                    </div>
                </header>
                <div className="mx-auto max-w-7xl px-4 py-6 lg:py-10">
                    <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
                        <div className="flex-1 space-y-4">
                            <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">Latest Blog
                                Posts</h1>
                            <p className="text-xl text-muted-foreground">
                                Insights, tutorials, and thoughts on development, design, and technology.
                            </p>
                        </div>
                    </div>
                    <hr className="my-8"/>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <Card key={i} className="overflow-hidden border-0 shadow-md">
                                <Skeleton className="aspect-video"/>
                                <CardContent className="p-6 space-y-4">
                                    <Skeleton className="h-6 w-3/4"/>
                                    <Skeleton className="h-4 w-1/2"/>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-background w-full overflow-hidden">
            <header
                className="fixed top-0 left-0 right-0 z-50 bg-background/40 backdrop-blur-xl border-b border-border/10 shadow-sm">
                <div className="absolute inset-0 bg-linear-to-r from-background/80 via-background/60 to-background/80"/>
                <div className="mx-auto max-w-7xl px-4 relative z-10">
                    <div className="flex h-20 items-center justify-between py-6">
                        <MainNav items={mainNavItems}/>
                    </div>
                </div>
            </header>
            <div className="mx-auto max-w-7xl px-4 pt-20 lg:pt-24">

                <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
                    <div className="flex-1 space-y-4">
                        <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">Latest Blog
                            Posts</h1>
                        <p className="text-xl text-muted-foreground">
                            Insights, tutorials, and thoughts on development, design, and technology.
                        </p>
                    </div>
                </div>
                <hr className="my-8"/>

                {posts?.length ? (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <Card
                                key={post._id}
                                className="group overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <CardContent className="p-6">
                                    <div className="space-y-4">
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

                                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <CalendarDays className="h-4 w-4"/>
                                                <time dateTime={new Date(post.createdAt).toISOString()}>
                                                    {formatDate(new Date(post.createdAt).toISOString())}
                                                </time>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <Eye className="h-4 w-4"/>
                                                <span>{post.viewCount.toLocaleString()} views</span>
                                            </div>
                                        </div>

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
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <Clock/>
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
