import Link from 'next/link'

export function BlogHeader() {
    return (
        <header className="border-b border-[#343330] bg-[#111111]/90" style={{ viewTransitionName: 'site-header' }}>
            <div className="mx-auto flex h-[68px] w-full max-w-[1028px] items-center justify-between gap-7 px-4 sm:px-6">
                <Link href="/" className="font-bold" transitionTypes={['nav-back']}>
                    ari <span className="font-normal text-[#97938c]">/ notes</span>
                </Link>
                <nav className="flex gap-4 text-xs text-[#97938c] sm:gap-6" aria-label="Primary navigation">
                    <Link className="border-b border-transparent hover:border-current hover:text-[#e4e2de]" href="/">
                        home
                    </Link>
                    <Link href="/docs" transitionTypes={['nav-forward']}>
                        docs
                    </Link>
                    <a className="max-[620px]:hidden" href="mailto:ariksquad@mikart.eu">
                        contact
                    </a>
                </nav>
            </div>
        </header>
    )
}
