"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { getOptimizedImageSize, getOptimalImageQuality } from "@/lib/image-optimization"

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
}

export default function OptimizedImage({ src, alt, width, height, className, priority = false }: OptimizedImageProps) {
  const [viewportWidth, setViewportWidth] = useState(1200)
  const [quality, setQuality] = useState(85)

  useEffect(() => {
    // Set initial viewport width
    setViewportWidth(window.innerWidth)
    setQuality(getOptimalImageQuality())

    // Update viewport width on resize
    const handleResize = () => {
      setViewportWidth(window.innerWidth)
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const optimizedWidth = getOptimizedImageSize(width, viewportWidth)
  const optimizedHeight = getOptimizedImageSize(height, viewportWidth)

  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      width={optimizedWidth}
      height={optimizedHeight}
      className={className}
      priority={priority}
      quality={quality}
    />
  )
}
