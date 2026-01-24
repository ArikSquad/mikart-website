import * as React from 'react'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import Image from 'next/image'

import { cn } from '@/lib/utils'
import { useLockBody } from '@/components/hooks/use-lock-body'
import { Separator } from '@/components/ui/separator'

type MainNavItem = {
    title: string
    href: string
    disabled?: boolean
}

interface MobileNavProps {
    items: MainNavItem[]
    children?: React.ReactNode
    onClose: () => void
}

export function MobileNav({ items, children, onClose }: MobileNavProps) {
    const segment = useSelectedLayoutSegment()
    useLockBody()

    return (
        <div className="fixed inset-0 top-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative z-50 bg-background border-r shadow-xl h-full w-72 p-6 animate-in slide-in-from-left-80 duration-300">
                <div className="flex items-center space-x-3 mb-8">
                    <div className="relative">
                        <Image
                            src="/assets/logo.png"
                            alt="MikArt Europe"
                            className="w-10 h-10 rounded-lg"
                            width={40}
                            height={40}
                        />
                    </div>
                    <span className="font-bold text-lg">MikArt</span>
                </div>

                <Separator className="mb-6" />

                <nav className="space-y-2">
                    {items.map((item, index) => {
                        const isActive = item.href === '/' ? segment === null : item.href.startsWith(`/${segment}`)

                        return (
                            <Link
                                key={index}
                                href={item.disabled ? '#' : item.href}
                                onClick={onClose}
                                className={cn(
                                    'flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200',
                                    'hover:bg-muted/50 hover:text-foreground',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                                    isActive
                                        ? 'text-foreground bg-muted/80 border-l-2 border-primary'
                                        : 'text-muted-foreground',
                                    item.disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent'
                                )}
                            >
                                {item.title}
                            </Link>
                        )
                    })}
                </nav>

                {children && (
                    <>
                        <Separator className="my-6" />
                        <div className="space-y-4">{children}</div>
                    </>
                )}

                <div className="absolute bottom-6 left-6 right-6">
                    <Separator className="mb-4" />
                    <div className="text-xs text-muted-foreground">© {new Date().getFullYear()} MikArt Europe</div>
                </div>
            </div>
        </div>
    )
}
