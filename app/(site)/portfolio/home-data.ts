import { SiBluesky, SiDiscord, SiGithub, SiX } from '@icons-pack/react-simple-icons'
import { Mail } from 'lucide-react'

export type ProjectData = {
    index: string
    name: string
    category: string
    strap: string
    detail: string
    outcome: string
    tags: readonly string[]
    image?: string
    visual: 'image' | 'tava' | 'platform' | 'terminal'
    href: string
    link: string
    theme: string
}

export const projects: readonly ProjectData[] = [
    {
        index: '01',
        name: 'Tava',
        category: 'Data infrastructure',
        strap: 'A typed data layer for Java.',
        detail: 'Tava keeps one model at the center and makes each storage adapter state its limits.',
        outcome: 'Less glue code, and fewer promises the backend cannot keep.',
        tags: ['Java 21', 'JDBC', 'NoSQL', 'DynamoDB'],
        visual: 'tava',
        href: '/docs/tava',
        link: 'Read the system',
        theme: 'lime'
    },
    {
        index: '02',
        name: 'Hypixel Recreation',
        category: 'Game platforms',
        strap: 'A Minecraft platform with room to grow.',
        detail: 'Rebuilding a large game world without Spigot meant getting the boundaries right before the content got big.',
        outcome: 'New game modes can sit on shared systems instead of copying the old ones.',
        tags: ['Java', 'Minecraft', 'Platform design', 'Scale'],
        visual: 'platform',
        href: 'https://github.com/Swofty-Developments/HypixelRecreation',
        link: 'See the repository',
        theme: 'blue'
    },
    {
        index: '03',
        name: 'Salattu',
        category: 'Security software',
        strap: 'A password manager with a Rust core.',
        detail: 'A cross-platform product with Rust at the center, Java services behind it, and a calmer surface for the daily work.',
        outcome: 'The hard security work stays underneath one understandable product.',
        tags: ['Rust', 'Java', 'React Native', 'Convex'],
        image: '/assets/ariksquad/salattu.png',
        visual: 'image',
        href: 'https://salattu.mikart.eu',
        link: 'Open Salattu',
        theme: 'violet'
    },
    {
        index: '04',
        name: 'EnSave',
        category: 'Community operations',
        strap: 'Tools for the people running a community.',
        detail: 'Discord automation and a focused dashboard for moderation, management, and the small jobs that fill every day.',
        outcome: 'The work becomes visible, repeatable, and easier to hand over.',
        tags: ['TypeScript', 'Discord', 'Convex', 'PostgreSQL'],
        image: '/assets/ariksquad/ensave.png',
        visual: 'image',
        href: 'https://ensave.mikart.eu',
        link: 'Open EnSave',
        theme: 'orange'
    }
]

export const proofPoints = [
    { value: '10k+', label: 'people reached by hosted services' },
    { value: '81', label: 'public repositories to learn from' },
    { value: '?', label: 'always choosing the right tech for the job' }
] as const

export const capabilities = [
    {
        number: '01',
        title: 'make the boundary clear.',
        copy: 'Typed models, explicit adapters, and APIs that make the wrong path feel harder to take.'
    },
    {
        number: '02',
        title: 'design for the next subsystem.',
        copy: 'Game platforms, plugins, and services are healthier when new work does not require rewriting old work.'
    },
    {
        number: '03',
        title: 'leave the operator calmer.',
        copy: 'Good tooling reduces cognitive load for the person who has to run it, debug it, and trust it on a bad day.'
    }
] as const

export const socials = [
    { label: 'GitHub', handle: 'ariksquad', href: 'https://github.com/ariksquad', icon: SiGithub },
    { label: 'Bluesky', handle: '@ariksquad.mikart.eu', href: 'https://bsky.app/profile/ariksquad.mikart.eu', icon: SiBluesky },
    { label: 'X', handle: '@ArikSquad', href: 'https://x.com/ArikSquad', icon: SiX },
    { label: 'Discord', handle: 'come say hello', href: '/flow/discord', icon: SiDiscord },
    { label: 'Email', handle: 'ariksquad@mikart.eu', href: 'mailto:ariksquad@mikart.eu', icon: Mail }
] as const

export const ease = [0.22, 1, 0.36, 1] as const

export function helsinkiTime() {
    return new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Helsinki',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }).format(new Date())
}
