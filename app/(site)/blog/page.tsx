import { Metadata } from 'next'
import { PageTransition } from '@/components/page-transition'
import BlogPage from '@/app/(site)/blog/client'

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Updates, ideas, and things we’re building at MikArt.'
}

export default function BlogPageServer() {
    return (
        <PageTransition>
            <BlogPage />
        </PageTransition>
    )
}
