"use client"

import Image from "next/image"
import Link from "next/link"
import { MessageSquare, Users, Clock, Eye, Search, PlusCircle, TrendingUp, Pin, Sparkles, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"
import { cn } from "@/lib/utils"
import { getForumCategoryUrl } from "@/lib/url-utils"

// This would typically come from a database
const forumCategories = [
  {
    id: 1,
    name: "General Discussion",
    description: "General topics related to the Lincoln Continental and the club",
    topics: 124,
    posts: 1872,
    icon: MessageSquare,
  },
  {
    id: 2,
    name: "Technical Help",
    description: "Technical questions, repairs, and maintenance discussions",
    topics: 256,
    posts: 3541,
    icon: MessageSquare,
  },
  {
    id: 3,
    name: "Parts Exchange",
    description: "Buy, sell, and trade Lincoln Continental parts",
    topics: 189,
    posts: 2103,
    icon: MessageSquare,
  },
  {
    id: 4,
    name: "Chapter Discussions",
    description: "Chapter-specific discussions and announcements",
    topics: 97,
    posts: 1456,
    icon: MessageSquare,
  },
  {
    id: 5,
    name: "Events & Meetups",
    description: "Upcoming events, meetups, and post-event discussions",
    topics: 78,
    posts: 1209,
    icon: MessageSquare,
  },
  {
    id: 6,
    name: "Restoration Projects",
    description: "Share and discuss your Lincoln Continental restoration projects",
    topics: 143,
    posts: 2567,
    icon: MessageSquare,
  },
]

const recentTopics = [
  {
    id: 1,
    title: "Best source for 1967 Continental door hinges?",
    author: "MichaelR",
    date: "2 hours ago",
    replies: 12,
    views: 156,
    category: "Parts Exchange",
  },
  {
    id: 2,
    title: "Electrical issues with 1964 Continental",
    author: "JamesW",
    date: "5 hours ago",
    replies: 8,
    views: 97,
    category: "Technical Help",
  },
  {
    id: 3,
    title: "Photos from the LA Chapter meet last weekend",
    author: "AnthonyG",
    date: "Yesterday",
    replies: 24,
    views: 312,
    category: "Chapter Discussions",
  },
  {
    id: 4,
    title: "Suicide door adjustment techniques",
    author: "RobertJ",
    date: "2 days ago",
    replies: 19,
    views: 245,
    category: "Technical Help",
  },
  {
    id: 5,
    title: "Upcoming Fall Road Trip details",
    author: "PaulJ",
    date: "3 days ago",
    replies: 31,
    views: 478,
    category: "Events & Meetups",
  },
]

export default function ForumPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <MainNav />

      {/* Enhanced Page Header */}
      <div className="relative pt-16 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-32 h-32 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10 bg-gradient-to-r from-black/40 via-gray-900/60 to-black/40 backdrop-blur-xl border-b border-gray-700">
          <div className="container mx-auto px-4 py-16 text-white">
            <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
              <div className="text-center lg:text-left">
                <div className="flex items-center gap-3 mb-4 justify-center lg:justify-start">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-red-700 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white border-none">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Community Hub
                  </Badge>
                </div>
                <h1 className="mb-4 text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Suicide Kings Forum
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl">
                  Connect with fellow Lincoln Continental enthusiasts, share knowledge, and build lasting friendships
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search discussions..."
                    className="w-full sm:w-80 rounded-lg border border-gray-600 bg-black/40 backdrop-blur-sm px-10 py-3 text-white placeholder:text-gray-400 focus:border-red-500 focus:outline-none transition-colors"
                  />
                </div>
                <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-200">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Forum Stats */}
      <div className="py-8 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/50 backdrop-blur-sm group hover:scale-105 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-white mb-1">887</div>
                <div className="text-sm text-blue-400 flex items-center justify-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  Topics
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-900/20 to-green-800/10 border-green-700/50 backdrop-blur-sm group hover:scale-105 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-white mb-1">12,748</div>
                <div className="text-sm text-green-400 flex items-center justify-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  Posts
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-700/50 backdrop-blur-sm group hover:scale-105 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="text-3xl font-bold text-white mb-1">1,243</div>
                <div className="text-sm text-purple-400 flex items-center justify-center gap-1">
                  <Users className="w-3 h-3" />
                  Members
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-red-900/20 to-red-800/10 border-red-700/50 backdrop-blur-sm group hover:scale-105 transition-all duration-300">
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-white mb-1">MichaelR</div>
                <div className="text-sm text-red-400 flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Newest Member
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Forum Content */}
      <section className="flex-1 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Forum Content */}
            <div className="lg:col-span-2">
              {/* Enhanced Categories */}
              <Card className="mb-8 bg-black/40 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-red-500" />
                    Forum Categories
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Explore different discussion topics
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-700">
                    {forumCategories.map((category, index) => (
                      <div key={category.id} className="p-6 hover:bg-white/5 transition-colors group">
                        <Link href={getForumCategoryUrl(category.id)} className="flex items-start gap-4">
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-red-600/20 to-red-700/20 border border-red-500/30 text-red-400 group-hover:scale-110 transition-transform">
                            <category.icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors mb-2">{category.name}</h3>
                            <p className="text-gray-400 mb-3 leading-relaxed">{category.description}</p>
                            <div className="flex gap-6">
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <MessageSquare className="w-3 h-3" />
                                <span>{category.topics} topics</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Users className="w-3 h-3" />
                                <span>{category.posts} posts</span>
                              </div>
                              {index < 2 && (
                                <Badge className="bg-red-600/20 text-red-400 border-red-500/30">
                                  <Flame className="w-3 h-3 mr-1" />
                                  Hot
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Enhanced Recent Topics */}
              <Card className="bg-black/40 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                        Recent Topics
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        Latest discussions in the community
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white" asChild>
                      <Link href="/forum/recent">View All</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-700">
                    {recentTopics.map((topic, index) => (
                      <div key={topic.id} className="p-6 hover:bg-white/5 transition-colors group">
                        <Link href={`/forum/topic/${topic.id}`} className="block">
                          <div className="flex items-start gap-4">
                            <Avatar className="w-10 h-10 border border-gray-600">
                              <AvatarFallback className="bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-bold">
                                {topic.author.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="text-lg font-medium text-white group-hover:text-red-400 transition-colors pr-4">
                                  {topic.title}
                                  {index === 0 && (
                                    <Pin className="inline w-4 h-4 ml-2 text-yellow-400" />
                                  )}
                                </h3>
                                <Badge className="bg-gray-700 text-gray-300 text-xs whitespace-nowrap">
                                  {topic.category}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {topic.author}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {topic.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="w-3 h-3" />
                                  {topic.replies} replies
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {topic.views} views
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                  <div className="p-6 border-t border-gray-700 text-center">
                    <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-red-500/25 transform hover:scale-105 transition-all duration-200" asChild>
                      <Link href="/forum/new-topic">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create New Topic
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Member Login */}
              <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-4 text-lg font-bold">Member Area</h3>
                <p className="mb-4 text-sm text-gray-400">
                  Login to participate in discussions, create topics, and connect with other members.
                </p>
                <div className="space-y-2">
                  <Button className="w-full bg-white text-black hover:bg-gray-200" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800" asChild>
                    <Link href="/signup">Register</Link>
                  </Button>
                </div>
              </div>

              {/* Active Users */}
              <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-4 text-lg font-bold">Currently Online</h3>
                <p className="mb-2 text-sm text-gray-400">Members online in the last 15 minutes:</p>
                <div className="flex flex-wrap gap-1">
                  {["MichaelR", "JamesW", "AnthonyG", "RobertJ", "DavidM"].map((user, index) => (
                    <Link
                      key={index}
                      href={`/forum/user/${user}`}
                      className="rounded bg-gray-800 px-2 py-1 text-xs hover:bg-gray-700"
                    >
                      {user}
                    </Link>
                  ))}
                  <span className="rounded bg-gray-800 px-2 py-1 text-xs">+12 more</span>
                </div>
              </div>

              {/* Forum Statistics */}
              <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-4 text-lg font-bold">Forum Statistics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Topics:</span>
                    <span>887</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Posts:</span>
                    <span>12,748</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Members:</span>
                    <span>1,243</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Newest Member:</span>
                    <Link href="/forum/user/MichaelR" className="hover:underline">
                      MichaelR
                    </Link>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Most Active:</span>
                    <Link href="/forum/user/AnthonyG" className="hover:underline">
                      AnthonyG
                    </Link>
                  </div>
                </div>
              </div>

              {/* Recent Topics */}
              <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-4 text-lg font-bold">Hot Topics</h3>
                <div className="space-y-3">
                  {recentTopics.slice(0, 3).map((topic) => (
                    <div key={topic.id} className="border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                      <Link href={`/forum/topic/${topic.id}`} className="block hover:text-gray-300">
                        <h4 className="mb-1 line-clamp-1 text-sm font-medium">{topic.title}</h4>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{topic.author}</span>
                          <span>{topic.replies} replies</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Link href="/forum/popular" className="text-sm text-white underline-offset-4 hover:underline">
                    View All Hot Topics
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
