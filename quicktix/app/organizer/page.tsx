import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import OrganizerDashboard from '../components/dashboard/OrganizerDashboard'


export const metadata = {
    title: 'Organizer Dashboard | QuickTix',
    description: 'Manage your events, view analytics, and track ticket sales',
}

export default function OrganizerDashboardPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Page Header */}
            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-12">
                <div className="container-custom">
                    <br />
                    <br />
                    <h1 className="text-4xl font-bold text-white mb-2">Organizer Dashboard</h1>
                    <p className="text-white/90">Manage your events and track performance</p>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="container-custom py-12">
                <OrganizerDashboard />
            </div>

            <Footer />
        </main>
    )
}