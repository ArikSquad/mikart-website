'use client'

import { SignInButton, useUser } from '@clerk/nextjs'
import { useConvexAuth, useMutation, useQuery } from 'convex/react'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'

import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { PostEditor, type PostEditorValue } from '@/components/blog/post-editor'
import { MainNav } from '@/components/taxomony/main-nav'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { mainNavItems } from '@/lib/navigation'
import { cn } from '@/lib/utils'

type AdminPostPageProps = {
    postId?: Id<'posts'>
}

function AdminHeader() {
    return (
        <header className="fixed top-0 right-0 left-0 z-50 border-border/10 border-b bg-background/40 shadow-sm backdrop-blur-xl">
            <div className="absolute inset-0 bg-linear-to-r from-background/80 via-background/60 to-background/80" />
            <div className="relative z-10 mx-auto max-w-7xl px-4">
                <div className="flex h-20 items-center justify-between py-6">
                    <MainNav items={mainNavItems} />
                </div>
            </div>
        </header>
    )
}

function LoadingState() {
    return (
        <AdminPageFrame>
            <div className="space-y-6">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-[720px] w-full" />
            </div>
        </AdminPageFrame>
    )
}

function SignInState() {
    return (
        <AdminPageFrame>
            <Card className="mx-auto max-w-md">
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
        </AdminPageFrame>
    )
}

function AdminPageFrame({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <AdminHeader />
            <main className="mx-auto max-w-7xl px-4 pt-28 pb-12">{children}</main>
        </div>
    )
}

export function AdminPostPage({ postId }: AdminPostPageProps) {
    const router = useRouter()
    const { user } = useUser()
    const { isAuthenticated, isLoading: authLoading } = useConvexAuth()
    const post = useQuery(api.posts.getById, postId ? { id: postId } : 'skip')
    const createPost = useMutation(api.posts.create)
    const updatePost = useMutation(api.posts.update)

    const isEditing = Boolean(postId)

    if (authLoading || (isEditing && post === undefined)) {
        return <LoadingState />
    }

    if (!isAuthenticated) {
        return <SignInState />
    }

    if (postId && post === null) {
        notFound()
    }

    const goBack = () => router.push('/admin')

    const savePost = async (data: PostEditorValue) => {
        if (!user) return

        if (postId) {
            await updatePost({
                id: postId,
                requesterId: user.id,
                ...data
            })
        } else {
            await createPost({
                ...data,
                userId: user.id
            })
        }

        goBack()
    }

    return (
        <AdminPageFrame>
            <div className="mb-6">
                <Link
                    href="/admin"
                    className={cn(
                        buttonVariants({ variant: 'ghost', size: 'sm' }),
                        'mb-4 -ml-2 text-muted-foreground hover:text-foreground'
                    )}
                >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back to Admin
                </Link>

                <h1 className="font-bold text-3xl tracking-tight">{isEditing ? 'Edit Post' : 'Create New Post'}</h1>
                <p className="mt-2 text-muted-foreground">
                    {isEditing
                        ? 'Make changes to your post below.'
                        : 'Fill in the details below to create a new blog post.'}
                </p>
            </div>

            <PostEditor initialData={post ?? undefined} onSave={savePost} onCancel={goBack} />
        </AdminPageFrame>
    )
}
