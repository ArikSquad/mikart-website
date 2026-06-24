import { source } from '@/lib/source'
import { DocsBody, DocsDescription, DocsPage, DocsTitle, PageLastUpdate } from 'fumadocs-ui/page'
import { notFound } from 'next/navigation'
import { getMDXComponents } from '@/components/mdx'
import { Metadata } from 'next'
import { MarkdownCopyButton, ViewOptionsPopover } from 'fumadocs-ui/layouts/docs/page'

export default async function Page(props: PageProps<'/docs/[...slug]'>) {
    const params = await props.params
    const page = source.getPage(params.slug)
    if (!page) notFound()

    const { body: Mdx, toc, lastModified } = await page.data.load()

    return (
        <DocsPage
            toc={toc}
            lastUpdate={lastModified ? new Date(lastModified) : undefined}
            full={page.data.full}
            tableOfContent={{
                style: 'clerk'
            }}
        >
            <h1 className="text-[1.75em] font-semibold">{page.data.title}</h1>
            <p className="text-muted-foreground">
                {page.data.description}
            </p>
            <div className="flex flex-row gap-2 items-center border-b pb-6">
                <MarkdownCopyButton markdownUrl={`${page.url}.mdx`} />
                <ViewOptionsPopover
                    markdownUrl={`${page.url}.mdx`}
                    githubUrl={`https://github.com/MikArt-Europe/website/blob/main/apps/docs/content/docs/${page.path}`}
                />
            </div>
            <DocsBody>
                <Mdx components={getMDXComponents()} />
            </DocsBody>
            {lastModified && <PageLastUpdate date={lastModified} />}
        </DocsPage>
    )
}

export async function generateStaticParams() {
    return source.generateParams()
}

export async function generateMetadata(props: PageProps<'/docs/[...slug]'>): Promise<Metadata> {
    const params = await props.params
    const page = source.getPage(params.slug)
    if (!page) notFound()

    return {
        title: page.data.title,
        description: page.data.description
    }
}
