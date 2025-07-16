"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export default function AdminForumPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Forum Management
        </h1>
        <p className="text-gray-400 mt-2">
          Manage forum posts, categories, and moderation
        </p>
      </div>

      <Card className="bg-black/40 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Forum Administration</CardTitle>
          <CardDescription className="text-gray-400">
            Coming soon - comprehensive forum management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">Forum management system coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}