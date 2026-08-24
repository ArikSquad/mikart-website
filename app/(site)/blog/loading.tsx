export default function BlogLoading() {
    return (
        <div className="min-h-screen bg-background" aria-busy="true" aria-label="Loading blog">
            <div className="mx-auto max-w-7xl px-4 pt-32 pb-16 text-center">
                <div className="mx-auto h-14 w-64 animate-pulse rounded-lg bg-muted" />
                <div className="mx-auto mt-6 h-6 max-w-2xl animate-pulse rounded-lg bg-muted" />
            </div>
            <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="h-56 animate-pulse rounded-2xl border border-border/50 bg-muted/50" />
                ))}
            </div>
        </div>
    )
}
