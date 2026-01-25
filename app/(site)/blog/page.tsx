import { Metadata } from 'next'
import BlogPage from '@/app/(site)/blog/client'

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Discover insights, tutorials, and thoughts on development, design, and the latest in technology.'
}

export default function BlogPageServer() {
    return <BlogPage />
}
