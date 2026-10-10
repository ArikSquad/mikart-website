'use client'

import { SignInButton } from '@clerk/nextjs'
import { useConvexAuth, useMutation, useQuery } from 'convex/react'
import { formatDistanceToNow } from 'date-fns'
import { ExternalLink, FileText, MessageSquare, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useState, type ComponentType } from 'react'

import { AdminHeader } from '@/components/admin/admin-header'
import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

type StatusFilter = 'all' | 'published' | 'drafts'

function AdminPageFrame({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-svh bg-muted/20">
            <AdminHeader />
            <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
    )
}

function StatCard({
    label,
    value,
    detail,
    icon: Icon
}: {
    label: string
    value: number
    detail: string
    icon: ComponentType<{ className?: string }>
}) {
    return (
        <Card className="rounded-lg border-border/70 bg-card/80 shadow-none">
            <CardContent className="flex items-start justify-between gap-4 p-4 sm:p-5">
                <div className="min-w-0">
                    <p className="text-muted-foreground text-xs font-medium uppercase tracking-[0.08em]">{label}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
                    <p className="mt-1 truncate text-muted-foreground text-xs">{detail}</p>
                </div>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-border/70 bg-muted/50 text-muted-foreground">
                    <Icon className="size-4" aria-hidden="true" />
                </span>
            </CardContent>
        </Card>
    )
}

