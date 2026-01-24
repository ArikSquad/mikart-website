import React from 'react'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'EnSave | Terms of Service'
}

export default function TermsPage() {
    return (
        <div className="mx-auto max-w-7xl px-4 mx-auto p-8 my-4">
            <h1 className="text-4xl font-extrabold mb-6">Terms & Conditions</h1>
            <p className="text-lg leading-relaxed mb-4">Last updated: July 18, 2024</p>
            <p className="text-lg leading-relaxed mb-4">
                These Terms of Service (&#34;Terms&#34;) govern your use of the EnSave Discord bot (&#34;Bot&#34;),
                provided by EnSave (&#34;Company&#34;, &#34;we&#34;, &#34;us&#34;, or &#34;our&#34;). By accessing or
                using the Bot, you agree to be bound by these Terms. If you disagree with any part of the terms, then
                you do not have permission to access the Bot.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">Use License</h2>
            <Separator className="mb-6" />
            <p className="text-lg leading-relaxed mb-4">
                1. Permission is granted to temporarily download one copy of the Bot for personal, non-commercial
                transitory viewing only. This is the grant of a license, not a transfer of title, and under this
                license, you may not:
            </p>
            <ul className="list-disc list-inside mb-4">
                <li>Modify or copy the materials;</li>
                <li>
                    Use the materials for any commercial purpose, or for any public display (commercial or
                    non-commercial);
                </li>
                <li>Attempt to decompile or reverse engineer any software contained in the Bot;</li>
                <li>Remove any copyright or other proprietary notations from the materials; or</li>
                <li>Transfer the materials to another person or &#34;mirror&#34; the materials on any other server.</li>
            </ul>
            <p className="text-lg leading-relaxed mb-4">
                2. This license shall automatically terminate if you violate any of these restrictions and may be
                terminated by the Company at any time. Upon terminating your viewing of these materials or upon the
                termination of this license, you must destroy any downloaded materials in your possession whether in
                electronic or printed format.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">Modifications to Terms</h2>
            <Separator className="mb-6" />
            <p className="text-lg leading-relaxed mb-4">
                The Company reserves the right, at our sole discretion, to modify or replace these Terms at any time. If
                a revision is material, we will provide at least 30 days&#39; notice prior to any new terms taking
                effect. What constitutes a material change will be determined at our sole discretion.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">Contact Us</h2>
            <Separator className="mb-6" />
            <p className="text-lg leading-relaxed mb-4">
                If you have any questions about these Terms, you can contact us:
            </p>
            <ul className="list-disc list-inside mb-4">
                <li>
                    By email:{' '}
                    <Link className="underline underline-offset-4" href="mailto:business.ariksquad@gmail.com">
                        business.ariksquad@gmail.com
                    </Link>
                </li>
            </ul>
        </div>
    )
}
