"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Calendar, 
  Search, 
  Plus, 
  Clock,
  MapPin,
  Users,
  Settings,
  Eye
} from "lucide-react"

export default function AdminEventsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading events
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Event Management
            </h1>
            <p className="text-gray-400 mt-2">
              Create and manage club events, meetups, and activities
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-black/40 border border-gray-700 backdrop-blur-sm">
          <TabsTrigger value="all" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <Calendar className="w-4 h-4 mr-2" />
            All Events
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <Clock className="w-4 h-4 mr-2" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="past" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <Eye className="w-4 h-4 mr-2" />
            Past Events
          </TabsTrigger>
          <TabsTrigger value="registrations" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <Users className="w-4 h-4 mr-2" />
            Registrations
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/40 border-gray-700 text-white"
            />
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">All Events</CardTitle>
              <CardDescription className="text-gray-400">
                Complete list of club events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">Event management system coming soon...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Features will include event creation, scheduling, and registration tracking
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Upcoming Events</CardTitle>
              <CardDescription className="text-gray-400">
                Events scheduled for the future
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Clock className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                <p className="text-gray-400">Upcoming events tracking coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Past Events</CardTitle>
              <CardDescription className="text-gray-400">
                Historical events and archived content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Eye className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">Event history tracking coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registrations" className="space-y-4">
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Event Registrations</CardTitle>
              <CardDescription className="text-gray-400">
                Manage event registrations and attendance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <p className="text-gray-400">Registration management coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}