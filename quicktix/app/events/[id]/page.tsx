import EventDescription from "@/app/components/events/details/EventDescription"
import EventHero from "@/app/components/events/details/EventHero"
import EventInfo from "@/app/components/events/details/EventInfo"
import OrganizerInfo from "@/app/components/events/details/OrganizerInfo"
import SimilarEvents from "@/app/components/events/details/SimilarEvents"
import TicketSelection from "@/app/components/events/details/Ticketselection"
import VenueInfo from "@/app/components/events/details/VenueInfo"
import Footer from "@/app/components/layout/Footer"
import Navbar from "@/app/components/layout/Navbar"


export async function generateMetadata({ params }: { params: { id: string } }) {
    // TODO: Fetch event data from API
    return {
        title: 'Summer Music Festival 2025 | QuickTix',
        description: 'Join us for an unforgettable summer music festival featuring top artists from around the world.',
    }
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
    // TODO: Fetch event data based on params.id
    const eventId = 1

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Event Hero with Image Gallery */}
            <EventHero eventId={eventId} />

            {/* Main Content */}
            <div className="container-custom py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Event Details */}
                    <div className="lg:col-span-2 space-y-8">
                        <EventInfo />
                        <EventDescription />
                        <VenueInfo />
                        <OrganizerInfo />
                    </div>

                    {/* Right Column - Ticket Selection (Sticky) */}
                    <div className="lg:col-span-1">
                        <div className="lg:sticky lg:top-24">
                            <TicketSelection />
                        </div>
                    </div>
                </div>

                {/* Similar Events */}
                <SimilarEvents />
            </div>

            <Footer />
        </main>
    )
}