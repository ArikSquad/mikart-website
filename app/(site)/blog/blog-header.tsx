import Link from 'next/link'
import './blog.css'

export function BlogHeader() {
    return (
        <header className="blog-header" style={{ viewTransitionName: 'site-header' }}>
            <div className="blog-header-inner">
                <Link href="/" className="blog-brand" transitionTypes={['nav-back']}>
                    mikart <span>/ Blog</span>
                </Link>
                <nav aria-label="Primary navigation">
                    <Link href="/">Home</Link>
                    <Link href="/blog" aria-current="page">
                        Blog
                    </Link>
                    <Link href="/docs" transitionTypes={['nav-forward']}>
                        Docs
                    </Link>
                    <a href="mailto:ariksquad@mikart.eu">Contact ↗</a>
                </nav>
            </div>
        </header>
    )
}
