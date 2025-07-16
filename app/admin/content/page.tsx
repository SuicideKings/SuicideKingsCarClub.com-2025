"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText } from "lucide-react"

export default function AdminContentPage() {
  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Content Management
        </h1>
        <p className="text-gray-400 mt-2">
          Manage pages, posts, and content across the site
        </p>
      </div>

      <Card className="bg-black/40 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Content Management System</CardTitle>
          <CardDescription className="text-gray-400">
            Coming soon - comprehensive content management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">Content management system coming soon...</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}