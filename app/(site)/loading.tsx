export default function SiteLoading() {
    return (
        <div className="min-h-screen bg-background" aria-busy="true" aria-label="Loading">
            <div className="mx-auto max-w-7xl px-4 py-6">
                <div className="h-10 w-36 animate-pulse rounded-lg bg-muted" />
            </div>
            <div className="mx-auto max-w-4xl px-4 py-24">
                <div className="space-y-5">
                    <div className="h-12 w-3/4 animate-pulse rounded-lg bg-muted" />
                    <div className="h-6 w-full animate-pulse rounded-lg bg-muted" />
                    <div className="h-6 w-5/6 animate-pulse rounded-lg bg-muted" />
                </div>
            </div>
        </div>
    )
}
