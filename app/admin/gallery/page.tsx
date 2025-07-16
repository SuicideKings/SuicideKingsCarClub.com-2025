"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Loader2, Plus, Trash2, Pencil, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"

interface GalleryImage {
  id: number
  title: string
  description: string | null
  blob_url: string
  pathname: string
  chapter: string | null
  category: string | null
  content_type: string
  created_at: string
}

export default function AdminGalleryPage() {
  const { isLoading: authLoading } = useAuth()

  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalImages, setTotalImages] = useState(0)
  const pageSize = 20

  // Filters
  const [chapterFilter, setChapterFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")

  useEffect(() => {
    if (authLoading) return
    fetchGalleryImages()
  }, [page, chapterFilter, categoryFilter, authLoading])

  async function fetchGalleryImages() {
    try {
      setLoading(true)

      // Build query parameters
      const params = new URLSearchParams()
      params.append("page", page.toString())
      params.append("limit", pageSize.toString())

      if (chapterFilter) {
        params.append("chapter", chapterFilter)
      }

      if (categoryFilter) {
        params.append("category", categoryFilter)
      }

      const response = await fetch(`/api/gallery?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to fetch gallery images")
      }

      const data = await response.json()
      setImages(data.images || [])
      setTotalImages(data.total || 0)
      setTotalPages(Math.ceil((data.total || 0) / pageSize))
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.error("Error fetching gallery images:", err)
    } finally {
      setLoading(false)
    }
  }

  async function handleDeleteImage(id: number) {
    if (!confirm("Are you sure you want to delete this image?")) {
      return
    }

    try {
      setDeletingId(id)
      const response = await fetch("/api/gallery", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete image")
      }

      // Remove the deleted image from the state
      setImages((prevImages) => prevImages.filter((image) => image.id !== id))

      // Refetch if we deleted the last image on the page
      if (images.length === 1 && page > 1) {
        setPage(page - 1)
      } else {
        fetchGalleryImages()
      }
    } catch (err) {
      console.error("Error deleting image:", err)
      alert("Failed to delete image")
    } finally {
      setDeletingId(null)
    }
  }

  if (authLoading) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Gallery Management</h1>
            <Button className="bg-white text-black hover:bg-gray-200" asChild>
              <Link href="/admin/gallery/upload">
                <Plus className="mr-2 h-4 w-4" />
                Upload Image
              </Link>
            </Button>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="w-full sm:w-auto">
              <Select value={chapterFilter} onValueChange={setChapterFilter}>
                <SelectTrigger className="border-gray-700 bg-gray-800 text-white w-full sm:w-[200px]">
                  <SelectValue placeholder="All Chapters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Chapters</SelectItem>
                  <SelectItem value="skie">Inland Empire</SelectItem>
                  <SelectItem value="skwa">Washington</SelectItem>
                  <SelectItem value="skla">Los Angeles</SelectItem>
                  <SelectItem value="skcv">Coachella Valley</SelectItem>
                  <SelectItem value="sknc">Northern California</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-auto">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-gray-700 bg-gray-800 text-white w-full sm:w-[200px]">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                  <SelectItem value="cars">Cars</SelectItem>
                  <SelectItem value="members">Members</SelectItem>
                  <SelectItem value="meetings">Meetings</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(chapterFilter || categoryFilter) && (
              <Button
                variant="outline"
                className="border-gray-700 text-white hover:bg-gray-800"
                onClick={() => {
                  setChapterFilter("")
                  setCategoryFilter("")
                  setPage(1)
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          ) : error ? (
            <div className="rounded-lg border border-red-800 bg-red-900/20 p-4 text-center text-red-400">{error}</div>
          ) : images.length === 0 ? (
            <div className="rounded-lg border border-gray-800 bg-black p-8 text-center">
              <p className="mb-4 text-gray-400">No gallery images found</p>
              <Button className="bg-white text-black hover:bg-gray-200" asChild>
                <Link href="/admin/gallery/upload">Upload Your First Image</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-gray-800"
                  >
                    <Image
                      src={image.blob_url || "/placeholder.svg"}
                      alt={image.title || "Gallery image"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="text-sm font-medium text-white">{image.title}</h3>
                        {image.chapter && (
                          <p className="text-xs text-gray-300">
                            {image.chapter} {image.category ? `• ${image.category}` : ""}
                          </p>
                        )}
                      </div>
                      <div className="absolute right-2 top-2 flex space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="rounded-full border-gray-600 bg-gray-800/80 text-white hover:bg-gray-700"
                          asChild
                        >
                          <Link href={`/admin/gallery/edit/${image.id}`}>
                            <Pencil className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="rounded-full"
                          onClick={() => handleDeleteImage(image.id)}
                          disabled={deletingId === image.id}
                        >
                          {deletingId === image.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalImages)} of {totalImages}{" "}
                  images
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-white hover:bg-gray-800"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="flex h-9 items-center px-2 text-sm text-white">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700 text-white hover:bg-gray-800"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
    </div>
  )
}
