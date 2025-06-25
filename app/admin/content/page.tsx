"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader2, FileText, Image, Video, Plus, Edit, Trash2, Eye } from "lucide-react"
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

interface ContentItem {
  id: number
  title: string
  type: "page" | "blog" | "news" | "media"
  status: "published" | "draft" | "archived"
  author: string
  lastModified: string
  views?: number
}

interface MediaItem {
  id: number
  name: string
  type: "image" | "video" | "document"
  size: string
  uploadedBy: string
  uploadDate: string
  url: string
}

export default function ContentPage() {
  const { isLoading: authLoading } = useAuth()
  const [content, setContent] = useState<ContentItem[]>([])
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  useEffect(() => {
    if (authLoading) return
    
    // Simulate API call
    setTimeout(() => {
      setContent([
        {
          id: 1,
          title: "Welcome to Suicide Kings Car Club",
          type: "page",
          status: "published",
          author: "Admin",
          lastModified: "2024-06-20T10:30:00Z",
          views: 1250
        },
        {
          id: 2,
          title: "June 2024 Newsletter",
          type: "blog",
          status: "published",
          author: "Newsletter Team",
          lastModified: "2024-06-15T14:20:00Z",
          views: 892
        },
        {
          id: 3,
          title: "New Track Day Rules",
          type: "news",
          status: "draft",
          author: "Safety Committee",
          lastModified: "2024-06-22T09:45:00Z"
        },
        {
          id: 4,
          title: "Club History Timeline",
          type: "page",
          status: "archived",
          author: "Historian",
          lastModified: "2024-05-10T16:30:00Z",
          views: 543
        }
      ])

      setMedia([
        {
          id: 1,
          name: "club-logo-main.png",
          type: "image",
          size: "245 KB",
          uploadedBy: "Admin",
          uploadDate: "2024-06-01T12:00:00Z",
          url: "/uploads/club-logo-main.png"
        },
        {
          id: 2,
          name: "track-day-highlights.mp4",
          type: "video",
          size: "15.2 MB",
          uploadedBy: "Media Team",
          uploadDate: "2024-06-15T18:30:00Z",
          url: "/uploads/track-day-highlights.mp4"
        },
        {
          id: 3,
          name: "membership-handbook.pdf",
          type: "document",
          size: "2.1 MB",
          uploadedBy: "Secretary",
          uploadDate: "2024-06-10T11:15:00Z",
          url: "/uploads/membership-handbook.pdf"
        }
      ])

      setLoading(false)
    }, 1000)
  }, [authLoading])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500">Published</Badge>
      case "draft":
        return <Badge variant="secondary">Draft</Badge>
      case "archived":
        return <Badge variant="outline">Archived</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "page":
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-400">Page</Badge>
      case "blog":
        return <Badge variant="outline" className="bg-purple-500/20 text-purple-400">Blog</Badge>
      case "news":
        return <Badge variant="outline" className="bg-yellow-500/20 text-yellow-400">News</Badge>
      case "media":
        return <Badge variant="outline" className="bg-pink-500/20 text-pink-400">Media</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const getMediaIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="h-4 w-4 text-green-400" />
      case "video":
        return <Video className="h-4 w-4 text-blue-400" />
      case "document":
        return <FileText className="h-4 w-4 text-yellow-400" />
      default:
        return <FileText className="h-4 w-4" />
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

  const totalContent = content.length
  const publishedContent = content.filter(c => c.status === "published").length
  const draftContent = content.filter(c => c.status === "draft").length
  const totalViews = content.reduce((sum, item) => sum + (item.views || 0), 0)

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminNav />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Content Management</h1>
            <div className="flex space-x-2">
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800" asChild>
                <Link href="/admin/content/media/upload">
                  Upload Media
                </Link>
              </Button>
              <Button className="bg-white text-black hover:bg-gray-200" asChild>
                <Link href="/admin/content/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Content
                </Link>
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-500/20 p-3">
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{totalContent}</p>
                  <p className="text-sm text-gray-400">Total Content</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-green-500/20 p-3">
                  <FileText className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{publishedContent}</p>
                  <p className="text-sm text-gray-400">Published</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-yellow-500/20 p-3">
                  <FileText className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{draftContent}</p>
                  <p className="text-sm text-gray-400">Drafts</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-purple-500/20 p-3">
                  <Eye className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</p>
                  <p className="text-sm text-gray-400">Total Views</p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          ) : (
            <Tabs defaultValue="content" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="media">Media Library</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <div className="rounded-lg border border-gray-800 bg-black overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead className="text-gray-300">Title</TableHead>
                        <TableHead className="text-gray-300">Type</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Author</TableHead>
                        <TableHead className="text-gray-300">Views</TableHead>
                        <TableHead className="text-gray-300">Last Modified</TableHead>
                        <TableHead className="text-gray-300 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {content.map((item) => (
                        <TableRow key={item.id} className="border-gray-800">
                          <TableCell className="text-white font-medium">{item.title}</TableCell>
                          <TableCell>{getTypeBadge(item.type)}</TableCell>
                          <TableCell>{getStatusBadge(item.status)}</TableCell>
                          <TableCell className="text-gray-300">{item.author}</TableCell>
                          <TableCell className="text-gray-300">
                            {item.views ? item.views.toLocaleString() : '-'}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {new Date(item.lastModified).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/content/${item.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="sm" asChild>
                                <Link href={`/admin/content/${item.id}/edit`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
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

              <TabsContent value="media" className="space-y-4">
                <div className="rounded-lg border border-gray-800 bg-black overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead className="text-gray-300">File</TableHead>
                        <TableHead className="text-gray-300">Type</TableHead>
                        <TableHead className="text-gray-300">Size</TableHead>
                        <TableHead className="text-gray-300">Uploaded By</TableHead>
                        <TableHead className="text-gray-300">Upload Date</TableHead>
                        <TableHead className="text-gray-300 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {media.map((item) => (
                        <TableRow key={item.id} className="border-gray-800">
                          <TableCell className="text-white">
                            <div className="flex items-center space-x-2">
                              {getMediaIcon(item.type)}
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300 capitalize">{item.type}</TableCell>
                          <TableCell className="text-gray-300">{item.size}</TableCell>
                          <TableCell className="text-gray-300">{item.uploadedBy}</TableCell>
                          <TableCell className="text-gray-300">
                            {new Date(item.uploadDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <Button variant="ghost" size="sm" asChild>
                                <a href={item.url} target="_blank" rel="noopener noreferrer">
                                  <Eye className="h-4 w-4" />
                                </a>
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

                {media.length === 0 && (
                  <div className="rounded-lg border border-gray-800 bg-black p-8 text-center">
                    <Image className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-400 mb-4">No media files found</p>
                    <Button className="bg-white text-black hover:bg-gray-200" asChild>
                      <Link href="/admin/content/media/upload">Upload Your First File</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  )
}