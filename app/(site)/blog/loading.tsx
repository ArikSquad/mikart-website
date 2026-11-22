import { BlogHeader } from './blog-header'

export default function BlogLoading() {
    return (
        <main className="blog-shell" aria-busy="true" aria-label="Loading posts">
            <BlogHeader />
            <div className="mx-auto w-full max-w-257 px-5 sm:px-8">
                <div className="max-w-190 pt-14 pb-20 sm:pt-24 sm:pb-28">
                    <div className="h-48 animate-pulse rounded-2xl bg-[#142338]" />
                </div>
                <div className="space-y-2">
                    {[0, 1, 2].map((index) => (
                        <div key={index} className="h-40 animate-pulse rounded-2xl bg-[#142338]/60" />
                    ))}
                </div>
            </div>
        </main>
    )
}
