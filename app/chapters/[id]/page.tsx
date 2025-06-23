import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ChevronRight, MapPin, Calendar, Users, Crown, Star, Trophy, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"
import MemberHierarchy from "@/components/member-hierarchy"

// This would typically come from a database
const chapters = {
  skie: {
    id: "skie",
    name: "Inland Empire",
    fullName: "Suicide Kings Inland Empire",
    description:
      "The founding chapter of the Suicide Kings Car Club, established in 2016. Based in the Inland Empire of Southern California, this is where it all began.",
    location: "Inland Empire, Southern California",
    meetingSchedule: "First Saturday of every month",
    meetingLocation: "Classic Car Garage, Riverside, CA",
    president: "Michael Rodriguez",
    vicePresident: "James Wilson",
    secretary: "Robert Johnson",
    treasurer: "David Martinez",
    memberCount: 24,
    foundedYear: 2016,
    mapDescription: "Covering Riverside and San Bernardino counties in Southern California",
    mapImage: "/images/maps/skie-map.jpg",
  },
  skwa: {
    id: "skwa",
    name: "Washington",
    fullName: "Suicide Kings Washington",
    description:
      "Our Pacific Northwest chapter brings together Continental enthusiasts from across Washington state, showcasing these classic automobiles in the beautiful Northwest landscape.",
    location: "Washington State",
    meetingSchedule: "Second Sunday of every month",
    meetingLocation: "Emerald City Classics, Seattle, WA",
    president: "Thomas Anderson",
    vicePresident: "William Clark",
    secretary: "Christopher Lewis",
    treasurer: "Daniel Walker",
    memberCount: 18,
    foundedYear: 2018,
    mapDescription: "Spanning the Evergreen State from Seattle to Spokane",
    mapImage: "/images/maps/skwa-map.jpg",
  },
  skla: {
    id: "skla",
    name: "Los Angeles",
    fullName: "Suicide Kings Los Angeles",
    description:
      "Representing the City of Angels with classic Continental style. Our LA chapter brings Hollywood glamour to these iconic vehicles.",
    location: "Los Angeles, California",
    meetingSchedule: "Third Friday of every month",
    meetingLocation: "Sunset Boulevard Garage, Los Angeles, CA",
    president: "Anthony Garcia",
    vicePresident: "Richard Moore",
    secretary: "Joseph Taylor",
    treasurer: "Edward Martin",
    memberCount: 22,
    foundedYear: 2017,
    mapDescription: "Covering Los Angeles County and surrounding areas",
    mapImage: "/images/maps/skla-map.jpg",
  },
  skcv: {
    id: "skcv",
    name: "Coachella Valley",
    fullName: "Suicide Kings Coachella Valley",
    description:
      "Desert cruising with the finest Continentals in the valley. Our Coachella Valley chapter embraces the desert lifestyle with these classic automobiles.",
    location: "Coachella Valley, California",
    meetingSchedule: "First Sunday of every month",
    meetingLocation: "Palm Springs Auto Museum, Palm Springs, CA",
    president: "Steven White",
    vicePresident: "Kevin Harris",
    secretary: "Brian Thompson",
    treasurer: "Mark Davis",
    memberCount: 15,
    foundedYear: 2019,
    mapDescription: "From Palm Springs to Indio and throughout the Coachella Valley",
    mapImage: "/images/maps/skcv-map.jpg",
  },
  sknc: {
    id: "sknc",
    name: "Northern California",
    fullName: "Suicide Kings Northern California",
    description:
      "Bringing Continental class to Northern California. From San Francisco to Sacramento, our Northern California chapter represents the northern region of the Golden State.",
    location: "Northern California",
    meetingSchedule: "Fourth Saturday of every month",
    meetingLocation: "Golden Gate Classics, San Francisco, CA",
    president: "Paul Jackson",
    vicePresident: "George Nelson",
    secretary: "Kenneth Carter",
    treasurer: "Donald Mitchell",
    memberCount: 20,
    foundedYear: 2018,
    mapDescription: "From the Bay Area to Sacramento and the surrounding Northern California region",
    mapImage: "/images/maps/sknc-map.jpg",
  },
}

