import PostPage from '@/app/(site)/blog/[slug]/client'
import { Metadata } from 'next'
import { api } from '@/convex/_generated/api'
import { fetchQuery } from 'convex/nextjs'

type Props = {
    params: Promise<{ slug: string }>
}

export default function BlogPageServer() {
    return <PostPage />
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const p = await params
    const slug = p.slug

    const postData = await fetchQuery(api.posts.getBySlugWithAuthor, { slug })

    if (!postData) {
        return {}
    }

    return {
        title: postData.title,
        description: postData.description,
        authors: [
            {
                name: postData.author?.name,
                url: 'https://www.mikart.eu/profile/' + postData.author?.clerkId
            }
        ],
        openGraph: {
            title: postData.title,
            description: postData.description,
            locale: 'en_US',
            type: 'article',
            authors: postData.author ? ['https://www.mikart.eu/profile/' + postData.author.clerkId] : [],
            siteName: 'MikArt Europe'
        },
        keywords: postData.tags,
        twitter: {
            title: postData.title,
            description: postData.description,
            card: 'summary_large_image'
        },
        creator: postData.author?.name,
        publisher: 'MikArt Europe'
    }
}
