"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ImageUploadProps {
  onUpload: (data: {
    url: string
    id?: number
    title?: string
    description?: string
    chapter?: string
    category?: string
  }) => void
  folder?: string
  className?: string
  aspectRatio?: "square" | "video" | "auto"
  maxWidth?: number
  metadata?: {
    title?: string
    description?: string
    chapter?: string
    category?: string
  }
}

export default function ImageUpload({
  onUpload,
  folder = "images",
  className = "",
  aspectRatio = "square",
  maxWidth = 800,
  metadata = {},
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    auto: "",
  }[aspectRatio]

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create preview
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setError(null)

    try {
      setIsUploading(true)

      // Create form data
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)

      // Add metadata if provided
      if (metadata.title) formData.append("title", metadata.title)
      if (metadata.description) formData.append("description", metadata.description)
      if (metadata.chapter) formData.append("chapter", metadata.chapter)
      if (metadata.category) formData.append("category", metadata.category)

      // Upload to API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to upload image")
      }

      const data = await response.json()
      onUpload(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image")
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={`${className}`}>
      {preview ? (
        <div className={`relative overflow-hidden rounded-lg border border-gray-800 ${aspectRatioClass}`}>
          <Image src={preview || "/placeholder.svg"} alt="Upload preview" fill className="object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            ) : (
              <Button variant="destructive" size="icon" onClick={handleRemove} className="rounded-full">
                <X className="h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`flex ${aspectRatioClass} cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-700 bg-gray-900 p-6 text-center hover:border-gray-500 hover:bg-gray-800/50`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mb-2 h-10 w-10 text-gray-400" />
          <p className="mb-1 text-sm font-medium text-white">Click to upload an image</p>
          <p className="text-xs text-gray-400">JPEG, PNG, WebP or GIF (max 5MB)</p>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          {isUploading && <Loader2 className="mt-4 h-6 w-6 animate-spin text-gray-400" />}
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
      />
    </div>
  )
}
