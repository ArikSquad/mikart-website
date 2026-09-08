import Link from 'next/link'

export function BlogHeader() {
    return (
        <header className="bg-[#111111]" style={{ viewTransitionName: 'site-header' }}>
            <div className="mx-auto flex h-16 w-full max-w-257 items-center justify-between gap-7 px-5 sm:h-18 sm:px-8">
                <Link href="/" className="font-bold" transitionTypes={['nav-back']}>
                    ari <span className="font-normal text-[#97938c]">/ blogs</span>
                </Link>
                <nav className="flex gap-5 text-xs text-[#97938c] sm:gap-7" aria-label="Primary navigation">
                    <Link className="transition-colors hover:text-[#e4e2de]" href="/">
                        home
                    </Link>
                    <Link
                        className="transition-colors hover:text-[#e4e2de]"
                        href="/docs"
                        transitionTypes={['nav-forward']}
                    >
                        docs
                    </Link>
                    <a
                        className="transition-colors hover:text-[#e4e2de] max-[620px]:hidden"
                        href="mailto:ariksquad@mikart.eu"
                    >
                        contact
                    </a>
                </nav>
            </div>
        </header>
    )
}
