export default function DocsLoading() {
    return (
        <div className="mx-auto flex max-w-7xl flex-1 flex-col items-center px-4 py-16 text-center" aria-busy="true">
            <div className="h-10 w-56 animate-pulse rounded-lg bg-fd-muted" />
            <div className="mt-4 h-5 w-80 max-w-full animate-pulse rounded-lg bg-fd-muted" />
            <div className="mt-8 grid w-full max-w-3xl gap-4 md:grid-cols-2">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="h-32 animate-pulse rounded-2xl border bg-fd-muted" />
                ))}
            </div>
        </div>
    )
}
