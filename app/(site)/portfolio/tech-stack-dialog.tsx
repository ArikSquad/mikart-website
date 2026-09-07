'use client'

import type { ComponentType, SVGProps } from 'react'
import {
    SiCloudflare,
    SiConvex,
    SiCplusplus,
    SiDocker,
    SiKotlin,
    SiKubernetes,
    SiLinux,
    SiNextdotjs,
    SiOpenjdk,
    SiPostgresql,
    SiPython,
    SiReactrouter,
    SiRust,
    SiTanstack,
    SiTrpc,
    SiTypescript,
    SiVercel,
    SiWireshark
} from '@icons-pack/react-simple-icons'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog'

type TechIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: string | number }>

const categories: ReadonlyArray<{
    name: string
    items: ReadonlyArray<{ name: string; href: string; icon: TechIcon }>
}> = [
    {
        name: 'infrastructure',
        items: [
            { name: 'Vercel', href: 'https://vercel.com', icon: SiVercel },
            { name: 'Kubernetes', href: 'https://kubernetes.io', icon: SiKubernetes },
            { name: 'Docker', href: 'https://www.docker.com', icon: SiDocker },
            { name: 'Linux', href: 'https://www.kernel.org', icon: SiLinux },
            { name: 'Cloudflare', href: 'https://www.cloudflare.com', icon: SiCloudflare },
            { name: 'PostgreSQL', href: 'https://www.postgresql.org', icon: SiPostgresql }
        ]
    },
    {
        name: 'systems & security',
        items: [
            { name: 'Rust', href: 'https://www.rust-lang.org', icon: SiRust },
            { name: 'C++', href: 'https://isocpp.org', icon: SiCplusplus },
            { name: 'Wireshark', href: 'https://www.wireshark.org', icon: SiWireshark }
        ]
    },
    {
        name: 'JVM',
        items: [
            { name: 'Java', href: 'https://openjdk.org', icon: SiOpenjdk },
            { name: 'Kotlin', href: 'https://kotlinlang.org', icon: SiKotlin }
        ]
    },
    {
        name: 'web & type safety',
        items: [
            { name: 'Convex', href: 'https://www.convex.dev', icon: SiConvex },
            { name: 'tRPC', href: 'https://trpc.io', icon: SiTrpc },
            { name: 'TypeScript', href: 'https://www.typescriptlang.org', icon: SiTypescript },
            { name: 'Next.js', href: 'https://nextjs.org', icon: SiNextdotjs },
            { name: 'TanStack', href: 'https://tanstack.com', icon: SiTanstack },
            { name: 'React Router', href: 'https://reactrouter.com', icon: SiReactrouter }
        ]
    },
    { name: 'scripting', items: [{ name: 'Python', href: 'https://www.python.org', icon: SiPython }] }
]

export function TechStackDialog() {
    return (
        <Dialog>
            <DialogTrigger className="cursor-pointer border-0 border-b border-[#343330] bg-transparent pb-1 font-mono text-xs text-[#97938c] transition-colors hover:border-[#e4e2de] hover:text-[#e4e2de] focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-[#97938c]">
                tech I like
            </DialogTrigger>
            <DialogContent className="max-h-[calc(100svh-3rem)] max-w-[820px] gap-0 overflow-y-auto rounded-none border border-[#3c3b38] bg-[#171717] p-[clamp(1.5rem,4vw,2.625rem)] font-mono text-[#e4e2de] shadow-[0_24px_80px_rgba(0,0,0,.35)] sm:max-w-[820px]">
                <DialogHeader className="pr-10 text-left">
                    <p className="m-0 text-sm text-[#97938c]">toolbox</p>
                    <DialogTitle className="mt-2.5 text-[clamp(1.375rem,4vw,2rem)] tracking-[-0.04em]">
                        tech I like
                    </DialogTitle>
                    <DialogDescription className="mt-3 max-w-[520px] leading-normal text-[#97938c]">
                        A working set, grouped by where I use it. Hover or focus for notes.
                    </DialogDescription>
                </DialogHeader>
                <div className="mt-9">
                    {categories.map((category, index) => (
                        <section className={index ? 'mt-8' : undefined} key={category.name}>
                            <h3 className="mb-3 text-[10px] font-medium tracking-[0.09em] text-[#97938c] uppercase">
                                {category.name}
                            </h3>
                            <div className="grid grid-cols-1 border-t border-l border-[#343330] sm:grid-cols-2 lg:grid-cols-3">
                                {category.items.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="group relative grid min-h-[76px] grid-cols-[22px_minmax(0,1fr)] items-center gap-x-2.5 border-r border-b border-[#343330] p-3.5 text-[#e4e2de] transition-colors hover:bg-[#20201e] focus-visible:bg-[#20201e] focus-visible:outline-none"
                                    >
                                        <item.icon className="fill-current" size={18} aria-hidden="true" />
                                        <span className="whitespace-nowrap">{item.name}</span>
                                        <small className="col-start-2 text-[9px] text-[#97938c] opacity-100 transition-all sm:absolute sm:right-2.5 sm:bottom-1.5 sm:left-[46px] sm:translate-y-0.5 sm:truncate sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-visible:translate-y-0 sm:group-focus-visible:opacity-100">
                                            Description pending.
                                        </small>
                                    </a>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}
