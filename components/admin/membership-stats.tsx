"use client"

import { useState } from "react"
import { ArrowUpRight, ArrowDownRight, Users, UserPlus, UserMinus, DollarSign } from "lucide-react"

// This would typically come from an API
const membershipData = {
  totalMembers: 1243,
  totalMembersChange: 5.2,
  activeMembers: 1156,
  activeMembersChange: 3.8,
  newApplications: 24,
  newApplicationsChange: 12.5,
  pendingRenewals: 37,
  pendingRenewalsChange: -8.3,
  revenueThisMonth: 2450,
  revenueThisMonthChange: 15.2,
}

export default function MembershipStats() {
  const [timeframe, setTimeframe] = useState("month")

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Members */}
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-blue-900/20 p-3">
            <Users className="h-6 w-6 text-blue-500" />
          </div>
          <div className="flex items-center space-x-1">
            <span className={`text-sm ${membershipData.totalMembersChange >= 0 ? "text-green-500" : "text-red-500"}`}>
              {membershipData.totalMembersChange >= 0 ? "+" : ""}
              {membershipData.totalMembersChange}%
            </span>
            {membershipData.totalMembersChange >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>
        <h3 className="mt-4 text-3xl font-bold">{membershipData.totalMembers}</h3>
        <p className="text-sm text-gray-400">Total Members</p>
      </div>

      {/* New Applications */}
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-green-900/20 p-3">
            <UserPlus className="h-6 w-6 text-green-500" />
          </div>
          <div className="flex items-center space-x-1">
            <span
              className={`text-sm ${membershipData.newApplicationsChange >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {membershipData.newApplicationsChange >= 0 ? "+" : ""}
              {membershipData.newApplicationsChange}%
            </span>
            {membershipData.newApplicationsChange >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>
        <h3 className="mt-4 text-3xl font-bold">{membershipData.newApplications}</h3>
        <p className="text-sm text-gray-400">New Applications</p>
      </div>

      {/* Pending Renewals */}
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-yellow-900/20 p-3">
            <UserMinus className="h-6 w-6 text-yellow-500" />
          </div>
          <div className="flex items-center space-x-1">
            <span
              className={`text-sm ${membershipData.pendingRenewalsChange >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {membershipData.pendingRenewalsChange >= 0 ? "+" : ""}
              {membershipData.pendingRenewalsChange}%
            </span>
            {membershipData.pendingRenewalsChange >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>
        <h3 className="mt-4 text-3xl font-bold">{membershipData.pendingRenewals}</h3>
        <p className="text-sm text-gray-400">Pending Renewals</p>
      </div>

      {/* Revenue This Month */}
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
        <div className="flex items-center justify-between">
          <div className="rounded-full bg-purple-900/20 p-3">
            <DollarSign className="h-6 w-6 text-purple-500" />
          </div>
          <div className="flex items-center space-x-1">
            <span
              className={`text-sm ${membershipData.revenueThisMonthChange >= 0 ? "text-green-500" : "text-red-500"}`}
            >
              {membershipData.revenueThisMonthChange >= 0 ? "+" : ""}
              {membershipData.revenueThisMonthChange}%
            </span>
            {membershipData.revenueThisMonthChange >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>
        <h3 className="mt-4 text-3xl font-bold">${membershipData.revenueThisMonth}</h3>
        <p className="text-sm text-gray-400">Revenue This {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}</p>
      </div>
    </div>
  )
}
