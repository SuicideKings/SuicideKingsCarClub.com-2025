"use client"

import { useState, useEffect } from "react"
import { useMemberAuth } from "@/hooks/use-member-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Car, 
  Calendar, 
  Trophy, 
  Star, 
  TrendingUp, 
  Users, 
  Clock, 
  MapPin, 
  Camera,
  Settings,
  Bell,
  CreditCard,
  Activity,
  Zap,
  Award,
  Target
} from "lucide-react"

export default function MemberDashboard() {
  const { member, isLoading, isAuthenticated } = useMemberAuth()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [membershipProgress, setMembershipProgress] = useState(75)
  const [notifications, setNotifications] = useState(2)
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse" />
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-red-500 border-t-transparent mx-auto mb-6 relative"></div>
          </div>
          <h3 className="text-xl font-semibold mb-2">Loading Your Dashboard</h3>
          <p className="text-gray-400">Preparing your member experience...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !member) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-950 text-white flex items-center justify-center">
        <Card className="bg-black/40 border-red-500/30 backdrop-blur-xl max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-white">Access Required</CardTitle>
            <CardDescription className="text-gray-400">
              Please sign in to access your member dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white w-full transform hover:scale-105 transition-all duration-200"
              onClick={() => (window.location.href = "/auth/signin")}
            >
              <Zap className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-950 text-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-red-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-yellow-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
      
      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="bg-black/20 backdrop-blur-xl border-b border-white/10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-2 border-red-500/50">
                  <AvatarImage src={member.profileImageUrl} />
                  <AvatarFallback className="bg-gradient-to-r from-red-600 to-red-700 text-white text-xl font-bold">
                    {member.name?.charAt(0) || 'M'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Welcome back, {member.name || 'Member'}!
                    </h1>
                    <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white border-none">
                      <Activity className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>Member #{member.id || '001'}</span>
                    <span>•</span>
                    <span className="capitalize">{member.membershipStatus || 'Active'}</span>
                    <span>•</span>
                    <span>Joined {member.joinDate ? new Date(member.joinDate).getFullYear() : '2024'}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
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
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-gray-700 bg-black/20 text-white hover:bg-gray-800 backdrop-blur-sm"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/50 backdrop-blur-sm group hover:scale-105 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">My Cars</CardTitle>
                <Car className="h-4 w-4 text-blue-400 group-hover:animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">3</div>
                <p className="text-xs text-blue-400">2 Continentals, 1 Classic</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-700/50 backdrop-blur-sm group hover:scale-105 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Events Attended</CardTitle>
                <Calendar className="h-4 w-4 text-green-400 group-hover:animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">12</div>
                <p className="text-xs text-green-400">+2 this month</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-700/50 backdrop-blur-sm group hover:scale-105 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Awards Earned</CardTitle>
                <Trophy className="h-4 w-4 text-purple-400 group-hover:animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">5</div>
                <p className="text-xs text-purple-400">Best in Show x2</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-700/50 backdrop-blur-sm group hover:scale-105 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">Club Ranking</CardTitle>
                <Star className="h-4 w-4 text-red-400 group-hover:animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">#7</div>
                <p className="text-xs text-red-400">Top 10% member</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Membership Progress */}
              <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Target className="w-5 h-5 text-red-500" />
                        Membership Progress
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Your journey as a Suicide Kings member
                      </CardDescription>
                    </div>
                    <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                      {membershipProgress}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Progress value={membershipProgress} className="h-3" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-gray-300">Profile Complete</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                        <span className="text-gray-300">Cars Registered</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <span className="text-gray-300">First Event Attended</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3].map((event) => (
                      <div key={event} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group">
                        <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                          {15 + event}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">Summer Show & Shine</h4>
                          <p className="text-sm text-gray-400">Los Angeles, CA • June {15 + event}, 2025</p>
                        </div>
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-auto py-4 flex-col group">
                      <Car className="w-6 h-6 mb-2 group-hover:animate-bounce" />
                      <span className="text-sm">Add Car</span>
                    </Button>
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 h-auto py-4 flex-col group">
                      <Camera className="w-6 h-6 mb-2 group-hover:animate-pulse" />
                      <span className="text-sm">Upload Photo</span>
                    </Button>
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 h-auto py-4 flex-col group">
                      <CreditCard className="w-6 h-6 mb-2 group-hover:animate-pulse" />
                      <span className="text-sm">Billing</span>
                    </Button>
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 h-auto py-4 flex-col group">
                      <Users className="w-6 h-6 mb-2 group-hover:animate-pulse" />
                      <span className="text-sm">Find Members</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: 'Registered for Summer Show', time: '2 hours ago', icon: Calendar },
                      { action: 'Added new car photos', time: '1 day ago', icon: Camera },
                      { action: 'Earned "Showstopper" badge', time: '3 days ago', icon: Award },
                      { action: 'Joined West Coast Chapter', time: '1 week ago', icon: Users }
                    ].map((activity, index) => {
                      const IconComponent = activity.icon
                      return (
                        <div key={index} className="flex items-center gap-3 text-sm">
                          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                            <IconComponent className="w-4 h-4 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-300">{activity.action}</p>
                            <p className="text-gray-500 text-xs">{activity.time}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
