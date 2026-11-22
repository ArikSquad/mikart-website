'use client'

import { SignInButton, useUser } from '@clerk/nextjs'
import { useConvexAuth, useMutation, useQuery } from 'convex/react'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound, useRouter } from 'next/navigation'

import { api } from '@/convex/_generated/api'
import type { Id } from '@/convex/_generated/dataModel'
import { AdminHeader } from '@/components/admin/admin-header'
import { PostEditor, type PostEditorValue } from '@/components/blog/post-editor'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

type AdminPostPageProps = {
    postId?: Id<'posts'>
}

function LoadingState() {
    return (
        <AdminPageFrame>
            <div className="space-y-6" aria-busy="true" aria-label="Loading post editor">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-9 w-64" />
                    <Skeleton className="h-4 w-96 max-w-full" />
                </div>
                <Skeleton className="h-[680px] w-full rounded-lg" />
            </div>
        </AdminPageFrame>
    )
}

function SignInState() {
    return (
        <AdminPageFrame>
            <Card className="mx-auto mt-16 w-full max-w-md rounded-lg border-border/70 shadow-sm">
                <CardContent className="p-6 text-center sm:p-8">
                    <h1 className="text-xl font-semibold tracking-tight">Posts</h1>
                    <p className="mt-2 text-muted-foreground text-sm">Sign in to create and manage blog posts.</p>
                    <SignInButton mode="modal">
                        <Button className="mt-6 w-full">Sign in to continue</Button>
                    </SignInButton>
                </CardContent>
            </Card>
        </AdminPageFrame>
    )
}

function AdminPageFrame({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-svh bg-muted/20">
            <AdminHeader />
            <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
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
            <div className="mb-6 flex flex-col gap-5 border-border/70 border-b pb-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="font-semibold text-3xl tracking-tight">{isEditing ? 'Edit post' : 'Create post'}</h1>
                    <p className="mt-2 max-w-2xl text-muted-foreground text-sm leading-6">
                        {isEditing ? 'Update the post below.' : 'Write a post, then save it as a draft or publish it.'}
                    </p>
                </div>
                <Link
                    href="/admin"
                    className={cn(
                        buttonVariants({ variant: 'ghost', size: 'sm' }),
                        'order-first self-start text-muted-foreground hover:text-foreground md:order-none md:self-auto'
                    )}
                >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back to posts
                </Link>
            </div>

            <PostEditor initialData={post ?? undefined} onSave={savePost} onCancel={goBack} />
        </AdminPageFrame>
    )
}
