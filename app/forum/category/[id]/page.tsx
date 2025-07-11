"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { 
  MessageSquare, 
  Users, 
  Clock, 
  Eye, 
  Search, 
  PlusCircle, 
  ArrowLeft,
  Pin,
  Lock,
  TrendingUp,
  Filter,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"
import { cn } from "@/lib/utils"

// Mock data - would come from database
const categories = {
  1: { 
    name: "General Discussion", 
    description: "General topics related to the Lincoln Continental and the club",
    slug: "general-discussion"
  },
  2: { 
    name: "Technical Help", 
    description: "Technical questions, repairs, and maintenance discussions",
    slug: "technical-help"
  },
  3: { 
    name: "Parts Exchange", 
    description: "Buy, sell, and trade Lincoln Continental parts",
    slug: "parts-exchange"
  },
  4: { 
    name: "Chapter Discussions", 
    description: "Chapter-specific discussions and announcements",
    slug: "chapter-discussions"
  },
  5: { 
    name: "Events & Meetups", 
    description: "Upcoming events, meetups, and post-event discussions",
    slug: "events-meetups"
  },
  6: { 
    name: "Restoration Projects", 
    description: "Share and discuss your Lincoln Continental restoration projects",
    slug: "restoration-projects"
  },
}

const topicsData = {
  1: [
    {
      id: 1,
      title: "Welcome to the Suicide Kings Forum!",
      author: "Admin",
      authorAvatar: "",
      date: "1 month ago",
      replies: 45,
      views: 1234,
      isPinned: true,
      isLocked: false,
      lastReplyBy: "MichaelR",
      lastReplyTime: "2 hours ago"
    },
    {
      id: 2,
      title: "Forum Rules and Guidelines",
      author: "Admin",
      authorAvatar: "",
      date: "1 month ago",
      replies: 12,
      views: 567,
      isPinned: true,
      isLocked: true,
      lastReplyBy: "JamesW",
      lastReplyTime: "1 day ago"
    },
    {
      id: 3,
      title: "Introduce yourself here!",
      author: "MichaelR",
      authorAvatar: "",
      date: "3 weeks ago",
      replies: 89,
      views: 2341,
      isPinned: false,
      isLocked: false,
      lastReplyBy: "AnthonyG",
      lastReplyTime: "30 minutes ago"
    }
  ],
  2: [
    {
      id: 1,
      title: "Electrical issues with 1964 Continental - Need expert advice",
      author: "JamesW",
      authorAvatar: "",
      date: "5 hours ago",
      replies: 8,
      views: 97,
      isPinned: false,
      isLocked: false,
      lastReplyBy: "TechExpert92",
      lastReplyTime: "2 hours ago"
    },
    {
      id: 2,
      title: "Suicide door adjustment techniques - Complete guide",
      author: "RobertJ",
      authorAvatar: "",
      date: "2 days ago",
      replies: 19,
      views: 245,
      isPinned: true,
      isLocked: false,
      lastReplyBy: "MasterMechanic",
      lastReplyTime: "1 day ago"
    },
    {
      id: 3,
      title: "Engine rebuild tips for 430 V8",
      author: "MikeR",
      authorAvatar: "",
      date: "3 days ago",
      replies: 15,
      views: 189,
      isPinned: false,
      isLocked: false,
      lastReplyBy: "EngineGuru",
      lastReplyTime: "6 hours ago"
    },
    {
      id: 4,
      title: "Transmission fluid recommendations",
      author: "CharlieT",
      authorAvatar: "",
      date: "1 week ago",
      replies: 12,
      views: 156,
      isPinned: false,
      isLocked: true,
      lastReplyBy: "AdminUser",
      lastReplyTime: "3 days ago"
    }
  ]
}

