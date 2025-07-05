"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="text-center">
        <div className="mb-8">
          <Image
            src="/images/suicide-kings-car-club-logo.png"
            alt="Suicide Kings Logo"
            width={200}
            height={100}
            className="mx-auto"
          />
        </div>
        <h2 className="mb-4 text-2xl font-bold text-white">Something went wrong!</h2>
        <p className="mb-6 text-gray-400 max-w-md">
          We encountered an unexpected error. Please try again or contact us if the problem persists.
        </p>
        <div className="space-y-3">
          <Button
            onClick={reset}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            Try again
          </Button>
          <div>
            <Button
              variant="outline"
              className="border-gray-400 text-gray-300 hover:bg-gray-800"
              onClick={() => window.location.href = "/"}
            >
              Go to Homepage
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
