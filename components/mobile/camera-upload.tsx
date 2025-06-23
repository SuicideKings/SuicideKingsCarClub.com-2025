"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface CameraUploadProps {
  onUpload: (file: File) => void
  onCancel?: () => void
}

export default function CameraUpload({ onUpload, onCancel }: CameraUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = async () => {
    try {
      setIsCapturing(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      setIsCapturing(false)
    }
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], "camera-photo.jpg", { type: "image/jpeg" })
          const url = URL.createObjectURL(blob)
          setPreview(url)
          onUpload(file)
        }
      },
      "image/jpeg",
      0.8,
    )

    stopCamera()
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach((track) => track.stop())
    }
    setIsCapturing(false)
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setPreview(url)
      onUpload(file)
    }
  }

  return (
    <div className="space-y-4">
      {isCapturing ? (
        <div className="relative">
          <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-4">
            <Button size="lg" className="rounded-full bg-white text-black hover:bg-gray-200" onClick={capturePhoto}>
              <Camera className="h-6 w-6" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white text-white hover:bg-white/10"
              onClick={stopCamera}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>
      ) : preview ? (
        <div className="relative">
          <Image
            src={preview || "/placeholder.svg"}
            alt="Preview"
            width={400}
            height={300}
            className="w-full rounded-lg object-cover"
          />
          <Button
            size="sm"
            variant="outline"
            className="absolute top-2 right-2 rounded-full"
            onClick={() => {
              setPreview(null)
              if (onCancel) onCancel()
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex space-x-2">
          <Button onClick={startCamera} className="flex-1 bg-red-600 text-white hover:bg-red-700">
            <Camera className="mr-2 h-4 w-4" />
            Take Photo
          </Button>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
            className="flex-1 border-gray-700 text-white hover:bg-gray-800"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      )}

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
