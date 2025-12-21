'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const faqs = [
        {
            question: 'How do I purchase tickets?',
            answer: 'Simply browse events, select your tickets, and complete the secure checkout process. You\'ll receive your tickets instantly via email with a QR code for easy entry.',
        },
        {
            question: 'Are the tickets refundable?',
            answer: 'Refund policies vary by event. Most events allow cancellations up to 24-48 hours before the event. Check the specific event\'s refund policy during checkout.',
        },
        {
            question: 'How do I receive my tickets?',
            answer: 'Tickets are delivered instantly to your email after purchase. You can also access them in your QuickTix account dashboard and add them to your mobile wallet.',
        },
        {
            question: 'Can I transfer tickets to someone else?',
            answer: 'Yes! You can transfer tickets to friends or family through your account dashboard. The recipient will receive the tickets via email.',
        },
        {
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, PayPal, Apple Pay, and Google Pay.',
        },
        {
            question: 'Is my payment information secure?',
            answer: 'Absolutely. We use bank-level SSL encryption and are PCI DSS compliant. Your payment information is never stored on our servers.',
        },
        {
            question: 'How do I become an event organizer?',
            answer: 'Click on "Become an Organizer" in the navigation menu, fill out the application form, and our team will review your submission within 24-48 hours.',
        },
        {
            question: 'What fees do organizers pay?',
            answer: 'We charge a small service fee per ticket sold (typically 5-10%). There are no upfront costs or monthly fees. You only pay when you sell tickets.',
        },
    ]

    return (
        <section className="section bg-gradient-to-br from-gray-50 to-white">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Frequently Asked <span className="gradient-text">Questions</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Got questions? We've got answers!
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in"
                            style={{ animationDelay: `${index * 50}ms` }}
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

                {/* Contact Support */}
                <div className="mt-12 text-center animate-fade-in">
                    <p className="text-gray-600 mb-4">
                        Still have questions?
                    </p>
                    <a
                        href="/contact"
                        className="text-primary-600 hover:text-primary-700 font-semibold text-lg"
                    >
                        Contact our support team →
                    </a>
                </div>
            </div>
        </section>
    )
}