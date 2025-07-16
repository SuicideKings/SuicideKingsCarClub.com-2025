"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  Search, 
  Plus, 
  MoreHorizontal,
  Mail,
  Calendar,
  Shield,
  UserCheck,
  UserX
} from "lucide-react"

export default function AdminMembersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading members
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
              Member Management
            </h1>
            <p className="text-gray-400 mt-2">
              Manage club members, applications, and renewals
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-black/40 border border-gray-700 backdrop-blur-sm">
          <TabsTrigger value="all" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <Users className="w-4 h-4 mr-2" />
            All Members
          </TabsTrigger>
          <TabsTrigger value="active" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <UserCheck className="w-4 h-4 mr-2" />
            Active
          </TabsTrigger>
          <TabsTrigger value="pending" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <Calendar className="w-4 h-4 mr-2" />
            Pending
          </TabsTrigger>
          <TabsTrigger value="expired" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <UserX className="w-4 h-4 mr-2" />
            Expired
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/40 border-gray-700 text-white"
            />
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">All Members</CardTitle>
              <CardDescription className="text-gray-400">
                Complete list of club members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">Member management system coming soon...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Features will include member profiles, status tracking, and bulk actions
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Active Members</CardTitle>
              <CardDescription className="text-gray-400">
                Currently active club members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <UserCheck className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <p className="text-gray-400">Active members tracking coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Pending Applications</CardTitle>
              <CardDescription className="text-gray-400">
                Membership applications awaiting approval
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                <p className="text-gray-400">Application review system coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expired" className="space-y-4">
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Expired Memberships</CardTitle>
              <CardDescription className="text-gray-400">
                Members with expired memberships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <UserX className="w-16 h-16 mx-auto text-red-500 mb-4" />
                <p className="text-gray-400">Expired membership tracking coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}