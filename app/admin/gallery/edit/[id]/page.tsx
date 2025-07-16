"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

export default function EditGalleryImagePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { isLoading: authLoading } = useAuth()

  const [image, setImage] = useState<GalleryImage | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [chapter, setChapter] = useState("")
  const [category, setCategory] = useState("")

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return

    async function fetchImage() {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/gallery/${params.id}`)

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Image not found")
          }
          throw new Error("Failed to fetch image")
        }

        const data = await response.json()
        setImage(data.image)

        // Set form values
        setTitle(data.image.title || "")
        setDescription(data.image.description || "")
        setChapter(data.image.chapter || "")
        setCategory(data.image.category || "")
      } catch (err) {
        console.error("Error fetching image:", err)
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchImage()
  }, [params.id, authLoading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title) {
      setError("Title is required")
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const response = await fetch(`/api/gallery/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          chapter,
          category,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update image")
      }

      router.push("/admin/gallery")
    } catch (err) {
      console.error("Error updating image:", err)
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      </div>
    )
  }

  if (error && !image) {
    return (
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-800 bg-red-900/20 p-4 text-center text-red-400">{error}</div>
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800"
            onClick={() => router.push("/admin/gallery")}
          >
            Back to Gallery
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Edit Gallery Image</h1>
          </div>

          <div className="rounded-lg border border-gray-800 bg-black p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  {image && (
                    <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-800">
                      <Image
                        src={image.blob_url || "/placeholder.svg"}
                        alt={image.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="mb-2 block text-sm font-medium text-white">
                      Image Title
                    </label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="border-gray-700 bg-gray-800 text-white"
                      placeholder="Enter image title"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="mb-2 block text-sm font-medium text-white">
                      Description
                    </label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="border-gray-700 bg-gray-800 text-white"
                      placeholder="Enter image description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label htmlFor="chapter" className="mb-2 block text-sm font-medium text-white">
                      Chapter
                    </label>
                    <Select value={chapter} onValueChange={setChapter}>
                      <SelectTrigger className="border-gray-700 bg-gray-800 text-white">
                        <SelectValue placeholder="Select chapter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="skie">Inland Empire</SelectItem>
                        <SelectItem value="skwa">Washington</SelectItem>
                        <SelectItem value="skla">Los Angeles</SelectItem>
                        <SelectItem value="skcv">Coachella Valley</SelectItem>
                        <SelectItem value="sknc">Northern California</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label htmlFor="category" className="mb-2 block text-sm font-medium text-white">
                      Category
                    </label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="border-gray-700 bg-gray-800 text-white">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="events">Events</SelectItem>
                        <SelectItem value="cars">Cars</SelectItem>
                        <SelectItem value="members">Members</SelectItem>
                        <SelectItem value="meetings">Meetings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {error && (
                <div className="rounded-lg border border-red-800 bg-red-900/20 p-4 text-center text-red-400">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-gray-800"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-white text-black hover:bg-gray-200" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </div>
    </div>
  )
}
