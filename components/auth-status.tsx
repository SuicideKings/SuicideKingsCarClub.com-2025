"use client"

import { useSession } from "next-auth/react"

export default function AuthStatus() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <div className="text-sm text-gray-500">Loading...</div>
  }

  if (status === "unauthenticated") {
    return <div className="text-sm text-gray-500">Not authenticated</div>
  }

  if (session) {
    return <div className="text-sm text-gray-500">Signed in as {session.user?.email}</div>
  }

  return null
}
