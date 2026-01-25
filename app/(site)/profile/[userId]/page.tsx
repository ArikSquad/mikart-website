import ProfilePage from '@/app/(site)/profile/[userId]/client'
import { api } from '@/convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'
import { Metadata } from 'next'

type Props = {
    params: Promise<{ userId: string }>
}

export default async function ProfilePageServer({ params }: Props) {
    const p = await params
    const userId = p.userId

    return <ProfilePage userId={userId} />
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const p = await params
    const userId = p.userId

    console.log(userId)
    const profile = await fetchQuery(api.users.getByClerkId, { clerkId: userId })
    if (!profile) return {}

    return {
        title: `${profile.name}'s Profile`,
        description: profile.bio || `Read posts by ${profile.name} on our blog platform.`,
        openGraph: {
            title: `${profile.name}'s Profile`,
            description: profile.bio || `Read posts by ${profile.name} on our blog platform.`,
            images: profile.avatar
                ? [
                      {
                          url: profile.avatar,
                          alt: `${profile.name}'s Avatar`
                      }
                  ]
                : undefined
        }
    }
}
