"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import ImageUpload from "@/components/image-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function GalleryUploadPage() {
  const router = useRouter()
  const [imageData, setImageData] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [chapter, setChapter] = useState("")
  const [category, setCategory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!imageData) {
      alert("Please upload an image")
      return
    }

    setIsSubmitting(true)

    try {
      // The image is already uploaded with metadata during the ImageUpload component's process
      // We just need to redirect to the gallery page
      router.push("/admin/gallery")
    } catch (error) {
      console.error("Error submitting image:", error)
      alert("Failed to submit image")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Upload Gallery Image</h1>
          </div>

          <div className="rounded-lg border border-gray-800 bg-black p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <ImageUpload
                    onUpload={(data) => {
                      setImageData(data)
                      if (data.title && !title) setTitle(data.title)
                    }}
                    folder="gallery"
                    aspectRatio="square"
                    metadata={{
                      title,
                      description,
                      chapter,
                      category,
                    }}
                  />
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
                        <SelectItem value="events">Events</SelectItem>
                        <SelectItem value="cars">Cars</SelectItem>
                        <SelectItem value="members">Members</SelectItem>
                        <SelectItem value="meetings">Meetings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  className="border-gray-700 text-white hover:bg-gray-800"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-white text-black hover:bg-gray-200"
                  disabled={isSubmitting || !imageData}
                >
                  {isSubmitting ? "Uploading..." : "Upload Image"}
                </Button>
              </div>
            </form>
          </div>
    </div>
  )
}
