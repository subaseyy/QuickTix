
import AdminDashboard from '../components/dashboard/AdminDashboard'
import Footer from '../components/layout/Footer'

import Navbar from '../components/layout/Navbar'

export const metadata = {
    title: 'Admin Dashboard | QuickTix',
    description: 'System administration and platform management',
}

export default function AdminDashboardPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Page Header */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-12">
                <div className="container-custom">
                    <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-white/90">Platform management and system overview</p>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="container-custom py-12">
                <AdminDashboard />
            </div>

            <Footer />
        </main>
    )
}