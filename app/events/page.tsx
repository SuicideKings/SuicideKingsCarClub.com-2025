import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Clock, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"

// This would typically come from a database
const events = [
  {
    id: 1,
    name: "Summer Cruise",
    date: "June 10, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Los Angeles, CA",
    description:
      "Join us for our annual summer cruise through the scenic coastal highways. This event brings together Continental enthusiasts from all chapters for a day of driving, socializing, and enjoying these classic automobiles.",
    chapter: "SKLA",
    chapterName: "Los Angeles",
    image: "/images/events/summer-cruise.jpg",
    featured: false,
  },
  {
    id: 2,
    name: "Annual Show & Shine",
    date: "June 15, 2025",
    time: "9:00 AM - 6:00 PM",
    location: "San Diego, CA",
    description:
      "Our biggest event of the year featuring Continental classics from all chapters. This prestigious show attracts enthusiasts and spectators from across the country to admire these iconic vehicles.",
    chapter: "SKLA",
    chapterName: "Los Angeles",
    image: "/images/events/show-shine.jpg",
    featured: true,
  },
  {
    id: 3,
    name: "Fall Road Trip",
    date: "June 20, 2025",
    time: "8:00 AM - 7:00 PM",
    location: "San Francisco, CA",
    description:
      "A weekend getaway featuring scenic drives and exclusive gatherings. Experience the beauty of Northern California while showcasing your Continental among fellow enthusiasts.",
    chapter: "SKNC",
    chapterName: "Northern California",
    image: "/images/events/fall-road-trip.jpg",
    featured: false,
  },
  {
    id: 4,
    name: "Inland Empire Monthly Meet",
    date: "July 5, 2025",
    time: "10:00 AM - 2:00 PM",
    location: "Riverside, CA",
    description:
      "Regular monthly gathering of the Inland Empire chapter. All members are encouraged to attend for updates, socializing, and planning upcoming activities.",
    chapter: "SKIE",
    chapterName: "Inland Empire",
    image: "/images/events/ie-monthly-meet.jpg",
    featured: false,
  },
  {
    id: 5,
    name: "Washington Chapter Cruise",
    date: "July 12, 2025",
    time: "11:00 AM - 5:00 PM",
    location: "Seattle, WA",
    description:
      "Explore the scenic routes of Washington state with fellow Continental enthusiasts. This cruise showcases the beauty of the Pacific Northwest from behind the wheel of these classic automobiles.",
    chapter: "SKWA",
    chapterName: "Washington",
    image: "/images/events/wa-cruise.jpg",
    featured: false,
  },
  {
    id: 6,
    name: "Desert Run",
    date: "July 19, 2025",
    time: "7:00 AM - 2:00 PM",
    location: "Palm Springs, CA",
    description:
      "Early morning cruise through the desert landscapes of the Coachella Valley. Beat the heat with this early start time and enjoy the stunning desert scenery.",
    chapter: "SKCV",
    chapterName: "Coachella Valley",
    image: "/images/events/desert-run.jpg",
    featured: false,
  },
]

