'use client'

import { Linkedin, Twitter, Mail } from 'lucide-react'

export default function AboutTeam() {
    const team = [
        {
            name: 'John Doe',
            role: 'CEO & Founder',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
            bio: '10+ years in tech, passionate about connecting people through events.',
            linkedin: '#',
            twitter: '#',
            email: 'john@quicktix.com',
        },
        {
            name: 'Jane Smith',
            role: 'CTO',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            bio: 'Former Google engineer, loves building scalable platforms.',
            linkedin: '#',
            twitter: '#',
            email: 'jane@quicktix.com',
        },
        {
            name: 'Mike Johnson',
            role: 'Head of Product',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
            bio: 'Product visionary with experience at leading startups.',
            linkedin: '#',
            twitter: '#',
            email: 'mike@quicktix.com',
        },
        {
            name: 'Sarah Williams',
            role: 'Head of Marketing',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
            bio: 'Marketing expert who helped scale multiple tech companies.',
            linkedin: '#',
            twitter: '#',
            email: 'sarah@quicktix.com',
        },
        {
            name: 'David Brown',
            role: 'Head of Operations',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
            bio: 'Operations guru ensuring smooth event experiences globally.',
            linkedin: '#',
            twitter: '#',
            email: 'david@quicktix.com',
        },
        {
            name: 'Emily Davis',
            role: 'Head of Customer Success',
            image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
            bio: 'Customer advocate dedicated to delivering exceptional support.',
            linkedin: '#',
            twitter: '#',
            email: 'emily@quicktix.com',
        },
    ]

    return (
        <section className="section bg-white">
            <div className="container-custom">
                {/* Section Header */}
                <div className="text-center mb-16 animate-fade-in">
                    <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Meet Our <span className="gradient-text">Team</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Passionate individuals working together to create amazing event experiences
                    </p>
                </div>

                {/* Team Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {team.map((member, index) => (
                        <div
                            key={index}
                            className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 animate-fade-in"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            {/* Image */}
                            <div className="relative h-80 overflow-hidden">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${member.image})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                {/* Social Links Overlay */}
                                <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <a
                                        href={member.linkedin}
                                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
                                    >
                                        <Linkedin className="w-5 h-5 text-blue-600" />
                                    </a>
                                    <a
                                        href={member.twitter}
                                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
                                    >
                                        <Twitter className="w-5 h-5 text-sky-500" />
                                    </a>
                                    <a
                                        href={`mailto:${member.email}`}
                                        className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
                                    >
                                        <Mail className="w-5 h-5 text-gray-700" />
                                    </a>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                    {member.name}
                                </h3>
                                <p className="text-primary-600 font-semibold mb-3">
                                    {member.role}
                                </p>
                                <p className="text-gray-600 leading-relaxed">
                                    {member.bio}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Join Team CTA */}
                <div className="mt-16 max-w-3xl mx-auto text-center animate-fade-in">
                    <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 sm:p-12">
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">
                            Join Our Team
                        </h3>
                        <p className="text-xl text-gray-600 mb-6">
                            We're always looking for talented, passionate people to join our mission.
                            Check out our open positions and become part of the QuickTix family!
                        </p>
                        <a
                            href="/careers"
                            className="inline-flex items-center btn btn-primary btn-lg"
                        >
                            View Open Positions
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}