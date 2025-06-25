"use client"

import { useState, useEffect } from "react"
import { Loader2, Map, MapPin, Plus, Edit, Trash2, Eye, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import AdminNav from "@/components/admin/admin-nav"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { useAuth } from "@/hooks/use-auth"

interface Location {
  id: number
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  latitude: number
  longitude: number
  type: "event" | "chapter" | "meetup" | "track"
  description?: string
  isActive: boolean
  createdDate: string
}

interface Route {
  id: number
  name: string
  startLocation: string
  endLocation: string
  distance: string
  estimatedTime: string
  difficulty: "easy" | "moderate" | "hard"
  isPublic: boolean
  createdBy: string
  waypoints: number
}

export default function MapsPage() {
  const { isLoading: authLoading } = useAuth()
  const [locations, setLocations] = useState<Location[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data for demonstration
  useEffect(() => {
    if (authLoading) return
    
    // Simulate API call
    setTimeout(() => {
      setLocations([
        {
          id: 1,
          name: "Santa Monica Pier",
          address: "200 Santa Monica Pier",
          city: "Santa Monica",
          state: "CA",
          zipCode: "90401",
          latitude: 34.0085,
          longitude: -118.4987,
          type: "meetup",
          description: "Popular meetup spot for LA chapter",
          isActive: true,
          createdDate: "2024-01-15T10:30:00Z"
        },
        {
          id: 2,
          name: "Willow Springs International Raceway",
          address: "25500 The Old Road",
          city: "Rosamond",
          state: "CA",
          zipCode: "93560",
          latitude: 34.6897,
          longitude: -118.2756,
          type: "track",
          description: "Professional racing track for track days",
          isActive: true,
          createdDate: "2024-02-20T14:15:00Z"
        },
        {
          id: 3,
          name: "Downtown LA Chapter HQ",
          address: "123 Main Street",
          city: "Los Angeles",
          state: "CA",
          zipCode: "90012",
          latitude: 34.0522,
          longitude: -118.2437,
          type: "chapter",
          description: "Los Angeles chapter headquarters",
          isActive: true,
          createdDate: "2024-03-10T09:20:00Z"
        },
        {
          id: 4,
          name: "Riverside Park",
          address: "5500 Van Buren Blvd",
          city: "Riverside",
          state: "CA",
          zipCode: "92503",
          latitude: 33.9533,
          longitude: -117.3962,
          type: "event",
          description: "Location for BBQ and family events",
          isActive: false,
          createdDate: "2024-04-05T16:45:00Z"
        }
      ])

      setRoutes([
        {
          id: 1,
          name: "Pacific Coast Highway Cruise",
          startLocation: "Santa Monica Pier",
          endLocation: "Malibu Point",
          distance: "25.3 miles",
          estimatedTime: "45 minutes",
          difficulty: "easy",
          isPublic: true,
          createdBy: "Route Master",
          waypoints: 5
        },
        {
          id: 2,
          name: "Angeles Crest Highway",
          startLocation: "La Cañada Flintridge",
          endLocation: "Wrightwood",
          distance: "66.2 miles",
          estimatedTime: "2 hours",
          difficulty: "hard",
          isPublic: true,
          createdBy: "Mountain Driver",
          waypoints: 12
        },
        {
          id: 3,
          name: "Downtown to Track",
          startLocation: "Downtown LA Chapter HQ",
          endLocation: "Willow Springs Raceway",
          distance: "78.5 miles",
          estimatedTime: "1.5 hours",
          difficulty: "moderate",
          isPublic: false,
          createdBy: "Track Coordinator",
          waypoints: 3
        }
      ])

      setLoading(false)
    }, 1000)
  }, [authLoading])

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "event":
        return <Badge className="bg-blue-500">Event</Badge>
      case "chapter":
        return <Badge className="bg-purple-500">Chapter</Badge>
      case "meetup":
        return <Badge className="bg-green-500">Meetup</Badge>
      case "track":
        return <Badge className="bg-red-500">Track</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return <Badge className="bg-green-500">Easy</Badge>
      case "moderate":
        return <Badge className="bg-yellow-500">Moderate</Badge>
      case "hard":
        return <Badge className="bg-red-500">Hard</Badge>
      default:
        return <Badge variant="outline">{difficulty}</Badge>
    }
  }

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase())
  )

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

  const totalLocations = locations.length
  const activeLocations = locations.filter(l => l.isActive).length
  const totalRoutes = routes.length
  const publicRoutes = routes.filter(r => r.isPublic).length

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminNav />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Maps & Locations</h1>
            <div className="flex space-x-2">
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                <Navigation className="mr-2 h-4 w-4" />
                Create Route
              </Button>
              <Button className="bg-white text-black hover:bg-gray-200">
                <Plus className="mr-2 h-4 w-4" />
                Add Location
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-500/20 p-3">
                  <MapPin className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{totalLocations}</p>
                  <p className="text-sm text-gray-400">Total Locations</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-green-500/20 p-3">
                  <Map className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{activeLocations}</p>
                  <p className="text-sm text-gray-400">Active Locations</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-purple-500/20 p-3">
                  <Navigation className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{totalRoutes}</p>
                  <p className="text-sm text-gray-400">Total Routes</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-yellow-500/20 p-3">
                  <Eye className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{publicRoutes}</p>
                  <p className="text-sm text-gray-400">Public Routes</p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          ) : (
            <Tabs defaultValue="locations" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="locations">Locations</TabsTrigger>
                <TabsTrigger value="routes">Routes</TabsTrigger>
                <TabsTrigger value="map">Map View</TabsTrigger>
              </TabsList>

              <TabsContent value="locations" className="space-y-4">
                {/* Search */}
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1 max-w-sm">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input
                      placeholder="Search locations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-gray-700 bg-gray-800 pl-10 text-white"
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-gray-800 bg-black overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead className="text-gray-300">Name</TableHead>
                        <TableHead className="text-gray-300">Type</TableHead>
                        <TableHead className="text-gray-300">Address</TableHead>
                        <TableHead className="text-gray-300">City, State</TableHead>
                        <TableHead className="text-gray-300">Coordinates</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLocations.map((location) => (
                        <TableRow key={location.id} className="border-gray-800">
                          <TableCell className="text-white font-medium">
                            <div>
                              <div>{location.name}</div>
                              {location.description && (
                                <div className="text-sm text-gray-400">{location.description}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{getTypeBadge(location.type)}</TableCell>
                          <TableCell className="text-gray-300">{location.address}</TableCell>
                          <TableCell className="text-gray-300">{location.city}, {location.state}</TableCell>
                          <TableCell className="text-gray-300 font-mono text-xs">
                            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                          </TableCell>
                          <TableCell>
                            <Badge variant={location.isActive ? "default" : "secondary"}>
                              {location.isActive ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-400">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="routes" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {routes.map((route) => (
                    <Card key={route.id} className="border-gray-800 bg-black">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white">{route.name}</CardTitle>
                          <div className="flex space-x-2">
                            {getDifficultyBadge(route.difficulty)}
                            <Badge variant={route.isPublic ? "default" : "secondary"}>
                              {route.isPublic ? "Public" : "Private"}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-300">
                            <MapPin className="mr-2 h-4 w-4" />
                            From: {route.startLocation}
                          </div>
                          <div className="flex items-center text-sm text-gray-300">
                            <Navigation className="mr-2 h-4 w-4" />
                            To: {route.endLocation}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Distance:</span>
                            <div className="text-white">{route.distance}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Time:</span>
                            <div className="text-white">{route.estimatedTime}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Waypoints:</span>
                            <div className="text-white">{route.waypoints}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Created by:</span>
                            <div className="text-white">{route.createdBy}</div>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-400">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="map" className="space-y-4">
                <Card className="border-gray-800 bg-black">
                  <CardHeader>
                    <CardTitle className="text-white">Interactive Map</CardTitle>
                    <CardDescription className="text-gray-400">
                      View all locations and routes on an interactive map
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-400">
                        <Map className="mx-auto h-16 w-16 mb-4" />
                        <p className="text-lg">Interactive Map Component</p>
                        <p className="text-sm">
                          Integrate with Google Maps, Mapbox, or similar service
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats for Map View */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border-gray-800 bg-black">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Location Types</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {["event", "chapter", "meetup", "track"].map((type) => {
                        const count = locations.filter(l => l.type === type).length
                        return (
                          <div key={type} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getTypeBadge(type)}
                            </div>
                            <span className="text-white">{count}</span>
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>

                  <Card className="border-gray-800 bg-black">
                    <CardHeader>
                      <CardTitle className="text-white text-lg">Route Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Distance:</span>
                        <span className="text-white">169.0 miles</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Avg. Route Time:</span>
                        <span className="text-white">1.3 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Waypoints:</span>
                        <span className="text-white">20</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  )
}