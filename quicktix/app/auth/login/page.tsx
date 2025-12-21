
import Link from 'next/link'
import { Ticket } from 'lucide-react'
import LoginForm from '@/app/components/auth/login/LoginForm'

export const metadata = {
    title: 'Sign In | QuickTix',
    description: 'Sign in to your QuickTix account to book events, manage tickets, and more.',
}

export default function LoginPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <Link href="/" className="flex items-center justify-center gap-2 mb-8">
                    <div className="bg-gradient-to-br from-primary-600 to-secondary-600 p-2 rounded-lg">
                        <Ticket className="w-8 h-8 text-white" />
                    </div>
                    <span className="text-3xl font-bold gradient-text">QuickTix</span>
                </Link>

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
                    <p className="text-gray-600">
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Login Form */}
                <LoginForm />

                {/* Register Link */}
                <p className="text-center text-gray-600 mt-6">
                    Don't have an account?{' '}
                    <Link href="/auth/register" className="text-primary-600 font-semibold hover:text-primary-700">
                        Sign up
                    </Link>
                </p>
            </div>
        </main>
    )
}