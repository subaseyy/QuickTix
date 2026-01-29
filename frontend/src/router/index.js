// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/events',
    name: 'events',
    component: () => import('@/views/EventsView.vue'),
  },
  {
    path: '/events/:id',
    name: 'event-detail',
    component: () => import('@/views/EventDetailView.vue'),
    props: true,
  },
  {
    path: '/my-bookings',
    name: 'my-bookings',
    component: () => import('@/views/MyBookingsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { guest: true },
  },
  {
    path: '/auth/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterView.vue'),
    meta: { guest: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Initialize auth store if not already done
  if (authStore.accessToken && !authStore.user) {
    try {
      await authStore.fetchUser()
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirect to login and preserve the intended destination
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    })
  }
  // Check if route is for guests only (login/register)
  else if (to.meta.guest && authStore.isAuthenticated) {
    // Redirect authenticated users away from login/register
    next({ name: 'home' })
  }
  else {
    next()
  }
})

export default router