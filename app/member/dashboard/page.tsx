"use client"

import { useMemberAuth } from "@/hooks/use-member-auth"
import { Button } from "@/components/ui/button"

export default function MemberDashboard() {
  const { member, isLoading, isAuthenticated } = useMemberAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !member) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Please sign in to access your dashboard.</p>
          <Button onClick={() => (window.location.href = "/auth/signin")}>Sign In</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Rest of the dashboard content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {member.firstName}!</h1>
          <p className="text-gray-400">
            Member #{member.memberNumber} • {member.membershipStatus}
          </p>
        </div>

        {/* Dashboard content continues... */}
      </div>
    </div>
  )
}
