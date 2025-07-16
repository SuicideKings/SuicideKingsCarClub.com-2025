import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"
import AnnouncementBanner from "@/components/announcement-banner"

// Enhanced chapter data with leadership hierarchy, cars, events, and announcements
const chapters = {
  skie: {
    id: "skie",
    name: "Inland Empire",
    fullName: "Suicide Kings Inland Empire",
    description: "The founding chapter of the Suicide Kings Car Club, established in 2016.",
    location: "Inland Empire, Southern California",
    memberCount: 24,
    foundedYear: 2016,
    leadership: {
      president: { name: "Alex Rodriguez", nickname: "The Don", since: "2020" },
      vicePresident: { name: "Marcus Thompson", nickname: "Ace", since: "2021" },
      treasurer: { name: "Danny Chen", nickname: "The Accountant", since: "2022" },
      roadCaptain: { name: "Rico Martinez", nickname: "Ghost Rider", since: "2021" },
      enforcer: { name: "Big Mike Johnson", nickname: "The Hammer", since: "2020" },
    },
    announcements: [
      { date: "2024-12-15", title: "Holiday Cruise Night", content: "Join us for our annual holiday cruise through downtown Riverside!" },
      { date: "2024-12-10", title: "New Member Orientation", content: "Welcome ceremony for 3 new prospects this Saturday." },
    ],
    memberCars: [
      { owner: "Alex Rodriguez", year: "1964", model: "Lincoln Continental", color: "Midnight Black", image: "/images/cars/1964-continental-black.jpg" },
      { owner: "Marcus Thompson", year: "1967", model: "Lincoln Continental", color: "Pearl White", image: "/images/cars/1967-continental-white.jpg" },
      { owner: "Rico Martinez", year: "1963", model: "Lincoln Continental", color: "Deep Red", image: "/images/cars/1963-continental-red.jpg" },
      { owner: "Danny Chen", year: "1966", model: "Lincoln Continental", color: "Silver", image: "/images/cars/1966-continental-silver.jpg" },
    ],
    upcomingEvents: [
      { date: "2024-12-20", title: "Christmas Toy Drive Cruise", location: "Victoria Gardens" },
      { date: "2024-12-28", title: "Year-End Chapter Meeting", location: "Club House" },
      { date: "2025-01-15", title: "New Year Kickoff Show", location: "San Bernardino Fairgrounds" },
    ],
  },
  skwa: {
    id: "skwa",
    name: "Washington",
    fullName: "Suicide Kings Washington",
    description: "Our Pacific Northwest chapter brings together Continental enthusiasts.",
    location: "Washington State",
    memberCount: 18,
    foundedYear: 2018,
    leadership: {
      president: { name: "Jake Morrison", nickname: "Rain King", since: "2019" },
      vicePresident: { name: "Sarah Williams", nickname: "Queen of Spades", since: "2020" },
      treasurer: { name: "Chris Anderson", nickname: "The Bank", since: "2021" },
      roadCaptain: { name: "Tony Valdez", nickname: "Northwest", since: "2020" },
      enforcer: { name: "Bull Henderson", nickname: "The Mountain", since: "2019" },
    },
    announcements: [
      { date: "2024-12-12", title: "Winter Storage Tips", content: "Don't forget to winterize your rides! Check our tech sheet." },
      { date: "2024-12-08", title: "Chapter Elections", content: "Nominations now open for 2025 officer positions." },
    ],
    memberCars: [
      { owner: "Jake Morrison", year: "1965", model: "Lincoln Continental", color: "Forest Green", image: "/images/cars/1965-continental-green.jpg" },
      { owner: "Sarah Williams", year: "1968", model: "Lincoln Continental", color: "Royal Blue", image: "/images/cars/1968-continental-blue.jpg" },
      { owner: "Chris Anderson", year: "1962", model: "Lincoln Continental", color: "Burgundy", image: "/images/cars/1962-continental-burgundy.jpg" },
    ],
    upcomingEvents: [
      { date: "2025-01-12", title: "Planning Meeting", location: "Denny's - Tacoma" },
      { date: "2025-02-14", title: "Valentine's Day Cruise", location: "Seattle Waterfront" },
      { date: "2025-03-15", title: "Spring Awakening Show", location: "Evergreen Speedway" },
    ],
  },
  skla: {
    id: "skla",
    name: "Los Angeles",
    fullName: "Suicide Kings Los Angeles",
    description: "Representing the City of Angels with classic Continental style.",
    location: "Los Angeles, California",
    memberCount: 22,
    foundedYear: 2017,
    leadership: {
      president: { name: "Carlos Mendoza", nickname: "El Jefe", since: "2018" },
      vicePresident: { name: "Lisa Rodriguez", nickname: "Hollywood", since: "2019" },
      treasurer: { name: "David Kim", nickname: "Calculator", since: "2020" },
      roadCaptain: { name: "Miguel Santos", nickname: "Sunset Strip", since: "2019" },
      enforcer: { name: "Tank Williams", nickname: "The Wall", since: "2018" },
    },
    announcements: [
      { date: "2024-12-14", title: "Holiday Toy Run", content: "Annual toy drive cruise to Children's Hospital this Sunday!" },
      { date: "2024-12-11", title: "New Prospects", content: "2 new prospects approved for membership track." },
    ],
    memberCars: [
      { owner: "Carlos Mendoza", year: "1961", model: "Lincoln Continental", color: "Candy Apple Red", image: "/images/cars/1961-continental-red.jpg" },
      { owner: "Lisa Rodriguez", year: "1969", model: "Lincoln Continental", color: "Pink Cadillac", image: "/images/cars/1969-continental-pink.jpg" },
      { owner: "David Kim", year: "1964", model: "Lincoln Continental", color: "Electric Blue", image: "/images/cars/1964-continental-blue.jpg" },
      { owner: "Miguel Santos", year: "1967", model: "Lincoln Continental", color: "Sunset Orange", image: "/images/cars/1967-continental-orange.jpg" },
    ],
    upcomingEvents: [
      { date: "2024-12-22", title: "Griffith Observatory Cruise", location: "Hollywood Hills" },
      { date: "2025-01-05", title: "Rose Bowl Parade Prep", location: "Pasadena" },
      { date: "2025-01-26", title: "Lowrider Super Show", location: "LA Convention Center" },
    ],
  },
  skcv: {
    id: "skcv",
    name: "Coachella Valley",
    fullName: "Suicide Kings Coachella Valley",
    description: "Desert cruising with the finest Continentals in the valley.",
    location: "Coachella Valley, California",
    memberCount: 15,
    foundedYear: 2019,
    leadership: {
      president: { name: "Roberto Flores", nickname: "Desert Storm", since: "2020" },
      vicePresident: { name: "Maria Gonzalez", nickname: "Mirage", since: "2021" },
      treasurer: { name: "Johnny Reyes", nickname: "Sand Dollar", since: "2022" },
      roadCaptain: { name: "Eddie Morales", nickname: "Heat Wave", since: "2021" },
      enforcer: { name: "Diesel Rodriguez", nickname: "Sandstorm", since: "2020" },
    },
    announcements: [
      { date: "2024-12-13", title: "Desert Cruise", content: "Monthly desert cruise this Saturday - bring water!" },
      { date: "2024-12-09", title: "Coachella Prep", content: "Planning meeting for Coachella Music Festival presence." },
    ],
    memberCars: [
      { owner: "Roberto Flores", year: "1963", model: "Lincoln Continental", color: "Desert Sand", image: "/images/cars/1963-continental-sand.jpg" },
      { owner: "Maria Gonzalez", year: "1966", model: "Lincoln Continental", color: "Turquoise", image: "/images/cars/1966-continental-turquoise.jpg" },
      { owner: "Johnny Reyes", year: "1965", model: "Lincoln Continental", color: "Gold", image: "/images/cars/1965-continental-gold.jpg" },
    ],
    upcomingEvents: [
      { date: "2024-12-21", title: "Desert Holiday Cruise", location: "Palm Springs" },
      { date: "2025-01-18", title: "New Year Desert Run", location: "Joshua Tree" },
      { date: "2025-04-12", title: "Coachella Music Festival", location: "Indio" },
    ],
  },
  sknc: {
    id: "sknc",
    name: "Northern California",
    fullName: "Suicide Kings Northern California",
    description: "Bringing Continental class to Northern California.",
    location: "Northern California",
    memberCount: 20,
    foundedYear: 2018,
    leadership: {
      president: { name: "Vincent Chang", nickname: "Golden Gate", since: "2019" },
      vicePresident: { name: "Angela Davis", nickname: "Bay Queen", since: "2020" },
      treasurer: { name: "Frank Russo", nickname: "Silicon", since: "2021" },
      roadCaptain: { name: "Ramon Gutierrez", nickname: "Bridge Runner", since: "2020" },
      enforcer: { name: "Thor Petersen", nickname: "Fog Crusher", since: "2019" },
    },
    announcements: [
      { date: "2024-12-16", title: "Bay Area Cruise", content: "Epic Golden Gate to Bay Bridge cruise this weekend!" },
      { date: "2024-12-12", title: "Tech Night", content: "Engine tech session at Frank's garage Thursday 7PM." },
    ],
    memberCars: [
      { owner: "Vincent Chang", year: "1962", model: "Lincoln Continental", color: "Golden Yellow", image: "/images/cars/1962-continental-yellow.jpg" },
      { owner: "Angela Davis", year: "1968", model: "Lincoln Continental", color: "Fog Gray", image: "/images/cars/1968-continental-gray.jpg" },
      { owner: "Frank Russo", year: "1964", model: "Lincoln Continental", color: "Bay Blue", image: "/images/cars/1964-continental-bayblue.jpg" },
      { owner: "Ramon Gutierrez", year: "1967", model: "Lincoln Continental", color: "Bridge Orange", image: "/images/cars/1967-continental-bridgeorange.jpg" },
    ],
    upcomingEvents: [
      { date: "2024-12-29", title: "Year-End Bay Cruise", location: "San Francisco Bay" },
      { date: "2025-01-19", title: "Wine Country Tour", location: "Napa Valley" },
      { date: "2025-02-16", title: "Silicon Valley Tech Show", location: "San Jose" },
    ],
  },
}

