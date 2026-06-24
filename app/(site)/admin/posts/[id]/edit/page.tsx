import { AdminPostPage } from '../../_components/admin-post-page'
import type { Id } from '@/convex/_generated/dataModel'

export default async function EditPostPage({ params }: { params: Promise<{ id: Id<'posts'> }> }) {
    const { id } = await params

    return <AdminPostPage postId={id} />
}
