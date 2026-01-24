import { source } from '@/lib/source'
import { DocsBody, DocsDescription, DocsPage, DocsTitle, PageLastUpdate } from 'fumadocs-ui/page'
import { notFound } from 'next/navigation'
import { getMDXComponents } from '@/mdx-components'
import { LLMCopyButton, ViewOptions } from '@/components/ai/page-actions'
import { Metadata } from 'next'

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
            <DocsTitle>{page.data.title}</DocsTitle>
            <DocsDescription>{page.data.description}</DocsDescription>
            <div className="flex flex-row gap-2 items-center border-b pb-6">
                <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
                <ViewOptions
                    markdownUrl={`${page.url}.mdx`}
                    githubUrl={`https://github.com/MikArt-Europe/website/blob/main/apps/docs/content/docs/${page.path}`}
                />
            </div>
            <DocsBody>
                <Mdx components={getMDXComponents()} />
            </DocsBody>
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
