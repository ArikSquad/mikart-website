"use client"

import { useState } from "react"
import { useConvexAuth, useQuery, useMutation } from "convex/react"
import { useUser, SignInButton } from "@clerk/nextjs"
import { api } from "@/convex/_generated/api"
import { Id } from "@/convex/_generated/dataModel"
import { formatDistanceToNow, format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Plus,
    Pencil,
    Trash2,
    Eye,
    MessageSquare,
    BarChart3,
    FileText,
    ExternalLink,
} from "lucide-react"

import { PostEditor } from "@/components/blog/post-editor"
import { MultiPostViewsChart, ViewsChart } from "@/components/blog/views-chart"

export default function AdminPage() {
    const { isAuthenticated, isLoading: authLoading } = useConvexAuth()
    const { user } = useUser()
    const posts = useQuery(api.posts.getWithStats)
    const createPost = useMutation(api.posts.create)
    const updatePost = useMutation(api.posts.update)
    const deletePost = useMutation(api.posts.remove)

    const [isEditorOpen, setIsEditorOpen] = useState(false)
    const [editingPost, setEditingPost] = useState<any>(null)
    const [selectedPostForStats, setSelectedPostForStats] = useState<string | null>(null)

    if (authLoading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-10">
                <div className="space-y-6">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-[400px] w-full" />
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-10">
                <Card className="max-w-md mx-auto">
                    <CardHeader className="text-center">
                        <CardTitle>Admin Panel</CardTitle>
                        <CardDescription>
                            Please sign in to access the admin panel
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <SignInButton mode="modal">
                            <Button>Sign In</Button>
                        </SignInButton>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const handleCreatePost = async (data: any) => {
        if (!user) return
        await createPost({
            ...data,
            userId: user.id,
        })
        setIsEditorOpen(false)
    }

    const handleUpdatePost = async (data: any) => {
        if (!editingPost) return
        await updatePost({
            id: editingPost._id,
            ...data,
        })
        setEditingPost(null)
        setIsEditorOpen(false)
    }

    const handleDeletePost = async (postId: Id<"posts">) => {
        await deletePost({ id: postId })
    }

    const openNewPostEditor = () => {
        setEditingPost(null)
        setIsEditorOpen(true)
    }

    const openEditPostEditor = (post: any) => {
        setEditingPost(post)
        setIsEditorOpen(true)
    }

    const totalViews = posts?.reduce((sum, post) => sum + post.viewCount, 0) || 0
    const totalComments = posts?.reduce((sum, post) => sum + post.commentCount, 0) || 0
    const publishedCount = posts?.filter((p) => p.isPublished).length || 0
    const draftCount = posts?.filter((p) => !p.isPublished).length || 0

    return (
        <div className="mx-auto max-w-7xl px-4 py-10">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
                    <p className="text-muted-foreground">
                        Manage your blog posts, comments, and analytics
                    </p>
                </div>
                <Button onClick={openNewPostEditor}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Post
                </Button>
            </div>

            {/* Stats Cards */}
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
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Across all posts</p>
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
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Analytics</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {posts && posts.length > 0
                                ? Math.round(totalViews / posts.length)
                                : 0}
                        </div>
                        <p className="text-xs text-muted-foreground">Avg views per post</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="posts" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="posts">Posts</TabsTrigger>
                    <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Posts</CardTitle>
                            <CardDescription>
                                Manage your blog posts. Click on a post to edit it.
                            </CardDescription>
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
                                    <p className="text-muted-foreground mb-4">
                                        Create your first blog post to get started
                                    </p>
                                    <Button onClick={openNewPostEditor}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create Post
                                    </Button>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-center">Views</TableHead>
                                            <TableHead className="text-center">Comments</TableHead>
                                            <TableHead>Created</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {posts.map((post) => (
                                            <TableRow
                                                key={post._id}
                                                className="cursor-pointer"
                                                onClick={() => openEditPostEditor(post)}
                                            >
                                                <TableCell className="font-medium">
                                                    <div className="flex flex-col">
                                                        <span>{post.title}</span>
                                                        <span className="text-xs text-muted-foreground">
                                                            /{post.slug}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={post.isPublished ? "default" : "secondary"}
                                                    >
                                                        {post.isPublished ? "Published" : "Draft"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                                        {post.viewCount.toLocaleString()}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <div className="flex items-center justify-center gap-1">
                                                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                                        {post.commentCount}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {formatDistanceToNow(new Date(post.createdAt), {
                                                        addSuffix: true,
                                                    })}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div
                                                        className="flex items-center justify-end gap-2"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => openEditPostEditor(post)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        {post.isPublished && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                asChild
                                                            >
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
                                                                        Are you sure you want to delete "{post.title}"?
                                                                        This action cannot be undone. All comments and
                                                                        replies will also be deleted.
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
                </TabsContent>

                <TabsContent value="analytics" className="space-y-4">
                    {posts && posts.length > 0 ? (
                        <>
                            <MultiPostViewsChart
                                posts={posts.map((p) => ({
                                    _id: p._id,
                                    title: p.title,
                                    slug: p.slug,
                                    viewCount: p.viewCount,
                                }))}
                            />

                            <Card>
                                <CardHeader>
                                    <CardTitle>Post Performance</CardTitle>
                                    <CardDescription>
                                        Individual post views breakdown
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {posts
                                            .sort((a, b) => b.viewCount - a.viewCount)
                                            .map((post) => (
                                                <div
                                                    key={post._id}
                                                    className="flex items-center justify-between p-4 border rounded-lg"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-medium truncate">{post.title}</p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {format(new Date(post.createdAt), "MMM d, yyyy")}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-6 ml-4">
                                                        <div className="text-right">
                                                            <p className="font-bold">{post.viewCount.toLocaleString()}</p>
                                                            <p className="text-xs text-muted-foreground">views</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold">{post.commentCount}</p>
                                                            <p className="text-xs text-muted-foreground">comments</p>
                                                        </div>
                                                        <Badge variant={post.isPublished ? "default" : "secondary"}>
                                                            {post.isPublished ? "Published" : "Draft"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-lg font-medium mb-2">No analytics data</h3>
                                <p className="text-muted-foreground">
                                    Create and publish posts to see analytics
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>
            </Tabs>

            {/* Post Editor Dialog */}
            <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
                    <DialogHeader>
                        <DialogTitle>
                            {editingPost ? "Edit Post" : "Create New Post"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingPost
                                ? "Make changes to your post below"
                                : "Fill in the details for your new post"}
                        </DialogDescription>
                    </DialogHeader>
                    <PostEditor
                        initialData={editingPost}
                        onSave={editingPost ? handleUpdatePost : handleCreatePost}
                        onCancel={() => {
                            setIsEditorOpen(false)
                            setEditingPost(null)
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}