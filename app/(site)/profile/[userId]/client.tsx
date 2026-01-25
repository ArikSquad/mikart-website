'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useQuery, useMutation } from 'convex/react'
import { useUser } from '@clerk/nextjs'
import { api } from '@/convex/_generated/api'
import { MainNav } from '@/components/taxomony/main-nav'
import { mainNavItems } from '@/lib/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'
import { ChevronLeft, FileText, CalendarDays, Globe, ExternalLink, Clock, Pencil, Save, X, Loader2 } from 'lucide-react'
import { SiGithub, SiX } from '@icons-pack/react-simple-icons'
import { cn, formatDate } from '@/lib/utils'

function ProfileHeader() {
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

type ProfilePageProps = {
    userId: string
}

export default function ProfilePage({ userId }: ProfilePageProps) {
    const { user: currentUser } = useUser()

    const profile = useQuery(api.users.getByClerkId, { clerkId: userId })
    const posts = useQuery(api.users.getPostsByUserId, { clerkId: userId, publishedOnly: true })

    const updateProfile = useMutation(api.users.updateProfile)

    const [isEditing, setIsEditing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [bio, setBio] = useState('')
    const [twitter, setTwitter] = useState('')
    const [github, setGithub] = useState('')
    const [website, setWebsite] = useState('')

    const isOwner = currentUser?.id === userId

    useEffect(() => {
        if (profile) {
            setBio(profile.bio || '')
            setTwitter(profile.twitter || '')
            setGithub(profile.github || '')
            setWebsite(profile.website || '')
        }
    }, [profile])

    const handleSave = async () => {
        if (!currentUser?.id) return
        setIsSaving(true)
        try {
            await updateProfile({
                clerkId: currentUser.id,
                bio: bio.trim() || undefined,
                twitter: twitter.trim() || undefined,
                github: github.trim() || undefined,
                website: website.trim() || undefined
            })
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to save profile:', error)
        } finally {
            setIsSaving(false)
        }
    }

    if (profile === undefined) {
        return <ProfilePageSkeleton />
    }

    if (profile === null) {
        return (
            <div className="bg-background min-h-screen">
                <ProfileHeader />
                <div className="mx-auto max-w-4xl px-4 pt-28">
                    <div className="text-center py-16">
                        <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
                        <p className="text-muted-foreground mb-6">
                            This user doesn't exist or hasn't been created yet.
                        </p>
                        <Link href="/blog" className={buttonVariants()}>
                            Go to Blog
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    const getWordCount = (content: any): number => {
        if (!content || !content.content) return 0
        let wordCount = 0
        const traverse = (nodes: any[]) => {
            for (const node of nodes) {
                if (node.type === 'text' && node.text) {
                    wordCount += node.text.split(/\s+/).length
                }
                if (node.content) {
                    traverse(node.content)
                }
            }
        }
        traverse(content.content)
        return wordCount
    }

    return (
        <div className="bg-background min-h-screen">
            <ProfileHeader />

            <div className="relative overflow-hidden border-b border-border/40">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

                <div className="mx-auto max-w-4xl px-4 pt-28 pb-12 relative">
                    <Link
                        href="/blog"
                        className={cn(
                            buttonVariants({ variant: 'ghost', size: 'sm' }),
                            'mb-8 -ml-2 text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Back to Blogs
                    </Link>

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <Avatar className="h-28 w-28 ring-4 ring-background shadow-xl">
                            <AvatarImage src={profile.avatar} />
                            <AvatarFallback className="text-4xl bg-primary/10 text-primary font-semibold">
                                {profile.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 text-center sm:text-left">
                            <div className="flex items-center gap-3 justify-center sm:justify-start mb-2">
                                <h1 className="text-3xl sm:text-4xl font-bold">{profile.name}</h1>
                            </div>

                            {isEditing ? (
                                <div className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            placeholder="Tell us about yourself..."
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            rows={3}
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="twitter">Twitter/X</Label>
                                            <Input
                                                id="twitter"
                                                placeholder="username"
                                                value={twitter}
                                                onChange={(e) => setTwitter(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="github">GitHub</Label>
                                            <Input
                                                id="github"
                                                placeholder="username"
                                                value={github}
                                                onChange={(e) => setGithub(e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="website">Website</Label>
                                            <Input
                                                id="website"
                                                placeholder="https://..."
                                                value={website}
                                                onChange={(e) => setWebsite(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button onClick={handleSave} disabled={isSaving}>
                                            {isSaving ? (
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            ) : (
                                                <Save className="h-4 w-4 mr-2" />
                                            )}
                                            Save
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setIsEditing(false)
                                                setBio(profile.bio || '')
                                                setTwitter(profile.twitter || '')
                                                setGithub(profile.github || '')
                                                setWebsite(profile.website || '')
                                            }}
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {profile.bio && (
                                        <p className="text-muted-foreground text-lg mb-4 max-w-2xl">{profile.bio}</p>
                                    )}

                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
                                        {profile.twitter && (
                                            <a
                                                href={`https://twitter.com/${profile.twitter}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={cn(
                                                    buttonVariants({ variant: 'outline', size: 'sm' }),
                                                    'gap-2'
                                                )}
                                            >
                                                <SiX className="h-4 w-4" />@{profile.twitter}
                                            </a>
                                        )}
                                        {profile.github && (
                                            <a
                                                href={`https://github.com/${profile.github}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={cn(
                                                    buttonVariants({ variant: 'outline', size: 'sm' }),
                                                    'gap-2'
                                                )}
                                            >
                                                <SiGithub className="h-4 w-4" />
                                                {profile.github}
                                            </a>
                                        )}
                                        {profile.website && (
                                            <a
                                                href={profile.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={cn(
                                                    buttonVariants({ variant: 'outline', size: 'sm' }),
                                                    'gap-2'
                                                )}
                                            >
                                                <Globe className="h-4 w-4" />
                                                Website
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                        {isOwner && (
                                            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                                <Pencil className="h-4 w-4 mr-2" />
                                                Edit Profile
                                            </Button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {posts && posts.length > 0 && (
                <div className="mx-auto max-w-4xl px-4 py-12">
                    <div className="flex items-center gap-3 mb-8">
                        <FileText className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-semibold">Posts by {profile.name}</h2>
                        <Badge variant="secondary">{posts.length}</Badge>
                    </div>

                    <div className="space-y-4">
                        {posts.map((post) => {
                            const wordCount = getWordCount(post.content)
                            const readingTime = Math.max(1, Math.ceil(wordCount / 200))

                            return (
                                <Link key={post._id} href={`/blog/${post.slug}`} className="block">
                                    <Card className="hover:shadow-md transition-all hover:border-primary/30 group">
                                        <CardContent className="p-4">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-semibold group-hover:text-primary transition-colors line-clamp-2">
                                                        {post.title}
                                                    </h3>

                                                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1.5">
                                                            <CalendarDays className="h-4 w-4" />
                                                            <time dateTime={new Date(post.createdAt).toISOString()}>
                                                                {formatDate(new Date(post.createdAt).toISOString())}
                                                            </time>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock className="h-4 w-4" />
                                                            <span>{readingTime} min read</span>
                                                        </div>
                                                    </div>

                                                    {post.tags && post.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-3">
                                                            {post.tags.slice(0, 3).map((tag) => (
                                                                <Badge
                                                                    key={tag}
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                >
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                            {post.tags.length > 3 && (
                                                                <Badge variant="outline" className="text-xs">
                                                                    +{post.tags.length - 3}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <ChevronLeft className="h-5 w-5 text-muted-foreground rotate-180 shrink-0 hidden sm:block group-hover:text-primary transition-colors" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

function ProfilePageSkeleton() {
    return (
        <div className="bg-background min-h-screen">
            <ProfileHeader />

            <div className="relative overflow-hidden border-b border-border/40">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-primary/10" />
                <div className="mx-auto max-w-4xl px-4 pt-28 pb-12 relative">
                    <Skeleton className="h-8 w-32 mb-8" />
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <Skeleton className="h-28 w-28 rounded-full" />
                        <div className="flex-1 text-center sm:text-left">
                            <Skeleton className="h-10 w-48 mb-3 mx-auto sm:mx-0" />
                            <Skeleton className="h-5 w-full max-w-md mb-4 mx-auto sm:mx-0" />
                            <div className="flex gap-3 justify-center sm:justify-start">
                                <Skeleton className="h-9 w-24" />
                                <Skeleton className="h-9 w-24" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
