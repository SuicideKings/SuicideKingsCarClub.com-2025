import type React from "react"
import AuthProvider from "@/components/providers/session-provider"
import AdminNav from "@/components/admin/admin-nav"
import AdminSidebar from "@/components/admin/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
        <AdminNav />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}
