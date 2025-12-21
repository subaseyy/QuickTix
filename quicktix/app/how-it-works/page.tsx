import FAQ from "../components/how-it-works/FAQ"
import HowItWorksCTA from "../components/how-it-works/HowItWorksCTA"
import HowItWorksHero from "../components/how-it-works/HowItWorksHero"
import OrganizerSteps from "../components/how-it-works/OrganizerSteps"
import PlatformFeatures from "../components/how-it-works/PlatformFeatures"
import UserSteps from "../components/how-it-works/UserSteps"
import Footer from "../components/layout/Footer"
import Navbar from "../components/layout/Navbar"




export const metadata = {
    title: 'How It Works | QuickTix',
    description: 'Learn how QuickTix makes event booking simple and secure. Discover and book tickets in just a few clicks.',
}

export default function HowItWorksPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <HowItWorksHero />
            <UserSteps />
            <OrganizerSteps />
            <PlatformFeatures />
            <FAQ />
            <HowItWorksCTA />
            <Footer />
        </main>
    )
}