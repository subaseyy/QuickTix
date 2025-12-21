import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'QuickTix - Book Your Event Tickets Instantly',
  description: 'Discover and book tickets for the best events, concerts, conferences, and more. QuickTix makes event booking simple and secure.',
  keywords: 'events, tickets, booking, concerts, conferences, festivals, QuickTix',
  authors: [{ name: 'QuickTix Team' }],
  openGraph: {
    title: 'QuickTix - Book Your Event Tickets Instantly',
    description: 'Discover and book tickets for the best events worldwide',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}