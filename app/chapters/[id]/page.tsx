import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"
import AnnouncementBanner from "@/components/announcement-banner"

// Optimized chapter data
const chapters = {
  skie: {
    id: "skie",
    name: "Inland Empire",
    fullName: "Suicide Kings Inland Empire",
    description: "The founding chapter of the Suicide Kings Car Club, established in 2016.",
    location: "Inland Empire, Southern California",
    memberCount: 24,
    foundedYear: 2016,
  },
  skwa: {
    id: "skwa",
    name: "Washington",
    fullName: "Suicide Kings Washington",
    description: "Our Pacific Northwest chapter brings together Continental enthusiasts.",
    location: "Washington State",
    memberCount: 18,
    foundedYear: 2018,
  },
  skla: {
    id: "skla",
    name: "Los Angeles",
    fullName: "Suicide Kings Los Angeles",
    description: "Representing the City of Angels with classic Continental style.",
    location: "Los Angeles, California",
    memberCount: 22,
    foundedYear: 2017,
  },
  skcv: {
    id: "skcv",
    name: "Coachella Valley",
    fullName: "Suicide Kings Coachella Valley",
    description: "Desert cruising with the finest Continentals in the valley.",
    location: "Coachella Valley, California",
    memberCount: 15,
    foundedYear: 2019,
  },
  sknc: {
    id: "sknc",
    name: "Northern California",
    fullName: "Suicide Kings Northern California",
    description: "Bringing Continental class to Northern California.",
    location: "Northern California",
    memberCount: 20,
    foundedYear: 2018,
  },
}

function ChapterContent({ chapter }: { chapter: typeof chapters.skie }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">{chapter.fullName}</h1>
            <div className="flex items-center justify-center space-x-4 text-gray-400 mb-6">
              <span>Est. {chapter.foundedYear}</span>
              <span>•</span>
              <span>{chapter.memberCount} Members</span>
            </div>
            <p className="text-xl text-gray-300 mb-4">{chapter.description}</p>
            <p className="text-lg text-gray-400">{chapter.location}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-black/40 backdrop-blur-sm border border-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-white">Chapter Info</h3>
              <div className="space-y-2">
                <p><strong className="text-gray-300">Founded:</strong> <span className="text-white">{chapter.foundedYear}</span></p>
                <p><strong className="text-gray-300">Members:</strong> <span className="text-white">{chapter.memberCount}</span></p>
                <p><strong className="text-gray-300">Location:</strong> <span className="text-white">{chapter.location}</span></p>
              </div>
            </div>
            
            <div className="bg-black/40 backdrop-blur-sm border border-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-white">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/membership/join" className="block text-red-400 hover:text-red-300 transition-colors">
                  Join Our Chapter
                </Link>
                <Link href="/events" className="block text-red-400 hover:text-red-300 transition-colors">
                  Upcoming Events
                </Link>
                <Link href="/gallery" className="block text-red-400 hover:text-red-300 transition-colors">
                  Photo Gallery
                </Link>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/" className="text-red-400 hover:text-red-300 transition-colors text-lg">
              ← Back to Home
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