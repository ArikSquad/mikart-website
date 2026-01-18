import React from 'react'
import { Separator } from '@/components/ui/separator'

export const metadata = {
    title: 'Privacy Policy'
}

export default function PrivacyPage() {
    return (
        <div className="mx-auto max-w-7xl px-4 mx-auto p-8 my-4">
            <h1 className="text-4xl font-extrabold mb-6">Privacy Policy</h1>
            <p className="text-lg leading-relaxed mb-4">Last updated: July 18, 2024</p>
            <p className="text-lg leading-relaxed mb-4">
                This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your
                information when You use the Service and tells You about Your privacy rights and how the law protects
                You.
            </p>
            <p className="text-lg leading-relaxed mb-4">
                We use Your Personal data to provide and improve the Service. By using the Service, You agree to the
                collection and use of information in accordance with this Privacy Policy. This Privacy Policy has been
                created with the help of the{' '}
                <a href="https://www.termsfeed.com/privacy-policy-generator/">Privacy Policy Generator</a>.
            </p>

            <h2 className="text-2xl font-semibold mb-4 mt-8">Interpretation and Definitions</h2>
            <Separator className="mb-6" />
            <h3 className="text-xl font-semibold mb-2">Interpretation</h3>
            <p className="text-lg leading-relaxed mb-4">
                The words of which the initial letter is capitalized have meanings defined under the following
                conditions. The following definitions shall have the same meaning regardless of whether they appear in
                singular or in plural.
            </p>
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">General</h2>
                <p className="text-lg leading-relaxed">placeholder</p>
            </section>
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
                <p className="text-lg leading-relaxed">placeholder</p>
            </section>
        </div>
    )
}
