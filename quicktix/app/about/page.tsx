import AboutCTA from "../components/about/AboutCTA"
import AboutHero from "../components/about/AboutHero"
import AboutMission from "../components/about/AboutMission"
import AboutStats from "../components/about/AboutStats"
import AboutTeam from "../components/about/AboutTeam"
import AboutTimeline from "../components/about/AboutTimeline"
import AboutValues from "../components/about/AboutValues"
import Footer from "../components/layout/Footer"
import Navbar from "../components/layout/Navbar"


export const metadata = {
    title: 'About Us | QuickTix',
    description: 'Learn about QuickTix - your trusted platform for discovering and booking amazing events. Meet our team and discover our mission.',
}

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <AboutHero />
            <AboutMission />
            <AboutStats />
            <AboutValues />
            <AboutTimeline />
            <AboutTeam />
            <AboutCTA />
            <Footer />
        </main>
    )
}