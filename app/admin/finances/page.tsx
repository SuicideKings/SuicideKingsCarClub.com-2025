"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard } from "lucide-react"

export default function AdminFinancesPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Financial Management
        </h1>
        <p className="text-gray-400 mt-2">
          Track revenue, expenses, and financial reports
        </p>
      </div>

      <Card className="bg-black/40 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Financial Dashboard</CardTitle>
          <CardDescription className="text-gray-400">
            Coming soon - comprehensive financial management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">Financial management system coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}