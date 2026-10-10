'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function AdminHeader() {
    return (
        <header className="sticky top-0 z-50 border-border/70 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center gap-4 px-4 sm:px-6 lg:px-8">
                <Link href="/admin" className="group flex items-center gap-3" aria-label="MikArt admin dashboard">
                    <span className="relative flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted ring-1 ring-border transition-transform group-hover:scale-105">
                        <Image
                            src="/assets/logo.png"
                            alt=""
                            width={32}
                            height={32}
                            sizes="32px"
                            className="size-8 object-cover"
                        />
                    </span>
                    <span className="hidden font-semibold text-sm tracking-tight sm:block">MikArt</span>
                </Link>

                <span className="hidden h-6 w-px bg-border sm:block" aria-hidden="true" />

                <span className="hidden text-muted-foreground text-sm md:block">Posts</span>

                <nav className="ml-auto flex items-center gap-1" aria-label="Admin utilities">
                    <Link
                        href="/blog"
                        className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground"
                    >
                        <span className="hidden sm:inline">View blog</span>
                        <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </Link>
                    <Link
                        href="/"
                        className="hidden h-8 items-center rounded-md px-2.5 text-muted-foreground text-sm transition-colors hover:bg-muted hover:text-foreground sm:inline-flex"
                    >
                        Back to site
                    </Link>
                </nav>
            </div>
        </header>
    )
}
