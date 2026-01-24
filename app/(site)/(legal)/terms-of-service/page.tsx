import React from 'react'
import { Separator } from '@/components/ui/separator'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Terms of Service'
}

export default function TermsPage() {
    return (
        <div className="mx-auto max-w-7xl px-4 mx-auto p-8 my-4">
            <h1 className="text-4xl font-extrabold mb-6">Terms & Conditions</h1>
            <p className="text-lg leading-relaxed mb-4">Last updated: January 18, 2026</p>
            <p className="text-lg leading-relaxed mb-4">
                Welcome to MikArt Europe. By accessing or using our website and services, you agree to be bound by these
                Terms of Service.
            </p>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Use of Service</h2>
                <Separator className="mb-6" />
                <p className="text-lg leading-relaxed mb-4">
                    You agree to use our website and services only for lawful purposes and in accordance with these
                    Terms. You may not use the services in any way that could damage, disable, overburden, or impair our
                    platform.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
                <Separator className="mb-6" />
                <p className="text-lg leading-relaxed mb-4">
                    All content, graphics, logos, and materials on this website are the property of MikArt Europe or its
                    licensors and are protected by copyright laws. You may not reproduce, distribute, or create
                    derivative works without explicit permission.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
                <Separator className="mb-6" />
                <p className="text-lg leading-relaxed mb-4">
                    MikArt Europe provides its services "as is" and makes no warranties regarding the accuracy,
                    reliability, or availability of the website. We are not liable for any damages arising from your use
                    of our services.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
                <Separator className="mb-6" />
                <p className="text-lg leading-relaxed mb-4">
                    We may update these Terms from time to time. Continued use of our services constitutes acceptance of
                    the updated Terms.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Contact</h2>
                <Separator className="mb-6" />
                <p className="text-lg leading-relaxed mb-4">
                    If you have questions about these Terms, please contact us at{' '}
                    <a href="mailto:admin@mikart.eu" className="text-blue-600 underline">
                        admin@mikart.eu
                    </a>
                    .
                </p>
            </section>
        </div>
    )
}
