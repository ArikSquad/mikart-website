export default function AdminLoading() {
    return (
        <div className="min-h-screen bg-background" aria-busy="true" aria-label="Loading admin panel">
            <div className="mx-auto max-w-7xl px-4 py-6">
                <div className="h-10 w-36 animate-pulse rounded-lg bg-muted" />
            </div>
            <main className="mx-auto max-w-7xl space-y-6 px-4 pt-16">
                <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
                <div className="h-96 animate-pulse rounded-xl bg-muted" />
            </main>
        </div>
    )
}
