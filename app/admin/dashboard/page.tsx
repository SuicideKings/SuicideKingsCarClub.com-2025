"use client"

import { Button } from "@/components/ui/button"
import AdminNav from "@/components/admin/admin-nav"
import AdminSidebar from "@/components/admin/admin-sidebar"
import MembershipStats from "@/components/admin/membership-stats"
import RecentApplications from "@/components/admin/recent-applications"
import UpcomingRenewals from "@/components/admin/upcoming-renewals"
import { useAuth } from "@/hooks/use-auth"
import { Loader2 } from "lucide-react"

export default function AdminDashboardPage() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
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
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <div className="flex space-x-2">
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                Export Data
              </Button>
              <Button className="bg-white text-black hover:bg-gray-200">New Member</Button>
            </div>
          </div>

          <MembershipStats />

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <RecentApplications />
            <UpcomingRenewals />
          </div>
        </main>
      </div>
    </div>
  )
}
