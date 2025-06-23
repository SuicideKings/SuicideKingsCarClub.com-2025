import { notFound } from "next/navigation"
import Link from "next/link"
import { MessageSquare, Users, Clock, Eye, Pin, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"

// This would come from database
const getCategory = async (id: string) => {
  const categories = {
    "1": {
      id: 1,
      name: "General Discussion",
      description: "General topics related to the Lincoln Continental and the club",
      topics: [
        {
          id: 1,
          title: "Welcome to the Suicide Kings Forum!",
          author: "Admin",
          authorAvatar: "/placeholder-user.jpg",
          replies: 45,
          views: 1234,
          lastReply: "2 hours ago",
          lastReplyBy: "MichaelR",
          isPinned: true,
          isLocked: false,
        },
        {
          id: 2,
          title: "Forum Rules and Guidelines",
          author: "Admin",
          authorAvatar: "/placeholder-user.jpg",
          replies: 12,
          views: 567,
          lastReply: "1 day ago",
          lastReplyBy: "JamesW",
          isPinned: true,
          isLocked: true,
        },
        {
          id: 3,
          title: "Introduce yourself here!",
          author: "MichaelR",
          authorAvatar: "/placeholder-user.jpg",
          replies: 89,
          views: 2341,
          lastReply: "30 minutes ago",
          lastReplyBy: "AnthonyG",
          isPinned: false,
          isLocked: false,
        },
      ],
    },
  }

  return categories[id as keyof typeof categories]
}

export default async function CategoryPage({ params }: { params: { id: string } }) {
  const category = await getCategory(params.id)

  if (!category) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      <div className="flex-1 bg-black pt-16 text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="mb-6 text-sm">
            <Link href="/forum" className="text-gray-400 hover:text-white">
              Forum
            </Link>
            <span className="mx-2 text-gray-600">/</span>
            <span className="text-white">{category.name}</span>
          </nav>

          {/* Category Header */}
          <div className="mb-8 rounded-lg border border-gray-800 bg-gray-900 p-6">
            <h1 className="mb-2 text-2xl font-bold">{category.name}</h1>
            <p className="text-gray-400">{category.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-6 text-sm text-gray-400">
                <span>{category.topics.length} topics</span>
                <span>{category.topics.reduce((sum, topic) => sum + topic.replies, 0)} posts</span>
              </div>
              <Button className="bg-white text-black hover:bg-gray-200" asChild>
                <Link href={`/forum/category/${category.id}/new-topic`}>New Topic</Link>
              </Button>
            </div>
          </div>

          {/* Topics List */}
          <div className="rounded-lg border border-gray-800 bg-gray-900 overflow-hidden">
            <div className="bg-gray-800 p-4">
              <h2 className="text-lg font-bold">Topics</h2>
            </div>
            <div className="divide-y divide-gray-800">
              {category.topics.map((topic) => (
                <div key={topic.id} className="p-4 hover:bg-gray-800/50">
                  <div className="flex items-start gap-4">
                    <img
                      src={topic.authorAvatar || "/placeholder.svg"}
                      alt={topic.author}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {topic.isPinned && <Pin className="h-4 w-4 text-yellow-500" />}
                        {topic.isLocked && <Lock className="h-4 w-4 text-red-500" />}
                        <Link href={`/forum/topic/${topic.id}`} className="text-lg font-medium hover:text-gray-300">
                          {topic.title}
                        </Link>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                        <span className="flex items-center">
                          <Users className="mr-1 h-3 w-3" />
                          by {topic.author}
                        </span>
                        <span className="flex items-center">
                          <MessageSquare className="mr-1 h-3 w-3" />
                          {topic.replies} replies
                        </span>
                        <span className="flex items-center">
                          <Eye className="mr-1 h-3 w-3" />
                          {topic.views} views
                        </span>
                        <span className="flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          Last reply {topic.lastReply} by {topic.lastReplyBy}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
