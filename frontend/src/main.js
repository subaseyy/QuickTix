// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Toast from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Toast, {
    autoClose: 3500,
    position: 'top-right',
    theme: 'colored',
    transition: 'slide',
})

// Initialize auth state before mounting
const authStore = useAuthStore()
authStore.initialize().then(() => {
    app.mount('#app')
})