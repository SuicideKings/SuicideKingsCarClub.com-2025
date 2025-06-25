"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Loader2, Plus, Calendar, MapPin, Users, Clock, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AdminNav from "@/components/admin/admin-nav"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { useAuth } from "@/hooks/use-auth"

interface Event {
  id: number
  title: string
  description: string
  date: string
  time: string
  location: string
  chapter: string
  maxAttendees?: number
  currentAttendees: number
  status: "upcoming" | "ongoing" | "completed" | "cancelled"
  imageUrl?: string
  price?: number
}

export default function EventsPage() {
  const { isLoading: authLoading } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  useEffect(() => {
    if (authLoading) return
    
    // Simulate API call
    setTimeout(() => {
      setEvents([
        {
          id: 1,
          title: "Monthly Car Meet",
          description: "Join us for our monthly car meet at the pier. Bring your ride and enjoy good company!",
          date: "2024-07-15",
          time: "18:00",
          location: "Santa Monica Pier, CA",
          chapter: "Los Angeles",
          maxAttendees: 50,
          currentAttendees: 32,
          status: "upcoming",
          imageUrl: "/images/car-meet.jpg",
          price: 0
        },
        {
          id: 2,
          title: "Track Day at Willow Springs",
          description: "Professional track day for members. Safety gear required.",
          date: "2024-07-22",
          time: "08:00",
          location: "Willow Springs International Raceway",
          chapter: "Los Angeles",
          maxAttendees: 25,
          currentAttendees: 18,
          status: "upcoming",
          imageUrl: "/images/track-day.jpg",
          price: 150
        },
        {
          id: 3,
          title: "BBQ and Cruise",
          description: "Scenic cruise followed by BBQ at the park.",
          date: "2024-06-30",
          time: "12:00",
          location: "Riverside Park",
          chapter: "Inland Empire",
          maxAttendees: 40,
          currentAttendees: 40,
          status: "completed",
          price: 25
        },
        {
          id: 4,
          title: "Charity Car Show",
          description: "Annual charity car show to support local community.",
          date: "2024-08-10",
          time: "10:00",
          location: "Downtown Convention Center",
          chapter: "Los Angeles",
          maxAttendees: 100,
          currentAttendees: 75,
          status: "upcoming",
          price: 20
        }
      ])
      setLoading(false)
    }, 1000)
  }, [authLoading])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-500">Upcoming</Badge>
      case "ongoing":
        return <Badge className="bg-green-500">Ongoing</Badge>
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <AdminNav />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminNav />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Events</h1>
            <Button className="bg-white text-black hover:bg-gray-200" asChild>
              <Link href="/admin/events/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="rounded-lg border border-gray-800 bg-black overflow-hidden"
                  >
                    {event.imageUrl && (
                      <div className="relative h-48">
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/events/${event.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/events/${event.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-300">
                          <Calendar className="mr-2 h-4 w-4" />
                          {new Date(event.date).toLocaleDateString()} at {event.time}
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-300">
                          <MapPin className="mr-2 h-4 w-4" />
                          {event.location}
                        </div>

                        <div className="flex items-center text-sm text-gray-300">
                          <Users className="mr-2 h-4 w-4" />
                          {event.currentAttendees}{event.maxAttendees && `/${event.maxAttendees}`} attendees
                        </div>

                        {event.price !== undefined && (
                          <div className="flex items-center text-sm text-gray-300">
                            <span className="mr-2">💰</span>
                            {event.price === 0 ? "Free" : `$${event.price}`}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        {getStatusBadge(event.status)}
                        <Badge variant="outline" className="text-xs">
                          {event.chapter}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {events.length === 0 && (
                <div className="rounded-lg border border-gray-800 bg-black p-8 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-400 mb-4">No events found</p>
                  <Button className="bg-white text-black hover:bg-gray-200" asChild>
                    <Link href="/admin/events/create">Create Your First Event</Link>
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Stats Cards */}
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-2xl font-bold text-white">{events.length}</p>
                  <p className="text-sm text-gray-400">Total Events</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-2xl font-bold text-blue-400">
                    {events.filter(e => e.status === "upcoming").length}
                  </p>
                  <p className="text-sm text-gray-400">Upcoming</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-2xl font-bold text-green-400">
                    {events.filter(e => e.status === "completed").length}
                  </p>
                  <p className="text-sm text-gray-400">Completed</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-2xl font-bold text-yellow-400">
                    {events.reduce((sum, event) => sum + event.currentAttendees, 0)}
                  </p>
                  <p className="text-sm text-gray-400">Total Attendees</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}