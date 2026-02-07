import Link from 'next/link';

interface Event {
    id: number;
    title: string;
    description: string;
    category: string;
    venue: string;
    date: string;
    time: string;
    available_seats: number;
    price: string;
}

export default function EventCard({ event }: { event: Event }) {
    const categoryColors: { [key: string]: string } = {
        movie: 'bg-blue-100 text-blue-800',
        concert: 'bg-purple-100 text-purple-800',
        sports: 'bg-green-100 text-green-800',
        theater: 'bg-red-100 text-red-800',
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
            <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[event.category] || 'bg-gray-100 text-gray-800'
                            }`}
                    >
                        {event.category}
                    </span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                </p>
                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-700">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.venue}
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(event.date).toLocaleDateString()} at {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-700">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {event.available_seats} seats available
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-indigo-600">
                        ${event.price}
                    </span>
                    <Link
                        href={`/events/${event.id}`}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium"
                    >
                        Book Now
                    </Link>
                </div>
            </div>
        </div>
    );
}