export default function EventsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      {/* Page Header */}
      <div className="relative pt-16">
        <div className="absolute inset-0 z-0">
          <div className="h-64 w-full bg-black">
            <Image
              src="/images/events/events-header.jpg"
              alt="Lincoln Continental Events"
              fill
              className="object-cover opacity-50"
            />
          </div>
        </div>
        <div className="container relative z-10 mx-auto px-4 py-24 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold">Upcoming Events</h1>
          <p className="mx-auto max-w-2xl text-lg">
            Join us at our upcoming events and connect with fellow Lincoln Continental enthusiasts.
          </p>
        </div>
      </div>

      {/* Events Filters */}
      <div className="bg-gray-900 py-6 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <span className="font-medium">Filter Events:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800">
                All Events
              </Button>
              <Button variant="outline" size="sm" className="border-gray-700 bg-gray-800">
                Featured
              </Button>
              <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800">
                Inland Empire
              </Button>
              <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800">
                Los Angeles
              </Button>
              <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800">
                Washington
              </Button>
              <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800">
                Coachella Valley
              </Button>
              <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800">
                Northern California
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Event */}
      {events
        .filter((event) => event.featured)
        .map((featuredEvent) => (
          <section key={featuredEvent.id} className="bg-gradient-to-r from-red-900 to-black py-12 text-white">
            <div className="container mx-auto px-4">
              <div className="rounded-lg border-2 border-gray-700 bg-black/50 p-1">
                <div className="grid overflow-hidden rounded-lg md:grid-cols-2">
                  <div className="relative aspect-video md:aspect-auto">
                    <Image
                      src={featuredEvent.image || "/placeholder.svg"}
                      alt={featuredEvent.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-6 md:p-8">
                    <div className="mb-4 inline-block rounded bg-red-800 px-3 py-1 text-sm font-bold uppercase tracking-wider">
                      Featured Event
                    </div>
                    <h2 className="mb-4 text-3xl font-bold">{featuredEvent.name}</h2>
                    <div className="mb-6 space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span>{featuredEvent.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <span>{featuredEvent.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <span>{featuredEvent.location}</span>
                      </div>
                    </div>
                    <p className="mb-6 text-gray-300">{featuredEvent.description}</p>
                    <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                      <Button className="bg-red-700 text-white hover:bg-red-800" asChild>
                        <Link href={`/events/${featuredEvent.id}/tickets`}>Buy Tickets</Link>
                      </Button>
                      <Button
                        variant="outline"
                        className="border-gray-400 bg-transparent text-white hover:bg-white/10"
                        asChild
                      >
                        <Link href={`/events/${featuredEvent.id}`}>Event Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}

      {/* All Events */}
      <section className="bg-black py-16 text-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-2xl font-bold">All Upcoming Events</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events
              .filter((event) => !event.featured)
              .map((event) => (
                <div key={event.id} className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900">
                  <div className="relative aspect-video">
                    <Image src={event.image || "/placeholder.svg"} alt={event.name} fill className="object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                      <span className="inline-block rounded bg-gray-800 px-2 py-1 text-xs font-medium">
                        {event.chapterName} Chapter
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="mb-2 text-xl font-bold">{event.name}</h3>
                    <div className="mb-4 space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <p className="mb-4 line-clamp-3 text-sm text-gray-400">{event.description}</p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-700 bg-transparent text-white hover:bg-gray-800"
                        asChild
                      >
                        <Link href={`/events/${event.id}`}>Details</Link>
                      </Button>
                      <Button size="sm" className="bg-white text-black hover:bg-gray-200" asChild>
                        <Link href={`/events/${event.id}/tickets`}>Tickets</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Past Events */}
      <section className="bg-gray-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-2xl font-bold">Past Events</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((id) => (
              <div key={id} className="overflow-hidden rounded-lg border border-gray-800 bg-black">
                <div className="relative aspect-video">
                  <Image
                    src={`/images/events/past-event-${id}.jpg`}
                    alt={`Past Event ${id}`}
                    fill
                    className="object-cover grayscale"
                  />
                </div>
                <div className="p-4">
                  <h3 className="mb-1 text-lg font-bold">Past Event {id}</h3>
                  <p className="mb-2 text-xs text-gray-400">May {id * 5}, 2025</p>
                  <Link href={`/gallery?event=${id}`} className="text-sm text-white underline-offset-4 hover:underline">
                    View Photos
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button variant="outline" className="border-gray-400 bg-transparent text-white hover:bg-gray-800" asChild>
              <Link href="/events/archive">View All Past Events</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Calendar Download */}
      <section className="bg-black py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-lg border border-gray-800 bg-gray-900 p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold">Never Miss an Event</h2>
            <p className="mb-6">
              Download our events calendar to stay updated with all upcoming Suicide Kings Car Club gatherings.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button className="bg-white text-black hover:bg-gray-200">
                <Calendar className="mr-2 h-4 w-4" />
                Add to Google Calendar
              </Button>
              <Button variant="outline" className="border-gray-400 bg-transparent text-white hover:bg-gray-800">
                <Calendar className="mr-2 h-4 w-4" />
                Download iCal
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