export default function ForumCategoryPage() {
  const params = useParams()
  const categoryId = parseInt(params.id as string)
  const [sortBy, setSortBy] = useState("recent")
  
  const category = categories[categoryId as keyof typeof categories]
  const topics = topicsData[categoryId as keyof typeof topicsData] || []

  if (!category) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center">
        <Card className="bg-black/40 border-gray-700 backdrop-blur-sm max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="text-white text-center">Category Not Found</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              The requested forum category could not be found.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
              <Link href="/forum">Back to Forum</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <MainNav />

      {/* Category Header */}
      <div className="pt-16 border-b border-gray-700">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800" asChild>
              <Link href="/forum">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Forum
              </Link>
            </Button>
            <div className="w-px h-6 bg-gray-600" />
            <nav className="flex items-center gap-2 text-sm text-gray-400">
              <Link href="/forum" className="hover:text-white transition-colors">Forum</Link>
              <span>/</span>
              <span className="text-white">{category.name}</span>
            </nav>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">{category.name}</h1>
              <p className="text-xl text-gray-300 max-w-2xl">{category.description}</p>
              <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {topics.length} topics
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {topics.reduce((acc, topic) => acc + topic.views, 0)} views
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  Active community
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search this category..."
                  className="w-full sm:w-64 rounded-lg border border-gray-600 bg-black/40 backdrop-blur-sm px-10 py-2 text-white placeholder:text-gray-400 focus:border-red-500 focus:outline-none transition-colors"
                />
              </div>
              <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-200" asChild>
                <Link href={`/forum/category/${categoryId}/new-topic`}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  New Topic
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Topics Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Topics List */}
          <div className="lg:col-span-3">
            {/* Sort Controls */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Topics</h2>
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                      <Filter className="w-4 h-4 mr-2" />
                      Sort by {sortBy}
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-black/90 border-gray-700 backdrop-blur-xl">
                    <DropdownMenuItem onClick={() => setSortBy("recent")} className="text-white hover:bg-white/10">
                      Recent Activity
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("popular")} className="text-white hover:bg-white/10">
                      Most Popular
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy("newest")} className="text-white hover:bg-white/10">
                      Newest
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Topics */}
            <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
              <CardContent className="p-0">
                {topics.length === 0 ? (
                  <div className="p-12 text-center">
                    <MessageSquare className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Topics Yet</h3>
                    <p className="text-gray-400 mb-6">Be the first to start a discussion in this category!</p>
                    <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white" asChild>
                      <Link href={`/forum/category/${categoryId}/new-topic`}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create First Topic
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-700">
                    {topics.map((topic) => (
                      <div key={topic.id} className="p-6 hover:bg-white/5 transition-colors group">
                        <Link href={`/forum/topic/${topic.id}`} className="block">
                          <div className="flex items-start gap-4">
                            <Avatar className="w-12 h-12 border border-gray-600">
                              <AvatarFallback className="bg-gradient-to-r from-red-600 to-red-700 text-white font-bold">
                                {topic.author.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className={cn(
                                  "text-lg font-medium group-hover:text-red-400 transition-colors pr-4",
                                  topic.isPinned ? "text-yellow-400" : "text-white"
                                )}>
                                  <div className="flex items-center gap-2">
                                    {topic.isPinned && <Pin className="w-4 h-4" />}
                                    {topic.isLocked && <Lock className="w-4 h-4" />}
                                    {topic.title}
                                  </div>
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-gray-400">
                                  <span className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    {topic.views}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MessageSquare className="w-3 h-3" />
                                    {topic.replies}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  by {topic.author}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {topic.date}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-500">
                                  Last reply by <span className="text-white">{topic.lastReplyBy}</span> • {topic.lastReplyTime}
                                </div>
                                {topic.isPinned && (
                                  <Badge className="bg-yellow-600/20 text-yellow-400 border-yellow-500/30">
                                    Pinned
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category Stats */}
            <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Category Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Topics:</span>
                    <span className="text-white font-medium">{topics.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Replies:</span>
                    <span className="text-white font-medium">{topics.reduce((acc, topic) => acc + topic.replies, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Views:</span>
                    <span className="text-white font-medium">{topics.reduce((acc, topic) => acc + topic.views, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Users:</span>
                    <span className="text-white font-medium">{new Set(topics.map(t => t.author)).size}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Contributors */}
            <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Top Contributors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["RobertJ", "JamesW", "MikeR"].map((user, index) => (
                    <div key={user} className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold">
                        {index + 1}
                      </div>
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gray-700 text-white text-xs">
                          {user.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <Link href={`/forum/user/${user}`} className="text-white hover:text-red-400 transition-colors">
                        {user}
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white" asChild>
                  <Link href={`/forum/category/${categoryId}/new-topic`}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Topic
                  </Link>
                </Button>
                <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800" asChild>
                  <Link href="/forum">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Forum
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}