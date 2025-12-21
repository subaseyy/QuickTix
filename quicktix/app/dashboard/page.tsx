


import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import UserDashboard from '../components/dashboard/UserDashboard'

export const metadata = {
    title: 'My Dashboard | QuickTix',
    description: 'View your bookings, upcoming events, and account activity',
}

export default function DashboardPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Page Header */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-12">
                <div className="container-custom">
                    <h1 className="text-4xl font-bold text-white mb-2">My Dashboard</h1>
                    <p className="text-white/90">Welcome back! Here's your activity overview</p>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="container-custom py-12">
                <UserDashboard />
            </div>

            <Footer />
        </main>
    )
}