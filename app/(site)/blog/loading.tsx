export default function BlogLoading() {
    return (
        <main className="min-h-svh bg-[#111111] font-mono text-[#e4e2de]" aria-busy="true" aria-label="Loading notes">
            <div className="mx-auto w-full max-w-[1028px] px-5 sm:px-8">
                <div className="max-w-[760px] pt-14 pb-20 sm:pt-24 sm:pb-28">
                    <div className="h-48 animate-pulse rounded-2xl bg-[#171717]" />
                </div>
                <div className="space-y-2">
                    {[0, 1, 2].map((index) => (
                        <div key={index} className="h-40 animate-pulse rounded-2xl bg-[#171717]/60" />
                    ))}
                </div>
            </div>
        </main>
    )
}
