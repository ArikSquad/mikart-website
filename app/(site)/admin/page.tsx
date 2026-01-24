'use client'

import { useConvexAuth, useQuery, useMutation } from 'convex/react'
import { SignInButton } from '@clerk/nextjs'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Pencil, Trash2, MessageSquare, FileText, ExternalLink } from 'lucide-react'

import { MainNav } from '@/components/taxomony/main-nav'
import { mainNavItems } from '@/lib/navigation'

function AdminHeader() {
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

export default function AdminPage() {
    const { isAuthenticated, isLoading: authLoading } = useConvexAuth()
    const posts = useQuery(api.posts.getWithStats)
    const deletePost = useMutation(api.posts.remove)

    if (authLoading) {
        return (
            <div className="bg-background min-h-screen">
                <AdminHeader />
                <div className="mx-auto max-w-7xl px-4 pt-28">
                    <div className="space-y-6">
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-100 w-full" />
                    </div>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className="bg-background min-h-screen">
                <AdminHeader />
                <div className="mx-auto max-w-7xl px-4 pt-28">
                    <Card className="max-w-md mx-auto">
                        <CardHeader className="text-center">
                            <CardTitle>Admin Panel</CardTitle>
                            <CardDescription>Please sign in to access the admin panel</CardDescription>
                        </CardHeader>
                        <CardContent className="flex justify-center">
                            <SignInButton mode="modal">
                                <Button>Sign In</Button>
                            </SignInButton>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    const handleDeletePost = async (postId: Id<'posts'>) => {
        await deletePost({ id: postId })
    }

    const totalComments = posts?.reduce((sum, post) => sum + post.commentCount, 0) || 0
    const publishedCount = posts?.filter((p) => p.isPublished).length || 0
    const draftCount = posts?.filter((p) => !p.isPublished).length || 0

    return (
        <div className="bg-background min-h-screen">
            <AdminHeader />

            <div className="mx-auto max-w-7xl px-4 pt-28 pb-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
                        <p className="text-muted-foreground">Manage your blog posts, comments, and analytics</p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/posts/new">
                            <Plus className="h-4 w-4 mr-2" />
                            New Post
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{posts?.length || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                {publishedCount} published, {draftCount} drafts
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Comments</CardTitle>
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalComments}</div>
                            <p className="text-xs text-muted-foreground">Total comments</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Posts</CardTitle>
                        <CardDescription>Manage your blog posts. Click on a post to edit it.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!posts ? (
                            <div className="space-y-2">
                                {[...Array(5)].map((_, i) => (
                                    <Skeleton key={i} className="h-16 w-full" />
                                ))}
                            </div>
                        ) : posts.length === 0 ? (
                            <div className="text-center py-12">
                                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                                <p className="text-muted-foreground mb-4">Create your first blog post to get started</p>
                                <Button asChild>
                                    <Link href="/admin/posts/new">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Post
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-center">Comments</TableHead>
                                        <TableHead>Created</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {posts.map((post) => (
                                        <TableRow key={post._id} className="group">
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={`/admin/posts/${post._id}/edit`}
                                                    className="flex flex-col hover:text-primary transition-colors"
                                                >
                                                    <span>{post.title}</span>
                                                    <span className="text-xs text-muted-foreground">/{post.slug}</span>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={post.isPublished ? 'default' : 'secondary'}>
                                                    {post.isPublished ? 'Published' : 'Draft'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                                    {post.commentCount}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {formatDistanceToNow(new Date(post.createdAt), {
                                                    addSuffix: true
                                                })}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/admin/posts/${post._id}/edit`}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    {post.isPublished && (
                                                        <Button variant="ghost" size="icon" asChild>
                                                            <a
                                                                href={`/blog/${post.slug}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                            >
                                                                <ExternalLink className="h-4 w-4" />
                                                            </a>
                                                        </Button>
                                                    )}
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-destructive hover:text-destructive"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete Post</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to delete &quot;{post.title}
                                                                    &quot;? This action cannot be undone. All comments
                                                                    and replies will also be deleted.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => handleDeletePost(post._id)}
                                                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                                >
                                                                    Delete
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
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
