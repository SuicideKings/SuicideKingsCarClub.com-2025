"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Member {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  membershipStatus: string
  memberNumber: string
}

export function useMemberAuth() {
  const [member, setMember] = useState<Member | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("memberToken")
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setMember(data.member)
        setIsAuthenticated(true)
      } else {
        // Token is invalid, remove it
        localStorage.removeItem("memberToken")
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      localStorage.removeItem("memberToken")
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = () => {
    localStorage.removeItem("memberToken")
    setMember(null)
    setIsAuthenticated(false)
    router.push("/auth/signin")
  }

  return {
    member,
    isLoading,
    isAuthenticated,
    signOut,
    checkAuth,
  }
}
