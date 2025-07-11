"use client"

import { useState, useEffect } from "react"

interface Member {
  id: number
  name: string
  email: string
  clubId: number
  role: string
  membershipStatus: string
  subscriptionStatus?: string
  profileImageUrl?: string
}

interface MemberAuthReturn {
  member: Member | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  refreshMember: () => Promise<void>
}

export function useMemberAuth(): MemberAuthReturn {
  const [member, setMember] = useState<Member | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setIsLoading(false)
        return
      }

      const response = await fetch("/api/member/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const memberData = await response.json()
        setMember(memberData)
      } else {
        localStorage.removeItem("token")
        setMember(null)
      }
    } catch (error) {
      console.error("Auth verification failed:", error)
      localStorage.removeItem("token")
      setMember(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/member/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem("token", data.token)
        setMember(data.member)
        return { success: true }
      } else {
        return { success: false, error: data.error || "Login failed" }
      }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Network error" }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setMember(null)
  }

  const refreshMember = async () => {
    await checkAuth()
  }

  return {
    member,
    isLoading,
    login,
    logout,
    refreshMember,
  }
}