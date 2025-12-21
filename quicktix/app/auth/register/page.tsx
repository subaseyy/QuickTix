
import Link from 'next/link'
import { Ticket } from 'lucide-react'
import RegisterForm from '@/app/components/auth/signup/RegisterForm'

export const metadata = {
    title: 'Create Account | QuickTix',
    description: 'Join QuickTix to discover and book amazing events. Sign up now and get instant access to thousands of events.',
}

export default function RegisterPage() {
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
                    <p className="text-gray-600">
                        Start booking amazing events today
                    </p>
                </div>

                {/* Register Form */}
                <RegisterForm />

                {/* Login Link */}
                <p className="text-center text-gray-600 mt-6">
                    Already have an account?{' '}
                    <Link href="/auth/login" className="text-primary-600 font-semibold hover:text-primary-700">
                        Sign in
                    </Link>
                </p>

                {/* Terms */}
                <p className="text-center text-xs text-gray-500 mt-8">
                    By signing up, you agree to our{' '}
                    <Link href="/terms" className="text-primary-600 hover:underline">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-primary-600 hover:underline">
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </main>
    )
} 