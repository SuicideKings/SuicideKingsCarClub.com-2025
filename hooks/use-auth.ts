"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { useSession, signOut as nextAuthSignOut } from "next-auth/react"

interface User {
  id: string
  email: string
  name?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signOut: () => Promise<void>
}

export function useAuth(): AuthContextType {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const isLoading = status === "loading"

  useEffect(() => {
    if (session?.user) {
      setUser({
        id: session.user.id as string,
        email: session.user.email as string,
        name: session.user.name as string,
      })
    } else {
      setUser(null)
    }
  }, [session])

  const signOut = async () => {
    await nextAuthSignOut()
  }

  return {
    user,
    isLoading,
    signOut,
  }
}