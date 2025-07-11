"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"

// This would typically come from a database
const events = {
  "1": {
    id: 1,
    name: "Summer Cruise",
    date: "June 10, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "Los Angeles, CA",
    description: "Join us for our annual summer cruise through the scenic coastal highways.",
    image: "/images/events/summer-cruise.png",
    ticketTypes: [
      {
        id: "standard",
        name: "Standard Ticket",
        price: 25,
        description: "General admission to the event",
        available: true,
      },
      {
        id: "premium",
        name: "Premium Ticket",
        price: 50,
        description: "General admission plus exclusive event merchandise",
        available: true,
      },
      {
        id: "vip",
        name: "VIP Experience",
        price: 100,
        description: "All premium benefits plus VIP parking and exclusive access to VIP lounge",
        available: true,
      },
    ],
    parkingOptions: [
      {
        id: "standard-parking",
        name: "Standard Parking",
        price: 10,
        description: "General parking area",
        available: true,
      },
      {
        id: "premium-parking",
        name: "Premium Parking",
        price: 25,
        description: "Closer parking with shade coverage",
        available: true,
      },
      {
        id: "display-parking",
        name: "Display Parking",
        price: 40,
        description: "Featured parking area to display your Continental",
        available: true,
        requiresVehicleInfo: true,
      },
    ],
  },
  "2": {
    id: 2,
    name: "Annual Show & Shine",
    date: "June 15, 2025",
    time: "9:00 AM - 6:00 PM",
    location: "San Diego, CA",
    description: "Our biggest event of the year featuring Continental classics from all chapters.",
    image: "/images/events/show-shine.png",
    ticketTypes: [
      {
        id: "standard",
        name: "Standard Ticket",
        price: 30,
        description: "General admission to the event",
        available: true,
      },
      {
        id: "premium",
        name: "Premium Ticket",
        price: 60,
        description: "General admission plus exclusive event merchandise",
        available: true,
      },
      {
        id: "vip",
        name: "VIP Experience",
        price: 120,
        description: "All premium benefits plus VIP parking and exclusive access to VIP lounge",
        available: true,
      },
    ],
    parkingOptions: [
      {
        id: "standard-parking",
        name: "Standard Parking",
        price: 15,
        description: "General parking area",
        available: true,
      },
      {
        id: "premium-parking",
        name: "Premium Parking",
        price: 30,
        description: "Closer parking with shade coverage",
        available: true,
      },
      {
        id: "display-parking",
        name: "Display Parking",
        price: 50,
        description: "Featured parking area to display your Continental",
        available: true,
        requiresVehicleInfo: true,
      },
    ],
  },
  "3": {
    id: 3,
    name: "Fall Road Trip",
    date: "June 20, 2025",
    time: "8:00 AM - 7:00 PM",
    location: "San Francisco, CA",
    description: "A weekend getaway featuring scenic drives and exclusive gatherings.",
    image: "/images/events/fall-road-trip.png",
    ticketTypes: [
      {
        id: "standard",
        name: "Standard Ticket",
        price: 35,
        description: "General admission to the event",
        available: true,
      },
      {
        id: "premium",
        name: "Premium Ticket",
        price: 70,
        description: "General admission plus exclusive event merchandise",
        available: true,
      },
      {
        id: "vip",
        name: "VIP Experience",
        price: 140,
        description: "All premium benefits plus VIP parking and exclusive access to VIP lounge",
        available: true,
      },
    ],
    parkingOptions: [
      {
        id: "standard-parking",
        name: "Standard Parking",
        price: 20,
        description: "General parking area",
        available: true,
      },
      {
        id: "premium-parking",
        name: "Premium Parking",
        price: 35,
        description: "Closer parking with shade coverage",
        available: true,
      },
      {
        id: "display-parking",
        name: "Display Parking",
        price: 60,
        description: "Featured parking area to display your Continental",
        available: true,
        requiresVehicleInfo: true,
      },
    ],
  },
}

