'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function ContactFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const faqs = [
        {
            question: 'What is the fastest way to get support?',
            answer: 'For immediate assistance, use our live chat feature available 24/7 on our website. You can also call us during business hours for real-time support. For non-urgent matters, email us and we\'ll respond within 24 hours.',
        },
        {
            question: 'How do I report a technical issue?',
            answer: 'To report a technical issue, use the contact form above and select "Technical Support" as the category. Please include details about the issue, steps to reproduce it, and any error messages you encountered. Our technical team will investigate and respond within 24 hours.',
        },
        {
            question: 'Can I visit your office in person?',
            answer: 'Yes! We welcome visitors at our offices. However, we recommend scheduling an appointment in advance by calling the office directly or sending an email. Walk-ins are accepted during business hours, but availability may be limited.',
        },
        {
            question: 'How do I become a partner or sponsor?',
            answer: 'For partnership and sponsorship inquiries, please email business@quicktix.com with details about your proposal. Our business development team will review your inquiry and respond within 3-5 business days.',
        },
        {
            question: 'Do you offer phone support in multiple languages?',
            answer: 'Currently, our phone support is available in English. However, our email support team can assist in multiple languages including Spanish, French, German, and Mandarin. Please specify your preferred language in your email.',
        },
        {
            question: 'How can I provide feedback about QuickTix?',
            answer: 'We love hearing from our users! You can provide feedback by using the contact form and selecting "Feedback" as the category. You can also email us directly at hello@quicktix.com. We review all feedback and use it to improve our platform.',
        },
    ]

    return (
        <section className="section bg-white">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Quick <span className="gradient-text">Answers</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Find answers to common questions about contacting us
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="max-w-3xl mx-auto space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-100 transition-colors duration-200"
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

                {/* More Help */}
                <div className="mt-12 text-center animate-fade-in">
                    <p className="text-gray-600 mb-4 text-lg">
                        Need more help?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/help"
                            className="text-primary-600 hover:text-primary-700 font-semibold text-lg"
                        >
                            Visit Help Center →
                        </a>
                        <span className="text-gray-400 hidden sm:inline">or</span>
                        <a
                            href="#"
                            className="text-primary-600 hover:text-primary-700 font-semibold text-lg"
                        >
                            Start Live Chat
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}