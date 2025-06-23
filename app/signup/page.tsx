"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SignupRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the correct signup page
    router.replace("/auth/signup")
  }, [router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
        <p>Redirecting to sign up...</p>
      </div>
    </div>
  )
}