function ChapterContent({ chapter }: { chapter: typeof chapters.skie }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 via-white to-red-500 bg-clip-text text-transparent">
              {chapter.fullName}
            </h1>
            <div className="flex items-center justify-center space-x-6 text-gray-300 mb-8">
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Est. {chapter.foundedYear}
              </span>
              <span>•</span>
              <span className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                {chapter.memberCount} Members Strong
              </span>
            </div>
            <p className="text-2xl text-gray-300 mb-6 max-w-4xl mx-auto">{chapter.description}</p>
            <p className="text-xl text-red-400 font-semibold">{chapter.location}</p>
          </div>

          {/* Chapter Announcements */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">Latest Word</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {chapter.announcements.map((announcement, index) => (
                <div key={index} className="bg-gradient-to-r from-red-900/20 to-black/40 backdrop-blur-sm border border-red-500/30 p-6 rounded-lg">
                  <div className="flex items-center mb-3">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-xs font-bold mr-3">!</span>
                    <span className="text-red-400 text-sm">{announcement.date}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{announcement.title}</h3>
                  <p className="text-gray-300">{announcement.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Leadership Hierarchy */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">The Family</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(chapter.leadership).map(([role, leader]) => (
                <div key={role} className="bg-black/50 backdrop-blur-sm border border-red-500/30 p-6 rounded-lg text-center hover:border-red-400 transition-all duration-300 hover:scale-105">
                  <div className="mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-800 rounded-full mx-auto flex items-center justify-center mb-3">
                      <span className="text-white font-bold text-lg">
                        {role === 'president' ? '👑' : role === 'vicePresident' ? '🎖️' : role === 'treasurer' ? '💰' : role === 'roadCaptain' ? '🏁' : '💪'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-red-400 capitalize mb-1">
                      {role === 'vicePresident' ? 'Vice President' : role === 'roadCaptain' ? 'Road Captain' : role}
                    </h3>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-1">{leader.name}</h4>
                  <p className="text-gray-300 italic mb-2">"{leader.nickname}"</p>
                  <p className="text-sm text-gray-400">Since {leader.since}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Member Cars Showcase */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">The Fleet</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {chapter.memberCars.map((car, index) => (
                <div key={index} className="bg-black/40 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden hover:border-red-500/50 transition-all duration-300 hover:scale-105">
                  <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <span className="text-4xl mb-2 block">🚗</span>
                      <span className="text-sm">Image Coming Soon</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-semibold text-white mb-1">{car.year} {car.model}</h4>
                    <p className="text-red-400 mb-2">{car.color}</p>
                    <p className="text-sm text-gray-400">Owned by {car.owner}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-8 text-center">
              <span className="bg-gradient-to-r from-red-500 to-white bg-clip-text text-transparent">What's Coming</span>
            </h2>
            <div className="space-y-4">
              {chapter.upcomingEvents.map((event, index) => (
                <div key={index} className="bg-gradient-to-r from-black/40 to-red-900/20 backdrop-blur-sm border border-gray-700 p-6 rounded-lg hover:border-red-500/50 transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-center mb-2 md:mb-0">
                      <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center mr-4">
                        <span className="text-white font-bold">📅</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                        <p className="text-gray-400">{event.location}</p>
                      </div>
                    </div>
                    <div className="text-red-400 font-semibold">{event.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action Section */}
          <div className="bg-gradient-to-r from-red-900/30 to-black/50 backdrop-blur-sm border border-red-500/30 rounded-lg p-8 text-center mb-12">
            <h3 className="text-3xl font-bold mb-4 text-white">Ready to Join the Family?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Experience the brotherhood, the rides, and the lifestyle. Become part of the {chapter.name} chapter legacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/membership/join" className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium">
                Apply for Membership
              </Link>
              <Link href="/contact" className="border border-red-600 text-red-400 px-8 py-3 rounded-lg hover:bg-red-600 hover:text-white transition-colors font-medium">
                Contact Chapter
              </Link>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/chapters" className="text-red-400 hover:text-red-300 transition-colors text-lg">
              ← Back to All Chapters
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default async function OptimizedChapterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const chapter = chapters[id as keyof typeof chapters]

  if (!chapter) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <AnnouncementBanner />
      
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
          <div className="text-center text-white">Loading chapter information...</div>
        </div>
      }>
        <ChapterContent chapter={chapter} />
      </Suspense>

      <Footer />
    </div>
  )
}