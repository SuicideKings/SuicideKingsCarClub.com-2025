import { Button } from "@/components/ui/button"
import Link from "next/link"

const upcomingEvents = [
  {
    id: 1,
    name: "Summer Cruise",
    date: "June 10, 2025",
    location: "Los Angeles, CA",
    description: "Join us for our annual summer cruise through the scenic coastal highways.",
  },
  {
    id: 2,
    name: "Annual Show & Shine",
    date: "June 15, 2025",
    location: "San Diego, CA",
    description: "Our biggest event of the year featuring Continental classics from all chapters.",
  },
  {
    id: 3,
    name: "Fall Road Trip",
    date: "June 20, 2025",
    location: "San Francisco, CA",
    description: "A weekend getaway featuring scenic drives and exclusive gatherings.",
  },
]

export default function EventsList() {
  return (
    <div className="space-y-6">
      {upcomingEvents.map((event) => (
        <div key={event.id} className="rounded-lg border border-gray-800 bg-gray-900 p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-2xl font-bold">{event.name}</h3>
              <p className="text-gray-400">
                {event.date} • {event.location}
              </p>
              <p className="mt-2 text-sm text-gray-300">{event.description}</p>
            </div>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-4 sm:space-y-0">
              {/* Fixed button styling for better contrast */}
              <Button variant="outline" className="border-gray-400 bg-transparent text-white hover:bg-gray-800" asChild>
                <Link href={`/events/${event.id}`}>Event Details</Link>
              </Button>
              <Button className="bg-white text-black hover:bg-gray-200" asChild>
                <Link href={`/events/${event.id}/tickets`}>RSVP Now</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
      <div className="mt-8 text-center">
        <Button variant="outline" className="border-gray-400 bg-transparent text-white hover:bg-gray-800" asChild>
          <Link href="/events">View All Events</Link>
        </Button>
      </div>
    </div>
  )
}
