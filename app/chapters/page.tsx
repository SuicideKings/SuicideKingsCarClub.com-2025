import Link from "next/link"
import Image from "next/image"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"
import AnnouncementBanner from "@/components/announcement-banner"

const chapters = [
  {
    id: "skie",
    name: "Inland Empire",
    fullName: "Suicide Kings Inland Empire",
    description: "The founding chapter of the Suicide Kings Car Club, established in 2016.",
    location: "Inland Empire, Southern California",
    memberCount: 24,
    foundedYear: 2016,
  },
  {
    id: "skwa",
    name: "Washington",
    fullName: "Suicide Kings Washington",
    description: "Our Pacific Northwest chapter brings together Continental enthusiasts.",
    location: "Washington State",
    memberCount: 18,
    foundedYear: 2018,
  },
  {
    id: "skla",
    name: "Los Angeles",
    fullName: "Suicide Kings Los Angeles",
    description: "Representing the City of Angels with classic Continental style.",
    location: "Los Angeles, California",
    memberCount: 22,
    foundedYear: 2017,
  },
  {
    id: "skcv",
    name: "Coachella Valley",
    fullName: "Suicide Kings Coachella Valley",
    description: "Desert cruising with the finest Continentals in the valley.",
    location: "Coachella Valley, California",
    memberCount: 15,
    foundedYear: 2019,
  },
  {
    id: "sknc",
    name: "Northern California",
    fullName: "Suicide Kings Northern California",
    description: "Bringing Continental class to Northern California.",
    location: "Northern California",
    memberCount: 20,
    foundedYear: 2018,
  },
]

export default function ChaptersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <AnnouncementBanner />
      
      <main className="flex-1 bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Our Chapters
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Suicide Kings Car Club has chapters across the West Coast, each bringing together passionate Continental enthusiasts in their local communities.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/chapters/${chapter.id}`}
                  className="group block bg-black/40 backdrop-blur-sm border border-gray-700 rounded-lg overflow-hidden hover:border-red-500/50 transition-all duration-300 hover:scale-105"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-white group-hover:text-red-400 transition-colors">
                        {chapter.name}
                      </h3>
                      <span className="text-sm text-gray-400">Est. {chapter.foundedYear}</span>
                    </div>
                    
                    <p className="text-gray-300 mb-4 line-clamp-2">
                      {chapter.description}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Location:</span>
                        <span className="text-white">{chapter.location}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Members:</span>
                        <span className="text-white">{chapter.memberCount}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <span className="text-red-400 text-sm group-hover:text-red-300 transition-colors">
                        Learn More →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <div className="bg-black/40 backdrop-blur-sm border border-gray-700 rounded-lg p-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-semibold mb-4 text-white">Interested in Starting a Chapter?</h3>
                <p className="text-gray-300 mb-6">
                  We're always looking to expand to new areas. If you're passionate about Continental cars and want to bring Suicide Kings to your region, we'd love to hear from you.
                </p>
                <Link
                  href="/contact"
                  className="inline-block bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}