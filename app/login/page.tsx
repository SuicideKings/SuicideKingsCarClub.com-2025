"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoginRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the correct signin page
    router.replace("/auth/signin")
  }, [router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p>Redirecting to sign in...</p>
      </div>
    </div>
  )
}
