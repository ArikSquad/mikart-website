export default function ProfileLoading() {
    return (
        <div className="min-h-screen bg-background" aria-busy="true" aria-label="Loading profile">
            <div className="h-20 border-b border-border/40 bg-background/70" />
            <div className="mx-auto max-w-4xl px-4 pt-28 pb-12">
                <div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />
                <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                    <div className="size-28 animate-pulse rounded-full bg-muted" />
                    <div className="w-full space-y-4">
                        <div className="h-10 w-64 animate-pulse rounded-lg bg-muted" />
                        <div className="h-6 w-full max-w-2xl animate-pulse rounded-lg bg-muted" />
                    </div>
                </div>
            </div>
        </div>
    )
}
