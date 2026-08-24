export default function DocsPageLoading() {
    return (
        <div className="mx-auto max-w-4xl space-y-6 px-4 py-12" aria-busy="true" aria-label="Loading documentation">
            <div className="h-10 w-3/4 animate-pulse rounded-lg bg-fd-muted" />
            <div className="h-5 w-full animate-pulse rounded-lg bg-fd-muted" />
            <div className="h-px w-full bg-fd-border" />
            {[...Array(12)].map((_, index) => (
                <div
                    key={index}
                    className={`h-5 animate-pulse rounded-lg bg-fd-muted ${index % 4 === 3 ? 'w-4/5' : 'w-full'}`}
                />
            ))}
        </div>
    )
}
