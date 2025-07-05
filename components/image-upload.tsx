"use client"

import type React from "react"
import { useState, useRef, useCallback } from "react"
import { Upload, X, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import type { ImageUploadProps, UploadResponse, ApiResponse } from "@/types"
import { logger } from "@/lib/logger"

interface ImageUploadState {
  isUploading: boolean;
  preview: string | null;
  error: string | null;
  uploadProgress: number;
  fileName: string | null;
  fileSize: number | null;
}

export default function ImageUpload({
  onUpload,
  folder = "gallery",
  className = "",
  aspectRatio = "square",
  maxWidth = 800,
  metadata = {},
  accept = "image/jpeg,image/png,image/webp,image/gif",
  maxSize = 10 * 1024 * 1024, // 10MB default
}: ImageUploadProps) {
  const [state, setState] = useState<ImageUploadState>({
    isUploading: false,
    preview: null,
    error: null,
    uploadProgress: 0,
    fileName: null,
    fileSize: null,
  })
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  const aspectRatioClass = {
    square: "aspect-square",
    video: "aspect-video",
    auto: "",
  }[aspectRatio]

  const formatFileSize = useCallback((bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }, [])

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (file.size > maxSize) {
      return `File size must be less than ${formatFileSize(maxSize)}`
    }

    // Check file type
    const allowedTypes = accept.split(',').map(type => type.trim())
    if (!allowedTypes.includes(file.type)) {
      return `File type not supported. Allowed types: ${allowedTypes.join(', ')}`
    }

    // Check if it's actually an image
    if (!file.type.startsWith('image/')) {
      return 'File must be an image'
    }

    return null
  }, [accept, maxSize, formatFileSize])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    const validationError = validateFile(file)
    if (validationError) {
      setState(prev => ({ ...prev, error: validationError }))
      return
    }

    // Create preview
    const objectUrl = URL.createObjectURL(file)
    
    setState(prev => ({
      ...prev,
      preview: objectUrl,
      error: null,
      fileName: file.name,
      fileSize: file.size,
      uploadProgress: 0,
    }))

    try {
      setState(prev => ({ ...prev, isUploading: true }))

      logger.info('Image upload started', { 
        fileName: file.name, 
        fileSize: file.size, 
        folder 
      })

      // Create form data
      const formData = new FormData()
      formData.append("file", file)
      formData.append("folder", folder)

      // Add metadata if provided
      if (metadata?.title) formData.append("title", metadata.title)
      if (metadata?.description) formData.append("description", metadata.description)
      if (metadata?.chapter) formData.append("chapter", metadata.chapter)
      if (metadata?.category) formData.append("category", metadata.category)

      // Upload to API with progress tracking
      const xhr = new XMLHttpRequest()
      
      const uploadPromise = new Promise<UploadResponse>((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded / e.total) * 100)
            setState(prev => ({ ...prev, uploadProgress: progress }))
          }
        })

        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data: ApiResponse<UploadResponse> = JSON.parse(xhr.responseText)
              if (data.success && data.data) {
                resolve(data.data)
              } else {
                reject(new Error(data.error || 'Upload failed'))
              }
            } catch (error) {
              reject(new Error('Invalid response from server'))
            }
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`))
          }
        })

        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'))
        })

        xhr.addEventListener('timeout', () => {
          reject(new Error('Upload timeout'))
        })

        xhr.open('POST', '/api/upload')
        xhr.timeout = 60000 // 60 second timeout
        xhr.send(formData)
      })

      const uploadResult = await uploadPromise
      
      logger.info('Image uploaded successfully', { 
        fileName: file.name, 
        url: uploadResult.url 
      })

      // Call the onUpload callback with the result
      onUpload(uploadResult)

      // Reset progress
      setState(prev => ({ ...prev, uploadProgress: 100 }))
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload image"
      
      logger.error('Image upload failed', { 
        fileName: file.name, 
        error: errorMessage 
      })
      
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        preview: null,
        uploadProgress: 0,
      }))
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } finally {
      setState(prev => ({ ...prev, isUploading: false }))
    }
  }

  const handleRemove = useCallback(() => {
    setState({
      isUploading: false,
      preview: null,
      error: null,
      uploadProgress: 0,
      fileName: null,
      fileSize: null,
    })
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])

  const handleClick = useCallback(() => {
    if (!state.isUploading) {
      fileInputRef.current?.click()
    }
  }, [state.isUploading])

  return (
    <div className={className}>
      {state.error && (
        <Alert className="mb-4 border-red-500 bg-red-950/50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-200">
            {state.error}
          </AlertDescription>
        </Alert>
      )}

      {state.preview ? (
        <div className={`relative overflow-hidden rounded-lg border border-gray-800 ${aspectRatioClass}`}>
          <Image 
            src={state.preview} 
            alt="Upload preview" 
            fill 
            className="object-cover" 
            sizes={`${maxWidth}px`}
          />
          
          {/* Upload Progress Overlay */}
          {state.isUploading && (
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white mb-2" />
              <div className="w-3/4 bg-gray-700 rounded-full h-2 mb-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${state.uploadProgress}%` }}
                />
              </div>
              <p className="text-sm text-white">{state.uploadProgress}%</p>
            </div>
          )}
          
          {/* Success/Remove Overlay */}
          {!state.isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity hover:opacity-100">
              {state.uploadProgress === 100 ? (
                <div className="flex flex-col items-center">
                  <CheckCircle className="h-8 w-8 text-green-400 mb-2" />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleRemove}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Replace
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={handleRemove} 
                  className="rounded-full"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </div>
          )}
          
          {/* File Info */}
          {state.fileName && state.fileSize && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
              <p className="text-xs text-white truncate">
                {state.fileName} ({formatFileSize(state.fileSize)})
              </p>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`flex ${aspectRatioClass} cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-700 bg-gray-900 p-6 text-center transition-all hover:border-gray-500 hover:bg-gray-800/50 ${state.isUploading ? 'cursor-not-allowed opacity-50' : ''}`}
          onClick={handleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleClick()
            }
          }}
          aria-label="Upload image"
        >
          <Upload className="mb-2 h-10 w-10 text-gray-400" />
          <p className="mb-1 text-sm font-medium text-white">
            {state.isUploading ? 'Uploading...' : 'Click to upload an image'}
          </p>
          <p className="text-xs text-gray-400">
            {accept.replace(/image\//g, '').toUpperCase()} (max {formatFileSize(maxSize)})
          </p>
          
          {state.isUploading && (
            <div className="mt-4 w-full">
              <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400 mb-2" />
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${state.uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="sr-only"
        disabled={state.isUploading}
        aria-hidden="true"
      />
    </div>
  )
}