export default function AdminPage() {
    const { isAuthenticated, isLoading: authLoading } = useConvexAuth()
    const posts = useQuery(api.posts.getWithStats)
    const deletePost = useMutation(api.posts.remove)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

    if (authLoading) {
        return (
            <AdminPageFrame>
                <div className="space-y-6" aria-busy="true" aria-label="Loading posts">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-9 w-64" />
                        <Skeleton className="h-4 w-96 max-w-full" />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, index) => (
                            <Skeleton key={index} className="h-28 w-full rounded-lg" />
                        ))}
                    </div>
                    <Skeleton className="h-[420px] w-full rounded-lg" />
                </div>
            </AdminPageFrame>
        )
    }

    if (!isAuthenticated) {
        return (
            <AdminPageFrame>
                <div className="grid min-h-[calc(100svh-8rem)] place-items-center">
                    <Card className="w-full max-w-md rounded-lg border-border/70 shadow-sm">
                        <CardContent className="p-6 text-center sm:p-8">
                            <div className="mx-auto flex size-11 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                                <FileText className="size-5" aria-hidden="true" />
                            </div>
                            <h1 className="mt-5 text-xl font-semibold tracking-tight">Posts</h1>
                            <p className="mt-2 text-muted-foreground text-sm">Sign in to manage posts.</p>
                            <SignInButton mode="modal">
                                <Button className="mt-6 w-full">Sign in to continue</Button>
                            </SignInButton>
                        </CardContent>
                    </Card>
                </div>
            </AdminPageFrame>
        )
    }

    const handleDeletePost = async (postId: Id<'posts'>) => {
        await deletePost({ id: postId })
    }

    const totalPosts = posts?.length ?? 0
    const publishedCount = posts?.filter((post) => post.isPublished).length ?? 0
    const draftCount = totalPosts - publishedCount
    const totalComments = posts?.reduce((sum, post) => sum + post.commentCount, 0) ?? 0
    const totalReplies = posts?.reduce((sum, post) => sum + post.replyCount, 0) ?? 0
    const normalizedSearch = searchTerm.trim().toLowerCase()
    const visiblePosts = posts?.filter((post) => {
        const matchesStatus =
            statusFilter === 'all' || (statusFilter === 'published' ? post.isPublished : !post.isPublished)
        const matchesSearch =
            !normalizedSearch ||
            post.title.toLowerCase().includes(normalizedSearch) ||
            post.slug.toLowerCase().includes(normalizedSearch)

        return matchesStatus && matchesSearch
    })

    const filters: Array<{ label: string; value: StatusFilter; count: number }> = [
        { label: 'All posts', value: 'all', count: totalPosts },
        { label: 'Published', value: 'published', count: publishedCount },
        { label: 'Drafts', value: 'drafts', count: draftCount }
    ]

    return (
        <AdminPageFrame>
            <div className="space-y-8">
                <section className="flex flex-col gap-5 border-border/70 border-b pb-7 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Posts</h1>
                        <p className="mt-2 max-w-2xl text-muted-foreground text-sm leading-6">
                            Create and manage blog posts.
                        </p>
                    </div>
                    <Button asChild className="w-full md:w-auto">
                        <Link href="/admin/posts/new">
                            <Plus className="size-4" aria-hidden="true" />
                            New post
                        </Link>
                    </Button>
                </section>

                <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Content summary">
                    <StatCard
                        label="Total posts"
                        value={totalPosts}
                        detail={`${publishedCount} published · ${draftCount} drafts`}
                        icon={FileText}
                    />
                    <StatCard label="Published" value={publishedCount} detail="Live on the blog" icon={ExternalLink} />
                    <StatCard label="Drafts" value={draftCount} detail="Not live yet" icon={Pencil} />
                    <StatCard
                        label="Discussions"
                        value={totalComments + totalReplies}
                        detail={`${totalComments} comments · ${totalReplies} replies`}
                        icon={MessageSquare}
                    />
                </section>

                <section className="overflow-hidden rounded-lg border border-border/70 bg-card shadow-sm">
                    <div className="flex flex-col gap-4 border-border/70 border-b p-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="font-semibold tracking-tight">Posts</h2>
                                <span className="text-muted-foreground text-sm tabular-nums">
                                    {visiblePosts?.length ?? 0}
                                </span>
                            </div>
                            <p className="mt-1 text-muted-foreground text-sm">All posts in your library.</p>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <div className="relative w-full sm:w-60">
                                <Search
                                    className="-translate-y-1/2 absolute top-1/2 left-2.5 size-4 text-muted-foreground"
                                    aria-hidden="true"
                                />
                                <Input
                                    aria-label="Search posts"
                                    placeholder="Search posts"
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                    className="h-8 pl-8 text-sm"
                                />
                            </div>
                            <div className="flex items-center rounded-md border border-border/70 bg-muted/30 p-0.5">
                                {filters.map((filter) => (
                                    <button
                                        key={filter.value}
                                        type="button"
                                        aria-pressed={statusFilter === filter.value}
                                        onClick={() => setStatusFilter(filter.value)}
                                        className={
                                            statusFilter === filter.value
                                                ? 'rounded-[5px] bg-background px-2.5 py-1 text-foreground text-xs font-medium shadow-sm'
                                                : 'rounded-[5px] px-2.5 py-1 text-muted-foreground text-xs font-medium transition-colors hover:text-foreground'
                                        }
                                    >
                                        {filter.label}
                                        <span className="ml-1 text-[10px] tabular-nums opacity-70">{filter.count}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {!posts ? (
                        <div className="space-y-2 p-5">
                            {[...Array(5)].map((_, index) => (
                                <Skeleton key={index} className="h-14 w-full" />
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <EmptyPostsState />
                    ) : visiblePosts?.length === 0 ? (
                        <div className="px-6 py-16 text-center">
                            <Search className="mx-auto size-8 text-muted-foreground/70" aria-hidden="true" />
                            <h3 className="mt-4 font-medium">No matching posts</h3>
                            <p className="mt-1 text-muted-foreground text-sm">
                                Try a different search or status filter.
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="h-11 pl-5 text-[11px] text-muted-foreground uppercase tracking-[0.08em]">
                                        Post
                                    </TableHead>
                                    <TableHead className="text-[11px] text-muted-foreground uppercase tracking-[0.08em]">
                                        Status
                                    </TableHead>
                                    <TableHead className="text-[11px] text-muted-foreground uppercase tracking-[0.08em]">
                                        Updated
                                    </TableHead>
                                    <TableHead className="text-[11px] text-muted-foreground uppercase tracking-[0.08em]">
                                        Discussions
                                    </TableHead>
                                    <TableHead className="pr-5 text-right text-[11px] text-muted-foreground uppercase tracking-[0.08em]">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {visiblePosts?.map((post) => (
                                    <TableRow key={post._id} className="group">
                                        <TableCell className="max-w-[34rem] pl-5">
                                            <Link
                                                href={`/admin/posts/${post._id}/edit`}
                                                className="block min-w-0 transition-colors hover:text-primary"
                                            >
                                                <span className="block truncate font-medium">{post.title}</span>
                                                <span className="mt-1 block truncate font-mono text-muted-foreground text-xs">
                                                    /{post.slug}
                                                </span>
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    post.isPublished
                                                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                        : 'bg-muted/40 text-muted-foreground'
                                                }
                                            >
                                                <span
                                                    className={`size-1.5 rounded-full ${post.isPublished ? 'bg-emerald-500' : 'bg-muted-foreground/60'}`}
                                                    aria-hidden="true"
                                                />
                                                {post.isPublished ? 'Published' : 'Draft'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                                            <span title={new Date(post.updatedAt).toLocaleString()}>
                                                {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
                                            </span>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                                            <span className="inline-flex items-center gap-1.5">
                                                <MessageSquare className="size-3.5" aria-hidden="true" />
                                                {post.commentCount + post.replyCount}
                                            </span>
                                        </TableCell>
                                        <TableCell className="pr-5">
                                            <div className="flex items-center justify-end gap-1 opacity-70 transition-opacity group-hover:opacity-100">
                                                <Button variant="ghost" size="icon-sm" asChild>
                                                    <Link
                                                        href={`/admin/posts/${post._id}/edit`}
                                                        aria-label={`Edit ${post.title}`}
                                                        title="Edit post"
                                                    >
                                                        <Pencil className="size-3.5" aria-hidden="true" />
                                                    </Link>
                                                </Button>
                                                {post.isPublished && (
                                                    <Button variant="ghost" size="icon-sm" asChild>
                                                        <a
                                                            href={`/blog/${post.slug}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            aria-label={`View ${post.title}`}
                                                            title="View published post"
                                                        >
                                                            <ExternalLink className="size-3.5" aria-hidden="true" />
                                                        </a>
                                                    </Button>
                                                )}
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon-sm"
                                                            className="text-destructive hover:text-destructive"
                                                            aria-label={`Delete ${post.title}`}
                                                            title="Delete post"
                                                        >
                                                            <Trash2 className="size-3.5" aria-hidden="true" />
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete post?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                This will permanently delete “{post.title}” and all of
                                                                its comments and replies.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                onClick={() => handleDeletePost(post._id)}
                                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                            >
                                                                Delete post
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </section>
            </div>
        </AdminPageFrame>
    )
}

function EmptyPostsState() {
    return (
        <div className="px-6 py-16 text-center">
            <div className="mx-auto flex size-11 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                <FileText className="size-5" aria-hidden="true" />
            </div>
            <h3 className="mt-4 font-medium">No posts yet</h3>
            <p className="mt-1 text-muted-foreground text-sm">Create your first post to start building the library.</p>
            <Button asChild size="sm" className="mt-5">
                <Link href="/admin/posts/new">
                    <Plus className="size-4" aria-hidden="true" />
                    Create post
                </Link>
            </Button>
        </div>
    )
}
