'use client'

import Link from 'next/link'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { ease } from './home-data'

export function SiteNavigation({
    menuOpen,
    setMenuOpen,
    time,
    reducedMotion
}: {
    menuOpen: boolean
    setMenuOpen: (open: boolean) => void
    time: string
    reducedMotion: boolean | null
}) {
    const links = [
        ['01', 'Work', '#work'],
        ['02', 'About', '#about'],
        ['03', 'Notes', '/blog'],
        ['04', 'Docs', '/docs'],
        ['05', 'Hello', '#hello']
    ] as const

    return (
        <>
            <header className="site-nav">
                <Link className="site-brand" href="/" aria-label="MikArt Europe home">
                    <span className="brand-mark">M</span>
                    <span>
                        <strong>MikArt</strong>
                        <small>Europe</small>
                    </span>
                </Link>
                <nav className="site-nav-links" aria-label="Primary navigation">
                    <Link href="#work">Work</Link>
                    <Link href="/blog">Notes</Link>
                    <button type="button" onClick={() => setMenuOpen(true)} aria-label="Open navigation menu">
                        Explore <Menu size={17} />
                    </button>
                </nav>
            </header>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        className="menu-overlay"
                        initial={{ clipPath: 'circle(0% at 94% 4%)' }}
                        animate={{ clipPath: 'circle(145% at 94% 4%)' }}
                        exit={{ clipPath: 'circle(0% at 94% 4%)' }}
                        transition={{ duration: reducedMotion ? 0 : 0.65, ease }}
                        aria-hidden={!menuOpen}
                    >
                        <button className="menu-close" type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu">
                            <X size={19} />
                        </button>
                        <div className="menu-inner">
                            <p className="menu-kicker">Menu</p>
                            <nav className="menu-links" aria-label="Section navigation">
                                {links.map(([number, label, href]) => (
                                    <Link href={href} key={href} onClick={() => setMenuOpen(false)}>
                                        <small>{number}</small>
                                        <span>{label}</span>
                                        <ArrowUpRight />
                                    </Link>
                                ))}
                            </nav>
                            <div className="menu-foot">
                                <span>Finland / {time}</span>
                                <span>Java · Rust · TypeScript · C++</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