export default function ChapterPage({ params }: { params: { id: string } }) {
  const chapter = chapters[params.id as keyof typeof chapters]

  if (!chapter) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      {/* Chapter Header with Animated Background */}
      <div className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="h-[500px] w-full bg-gradient-to-br from-gray-900 via-black to-gray-800">
            {/* Animated Map background */}
            <div className="absolute inset-0 opacity-30">
              <Image
                src={chapter.mapImage || "/placeholder.svg"}
                alt={`${chapter.name} Chapter Region Map`}
                fill
                className="object-cover transition-transform duration-[20s] ease-linear hover:scale-105"
              />
            </div>

            {/* Floating geometric shapes */}
            <div className="absolute inset-0">
              <div className="absolute top-20 left-10 w-20 h-20 border border-white/20 rotate-45 animate-pulse"></div>
              <div className="absolute top-40 right-20 w-16 h-16 border border-white/10 rotate-12 animate-bounce"></div>
              <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-white/15 rotate-45 animate-pulse delay-1000"></div>
              <div className="absolute bottom-40 right-1/3 w-24 h-24 border border-white/10 rotate-12 animate-bounce delay-500"></div>
            </div>

            {/* Gradient overlay with sparkle effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-blue-900/20"></div>
          </div>
        </div>

        <div className="container relative z-10 mx-auto px-4 py-40 text-white">
          <div className="flex flex-col items-center text-center space-y-6">
            {/* Chapter Badge */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur-lg opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-4">
                <Crown className="h-12 w-12 text-black" />
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent drop-shadow-2xl">
                {chapter.fullName}
              </h1>
              <div className="flex items-center justify-center space-x-2 text-yellow-400">
                <Star className="h-5 w-5 fill-current" />
                <span className="text-lg font-semibold">Est. {chapter.foundedYear}</span>
                <Star className="h-5 w-5 fill-current" />
              </div>
            </div>
            
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-200 font-light">
              {chapter.description}
            </p>
            
            <div className="flex items-center space-x-2 text-gray-300 bg-black/30 backdrop-blur-sm rounded-full px-6 py-3">
              <MapPin className="h-5 w-5 text-yellow-400" />
              <span className="font-medium">{chapter.mapDescription}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Breadcrumbs */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 py-6 text-gray-300 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-3 text-sm">
            <Link href="/" className="group flex items-center space-x-1 hover:text-yellow-400 transition-all duration-300">
              <span className="group-hover:scale-110 transition-transform duration-300">Home</span>
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-600" />
            <Link href="/#about" className="group flex items-center space-x-1 hover:text-yellow-400 transition-all duration-300">
              <span className="group-hover:scale-110 transition-transform duration-300">Chapters</span>
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-600" />
            <span className="text-yellow-400 font-semibold flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>{chapter.name}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Chapter Info with Glass Morphism Cards */}
      <section className="bg-gradient-to-b from-black via-gray-900 to-black py-20 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Chapter Info Card */}
            <div className="group">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-yellow-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-400/20 hover:scale-105">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-3">
                    <MapPin className="h-6 w-6 text-black" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    About Our Chapter
                  </h2>
                </div>
                
                <div className="space-y-6">
                  <div className="group/item hover:bg-white/5 rounded-xl p-4 transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-2">
                      <MapPin className="h-5 w-5 text-yellow-400" />
                      <h3 className="text-xl font-semibold text-white group-hover/item:text-yellow-400 transition-colors duration-300">Location</h3>
                    </div>
                    <p className="text-gray-300 ml-8 group-hover/item:text-white transition-colors duration-300">{chapter.location}</p>
                  </div>
                  
                  <div className="group/item hover:bg-white/5 rounded-xl p-4 transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-2">
                      <Trophy className="h-5 w-5 text-yellow-400" />
                      <h3 className="text-xl font-semibold text-white group-hover/item:text-yellow-400 transition-colors duration-300">Founded</h3>
                    </div>
                    <p className="text-gray-300 ml-8 group-hover/item:text-white transition-colors duration-300">{chapter.foundedYear}</p>
                  </div>
                  
                  <div className="group/item hover:bg-white/5 rounded-xl p-4 transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-2">
                      <Users className="h-5 w-5 text-yellow-400" />
                      <h3 className="text-xl font-semibold text-white group-hover/item:text-yellow-400 transition-colors duration-300">Members</h3>
                    </div>
                    <p className="text-gray-300 ml-8 group-hover/item:text-white transition-colors duration-300">{chapter.memberCount} active members</p>
                  </div>
                  
                  <div className="group/item hover:bg-white/5 rounded-xl p-4 transition-all duration-300">
                    <div className="flex items-center space-x-3 mb-2">
                      <Calendar className="h-5 w-5 text-yellow-400" />
                      <h3 className="text-xl font-semibold text-white group-hover/item:text-yellow-400 transition-colors duration-300">Meetings</h3>
                    </div>
                    <p className="text-gray-300 ml-8 group-hover/item:text-white transition-colors duration-300">
                      {chapter.meetingSchedule} at {chapter.meetingLocation}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Leadership Card */}
            <div className="group">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-yellow-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-400/20 hover:scale-105">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-3">
                    <Crown className="h-6 w-6 text-black" />
                  </div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Chapter Leadership
                  </h2>
                </div>
                
                <div className="space-y-6">
                  <div className="group/leader hover:bg-gradient-to-r hover:from-yellow-400/10 hover:to-yellow-600/10 rounded-xl p-4 transition-all duration-300 border border-transparent hover:border-yellow-400/30">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-2">
                        <Crown className="h-4 w-4 text-black" />
                      </div>
                      <h3 className="text-xl font-semibold text-white group-hover/leader:text-yellow-400 transition-colors duration-300">President</h3>
                    </div>
                    <p className="text-gray-300 ml-9 group-hover/leader:text-white transition-colors duration-300 font-medium">{chapter.president}</p>
                  </div>
                  
                  <div className="group/leader hover:bg-gradient-to-r hover:from-blue-400/10 hover:to-blue-600/10 rounded-xl p-4 transition-all duration-300 border border-transparent hover:border-blue-400/30">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-full p-2">
                        <Star className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white group-hover/leader:text-blue-400 transition-colors duration-300">Vice President</h3>
                    </div>
                    <p className="text-gray-300 ml-9 group-hover/leader:text-white transition-colors duration-300 font-medium">{chapter.vicePresident}</p>
                  </div>
                  
                  <div className="group/leader hover:bg-gradient-to-r hover:from-green-400/10 hover:to-green-600/10 rounded-xl p-4 transition-all duration-300 border border-transparent hover:border-green-400/30">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-full p-2">
                        <Star className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white group-hover/leader:text-green-400 transition-colors duration-300">Secretary</h3>
                    </div>
                    <p className="text-gray-300 ml-9 group-hover/leader:text-white transition-colors duration-300 font-medium">{chapter.secretary}</p>
                  </div>
                  
                  <div className="group/leader hover:bg-gradient-to-r hover:from-purple-400/10 hover:to-purple-600/10 rounded-xl p-4 transition-all duration-300 border border-transparent hover:border-purple-400/30">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-full p-2">
                        <Star className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white group-hover/leader:text-purple-400 transition-colors duration-300">Treasurer</h3>
                    </div>
                    <p className="text-gray-300 ml-9 group-hover/leader:text-white transition-colors duration-300 font-medium">{chapter.treasurer}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Member Hierarchy */}
      <section className="bg-gray-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">Chapter Members</h2>
          <MemberHierarchy chapterId={chapter.id} />
        </div>
      </section>

      {/* Chapter Events with Neon Cards */}
      <section className="bg-gradient-to-b from-gray-900 via-black to-gray-900 py-20 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-yellow-400/10 to-transparent rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-blue-400/10 to-transparent rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-purple-400/5 to-transparent rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-3">
                <Calendar className="h-8 w-8 text-black" />
              </div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
                Upcoming Chapter Events
              </h2>
            </div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Join us for exciting gatherings and showcase your Continental in style
            </p>
          </div>
          
          <div className="space-y-8">
            {[1, 2, 3].map((eventId) => (
              <div key={eventId} className="group relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/20 via-purple-400/20 to-blue-400/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 group-hover:border-yellow-400/50 transition-all duration-500 group-hover:scale-[1.02]">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-2">
                          <Star className="h-5 w-5 text-black" />
                        </div>
                        <h3 className="text-3xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300">
                          {chapter.name} Chapter Meet
                        </h3>
                      </div>
                      
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-center space-x-2 text-gray-300">
                          <Calendar className="h-5 w-5 text-yellow-400" />
                          <span className="font-medium">July {10 + eventId}, 2025</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-300">
                          <MapPin className="h-5 w-5 text-yellow-400" />
                          <span className="font-medium">{chapter.meetingLocation}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-lg leading-relaxed group-hover:text-white transition-colors duration-300">
                        Monthly gathering of the {chapter.fullName} chapter. All members are encouraged to attend and showcase their Continental classics.
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 lg:flex-col xl:flex-row">
                      <Button
                        variant="outline"
                        className="group/btn relative overflow-hidden border-2 border-yellow-400/50 bg-transparent text-white hover:text-black transition-all duration-300 px-8 py-3"
                        asChild
                      >
                        <Link href={`/events/${eventId}`}>
                          <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></span>
                          <span className="relative z-10 font-semibold">Event Details</span>
                        </Link>
                      </Button>
                      
                      <Button 
                        className="group/btn relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 px-8 py-3 font-semibold"
                        asChild
                      >
                        <Link href={`/events/${eventId}/tickets`}>
                          <span className="relative z-10 flex items-center space-x-2">
                            <span>RSVP Now</span>
                            <Sparkles className="h-4 w-4 group-hover/btn:animate-spin" />
                          </span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chapter Gallery with 3D Effects */}
      <section className="bg-gradient-to-b from-black via-gray-900 to-black py-20 text-white relative">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20h20v20H20z'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-3 mb-6">
              <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-full p-3">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
                Chapter Gallery
              </h2>
            </div>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Witness the beauty and craftsmanship of our members' Continental classics
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="group relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-400/30 via-blue-400/30 to-yellow-400/30 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                
                <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/20 group-hover:border-purple-400/50 transition-all duration-500">
                  <Image
                    src={`/images/gallery/car-${chapter.id}-${i + 1}.jpg`}
                    alt={`${chapter.name} Chapter Gallery Image ${i + 1}`}
                    width={300}
                    height={300}
                    className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                  />
                  
                  {/* Overlay with gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  {/* Hover content */}
                  <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                      <h4 className="text-white font-semibold text-sm">Continental Classic</h4>
                      <p className="text-gray-300 text-xs">Member Showcase</p>
                    </div>
                  </div>
                  
                  {/* Corner accent */}
                  <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Button 
              variant="outline" 
              className="group relative overflow-hidden border-2 border-purple-400/50 bg-transparent text-white hover:text-black transition-all duration-300 px-12 py-4 text-lg font-semibold"
              asChild
            >
              <Link href={`/gallery?chapter=${chapter.id}`}>
                <span className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                <span className="relative z-10 flex items-center space-x-2">
                  <Trophy className="h-5 w-5" />
                  <span>View Full Chapter Gallery</span>
                  <Sparkles className="h-5 w-5 group-hover:animate-spin" />
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Join Chapter with Premium CTA */}
      <section className="bg-gradient-to-b from-gray-900 via-black to-gray-900 py-24 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="mx-auto max-w-4xl">
            {/* Main CTA Card */}
            <div className="relative group">
              {/* Outer glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/30 via-purple-400/30 to-blue-400/30 rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-all duration-700"></div>
              
              <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/30 group-hover:border-yellow-400/50 transition-all duration-500">
                {/* Crown icon with animation */}
                <div className="text-center mb-8">
                  <div className="relative inline-block">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur-lg opacity-70 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-6">
                      <Crown className="h-16 w-16 text-black" />
                    </div>
                  </div>
                </div>
                
                <div className="text-center space-y-6">
                  <h2 className="text-5xl font-bold bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
                    Join Our Chapter
                  </h2>
                  
                  <div className="flex items-center justify-center space-x-2 text-yellow-400">
                    <Star className="h-6 w-6 fill-current" />
                    <span className="text-xl font-semibold">Exclusive Membership</span>
                    <Star className="h-6 w-6 fill-current" />
                  </div>
                  
                  <p className="text-xl leading-relaxed text-gray-200 max-w-2xl mx-auto">
                    Become a member of the <span className="text-yellow-400 font-semibold">{chapter.fullName}</span> chapter and join our prestigious community of Lincoln Continental enthusiasts.
                  </p>
                  
                  {/* Benefits list */}
                  <div className="grid md:grid-cols-3 gap-6 my-12">
                    <div className="text-center space-y-2">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-3 w-fit mx-auto">
                        <Users className="h-6 w-6 text-black" />
                      </div>
                      <h4 className="font-semibold text-white">Exclusive Events</h4>
                      <p className="text-gray-400 text-sm">Access to member-only gatherings</p>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-full p-3 w-fit mx-auto">
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-white">Show Recognition</h4>
                      <p className="text-gray-400 text-sm">Participate in prestigious shows</p>
                    </div>
                    
                    <div className="text-center space-y-2">
                      <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-full p-3 w-fit mx-auto">
                        <Crown className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-white">Elite Community</h4>
                      <p className="text-gray-400 text-sm">Connect with fellow enthusiasts</p>
                    </div>
                  </div>
                  
                  <Button 
                    size="lg" 
                    className="group/cta relative overflow-hidden bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 px-12 py-6 text-xl font-bold rounded-2xl"
                    asChild
                  >
                    <Link href={`/membership/join?chapter=${chapter.id}`}>
                      <span className="relative z-10 flex items-center space-x-3">
                        <Crown className="h-6 w-6" />
                        <span>Apply for Membership</span>
                        <Sparkles className="h-6 w-6 group-hover/cta:animate-spin" />
                      </span>
                    </Link>
                  </Button>
                  
                  <p className="text-gray-400 text-sm mt-4">
                    Limited membership slots available • Premium Continental owners preferred
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
