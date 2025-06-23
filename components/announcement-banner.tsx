"use client"

import { useState } from "react"
import { X } from "lucide-react"
import Link from "next/link"

// This would typically be fetched from an API or CMS
const announcement = {
  active: true,
  message: "New membership applications are now open for all chapters!",
  link: "/membership",
  linkText: "Apply Now",
  dismissible: true,
  isHighPriority: true, // New property to indicate high priority announcements
}

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(announcement.active)

  if (!isVisible) return null

  // Enhanced styling for better visibility
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 py-3 text-white ${
        announcement.isHighPriority
          ? "bg-gradient-to-r from-red-800 to-black"
          : "bg-gradient-to-r from-red-800 to-black"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex flex-1 items-center justify-center">
          {/* Added icon for high priority announcements */}
          {announcement.isHighPriority && (
            <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold">
              !
            </span>
          )}
          <p className="text-center text-sm font-medium">
            {announcement.message}{" "}
            {announcement.link && (
              <Link href={announcement.link} className="ml-1 rounded bg-white px-2 py-0.5 text-black hover:bg-gray-200">
                {announcement.linkText}
              </Link>
            )}
          </p>
        </div>
        {announcement.dismissible && (
          <button
            type="button"
            className="ml-4 flex-shrink-0 rounded-md p-1 hover:bg-red-700"
            onClick={() => setIsVisible(false)}
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
