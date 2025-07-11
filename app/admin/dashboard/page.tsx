"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminNav from "@/components/admin/admin-nav"
import AdminSidebar from "@/components/admin/admin-sidebar"
import MembershipStats from "@/components/admin/membership-stats"
import RecentApplications from "@/components/admin/recent-applications"
import UpcomingRenewals from "@/components/admin/upcoming-renewals"
import { useAuth } from "@/hooks/use-auth"
import { 
  Loader2, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Activity,
  Bell,
  Download,
  Plus,
  BarChart3,
  PieChart,
  Settings,
  Sparkles
} from "lucide-react"

export default function AdminDashboardPage() {
  const { isLoading } = useAuth()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [notifications, setNotifications] = useState(3)
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
            <Loader2 className="h-12 w-12 animate-spin text-red-500 relative" />
          </div>
          <p className="mt-4 text-gray-300 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <AdminNav />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {/* Enhanced Header with Real-time Info */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Admin Dashboard
                  </h1>
                  <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white border-none">
                    <Activity className="w-3 h-3 mr-1" />
                    Live
                  </Badge>
                </div>
                <p className="text-gray-400">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="relative border-gray-700 bg-black/20 text-white hover:bg-gray-800 backdrop-blur-sm"
                >
                  <Bell className="w-4 h-4" />
                  {notifications > 0 && (
                    <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                      {notifications}
                    </Badge>
                  )}
                </Button>
                
                {/* Quick Actions */}
                <Button 
                  variant="outline" 
                  className="border-gray-700 bg-black/20 text-white hover:bg-gray-800 backdrop-blur-sm group"
                >
                  <Download className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                  Export Data
                </Button>
                <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-200 group">
                  <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                  New Member
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Stats Dashboard */}
          <div className="mb-8">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-black/40 border border-gray-700 backdrop-blur-sm">
                <TabsTrigger value="overview" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  <PieChart className="w-4 h-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="settings" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                {/* Quick Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/50 backdrop-blur-sm group hover:scale-105 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Total Members</CardTitle>
                      <Users className="h-4 w-4 text-blue-400 group-hover:animate-pulse" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">1,234</div>
                      <div className="flex items-center text-xs text-blue-400">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +12% from last month
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-700/50 backdrop-blur-sm group hover:scale-105 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Monthly Revenue</CardTitle>
                      <DollarSign className="h-4 w-4 text-green-400 group-hover:animate-pulse" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">$12,456</div>
                      <div className="flex items-center text-xs text-green-400">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +8% from last month
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-700/50 backdrop-blur-sm group hover:scale-105 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Events This Month</CardTitle>
                      <Calendar className="h-4 w-4 text-purple-400 group-hover:animate-pulse" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">8</div>
                      <div className="flex items-center text-xs text-purple-400">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +3 more than last month
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-700/50 backdrop-blur-sm group hover:scale-105 transition-all duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-300">Active Subscriptions</CardTitle>
                      <Sparkles className="h-4 w-4 text-red-400 group-hover:animate-pulse" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">987</div>
                      <div className="flex items-center text-xs text-red-400">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +5% from last month
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <MembershipStats />

                <div className="grid gap-8 lg:grid-cols-2">
                  <RecentApplications />
                  <UpcomingRenewals />
                </div>
              </TabsContent>
              
              <TabsContent value="analytics">
                <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Advanced Analytics</CardTitle>
                    <CardDescription className="text-gray-400">
                      Detailed insights and performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-12">
                    <PieChart className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                    <p className="text-gray-400">Advanced analytics dashboard coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Dashboard Settings</CardTitle>
                    <CardDescription className="text-gray-400">
                      Customize your dashboard experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-12">
                    <Settings className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                    <p className="text-gray-400">Settings panel coming soon...</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}
