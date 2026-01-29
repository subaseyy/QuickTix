<template>
    <div
        class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
            <!-- Header -->
            <div>
                <h2 class="text-center text-3xl font-bold text-gray-900">
                    Welcome Back
                </h2>
                <p class="mt-2 text-center text-sm text-gray-600">
                    Sign in to your QuickTix account
                </p>
            </div>

            <!-- Login Form -->
            <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
                <!-- Email Input -->
                <div>
                    <label for="email" class="block text-sm font-medium text-gray-700">
                        Email Address *
                    </label>
                    <input id="email" v-model="form.email" type="email" autocomplete="email" required
                        class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="you@example.com" />
                </div>

                <!-- Password Input -->
                <div>
                    <label for="password" class="block text-sm font-medium text-gray-700">
                        Password *
                    </label>
                    <input id="password" v-model="form.password" type="password" autocomplete="current-password"
                        required
                        class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="••••••••" />
                </div>

                <!-- Remember Me & Forgot Password -->
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input id="remember-me" v-model="form.rememberMe" type="checkbox"
                            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                        <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                            Remember me
                        </label>
                    </div>

                    <div class="text-sm">
                        <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
                            Forgot password?
                        </a>
                    </div>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="text-red-600 text-center font-medium bg-red-50 p-3 rounded-lg">
                    {{ error }}
                </div>

                <!-- Submit Button -->
                <button type="submit" :disabled="authStore.loading"
                    class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150">
                    <span v-if="!authStore.loading">Sign In</span>
                    <span v-else class="flex items-center">
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        Signing in...
                    </span>
                </button>

                <!-- Register Link -->
                <div class="text-center mt-6">
                    <p class="text-sm text-gray-600">
                        Don't have an account?
                        <router-link to="/auth/register" class="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign up
                        </router-link>
                    </p>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
    email: '',
    password: '',
    rememberMe: true, // default to true (common UX)
})

const error = ref('')

const handleLogin = async () => {
    error.value = ''

    const credentials = {
        email: form.value.email.trim(),
        password: form.value.password,
    }

    const success = await authStore.login(credentials)

    if (success) {
        // Redirect to intended page or home
        const redirect = route.query.redirect || '/'
        router.push(redirect)
        toast.success('Welcome back!')
    } else {
        // Show specific error from backend if available
        error.value = authStore.loginError || 'Invalid email or password. Please try again.'
    }
}
</script>