export default async function EventTicketsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [selectedParking, setSelectedParking] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [vehicleInfo, setVehicleInfo] = useState({
    year: "",
    model: "",
    color: "",
  })

  const event = events[id as keyof typeof events]

  if (!event) {
    return (
      <div className="flex min-h-screen flex-col">
        <MainNav />
        <div className="flex flex-1 items-center justify-center bg-black text-white">
          <div className="text-center">
            <h1 className="mb-4 text-3xl font-bold">Event Not Found</h1>
            <p className="mb-8">The event you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link href="/events">View All Events</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  const selectedTicketOption = event.ticketTypes.find((ticket) => ticket.id === selectedTicket)
  const selectedParkingOption = event.parkingOptions.find((parking) => parking.id === selectedParking)

  const ticketSubtotal = selectedTicketOption ? selectedTicketOption.price * quantity : 0
  const parkingSubtotal = selectedParkingOption ? selectedParkingOption.price : 0
  const total = ticketSubtotal + parkingSubtotal

  const handleCheckout = () => {
    // In a real implementation, this would redirect to a payment processor
    alert(`Processing payment for $${total.toFixed(2)}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      {/* Event Header */}
      <div className="relative pt-16">
        <div className="absolute inset-0 z-0">
          <div className="h-64 w-full bg-black">
            <Image src={event.image || "/placeholder.svg"} alt={event.name} fill className="object-cover opacity-50" />
          </div>
        </div>
        <div className="container relative z-10 mx-auto px-4 py-24 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold">{event.name} Tickets</h1>
          <p className="mx-auto max-w-2xl text-lg">
            {event.date} • {event.location}
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="bg-gray-900 py-4 text-gray-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/events" className="hover:text-white">
              Events
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/events/${event.id}`} className="hover:text-white">
              {event.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white">Tickets</span>
          </div>
        </div>
      </div>

      {/* Ticket Selection */}
      <section className="bg-black py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Ticket Options */}
            <div className="lg:col-span-2">
              <h2 className="mb-6 text-2xl font-bold">Select Tickets</h2>
              <div className="space-y-4">
                {event.ticketTypes.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                      selectedTicket === ticket.id
                        ? "border-white bg-gray-800"
                        : "border-gray-700 bg-gray-900 hover:border-gray-500"
                    }`}
                    onClick={() => setSelectedTicket(ticket.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold">{ticket.name}</h3>
                        <p className="text-gray-300">{ticket.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">${ticket.price}</p>
                        <p className="text-sm text-gray-400">per ticket</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedTicket && (
                <>
                  <h2 className="mb-6 mt-12 text-2xl font-bold">Parking Options</h2>
                  <div className="space-y-4">
                    {event.parkingOptions.map((parking) => (
                      <div
                        key={parking.id}
                        className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                          selectedParking === parking.id
                            ? "border-white bg-gray-800"
                            : "border-gray-700 bg-gray-900 hover:border-gray-500"
                        }`}
                        onClick={() => setSelectedParking(parking.id)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold">{parking.name}</h3>
                            <p className="text-gray-300">{parking.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold">${parking.price}</p>
                            <p className="text-sm text-gray-400">per vehicle</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {selectedParking && event.parkingOptions.find((p) => p.id === selectedParking)?.requiresVehicleInfo && (
                <div className="mt-8 rounded-lg border border-gray-700 bg-gray-900 p-6">
                  <h3 className="mb-4 text-xl font-bold">Vehicle Information</h3>
                  <p className="mb-4 text-gray-300">Please provide details about the vehicle you'll be displaying.</p>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label htmlFor="vehicleYear" className="mb-2 block text-sm font-medium">
                        Year
                      </label>
                      <select
                        id="vehicleYear"
                        className="w-full rounded-md border border-gray-700 bg-black px-4 py-2"
                        value={vehicleInfo.year}
                        onChange={(e) => setVehicleInfo({ ...vehicleInfo, year: e.target.value })}
                      >
                        <option value="">Select Year</option>
                        {[1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969].map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="vehicleModel" className="mb-2 block text-sm font-medium">
                        Model
                      </label>
                      <input
                        type="text"
                        id="vehicleModel"
                        className="w-full rounded-md border border-gray-700 bg-black px-4 py-2"
                        placeholder="Continental"
                        value={vehicleInfo.model}
                        onChange={(e) => setVehicleInfo({ ...vehicleInfo, model: e.target.value })}
                      />
                    </div>
                    <div>
                      <label htmlFor="vehicleColor" className="mb-2 block text-sm font-medium">
                        Color
                      </label>
                      <input
                        type="text"
                        id="vehicleColor"
                        className="w-full rounded-md border border-gray-700 bg-black px-4 py-2"
                        placeholder="Black"
                        value={vehicleInfo.color}
                        onChange={(e) => setVehicleInfo({ ...vehicleInfo, color: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div>
              <div className="sticky top-20 rounded-lg border border-gray-700 bg-gray-900 p-6">
                <h2 className="mb-6 text-2xl font-bold">Order Summary</h2>
                <div className="mb-4">
                  <h3 className="mb-2 text-lg font-bold">{event.name}</h3>
                  <p className="text-gray-300">
                    {event.date} • {event.time}
                  </p>
                  <p className="text-gray-300">{event.location}</p>
                </div>

                {selectedTicket && (
                  <div className="mb-6 border-t border-gray-700 pt-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium">{selectedTicketOption?.name}</p>
                        <div className="mt-2 flex items-center">
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-l-md border border-gray-700 bg-gray-800 text-lg font-bold"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          >
                            -
                          </button>
                          <div className="flex h-8 w-12 items-center justify-center border-y border-gray-700 bg-black">
                            {quantity}
                          </div>
                          <button
                            className="flex h-8 w-8 items-center justify-center rounded-r-md border border-gray-700 bg-gray-800 text-lg font-bold"
                            onClick={() => setQuantity(quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${ticketSubtotal.toFixed(2)}</p>
                        <p className="text-sm text-gray-400">
                          ${selectedTicketOption?.price.toFixed(2)} × {quantity}
                        </p>
                      </div>
                    </div>

                    {selectedParking && (
                      <div className="mb-4 flex items-center justify-between">
                        <p className="font-medium">{selectedParkingOption?.name}</p>
                        <p className="font-medium">${parkingSubtotal.toFixed(2)}</p>
                      </div>
                    )}

                    <div className="border-t border-gray-700 pt-4">
                      <div className="mb-2 flex justify-between text-lg font-bold">
                        <p>Total</p>
                        <p>${total.toFixed(2)}</p>
                      </div>
                    </div>

                    <Button
                      className="mt-6 w-full bg-white text-black hover:bg-gray-200"
                      onClick={handleCheckout}
                      disabled={
                        !selectedTicket ||
                        (selectedParking &&
                          event.parkingOptions.find((p) => p.id === selectedParking)?.requiresVehicleInfo &&
                          (!vehicleInfo.year || !vehicleInfo.model || !vehicleInfo.color))
                      }
                    >
                      Proceed to Checkout
                    </Button>
                  </div>
                )}

                {!selectedTicket && (
                  <div className="rounded-lg border border-gray-700 bg-gray-800 p-4 text-center">
                    <p className="text-gray-300">Please select a ticket type to continue</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
