'use client'

import { useState } from 'react'
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { RegisterData, useAuth } from '@/app/lib/hooks'


interface PasswordStrength {
    score: number
    label: string
    color: string
}

export default function RegisterForm() {
    const { register, isLoading } = useAuth()

    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [acceptTerms, setAcceptTerms] = useState(false)
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [apiError, setApiError] = useState('')

    // Password strength calculation
    const getPasswordStrength = (password: string): PasswordStrength => {
        if (!password) return { score: 0, label: '', color: '' }

        let score = 0

        // Length check
        if (password.length >= 8) score++
        if (password.length >= 12) score++

        // Character checks
        if (/[a-z]/.test(password)) score++
        if (/[A-Z]/.test(password)) score++
        if (/[0-9]/.test(password)) score++
        if (/[^A-Za-z0-9]/.test(password)) score++

        if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' }
        if (score <= 4) return { score, label: 'Medium', color: 'bg-yellow-500' }
        return { score, label: 'Strong', color: 'bg-green-500' }
    }

    const passwordStrength = getPasswordStrength(formData.password)

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = 'Username is required'
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters'
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = 'Username can only contain letters, numbers, and underscores'
        }

        // Name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required'
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required'
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address'
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters'
        } else if (!/(?=.*[a-z])/.test(formData.password)) {
            newErrors.password = 'Password must contain a lowercase letter'
        } else if (!/(?=.*[A-Z])/.test(formData.password)) {
            newErrors.password = 'Password must contain an uppercase letter'
        } else if (!/(?=.*[0-9])/.test(formData.password)) {
            newErrors.password = 'Password must contain a number'
        } else if (!/(?=.*[^A-Za-z0-9])/.test(formData.password)) {
            newErrors.password = 'Password must contain a special character'
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        // Terms validation
        if (!acceptTerms) {
            newErrors.terms = 'You must accept the terms and conditions'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }))
        }
        setApiError('')
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        setApiError('')

        try {
            const registerData: RegisterData = {
                username: formData.username.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
                password2: formData.confirmPassword,
                first_name: formData.firstName.trim(),
                last_name: formData.lastName.trim(),
            }

            await register(registerData)
            // AuthContext handles navigation after successful registration

        } catch (error: any) {
            // Handle API validation errors
            if (error.errors) {
                const apiErrors: { [key: string]: string } = {}
                Object.keys(error.errors).forEach((key) => {
                    // Map API field names to form field names
                    const fieldMap: { [key: string]: string } = {
                        'username': 'username',
                        'email': 'email',
                        'password': 'password',
                        'password2': 'confirmPassword',
                        'first_name': 'firstName',
                        'last_name': 'lastName',
                    }
                    const formField = fieldMap[key] || key
                    apiErrors[formField] = Array.isArray(error.errors[key])
                        ? error.errors[key][0]
                        : error.errors[key]
                })
                setErrors(apiErrors)
            } else {
                setApiError(error.message || 'Registration failed. Please try again.')
            }
        }
    }

    const handleSocialSignup = (provider: string) => {
        console.log(`Sign up with ${provider}`)
        // TODO: Implement social signup
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* API Error */}
            {apiError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{apiError}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username Field */}
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                        Username
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className={`input pl-10 ${errors.username ? 'input-error' : ''}`}
                            placeholder="johndoe"
                            autoComplete="username"
                        />
                    </div>
                    {errors.username && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.username}
                        </p>
                    )}
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                            First Name
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className={`input pl-10 ${errors.firstName ? 'input-error' : ''}`}
                                placeholder="John"
                            />
                        </div>
                        {errors.firstName && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.firstName}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`input ${errors.lastName ? 'input-error' : ''}`}
                            placeholder="Doe"
                        />
                        {errors.lastName && (
                            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {errors.lastName}
                            </p>
                        )}
                    </div>
                </div>

                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
                            placeholder="you@example.com"
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {formData.password && (
                        <div className="mt-2">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-600">Password strength:</span>
                                <span className={`text-xs font-medium ${passwordStrength.label === 'Weak' ? 'text-red-600' :
                                    passwordStrength.label === 'Medium' ? 'text-yellow-600' :
                                        'text-green-600'
                                    }`}>
                                    {passwordStrength.label}
                                </span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                                    style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.password}
                        </p>
                    )}

                    {/* Password Requirements */}
                    {formData.password && !errors.password && (
                        <div className="mt-2 space-y-1">
                            <PasswordRequirement
                                met={formData.password.length >= 8}
                                text="At least 8 characters"
                            />
                            <PasswordRequirement
                                met={/[a-z]/.test(formData.password)}
                                text="One lowercase letter"
                            />
                            <PasswordRequirement
                                met={/[A-Z]/.test(formData.password)}
                                text="One uppercase letter"
                            />
                            <PasswordRequirement
                                met={/[0-9]/.test(formData.password)}
                                text="One number"
                            />
                            <PasswordRequirement
                                met={/[^A-Za-z0-9]/.test(formData.password)}
                                text="One special character"
                            />
                        </div>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`input pl-10 pr-10 ${errors.confirmPassword ? 'input-error' : ''}`}
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>
                    {errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.confirmPassword}
                        </p>
                    )}
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                        <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" />
                            Passwords match
                        </p>
                    )}
                </div>

                {/* Terms Checkbox */}
                <div>
                    <div className="flex items-start">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            checked={acceptTerms}
                            onChange={(e) => {
                                setAcceptTerms(e.target.checked)
                                if (errors.terms) {
                                    setErrors((prev) => ({ ...prev, terms: '' }))
                                }
                            }}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1"
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                            I agree to the{' '}
                            <a href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                                Terms of Service
                            </a>{' '}
                            and{' '}
                            <a href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                                Privacy Policy
                            </a>
                        </label>
                    </div>
                    {errors.terms && (
                        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.terms}
                        </p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary btn-lg w-full flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        'Create Account'
                    )}
                </button>
            </form>

            {/* Divider */}
            {/* <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                    </div>
                </div>
            </div> */}

            {/* Social Signup Buttons */}
            {/* <div className="mt-6 grid grid-cols-3 gap-3">
                <button
                    type="button"
                    onClick={() => handleSocialSignup('Google')}
                    className="btn btn-outline btn-md flex items-center justify-center gap-2 text-sm"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                </button>

                <button
                    type="button"
                    onClick={() => handleSocialSignup('Facebook')}
                    className="btn btn-outline btn-md flex items-center justify-center gap-2 text-sm"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                </button>

                <button
                    type="button"
                    onClick={() => handleSocialSignup('Apple')}
                    className="btn btn-outline btn-md flex items-center justify-center gap-2 text-sm"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                </button>
            </div> */}
        </div>
    )
}

// Password Requirement Component
function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
    return (
        <div className="flex items-center gap-2 text-xs">
            {met ? (
                <CheckCircle className="w-3 h-3 text-green-600" />
            ) : (
                <div className="w-3 h-3 border-2 border-gray-300 rounded-full" />
            )}
            <span className={met ? 'text-green-600' : 'text-gray-500'}>{text}</span>
        </div>
    )
}