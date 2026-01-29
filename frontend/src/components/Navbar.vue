<template>
    <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="container mx-auto px-4">
            <div class="flex justify-between items-center h-16">
                <!-- Logo -->
                <router-link to="/"
                    class="flex items-center space-x-2 text-2xl font-bold text-indigo-600 hover:text-indigo-700 transition">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <span>QuickTix</span>
                </router-link>

                <!-- Desktop Navigation Links -->
                <div class="hidden md:flex items-center space-x-6">
                    <router-link v-for="link in visibleNavLinks" :key="link.path" :to="link.path" :class="[
                        'text-gray-700 hover:text-indigo-600 font-medium transition',
                        isActiveRoute(link.path) ? 'text-indigo-600 border-b-2 border-indigo-600' : ''
                    ]">
                        {{ link.name }}
                    </router-link>
                </div>

                <!-- Desktop Auth Section -->
                <div class="hidden md:flex items-center space-x-4">
                    <!-- Authenticated User -->
                    <template v-if="authStore.isAuthenticated">
                        <!-- User Greeting -->
                        <div class="flex items-center space-x-3">
                            <div class="text-right">
                                <p class="text-sm font-semibold text-gray-800">
                                    {{ authStore.fullName || authStore.user?.username }}
                                </p>
                                <p class="text-xs text-gray-500 capitalize">
                                    {{ authStore.userRole }}
                                </p>
                            </div>

                            <!-- User Avatar -->
                            <div
                                class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                {{ getUserInitials }}
                            </div>
                        </div>

                        <!-- Logout Button -->
                        <button @click="handleLogout"
                            class="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Logout</span>
                        </button>
                    </template>

                    <!-- Guest User -->
                    <template v-else>
                        <router-link to="/auth/login"
                            class="text-gray-700 hover:text-indigo-600 font-medium transition">
                            Login
                        </router-link>
                        <router-link to="/auth/register"
                            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-sm">
                            Sign Up
                        </router-link>
                    </template>
                </div>

                <!-- Mobile Menu Button -->
                <button
                    class="md:hidden text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded p-1"
                    @click="toggleMobileMenu" aria-label="Toggle menu">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            :d="mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'" />
                    </svg>
                </button>
            </div>

            <!-- Mobile Menu -->
            <transition enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-1">
                <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-gray-200">
                    <!-- User Info (Mobile) -->
                    <div v-if="authStore.isAuthenticated" class="px-4 py-3 bg-gray-50 rounded-lg mb-4">
                        <div class="flex items-center space-x-3">
                            <div
                                class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                                {{ getUserInitials }}
                            </div>
                            <div>
                                <p class="font-semibold text-gray-800">
                                    {{ authStore.fullName || authStore.user?.username }}
                                </p>
                                <p class="text-sm text-gray-500 capitalize">
                                    {{ authStore.userRole }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <!-- Navigation Links (Mobile) -->
                    <div class="flex flex-col space-y-1">
                        <router-link v-for="link in visibleNavLinks" :key="link.path" :to="link.path"
                            @click="closeMobileMenu" :class="[
                                'px-4 py-3 rounded-lg font-medium transition',
                                isActiveRoute(link.path)
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-gray-700 hover:bg-gray-50'
                            ]">
                            {{ link.name }}
                        </router-link>
                    </div>

                    <!-- Auth Buttons (Mobile) -->
                    <div class="mt-4 pt-4 border-t border-gray-200">
                        <template v-if="authStore.isAuthenticated">
                            <button @click="handleLogout"
                                class="w-full flex items-center justify-center space-x-2 px-4 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 transition font-medium">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Logout</span>
                            </button>
                        </template>
                        <template v-else>
                            <div class="flex flex-col space-y-2">
                                <router-link to="/auth/login" @click="closeMobileMenu"
                                    class="text-center px-4 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium">
                                    Login
                                </router-link>
                                <router-link to="/auth/register" @click="closeMobileMenu"
                                    class="text-center px-4 py-3 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition font-medium shadow-sm">
                                    Sign Up
                                </router-link>
                            </div>
                        </template>
                    </div>
                </div>
            </transition>
        </div>
    </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const mobileMenuOpen = ref(false)

// Navigation links configuration
const navLinks = [
    {
        name: 'Home',
        path: '/',
        requiresAuth: false
    },
    {
        name: 'Events',
        path: '/events',
        requiresAuth: false
    },
    {
        name: 'My Bookings',
        path: '/my-bookings',
        requiresAuth: true,
        icon: 'ticket'
    },
]

// Computed: Filter navigation links based on authentication
const visibleNavLinks = computed(() => {
    return navLinks.filter(link => {
        if (link.requiresAuth) {
            return authStore.isAuthenticated
        }
        return true
    })
})

// Computed: Get user initials for avatar
const getUserInitials = computed(() => {
    if (!authStore.user) return '?'

    const firstName = authStore.user.first_name || ''
    const lastName = authStore.user.last_name || ''

    if (firstName && lastName) {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    } else if (firstName) {
        return firstName.charAt(0).toUpperCase()
    } else if (authStore.user.username) {
        return authStore.user.username.charAt(0).toUpperCase()
    }

    return '?'
})

// Check if route is active
const isActiveRoute = (path) => {
    if (path === '/') {
        return route.path === '/'
    }
    return route.path.startsWith(path)
}

// Toggle mobile menu
const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
}

// Close mobile menu
const closeMobileMenu = () => {
    mobileMenuOpen.value = false
}

// Handle logout
const handleLogout = () => {
    authStore.logout()
    closeMobileMenu()
    router.push('/')
}
</script>

<style scoped>
/* Smooth transitions */
.router-link-active {
    /* This class is automatically added by Vue Router */
}

/* Ensure mobile menu doesn't cause layout shift */
nav {
    min-height: 64px;
    /* Same as h-16 */
}

/* Add hover effect to mobile menu items */
@media (max-width: 768px) {
    .router-link-active {
        background-color: rgb(238 242 255);
        /* indigo-50 */
        color: rgb(79 70 229);
        /* indigo-600 */
    }
}
</style>