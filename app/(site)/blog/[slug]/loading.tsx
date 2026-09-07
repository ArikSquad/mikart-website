export default function BlogPostLoading() {
    return (
        <main
            className="min-h-svh bg-[#111111] font-mono text-[#e4e2de]"
            aria-busy="true"
            aria-label="Loading blog post"
        >
            <div className="mx-auto w-full max-w-[808px] px-4 sm:px-6">
                <div className="border-b border-[#343330] py-20">
                    <div className="h-48 animate-pulse bg-[#171717]" />
                </div>
                <div className="py-14">
                    <div className="h-80 animate-pulse bg-[#171717]" />
                </div>
            </div>
        </main>
    )
}
