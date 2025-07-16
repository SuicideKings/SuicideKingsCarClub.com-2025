"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Map } from "lucide-react"

export default function AdminMapsPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Maps & Locations
        </h1>
        <p className="text-gray-400 mt-2">
          Manage chapter locations and event venues
        </p>
      </div>

      <Card className="bg-black/40 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Location Management</CardTitle>
          <CardDescription className="text-gray-400">
            Coming soon - comprehensive location and mapping system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Map className="w-16 h-16 mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">Maps and location management coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}