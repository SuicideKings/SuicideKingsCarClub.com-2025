"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader2, MessageSquare, Users, AlertTriangle, Shield, Eye, Edit, Trash2, Pin, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminNav from "@/components/admin/admin-nav"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { useAuth } from "@/hooks/use-auth"

interface ForumPost {
  id: number
  title: string
  author: string
  category: string
  replies: number
  views: number
  lastActivity: string
  status: "active" | "locked" | "pinned" | "deleted"
  isReported: boolean
}

interface ForumCategory {
  id: number
  name: string
  description: string
  posts: number
  topics: number
  lastPost: string
}

interface ReportedContent {
  id: number
  type: "post" | "comment" | "user"
  title: string
  author: string
  reporter: string
  reason: string
  date: string
  status: "pending" | "reviewed" | "resolved"
}

export default function ForumPage() {
  const { isLoading: authLoading } = useAuth()
  const [posts, setPosts] = useState<ForumPost[]>([])
  const [categories, setCategories] = useState<ForumCategory[]>([])
  const [reports, setReports] = useState<ReportedContent[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  useEffect(() => {
    if (authLoading) return
    
    // Simulate API call
    setTimeout(() => {
      setPosts([
        {
          id: 1,
          title: "Best mods for street racing",
          author: "SpeedDemon",
          category: "Car Modifications",
          replies: 23,
          views: 1245,
          lastActivity: "2024-06-24T10:30:00Z",
          status: "active",
          isReported: false
        },
        {
          id: 2,
          title: "Track day preparation checklist",
          author: "TrackMaster",
          category: "Events",
          replies: 15,
          views: 890,
          lastActivity: "2024-06-23T15:20:00Z",
          status: "pinned",
          isReported: false
        },
        {
          id: 3,
          title: "Controversial racing topic",
          author: "RacingFan",
          category: "General Discussion",
          replies: 45,
          views: 2130,
          lastActivity: "2024-06-22T08:45:00Z",
          status: "locked",
          isReported: true
        }
      ])

      setCategories([
        {
          id: 1,
          name: "General Discussion",
          description: "General car club topics",
          posts: 234,
          topics: 67,
          lastPost: "2024-06-24T10:30:00Z"
        },
        {
          id: 2,
          name: "Car Modifications",
          description: "Discuss car mods and upgrades",
          posts: 189,
          topics: 45,
          lastPost: "2024-06-23T15:20:00Z"
        },
        {
          id: 3,
          name: "Events",
          description: "Event discussions and meetups",
          posts: 145,
          topics: 32,
          lastPost: "2024-06-22T08:45:00Z"
        }
      ])

      setReports([
        {
          id: 1,
          type: "post",
          title: "Controversial racing topic",
          author: "RacingFan",
          reporter: "CleanRacer",
          reason: "Inappropriate language",
          date: "2024-06-22T09:00:00Z",
          status: "pending"
        },
        {
          id: 2,
          type: "comment",
          title: "Comment on safety gear discussion",
          author: "BadActor",
          reporter: "SafetyFirst",
          reason: "Spam content",
          date: "2024-06-21T14:30:00Z",
          status: "reviewed"
        }
      ])

      setLoading(false)
    }, 1000)
  }, [authLoading])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "locked":
        return <Badge variant="secondary">Locked</Badge>
      case "pinned":
        return <Badge className="bg-blue-500">Pinned</Badge>
      case "deleted":
        return <Badge variant="destructive">Deleted</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getReportStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="destructive">Pending</Badge>
      case "reviewed":
        return <Badge className="bg-yellow-500">Reviewed</Badge>
      case "resolved":
        return <Badge className="bg-green-500">Resolved</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <AdminNav />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          </main>
        </div>
      </div>
    )
  }

  const totalPosts = posts.length
  const activePosts = posts.filter(p => p.status === "active").length
  const reportedPosts = posts.filter(p => p.isReported).length
  const pendingReports = reports.filter(r => r.status === "pending").length

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminNav />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Forum Management</h1>
            <Button className="bg-white text-black hover:bg-gray-200" asChild>
              <Link href="/admin/forum/create-category">
                Add Category
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-500/20 p-3">
                  <MessageSquare className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{totalPosts}</p>
                  <p className="text-sm text-gray-400">Total Posts</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-green-500/20 p-3">
                  <Users className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{activePosts}</p>
                  <p className="text-sm text-gray-400">Active Posts</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-yellow-500/20 p-3">
                  <AlertTriangle className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{reportedPosts}</p>
                  <p className="text-sm text-gray-400">Reported Posts</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-red-500/20 p-3">
                  <Shield className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{pendingReports}</p>
                  <p className="text-sm text-gray-400">Pending Reports</p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          ) : (
            <Tabs defaultValue="posts" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="posts">Posts</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="space-y-4">
                <div className="rounded-lg border border-gray-800 bg-black overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead className="text-gray-300">Title</TableHead>
                        <TableHead className="text-gray-300">Author</TableHead>
                        <TableHead className="text-gray-300">Category</TableHead>
                        <TableHead className="text-gray-300">Replies</TableHead>
                        <TableHead className="text-gray-300">Views</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Last Activity</TableHead>
                        <TableHead className="text-gray-300 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {posts.map((post) => (
                        <TableRow key={post.id} className="border-gray-800">
                          <TableCell className="text-white">
                            <div className="flex items-center space-x-2">
                              {post.status === "pinned" && <Pin className="h-4 w-4 text-blue-400" />}
                              {post.status === "locked" && <Lock className="h-4 w-4 text-gray-400" />}
                              {post.isReported && <AlertTriangle className="h-4 w-4 text-red-400" />}
                              <span className="font-medium">{post.title}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">{post.author}</TableCell>
                          <TableCell className="text-gray-300">{post.category}</TableCell>
                          <TableCell className="text-gray-300">{post.replies}</TableCell>
                          <TableCell className="text-gray-300">{post.views}</TableCell>
                          <TableCell>{getStatusBadge(post.status)}</TableCell>
                          <TableCell className="text-gray-300">
                            {new Date(post.lastActivity).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/forum/posts/${post.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-400">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="categories" className="space-y-4">
                <div className="grid gap-4">
                  {categories.map((category) => (
                    <div key={category.id} className="rounded-lg border border-gray-800 bg-black p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                          <p className="text-gray-400">{category.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-400">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-6 text-sm text-gray-400">
                        <span>{category.topics} topics</span>
                        <span>{category.posts} posts</span>
                        <span>Last post: {new Date(category.lastPost).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reports" className="space-y-4">
                <div className="rounded-lg border border-gray-800 bg-black overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead className="text-gray-300">Type</TableHead>
                        <TableHead className="text-gray-300">Content</TableHead>
                        <TableHead className="text-gray-300">Author</TableHead>
                        <TableHead className="text-gray-300">Reporter</TableHead>
                        <TableHead className="text-gray-300">Reason</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Date</TableHead>
                        <TableHead className="text-gray-300 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.map((report) => (
                        <TableRow key={report.id} className="border-gray-800">
                          <TableCell className="text-white">
                            <Badge variant="outline">{report.type}</Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">{report.title}</TableCell>
                          <TableCell className="text-gray-300">{report.author}</TableCell>
                          <TableCell className="text-gray-300">{report.reporter}</TableCell>
                          <TableCell className="text-gray-300">{report.reason}</TableCell>
                          <TableCell>{getReportStatusBadge(report.status)}</TableCell>
                          <TableCell className="text-gray-300">
                            {new Date(report.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm" className="text-green-400">
                                Resolve
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  )
}