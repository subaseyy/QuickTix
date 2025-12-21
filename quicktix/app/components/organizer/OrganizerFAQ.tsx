'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function OrganizerFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const faqs = [
        {
            question: 'How much does it cost to become an organizer?',
            answer: 'It\'s completely free to sign up as an organizer. We only charge a small service fee per ticket sold. You can choose between our Free plan (5% + $1 per ticket), Professional plan ($49/month + 3% + $0.50 per ticket), or custom Enterprise pricing.',
        },
        {
            question: 'How long does the approval process take?',
            answer: 'Most applications are reviewed and approved within 24-48 hours. In many cases, approval is instant. Once approved, you can immediately start creating and publishing events.',
        },
        {
            question: 'When do I get paid?',
            answer: 'Professional and Enterprise plan users receive payouts every 24 hours. Free plan users receive payouts weekly. All payments are processed securely and deposited directly to your bank account.',
        },
        {
            question: 'Can I sell tickets for free events?',
            answer: 'Yes! You can create free events and collect RSVPs. You\'ll still have access to all our management tools, attendee tracking, and analytics features.',
        },
        {
            question: 'What payment methods can attendees use?',
            answer: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, PayPal, Apple Pay, and Google Pay. All transactions are secure and PCI compliant.',
        },
        {
            question: 'Can I customize my event pages?',
            answer: 'Yes! Professional and Enterprise plans include custom branding options. You can add your logo, brand colors, and customize the event page design to match your brand identity.',
        },
        {
            question: 'Do you charge refund fees?',
            answer: 'No, we don\'t charge fees for refunds. However, payment processing fees are non-refundable. You have full control over your refund policy for each event.',
        },
        {
            question: 'Is there a limit to how many events I can create?',
            answer: 'No, there\'s no limit! You can create and manage unlimited events on all plans. Each event can be customized with different ticket tiers, pricing, and capacity.',
        },
        {
            question: 'What support do you provide?',
            answer: 'All plans include email support. Professional plans get priority support, and Enterprise customers receive a dedicated account manager. Our support team is available 24/7 to help with any issues.',
        },
        {
            question: 'Can I cancel my subscription anytime?',
            answer: 'Yes, you can cancel your subscription at any time with no penalties. Your events will remain active, and you\'ll only revert to the Free plan pricing structure.',
        },
    ]

    return (
        <section id="faq" className="section bg-gradient-to-br from-gray-50 to-white">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Frequently Asked <span className="gradient-text">Questions</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Everything you need to know about becoming an organizer
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in"
                            style={{ animationDelay: `${index * 30}ms` }}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200"
                            >
                                <span className="text-lg font-bold text-gray-900 pr-4">
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`w-6 h-6 text-primary-600 flex-shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            <div
                                className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96' : 'max-h-0'
                                    }`}
                            >
                                <div className="px-6 pb-6 text-gray-600 leading-relaxed">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Still Have Questions */}
                <div className="mt-12 text-center animate-fade-in">
                    <p className="text-gray-600 mb-4 text-lg">
                        Still have questions?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/contact"
                            className="text-primary-600 hover:text-primary-700 font-semibold text-lg"
                        >
                            Contact our team →
                        </a>
                        <span className="text-gray-400 hidden sm:inline">or</span>
                        <a
                            href="mailto:organizers@quicktix.com"
                            className="text-primary-600 hover:text-primary-700 font-semibold text-lg"
                        >
                            Email organizers@quicktix.com
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}