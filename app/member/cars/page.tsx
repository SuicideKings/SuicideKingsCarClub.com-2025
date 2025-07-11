"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import { useMemberAuth } from "@/hooks/use-member-auth"
import { Car } from "@/lib/types"
import { toast } from "sonner"
import { CarForm } from "@/components/member/cars/car-form"
import { CarCard } from "@/components/member/cars/car-card"
import { EmptyState } from "@/components/empty-state"

export default function CarsPage() {
  const { member, isLoading: authLoading } = useMemberAuth()
  const router = useRouter()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    if (!authLoading && !member) {
      router.push("/member/login")
    }
  }, [authLoading, member, router])

  const fetchCars = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/member/cars", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch cars")
      }

      const { data } = await response.json()
      setCars(data)
    } catch (error) {
      console.error("Error fetching cars:", error)
      toast.error("Failed to load your cars. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddCar = async (carData: Omit<Car, "id" | "memberId">) => {
    try {
      const response = await fetch("/api/member/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(carData),
      })

      if (!response.ok) {
        throw new Error("Failed to add car")
      }

      const { data } = await response.json()
      setCars([...cars, data])
      setShowForm(false)
      toast.success("Car added successfully!")
    } catch (error) {
      console.error("Error adding car:", error)
      toast.error("Failed to add car. Please try again.")
    }
  }

  const handleUpdateCar = async (id: string, carData: Partial<Car>) => {
    try {
      const response = await fetch("/api/member/cars", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id, ...carData }),
      })

      if (!response.ok) {
        throw new Error("Failed to update car")
      }

      const { data } = await response.json()
      setCars(cars.map((car) => (car.id === id ? data : car)))
      toast.success("Car updated successfully!")
    } catch (error) {
      console.error("Error updating car:", error)
      toast.error("Failed to update car. Please try again.")
    }
  }

  const handleDeleteCar = async (id: string) => {
    try {
      const response = await fetch("/api/member/cars", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete car")
      }

      setCars(cars.filter((car) => car.id !== id))
      toast.success("Car removed successfully!")
    } catch (error) {
      console.error("Error deleting car:", error)
      toast.error("Failed to delete car. Please try again.")
    }
  }

  useEffect(() => {
    if (member) {
      fetchCars()
    }
  }, [member])

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Cars</h1>
        <Button onClick={() => setShowForm(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Car
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Car</CardTitle>
          </CardHeader>
          <CardContent>
            <CarForm
              onSubmit={handleAddCar}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {cars.length === 0 && !showForm ? (
        <EmptyState
          title="No cars yet"
          description="Add your first car to get started"
          action={
            <Button onClick={() => setShowForm(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Car
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onUpdate={handleUpdateCar}
              onDelete={handleDeleteCar}
            />
          ))}
        </div>
      )}
    </div>
  )
}
