export default function BlogPostLoading() {
    return (
        <div className="min-h-screen bg-background" aria-busy="true" aria-label="Loading blog post">
            <div className="mx-auto max-w-4xl px-4 pt-32 pb-12">
                <div className="mb-8 h-8 w-32 animate-pulse rounded-lg bg-muted" />
                <div className="h-12 w-full animate-pulse rounded-lg bg-muted" />
                <div className="mt-4 h-12 w-3/4 animate-pulse rounded-lg bg-muted" />
                <div className="mt-8 flex gap-6">
                    <div className="h-10 w-32 animate-pulse rounded-lg bg-muted" />
                    <div className="h-10 w-32 animate-pulse rounded-lg bg-muted" />
                </div>
            </div>
            <div className="mx-auto max-w-4xl space-y-4 px-4 py-12">
                {[...Array(8)].map((_, index) => (
                    <div
                        key={index}
                        className={`h-5 animate-pulse rounded-lg bg-muted ${index % 3 === 2 ? 'w-4/5' : 'w-full'}`}
                    />
                ))}
            </div>
        </div>
    )
}
