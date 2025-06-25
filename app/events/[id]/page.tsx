import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, MapPin, Clock, Users, Car, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import Footer from "@/components/footer"

interface EventPageProps {
  params: Promise<{ id: string }>
}

// Event data - in a real app, this would come from a database
const events: Record<string, {
  id: number
  name: string
  date: string
  time: string
  location: string
  description: string
  fullDescription: string
  chapter: string
  chapterName: string
  image: string
  price: string
  capacity: number
  registered: number
  highlights: string[]
  schedule: { time: string; activity: string }[]
}> = {
  "1": {
    id: 1,
    name: "Summer Cruise",
    date: "June 10, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Los Angeles, CA",
    description: "Join us for our annual summer cruise through the scenic coastal highways.",
    fullDescription: "Experience the beauty of Southern California's coastline while showcasing your Lincoln Continental. This annual event brings together Continental enthusiasts from all chapters for a day of driving, socializing, and enjoying these classic automobiles. The route includes stops at scenic overlooks, classic car-friendly restaurants, and photo opportunities.",
    chapter: "SKLA",
    chapterName: "Los Angeles",
    image: "/images/events/summer-cruise.jpg",
    price: "$25.00",
    capacity: 50,
    registered: 32,
    highlights: [
      "Scenic coastal highway driving",
      "Professional photography opportunities",
      "Lunch at a historic venue",
      "Continental showcase and awards",
      "All chapters welcome"
    ],
    schedule: [
      { time: "10:00 AM", activity: "Registration and welcome coffee" },
      { time: "10:30 AM", activity: "Safety briefing and route overview" },
      { time: "11:00 AM", activity: "Cruise departure - coastal route" },
      { time: "1:00 PM", activity: "Lunch stop at historic pier restaurant" },
      { time: "2:30 PM", activity: "Group photos and vehicle showcase" },
      { time: "3:30 PM", activity: "Return journey and closing remarks" }
    ]
  },
  "2": {
    id: 2,
    name: "Annual Show & Shine",
    date: "June 15, 2025",
    time: "9:00 AM - 6:00 PM",
    location: "San Diego, CA",
    description: "Our biggest event of the year featuring Continental classics from all chapters.",
    fullDescription: "The Annual Show & Shine is the premier event of the Suicide Kings Car Club calendar. This prestigious show attracts enthusiasts and spectators from across the country to admire these iconic vehicles. Awards are given in multiple categories, and vendors showcase Continental-specific parts and accessories.",
    chapter: "SKLA",
    chapterName: "Los Angeles",
    image: "/images/events/show-shine.jpg",
    price: "$40.00",
    capacity: 100,
    registered: 78,
    highlights: [
      "Award categories for every Continental year",
      "Vendor marketplace with rare parts",
      "Expert judging panel",
      "Live music and entertainment",
      "Food trucks and refreshments"
    ],
    schedule: [
      { time: "9:00 AM", activity: "Vehicle registration and positioning" },
      { time: "10:00 AM", activity: "Show opens to public" },
      { time: "11:00 AM", activity: "Judging begins" },
      { time: "12:30 PM", activity: "Lunch break" },
      { time: "2:00 PM", activity: "Technical seminars" },
      { time: "4:00 PM", activity: "Awards ceremony" },
      { time: "5:30 PM", activity: "Group photo and closing" }
    ]
  },
  "3": {
    id: 3,
    name: "Fall Road Trip",
    date: "June 20, 2025",
    time: "8:00 AM - 7:00 PM",
    location: "San Francisco, CA",
    description: "A weekend getaway featuring scenic drives and exclusive gatherings.",
    fullDescription: "Experience the beauty of Northern California while showcasing your Continental among fellow enthusiasts. This multi-day event includes scenic drives through wine country, exclusive access to private collections, and gatherings at premium venues.",
    chapter: "SKNC",
    chapterName: "Northern California",
    image: "/images/events/fall-road-trip.jpg",
    price: "$75.00",
    capacity: 30,
    registered: 24,
    highlights: [
      "Wine country scenic routes",
      "Private collection tours",
      "Premium venue gatherings",
      "Multi-day adventure",
      "Photography workshops"
    ],
    schedule: [
      { time: "8:00 AM", activity: "Departure from San Francisco" },
      { time: "10:00 AM", activity: "First scenic stop and photos" },
      { time: "12:00 PM", activity: "Wine country lunch" },
      { time: "2:00 PM", activity: "Private collection visit" },
      { time: "4:00 PM", activity: "Scenic drive through valleys" },
      { time: "6:00 PM", activity: "Dinner at historic inn" }
    ]
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params
  const event = events[id]

  if (!event) {
    notFound()
  }

  const availableSpots = event.capacity - event.registered

  return (
    <div className="pt-28 bg-black text-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <Image
            src={event.image}
            alt={event.name}
            fill
            className="object-cover brightness-[0.4]"
            priority
            sizes="100vw"
          />
        </div>
        <div className="z-10 text-center text-white max-w-4xl px-4">
          <div className="mb-4 inline-block rounded bg-red-800 px-3 py-1 text-sm font-bold uppercase tracking-wider">
            {event.chapterName} Chapter
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {event.name}
          </h1>
          <p className="text-lg sm:text-xl mb-8">
            {event.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-red-700 hover:bg-red-800" asChild>
              <Link href={`/events/${event.id}/tickets`}>Register Now - {event.price}</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-gray-400 hover:bg-white/10" asChild>
              <Link href="/events">Back to Events</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Event Details */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Event Info */}
              <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
                <h2 className="text-2xl font-bold mb-6 text-red-400">Event Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-red-400" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-gray-300">{event.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-red-400" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-gray-300">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-red-400" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-gray-300">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="h-5 w-5 text-red-400" />
                    <div>
                      <p className="font-medium">Price</p>
                      <p className="text-gray-300">{event.price}</p>
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">{event.fullDescription}</p>
              </div>

              {/* Event Highlights */}
              <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
                <h2 className="text-2xl font-bold mb-6 text-red-400">Event Highlights</h2>
                <ul className="space-y-3">
                  {event.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-3">•</span>
                      <span className="text-gray-300">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Schedule */}
              <div className="bg-gray-900 rounded-lg p-8 border border-gray-800">
                <h2 className="text-2xl font-bold mb-6 text-red-400">Event Schedule</h2>
                <div className="space-y-4">
                  {event.schedule.map((item, index) => (
                    <div key={index} className="flex items-start space-x-4 border-b border-gray-700 pb-4 last:border-b-0 last:pb-0">
                      <div className="font-mono text-red-400 min-w-[80px]">{item.time}</div>
                      <div className="text-gray-300">{item.activity}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Registration Card */}
              <div className="bg-gradient-to-b from-red-900 to-black rounded-lg p-6 border border-red-800">
                <h3 className="text-xl font-bold mb-4">Registration</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      Registered
                    </span>
                    <span className="font-bold">{event.registered}/{event.capacity}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-300">
                    {availableSpots > 0 ? `${availableSpots} spots remaining` : 'Event is full'}
                  </p>
                  <Button 
                    className="w-full bg-red-700 hover:bg-red-800" 
                    disabled={availableSpots === 0}
                    asChild
                  >
                    <Link href={`/events/${event.id}/tickets`}>
                      {availableSpots > 0 ? `Register - ${event.price}` : 'Join Waitlist'}
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Car className="h-5 w-5 mr-2 text-red-400" />
                  Requirements
                </h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Valid club membership</li>
                  <li>• Lincoln Continental (1961-1969)</li>
                  <li>• Current vehicle registration</li>
                  <li>• Liability insurance</li>
                </ul>
              </div>

              {/* Contact */}
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-xl font-bold mb-4">Questions?</h3>
                <p className="text-gray-300 mb-4">
                  Contact the {event.chapterName} chapter for more information.
                </p>
                <Button variant="outline" className="w-full border-gray-600 hover:bg-gray-800" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
