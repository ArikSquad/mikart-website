'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import { MobileNav } from './mobile-nav'
import { Button } from '@/components/ui/button'

type MainNavItem = {
    title: string
    href: string
    disabled?: boolean
}

interface MainNavProps {
    items?: MainNavItem[]
    children?: React.ReactNode
    showLogo?: boolean
    className?: string
}

export function MainNav({ items, children, showLogo = true, className }: MainNavProps) {
    const segment = useSelectedLayoutSegment()
    const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false)

    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu)
    }

    return (
        <div className={cn('flex items-center justify-between w-full', className)}>
            {showLogo && (
                <Link href="/" className="flex items-center space-x-3 group">
                    <div className="relative">
                        <Image
                            src="/assets/logo.png"
                            alt="MikArt Europe"
                            className="w-10 h-10 rounded-lg transition-transform group-hover:scale-105"
                            width={40}
                            height={40}
                        />
                        <div className="absolute inset-0 rounded-lg bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <span className="hidden sm:block font-bold text-lg bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                        MikArt
                    </span>
                </Link>
            )}

            {items?.length ? (
                <nav className="hidden md:flex items-center space-x-1">
                    {items.map((item, index) => {
                        const isActive = item.href === '/' ? segment === null : item.href.startsWith(`/${segment}`)

                        return (
                            <Link
                                key={index}
                                href={item.disabled ? '#' : item.href}
                                className={cn(
                                    'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                                    'hover:bg-muted/50 hover:text-foreground',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                    isActive ? 'text-foreground bg-muted/80' : 'text-muted-foreground',
                                    item.disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent'
                                )}
                            >
                                {item.title}
                                {isActive && (
                                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                                )}
                            </Link>
                        )
                    })}
                </nav>
            ) : null}

            <Button variant="ghost" size="sm" className="md:hidden" onClick={toggleMobileMenu} aria-label="Toggle menu">
                {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {showMobileMenu && items && (
                <MobileNav items={items} onClose={() => setShowMobileMenu(false)}>
                    {children}
                </MobileNav>
            )}
        </div>
    )
}
