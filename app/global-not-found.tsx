'use client'

import { Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import React from 'react'
import { motion, type Variants } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home, Search } from 'lucide-react'
import Link from 'next/link'

const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-sans' })

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
})

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15
        }
    }
}

const glitchVariants: Variants = {
    animate: {
        x: [0, -2, 2, -1, 1, 0],
        transition: {
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 3
        }
    }
}

const pulseVariants: Variants = {
    animate: {
        scale: [1, 1.02, 1],
        opacity: [0.5, 0.8, 0.5],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut'
        }
    }
}

export default function NotFound() {
    return (
        <html lang="en" className={jetbrainsMono.variable} suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
                    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-background">
                        <div className="absolute inset-0 overflow-hidden">
                            <motion.div
                                variants={pulseVariants}
                                animate="animate"
                                className="absolute -top-1/2 -left-1/2 w-full h-full bg-linear-to-br from-primary/10 via-transparent to-transparent rounded-full blur-3xl"
                            />
                            <motion.div
                                variants={pulseVariants}
                                animate="animate"
                                style={{ animationDelay: '2s' }}
                                className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-linear-to-tl from-primary/10 via-transparent to-transparent rounded-full blur-3xl"
                            />
                        </div>

                        <div
                            className="absolute inset-0 opacity-[0.02]"
                            style={{
                                backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
                                backgroundSize: '60px 60px'
                            }}
                        />

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl"
                        >
                            <motion.div variants={itemVariants} className="relative mb-6">
                                <motion.span
                                    variants={glitchVariants}
                                    animate="animate"
                                    className="font-mono text-[10rem] sm:text-[14rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-foreground to-foreground/20 select-none"
                                >
                                    404
                                </motion.span>
                                <motion.span
                                    className="absolute inset-0 font-mono text-[10rem] sm:text-[14rem] font-bold leading-none tracking-tighter text-primary/30 select-none"
                                    animate={{
                                        x: [0, 4, -4, 0],
                                        opacity: [0, 0.5, 0, 0]
                                    }}
                                    transition={{
                                        duration: 0.3,
                                        repeat: Infinity,
                                        repeatDelay: 4
                                    }}
                                >
                                    404
                                </motion.span>
                            </motion.div>

                            <motion.div variants={itemVariants} className="mb-6">
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/50 backdrop-blur-sm font-mono text-xs text-muted-foreground">
                                    <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                                    ERROR_NOT_FOUND
                                </span>
                            </motion.div>

                            <motion.h1
                                variants={itemVariants}
                                className="text-2xl sm:text-3xl font-semibold text-foreground mb-3"
                            >
                                Page not found
                            </motion.h1>

                            <motion.p
                                variants={itemVariants}
                                className="text-muted-foreground text-base sm:text-lg mb-10 max-w-md font-mono"
                            >
                                The page you&apos;re looking for doesn&apos;t exist or has been moved to another
                                dimension.
                            </motion.p>

                            <motion.div
                                variants={itemVariants}
                                className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
                            >
                                <Button asChild size="lg" className="gap-2 font-mono">
                                    <Link
                                        href="/"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            window.location.href = '/'
                                        }}
                                    >
                                        <Home className="size-4" />
                                        Back to home
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="gap-2 font-mono"
                                    onClick={() => window.history.back()}
                                >
                                    <button
                                        type="button"
                                        onClick={() => {
                                            window.history.back()
                                            setTimeout(() => {
                                                window.location.reload()
                                            }, 100)
                                        }}
                                    >
                                        <ArrowLeft className="size-4" />
                                        Go back
                                    </button>
                                </Button>
                                <Button asChild variant="ghost" size="lg" className="gap-2 font-mono">
                                    <Link
                                        href="/docs"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            window.location.href = '/docs'
                                        }}
                                    >
                                        <Search className="size-4" />
                                        Visit docs
                                    </Link>
                                </Button>
                            </motion.div>

                            <motion.div
                                variants={itemVariants}
                                className="mt-16 p-4 rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm w-full max-w-md"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="w-3 h-3 rounded-full bg-destructive/80" />
                                    <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <span className="w-3 h-3 rounded-full bg-green-500/80" />
                                    <span className="ml-auto font-mono text-xs text-muted-foreground">terminal</span>
                                </div>
                                <div className="font-mono text-xs text-muted-foreground text-left space-y-1">
                                    <p>
                                        <span className="text-primary">$</span> curl -I{' '}
                                        {typeof window !== 'undefined' ? window.location.href : 'https://mikart.eu/...'}
                                    </p>
                                    <p className="text-destructive">HTTP/1.1 404 Not Found</p>
                                    <p>
                                        <span className="text-muted-foreground/60">→</span> Resource unavailable
                                    </p>
                                    <motion.span
                                        animate={{ opacity: [1, 0, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className="inline-block w-2 h-4 bg-primary/80 ml-1"
                                    />
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </ThemeProvider>
            </body>
        </html>
    )
}
