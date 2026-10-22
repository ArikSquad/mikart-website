import { BlogHeader } from '../blog-header'

export default function BlogPostLoading() {
    return (
        <main className="blog-shell" aria-busy="true" aria-label="Loading blog post">
            <BlogHeader />
            <div className="mx-auto w-full max-w-[808px] px-5 sm:px-8">
                <div className="pt-14 pb-12 sm:pt-24 sm:pb-20">
                    <div className="h-48 animate-pulse rounded-2xl bg-[#142338]" />
                </div>
                <div className="pt-6 pb-24">
                    <div className="h-80 animate-pulse rounded-2xl bg-[#142338]" />
                </div>
            </div>
        </main>
    )
}
