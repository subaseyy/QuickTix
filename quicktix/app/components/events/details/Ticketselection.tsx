'use client'

import { useState } from 'react'
import { Plus, Minus, ShoppingCart, Check, AlertCircle } from 'lucide-react'

export default function TicketSelection() {
    const [selectedTickets, setSelectedTickets] = useState<{ [key: string]: number }>({})

    const ticketTypes = [
        {
            id: 'general',
            name: 'General Admission',
            price: 149,
            originalPrice: 199,
            description: 'Standing access to main stage area',
            available: 450,
            benefits: ['Standing area access', 'General facilities', 'Standard entry'],
            popular: false,
        },
        {
            id: 'vip',
            name: 'VIP Pass',
            price: 299,
            description: 'Premium seating with exclusive perks',
            available: 80,
            benefits: ['Reserved seating', 'VIP lounge access', 'Complimentary drinks', 'Meet & greet pass'],
            popular: true,
        },
        {
            id: 'platinum',
            name: 'Platinum Package',
            price: 499,
            description: 'Ultimate festival experience',
            available: 20,
            benefits: [
                'Front row seating',
                'Backstage access',
                'Premium catering',
                'Exclusive merchandise',
                'Private parking',
            ],
            popular: false,
        },
    ]

    const updateTicketCount = (ticketId: string, change: number) => {
        setSelectedTickets((prev) => {
            const currentCount = prev[ticketId] || 0
            const newCount = Math.max(0, Math.min(10, currentCount + change))

            if (newCount === 0) {
                const { [ticketId]: _, ...rest } = prev
                return rest
            }

            return { ...prev, [ticketId]: newCount }
        })
    }

    const getTotalPrice = () => {
        return Object.entries(selectedTickets).reduce((total, [ticketId, count]) => {
            const ticket = ticketTypes.find((t) => t.id === ticketId)
            return total + (ticket?.price || 0) * count
        }, 0)
    }

    const getTotalTickets = () => {
        return Object.values(selectedTickets).reduce((sum, count) => sum + count, 0)
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Select Tickets</h3>
                <p className="text-white/90">Choose your ticket type and quantity</p>
            </div>

            {/* Ticket Types */}
            <div className="p-6 space-y-4">
                {ticketTypes.map((ticket) => (
                    <div
                        key={ticket.id}
                        className={`border-2 rounded-xl p-5 transition-all duration-200 ${selectedTickets[ticket.id]
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-300'
                            }`}
                    >
                        {/* Ticket Header */}
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-gray-900">{ticket.name}</h4>
                                    {ticket.popular && (
                                        <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-1 rounded-full">
                                            Popular
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600">{ticket.description}</p>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="mb-3">
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900">${ticket.price}</span>
                                {ticket.originalPrice && (
                                    <>
                                        <span className="text-lg text-gray-400 line-through">
                                            ${ticket.originalPrice}
                                        </span>
                                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                                            Save ${ticket.originalPrice - ticket.price}
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                {ticket.available} tickets available
                            </p>
                        </div>

                        {/* Benefits */}
                        <div className="mb-4 space-y-2">
                            {ticket.benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <span className="text-sm font-medium text-gray-700">Quantity</span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => updateTicketCount(ticket.id, -1)}
                                    disabled={!selectedTickets[ticket.id]}
                                    className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center text-gray-700 hover:border-primary-600 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-lg font-bold text-gray-900 w-8 text-center">
                                    {selectedTickets[ticket.id] || 0}
                                </span>
                                <button
                                    onClick={() => updateTicketCount(ticket.id, 1)}
                                    disabled={selectedTickets[ticket.id] >= 10 || selectedTickets[ticket.id] >= ticket.available}
                                    className="w-8 h-8 rounded-lg border-2 border-gray-300 flex items-center justify-center text-gray-700 hover:border-primary-600 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    <Plus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary */}
            {getTotalTickets() > 0 && (
                <div className="px-6 pb-6">
                    <div className="bg-gray-50 rounded-xl p-5 space-y-3">
                        <h4 className="font-bold text-gray-900">Order Summary</h4>

                        {/* Selected Tickets */}
                        {Object.entries(selectedTickets).map(([ticketId, count]) => {
                            const ticket = ticketTypes.find((t) => t.id === ticketId)
                            if (!ticket || count === 0) return null

                            return (
                                <div key={ticketId} className="flex justify-between text-sm">
                                    <span className="text-gray-600">
                                        {ticket.name} × {count}
                                    </span>
                                    <span className="font-semibold text-gray-900">
                                        ${ticket.price * count}
                                    </span>
                                </div>
                            )
                        })}

                        {/* Service Fee */}
                        <div className="flex justify-between text-sm pt-3 border-t border-gray-200">
                            <span className="text-gray-600">Service Fee</span>
                            <span className="font-semibold text-gray-900">${(getTotalPrice() * 0.05).toFixed(2)}</span>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between pt-3 border-t border-gray-200">
                            <span className="text-lg font-bold text-gray-900">Total</span>
                            <span className="text-2xl font-bold text-primary-600">
                                ${(getTotalPrice() * 1.05).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Checkout Button */}
                    <button className="w-full mt-4 btn btn-primary btn-lg flex items-center justify-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Proceed to Checkout ({getTotalTickets()} {getTotalTickets() === 1 ? 'ticket' : 'tickets'})
                    </button>

                    {/* Info Message */}
                    <div className="mt-4 flex items-start gap-2 text-sm text-gray-600">
                        <AlertCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                        <p>
                            Tickets are non-refundable. You can transfer tickets to another person up to 24 hours before the event.
                        </p>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {getTotalTickets() === 0 && (
                <div className="px-6 pb-6 text-center">
                    <p className="text-gray-500 mb-4">Select tickets to continue</p>
                    <button disabled className="w-full btn btn-secondary btn-lg opacity-50 cursor-not-allowed">
                        Select Tickets First
                    </button>
                </div>
            )}
        </div>
    )
}