import { Metadata } from 'next'
import { PageTransition } from '@/components/page-transition'
import BlogPage from '@/app/(site)/blog/client'

export const metadata: Metadata = {
    title: 'blog — ArikSquad',
    description: 'blogs written by ArikSquad'
}

export default function BlogPageServer() {
    return (
        <PageTransition>
            <BlogPage />
        </PageTransition>
    )
}
