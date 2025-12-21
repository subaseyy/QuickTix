'use client'

import { Check } from 'lucide-react'

export default function OrganizerPricing() {
    const plans = [
        {
            name: 'Free',
            price: '0',
            description: 'Perfect for small events and getting started',
            features: [
                'Up to 100 tickets per event',
                'Basic analytics',
                'Email support',
                'Standard listing',
                '5% + $1 per ticket fee',
            ],
            popular: false,
            cta: 'Start Free',
        },
        {
            name: 'Professional',
            price: '49',
            description: 'Best for growing organizers and regular events',
            features: [
                'Up to 1,000 tickets per event',
                'Advanced analytics',
                'Priority support',
                'Featured listing',
                'Custom branding',
                '3% + $0.50 per ticket fee',
                'Early payout',
            ],
            popular: true,
            cta: 'Start Trial',
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            description: 'For large-scale events and organizations',
            features: [
                'Unlimited tickets',
                'Custom analytics',
                'Dedicated account manager',
                'Premium listing',
                'White-label solution',
                'Custom fee structure',
                'API access',
                'Custom integrations',
            ],
            popular: false,
            cta: 'Contact Sales',
        },
    ]

    return (
        <section className="section bg-white">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Simple, Transparent <span className="gradient-text">Pricing</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Choose the plan that fits your needs. No hidden fees, cancel anytime.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative bg-white rounded-2xl p-8 transition-all duration-300 animate-fade-in ${plan.popular
                                    ? 'border-2 border-primary-600 shadow-2xl scale-105'
                                    : 'border-2 border-gray-200 shadow-lg hover:shadow-xl'
                                }`}
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                                        Most Popular
                                    </span>
                                </div>
                            )}

                            {/* Plan Name */}
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {plan.name}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-600 mb-6">
                                {plan.description}
                            </p>

                            {/* Price */}
                            <div className="mb-6">
                                {plan.price === 'Custom' ? (
                                    <div className="text-4xl font-bold text-gray-900">Custom</div>
                                ) : (
                                    <>
                                        <div className="flex items-baseline">
                                            <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                                            <span className="text-gray-600 ml-2">/month</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Features */}
                            <ul className="space-y-4 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Check className="w-3 h-3 text-green-600" />
                                        </div>
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            <button
                                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${plan.popular
                                        ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:shadow-lg'
                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                                    }`}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Additional Info */}
                <div className="mt-12 text-center animate-fade-in">
                    <p className="text-gray-600 mb-4">
                        All plans include secure payment processing and fraud protection
                    </p>
                    <a href="#faq" className="text-primary-600 hover:text-primary-700 font-semibold">
                        Have questions? Check our FAQ →
                    </a>
                </div>
            </div>
        </section>
    )
}