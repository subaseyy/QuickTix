import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import OrganizerFeatures from '../components/organizer/OrganizerFeatures'
import OrganizerPricing from '../components/organizer/OrganizerPricing'
import OrganizerProcess from '../components/organizer/OrganizerProcess'
import OrganizerTestimonials from '../components/organizer/OrganizerTestimonials'
import OrganizerFAQ from '../components/organizer/OrganizerFAQ'
import OrganizerCTA from '../components/organizer/OrganizerCTA'
import OrganizerHero from '../components/organizer/OrganizerHero'
import OrganizerBenefits from '../components/organizer/OrganizerBenefits'

export const metadata = {
    title: 'Become an Organizer | QuickTix',
    description: 'Host your events on QuickTix and reach thousands of potential attendees. Simple setup, powerful tools, and competitive pricing.',
}

export default function BecomeOrganizerPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <OrganizerHero />
            <OrganizerBenefits />
            <OrganizerFeatures />
            <OrganizerPricing />
            <OrganizerProcess />
            <OrganizerTestimonials />
            <OrganizerFAQ />
            <OrganizerCTA />
            <Footer />
        </main>
    )
}