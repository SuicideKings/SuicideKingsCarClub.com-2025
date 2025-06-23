"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Car, Edit, Trash2, Eye, Camera, Star } from "lucide-react"

interface MemberCar {
  id: number
  year: number
  make: string
  model: string
  trim?: string
  color: string
  vin?: string
  engineType?: string
  transmission?: string
  modifications?: string
  purchaseDate?: string
  purchasePrice?: number
  currentValue?: number
  mileage?: number
  condition: string
  story?: string
  isPrimary: boolean
  isPublic: boolean
  photos: Array<{
    id: number
    imageUrl: string
    thumbnailUrl?: string
    caption?: string
    isPrimary: boolean
  }>
}

export default function MemberCarsPage() {
  const { data: session, status } = useSession()
  const [cars, setCars] = useState<MemberCar[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (status === "authenticated") {
      fetchCars()
    }
  }, [status])

  const fetchCars = async () => {
    try {
      const response = await fetch("/api/member/cars")
      if (response.ok) {
        const data = await response.json()
        setCars(data)
      }
    } catch (error) {
      console.error("Error fetching cars:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteCar = async (carId: number) => {
    if (!confirm("Are you sure you want to delete this car?")) return

    try {
      const response = await fetch(`/api/member/cars/${carId}`, {
        method: "DELETE",
      })
      if (response.ok) {
        setCars(cars.filter((car) => car.id !== carId))
      }
    } catch (error) {
      console.error("Error deleting car:", error)
    }
  }

  const setPrimaryCar = async (carId: number) => {
    try {
      const response = await fetch(`/api/member/cars/${carId}/primary`, {
        method: "POST",
      })
      if (response.ok) {
        setCars(
          cars.map((car) => ({
            ...car,
            isPrimary: car.id === carId,
          })),
        )
      }
    } catch (error) {
      console.error("Error setting primary car:", error)
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-4">Please sign in to access your garage.</p>
          <Link href="/auth/signin">
            <Button className="bg-red-700 hover:bg-red-800">Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Garage</h1>
              <p className="text-gray-400">Manage your car collection</p>
            </div>
            <Button className="bg-red-700 hover:bg-red-800" asChild>
              <Link href="/member/cars/add">
                <Plus className="w-4 h-4 mr-2" />
                Add Car
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {cars.length === 0 ? (
          <div className="text-center py-16">
            <Car className="w-24 h-24 mx-auto mb-6 text-gray-600" />
            <h2 className="text-2xl font-bold mb-4">No Cars Yet</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Start building your garage by adding your first car. Show off your ride to other club members!
            </p>
            <Button className="bg-red-700 hover:bg-red-800" asChild>
              <Link href="/member/cars/add">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Car
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <Card key={car.id} className="bg-gray-900 border-gray-800 overflow-hidden">
                <div className="relative">
                  {car.photos.length > 0 ? (
                    <div className="relative h-48">
                      <Image
                        src={car.photos.find((p) => p.isPrimary)?.imageUrl || car.photos[0].imageUrl}
                        alt={`${car.year} ${car.make} ${car.model}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-800 flex items-center justify-center">
                      <Car className="w-16 h-16 text-gray-600" />
                    </div>
                  )}

                  {car.isPrimary && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-yellow-600 hover:bg-yellow-700">
                        <Star className="w-3 h-3 mr-1" />
                        Primary
                      </Badge>
                    </div>
                  )}

                  <div className="absolute top-2 right-2">
                    <Badge variant={car.isPublic ? "default" : "secondary"}>
                      {car.isPublic ? "Public" : "Private"}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>
                      {car.year} {car.make} {car.model}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {car.trim && `${car.trim} • `}
                    {car.color}
                    {car.mileage && ` • ${car.mileage.toLocaleString()} miles`}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-3">
                    {car.condition && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Condition:</span>
                        <span className="capitalize">{car.condition}</span>
                      </div>
                    )}

                    {car.currentValue && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Est. Value:</span>
                        <span>${car.currentValue.toLocaleString()}</span>
                      </div>
                    )}

                    {car.story && <p className="text-sm text-gray-400 line-clamp-2">{car.story}</p>}

                    <div className="flex space-x-2 pt-4">
                      <Button size="sm" variant="outline" className="flex-1 border-gray-700 hover:bg-gray-800" asChild>
                        <Link href={`/member/cars/${car.id}`}>
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-700 hover:bg-gray-800" asChild>
                        <Link href={`/member/cars/${car.id}/edit`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-700 hover:bg-gray-800" asChild>
                        <Link href={`/member/cars/${car.id}/photos`}>
                          <Camera className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>

                    <div className="flex space-x-2">
                      {!car.isPrimary && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex-1 text-yellow-400 hover:bg-yellow-400/10"
                          onClick={() => setPrimaryCar(car.id)}
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Set as Primary
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:bg-red-400/10"
                        onClick={() => deleteCar(car.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
