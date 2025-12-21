

import EventsHeader from '../components/events/EventsHeader'
import EventsFilters from '../components/events/EventsFilters'
import EventsGrid from '../components/events/EventsGrid'
import EventsPagination from '../components/events/EventsPagination'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

export const metadata = {
  title: 'Browse Events | QuickTix',
  description: 'Discover and book tickets for amazing events near you. Browse by category, date, location, and more.',
}

export default function EventsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Page Header */}
      <EventsHeader />

      {/* Main Content */}
      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:col-span-1">
            <EventsFilters />
          </aside>

          {/* Events Grid */}
          <div className="lg:col-span-3">
            <EventsGrid />
            <EventsPagination />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}