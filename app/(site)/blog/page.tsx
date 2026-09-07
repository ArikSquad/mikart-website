import { Metadata } from 'next'
import { PageTransition } from '@/components/page-transition'
import BlogPage from '@/app/(site)/blog/client'

export const metadata: Metadata = {
    title: 'Notes — ArikSquad',
    description: 'Notes on software, infrastructure, security, and building systems that are easier to operate.'
}

export default function BlogPageServer() {
    return (
        <PageTransition>
            <BlogPage />
        </PageTransition>
    )
}
