export default function BlogLoading() {
    return (
        <main className="min-h-svh bg-[#111111] font-mono text-[#e4e2de]" aria-busy="true" aria-label="Loading notes">
            <div className="mx-auto w-full max-w-[1028px] px-4 sm:px-6">
                <div className="max-w-[760px] py-[clamp(5.5rem,13vw,9.375rem)]">
                    <div className="h-48 animate-pulse bg-[#171717]" />
                </div>
                <div className="border-t border-[#343330]">
                    {[0, 1, 2].map((index) => (
                        <div key={index} className="h-32 animate-pulse border-b border-[#343330] bg-[#171717]/40" />
                    ))}
                </div>
            </div>
        </main>
    )
}
