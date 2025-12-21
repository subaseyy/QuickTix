import ContactCTA from "../components/contact/ContactCTA"
import ContactFAQ from "../components/contact/ContactFAQ"
import ContactForm from "../components/contact/ContactForm"
import ContactHero from "../components/contact/ContactHero"
import ContactInfo from "../components/contact/ContactInfo"
import ContactLocations from "../components/contact/ContactLocations"
import Footer from "../components/layout/Footer"
import Navbar from "../components/layout/Navbar"


export const metadata = {
    title: 'Contact Us | QuickTix',
    description: 'Get in touch with QuickTix. Our support team is available 24/7 to help you with any questions or concerns.',
}

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <ContactHero />
            <div className="section bg-white">
                <div className="container-custom">
                    <div className="grid lg:grid-cols-2 gap-12">
                        <ContactForm />
                        <ContactInfo />
                    </div>
                </div>
            </div>
            <ContactLocations />
            <ContactFAQ />
            <ContactCTA />
            <Footer />
        </main>
    )
}