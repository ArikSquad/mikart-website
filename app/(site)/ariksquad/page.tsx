import Link from 'next/link'
import Image from 'next/image'
import { ExternalLink, Mail } from 'lucide-react'
import { SiGithub, SiBluesky } from '@icons-pack/react-simple-icons'
import { Fragment } from 'react'
import { Badge } from '@/components/ui/badge'
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemFooter,
    ItemGroup,
    ItemHeader,
    ItemMedia,
    ItemSeparator,
    ItemTitle
} from '@/components/ui/item'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'ArikSquad | Portfolio'
}

const projects = [
    {
        title: 'Salattu',
        description: 'A full-stack password manager with a mobile, a desktop, and a web application',
        image: '/assets/ariksquad/salattu.png',
        link: 'https://salattu.mikart.eu',
        technologies: ['Next.js', 'Rust', 'Postgres', 'Java']
    },
    {
        title: 'GroupSecurity',
        description: 'A staff security management system',
        image: '/assets/ariksquad/groupsecurity.png',
        link: 'https://github.com/ariksquad/GroupSecurity',
        technologies: ['Java', 'SQL']
    },
    {
        title: 'EnSave',
        description: 'An all-in-one Discord bot solution, with a dashboard',
        image: '/assets/ariksquad/ensave.png',
        link: 'https://ensave.mikart.eu',
        technologies: ['Next.js', 'TypeScript', 'Postgres', 'Python']
    },
    {
        title: 'And much more in my GitHub',
        description: 'Check out my GitHub for more projects and contributions',
        image: '',
        link: 'https://github.com/ariksquad',
        technologies: []
    }
]

const stack = [
    { name: 'Java' },
    { name: 'TypeScript' },
    { name: 'React' },
    { name: 'Next.js' },
    { name: 'Python' },
    { name: 'Git' },
    { name: 'Docker' },
    { name: 'SQL' },
    { name: 'Kubernetes' }
]

export default function Page() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
            <div className="relative z-10 flex min-h-screen flex-col justify-between">
                <main className="mx-auto max-w-7xl px-4 mx-auto px-4 py-12 md:py-20">
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
                        <div className="lg:col-span-5 lg:sticky lg:top-10 lg:self-start">
                            <div className="space-y-8">
                                <div>
                                    <h1 className="text-4xl font-bold tracking-tight md:text-6xl ">
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground/80 via-primary/90 to-slate-700">
                                            ArikSquad
                                        </span>
                                    </h1>
                                    <p className="mt-3 text-base text-muted-foreground md:text-lg">
                                        Full‑stack developer
                                    </p>
                                </div>

                                <Item variant="muted" className="p-6">
                                    <ItemContent>
                                        <ItemTitle className="text-base">About</ItemTitle>
                                        <ItemDescription className="line-clamp-none">
                                            I build modern web apps and backend services. Mostly Java for backend; I
                                            also work with multiple web technologies powered by React. I focus on
                                            shipping clean, reliable systems.
                                        </ItemDescription>
                                        <div className={`mt-4 flex flex-wrap gap-2`}>
                                            {stack.map((tech) => (
                                                <Badge key={tech.name} variant="secondary" className="text-xs">
                                                    {tech.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </ItemContent>
                                </Item>

                                <div className="flex gap-4">
                                    <Link
                                        href="https://github.com/ariksquad"
                                        className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        <SiGithub size={20} />
                                        <span className="border-b border-dotted border-transparent group-hover:border-foreground/50">
                                            GitHub
                                        </span>
                                    </Link>

                                    <Link
                                        href="https://bsky.app/profile/ariksquad.mikart.eu"
                                        className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        <SiBluesky size={20} />
                                        <span className="border-b border-dotted border-transparent group-hover:border-foreground/50">
                                            Bluesky
                                        </span>
                                    </Link>

                                    <Link
                                        href="mailto:ariksquad@mikart.eu"
                                        className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                        <Mail size={20} />
                                        <span className="border-b border-dotted border-transparent group-hover:border-foreground/50">
                                            Email
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-7">
                            <h2 className="mb-4 text-2xl font-medium">Selected Work</h2>
                            <ItemGroup>
                                {projects.map((project, idx) => (
                                    <Fragment key={project.title}>
                                        <Item variant="muted" asChild className="hover:bg-accent/30">
                                            <Link href={project.link} target="_blank" rel="noreferrer">
                                                <ItemMedia
                                                    variant={project.image ? 'image' : 'icon'}
                                                    className={
                                                        project.image
                                                            ? 'relative h-36 w-56 overflow-hidden rounded-md md:h-44 md:w-72'
                                                            : 'size-10'
                                                    }
                                                >
                                                    {project.image ? (
                                                        <Image
                                                            src={project.image}
                                                            alt={project.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <ExternalLink className="size-6 text-muted-foreground" />
                                                    )}
                                                </ItemMedia>
                                                <ItemContent>
                                                    <ItemHeader>
                                                        <ItemTitle className="text-base">{project.title}</ItemTitle>
                                                        <ItemActions className="text-muted-foreground">
                                                            <ExternalLink className="size-4" />
                                                        </ItemActions>
                                                    </ItemHeader>
                                                    <ItemDescription>{project.description}</ItemDescription>
                                                    {project.technologies.length > 0 && (
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {project.technologies.map((tech) => (
                                                                <Badge
                                                                    key={tech}
                                                                    variant="secondary"
                                                                    className="text-xs"
                                                                >
                                                                    {tech}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <ItemFooter />
                                                </ItemContent>
                                            </Link>
                                        </Item>
                                        {idx < projects.length - 1 && <ItemSeparator />}
                                    </Fragment>
                                ))}
                            </ItemGroup>
                        </div>
                    </div>
                </main>

                <footer className="border-t py-4 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} ArikSquad. All rights reserved.
                </footer>
            </div>
        </div>
    )
}
