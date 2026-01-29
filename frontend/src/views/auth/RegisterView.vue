<template>
    <div
        class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl w-full space-y-8 bg-white p-8 md:p-10 rounded-xl shadow-xl">
            <!-- Header -->
            <div class="text-center">
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900">
                    Create Your QuickTix Account
                </h2>
                <p class="mt-3 text-gray-600">
                    Join thousands booking events across Nepal
                </p>
            </div>

            <!-- Form -->
            <form class="mt-10 space-y-8" @submit.prevent="handleRegister">
                <!-- Personal Information -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Username *</label>
                        <input v-model="form.username" type="text" required
                            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="johndoe" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Email Address *</label>
                        <input v-model="form.email" type="email" required
                            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="you@example.com" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">First Name *</label>
                        <input v-model="form.first_name" type="text" required
                            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="John" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Last Name *</label>
                        <input v-model="form.last_name" type="text" required
                            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Doe" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Date of Birth *</label>
                        <input v-model="form.date_of_birth" type="date" required :max="maxDate"
                            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                        <p class="mt-1 text-xs text-gray-500">You must be at least 13 years old</p>
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Gender</label>
                        <select v-model="form.gender"
                            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
                            <option value="">Prefer not to say</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer_not_to_say">Prefer not to say</option>
                        </select>
                    </div>
                </div>

                <!-- Contact & Notifications -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input v-model="form.phone_number" type="tel"
                            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="+977 98XXXXXXXX" />
                    </div>

                    <div class="flex flex-col justify-center space-y-4 mt-6 md:mt-0">
                        <label class="flex items-center">
                            <input v-model="form.email_notifications" type="checkbox"
                                class="h-5 w-5 text-indigo-600 rounded" />
                            <span class="ml-3 text-sm text-gray-700">Receive email notifications</span>
                        </label>
                        <label class="flex items-center">
                            <input v-model="form.sms_notifications" type="checkbox"
                                class="h-5 w-5 text-indigo-600 rounded" />
                            <span class="ml-3 text-sm text-gray-700">Receive SMS notifications</span>
                        </label>
                    </div>
                </div>

                <!-- Password -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Password *</label>
                        <input v-model="form.password" type="password" required
                            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="••••••••" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Confirm Password *</label>
                        <input v-model="form.confirm_password" type="password" required
                            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="••••••••" />
                    </div>
                </div>

                <!-- Optional Profile -->
                <div class="space-y-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Profile Picture URL (optional)</label>
                        <input v-model="form.profile_picture" type="url"
                            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="https://example.com/myphoto.jpg" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Short Bio (optional)</label>
                        <textarea v-model="form.bio" rows="3"
                            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Tell us a little about yourself..."></textarea>
                    </div>
                </div>

                <!-- Address -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Address Line 1</label>
                        <input v-model="form.address_line1" type="text"
                            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Address Line 2</label>
                        <input v-model="form.address_line2" type="text"
                            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">City</label>
                        <input v-model="form.city" type="text"
                            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">State / Province</label>
                        <input v-model="form.state" type="text"
                            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Country</label>
                        <input v-model="form.country" type="text" placeholder="Nepal"
                            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700">Postal Code</label>
                        <input v-model="form.postal_code" type="text"
                            class="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                </div>

                <!-- Terms Checkbox -->
                <div class="flex items-center">
                    <input v-model="form.acceptTerms" id="terms" type="checkbox" required
                        class="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                    <label for="terms" class="ml-3 text-sm text-gray-700">
                        I agree to the <a href="#" class="text-indigo-600 hover:underline">Terms of Service</a> and <a
                            href="#" class="text-indigo-600 hover:underline">Privacy Policy</a>
                    </label>
                </div>

                <!-- Error Message -->
                <div v-if="error" class="text-red-600 text-center font-medium bg-red-50 p-4 rounded-lg">
                    {{ error }}
                </div>

                <!-- Submit Button -->
                <button type="submit" :disabled="authStore.loading || !form.acceptTerms"
                    class="w-full py-4 px-6 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition">
                    <span v-if="!authStore.loading">Create Account</span>
                    <span v-else class="flex items-center justify-center">
                        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                            fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        Creating account...
                    </span>
                </button>

                <!-- Login Link -->
                <div class="text-center mt-6">
                    <p class="text-sm text-gray-600">
                        Already have an account?
                        <router-link to="/auth/login" class="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign in
                        </router-link>
                    </p>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { toast } from 'vue3-toastify'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    first_name: '',
    last_name: '',
    date_of_birth: '',
    phone_number: '',
    gender: '',
    country: 'Nepal',
    profile_picture: '',
    bio: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    email_notifications: true,
    sms_notifications: false,
    acceptTerms: false,
})

const error = ref('')

// Minimum age 13
const maxDate = computed(() => {
    const date = new Date()
    date.setFullYear(date.getFullYear() - 13)
    return date.toISOString().split('T')[0]
})

const handleRegister = async () => {
    // Basic client-side checks
    if (form.value.password !== form.value.confirm_password) {
        toast.error('Passwords do not match')
        return
    }

    if (!form.value.acceptTerms) {
        toast.error('You must accept the terms and conditions')
        return
    }

    // Prepare payload exactly matching backend User model
    const registrationData = {
        username: form.value.username.trim(),
        email: form.value.email.trim(),
        first_name: form.value.first_name.trim(),
        last_name: form.value.last_name.trim(),
        date_of_birth: form.value.date_of_birth || null,
        gender: form.value.gender || null,
        phone_number: form.value.phone_number.trim() || '',
        profile_picture: form.value.profile_picture.trim() || '',
        bio: form.value.bio.trim() || '',
        address_line1: form.value.address_line1.trim() || '',
        address_line2: form.value.address_line2.trim() || '',
        city: form.value.city.trim() || '',
        state: form.value.state.trim() || '',
        country: form.value.country.trim() || 'Nepal',
        postal_code: form.value.postal_code.trim() || '',
        email_notifications: form.value.email_notifications,
        sms_notifications: form.value.sms_notifications,
        password: form.value.password,
        password2: form.value.confirm_password,
    }

    const success = await authStore.register(registrationData)

    if (success) {
        toast.success('Registration successful! Please log in.')
        router.push('/auth/login')
    } else {
        error.value = 'Registration failed. Please check your details or try again later.'
    }
}
</script>