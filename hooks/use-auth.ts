"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useAuth({ required = true, redirectTo = "/admin/login" } = {}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const isLoading = status === "loading"
  const isAuthenticated = !!session?.user

  useEffect(() => {
    // Only redirect if we're not loading and authentication is required
    if (required && !isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [required, isLoading, isAuthenticated, router, redirectTo])

  return {
    session,
    isLoading,
    isAuthenticated,
    user: session?.user,
    signOut: () => signOut({ callbackUrl: "/admin/login" }),
  }
}
