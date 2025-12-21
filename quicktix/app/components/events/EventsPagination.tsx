'use client'

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useState } from 'react'

export default function EventsPagination() {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = 15
    const itemsPerPage = 9

    const generatePageNumbers = () => {
        const pages = []
        const showEllipsisStart = currentPage > 3
        const showEllipsisEnd = currentPage < totalPages - 2

        // Always show first page
        pages.push(1)

        // Show ellipsis or pages after first
        if (showEllipsisStart) {
            pages.push('...')
        }

        // Show current page and surrounding pages
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i)
        }

        // Show ellipsis or pages before last
        if (showEllipsisEnd) {
            pages.push('...')
        }

        // Always show last page
        if (totalPages > 1) {
            pages.push(totalPages)
        }

        return pages
    }

    const goToPage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    return (
        <div className="mt-12">
            {/* Results Info */}
            <div className="text-center text-gray-600 mb-6">
                Showing <span className="font-semibold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                <span className="font-semibold text-gray-900">{Math.min(currentPage * itemsPerPage, 135)}</span> of{' '}
                <span className="font-semibold text-gray-900">135</span> events
            </div>

            {/* Pagination Controls */}
            <div className="flex flex-wrap items-center justify-center gap-2">
                {/* First Page */}
                <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    aria-label="First page"
                >
                    <ChevronsLeft className="w-5 h-5 text-gray-600" />
                </button>

                {/* Previous Page */}
                <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    aria-label="Previous page"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                {/* Page Numbers */}
                {generatePageNumbers().map((page, index) => (
                    <button
                        key={index}
                        onClick={() => typeof page === 'number' && goToPage(page)}
                        disabled={page === '...'}
                        className={`min-w-[40px] h-10 px-3 rounded-lg font-medium transition-all duration-200 ${page === currentPage
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/50'
                                : page === '...'
                                    ? 'cursor-default'
                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                {/* Next Page */}
                <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    aria-label="Next page"
                >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>

                {/* Last Page */}
                <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    aria-label="Last page"
                >
                    <ChevronsRight className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* Quick Jump (Optional) */}
            <div className="mt-6 flex items-center justify-center gap-3">
                <span className="text-sm text-gray-600">Jump to page:</span>
                <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                        const page = parseInt(e.target.value)
                        if (page >= 1 && page <= totalPages) {
                            goToPage(page)
                        }
                    }}
                    className="w-16 px-3 py-1.5 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <span className="text-sm text-gray-600">of {totalPages}</span>
            </div>
        </div>
    )
}