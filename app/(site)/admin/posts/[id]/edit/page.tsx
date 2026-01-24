'use client'

import { useConvexAuth, useQuery, useMutation } from 'convex/react'
import { SignInButton, useUser } from '@clerk/nextjs'
import { useRouter, useParams, notFound } from 'next/navigation'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

import { PostEditor } from '@/components/blog/post-editor'
import { MainNav } from '@/components/taxomony/main-nav'
import { mainNavItems } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

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

export default function EditPostPage() {
    const router = useRouter()
    const params = useParams()
    const postId = params.id as Id<'posts'>
    const { user } = useUser()

    const { isAuthenticated, isLoading: authLoading } = useConvexAuth()
    const post = useQuery(api.posts.getById, { id: postId })
    const updatePost = useMutation(api.posts.update)

    if (authLoading || post === undefined) {
        return (
            <div className="bg-background min-h-screen">
                <AdminHeader />
                <div className="mx-auto max-w-5xl px-4 pt-28">
                    <div className="space-y-6">
                        <Skeleton className="h-10 w-48" />
                        <Skeleton className="h-150 w-full" />
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

    if (post === null) {
        notFound()
    }

    const handleUpdatePost = async (data: any) => {
        if (!user) return
        await updatePost({
            id: postId,
            requesterId: user.id,
            ...data
        })
        router.push('/admin')
    }

    const handleCancel = () => {
        router.push('/admin')
    }

    return (
        <div className="bg-background min-h-screen">
            <AdminHeader />

            <div className="mx-auto max-w-5xl px-4 pt-28 pb-12">
                <div className="mb-8">
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

                    <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
                    <p className="text-muted-foreground mt-2">Make changes to your post below.</p>
                </div>

                <Card>
                    <CardContent className="pt-6">
                        <PostEditor initialData={post} onSave={handleUpdatePost} onCancel={handleCancel} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
