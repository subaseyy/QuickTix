import Footer from "@/app/components/layout/Footer"
import Navbar from "@/app/components/layout/Navbar"
import ProfileContent from "@/app/components/profile/ProfileContent"


export const metadata = {
    title: 'My Profile | QuickTix',
    description: 'Manage your account settings and personal information',
}

export default function ProfilePage() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Page Header */}


            <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-16">
                <div className="container-custom">
                    <br />
                    <br />

                    <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
                    <p className="text-white/90">Manage your account settings and preferences</p>
                </div>
            </div>

            {/* Profile Content */}
            <div className="container-custom py-12">
                <ProfileContent />
            </div>

            <Footer />
        </main>
    )
}