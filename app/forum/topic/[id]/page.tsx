import { notFound } from "next/navigation"
import Link from "next/link"
import { MessageSquare, Users, Clock, Eye, ThumbsUp, Flag, Reply } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"

// This would come from database
const getTopic = async (id: string) => {
  const topics = {
    "1": {
      id: 1,
      title: "Best source for 1967 Continental door hinges?",
      category: "Parts Exchange",
      categoryId: 3,
      author: "MichaelR",
      authorAvatar: "/placeholder-user.jpg",
      authorJoined: "Jan 2023",
      authorPosts: 156,
      content: `Hi everyone! I'm restoring my 1967 Lincoln Continental and I'm having trouble finding replacement door hinges. The original ones are completely worn out and the doors are sagging badly.

Has anyone had luck with reproduction parts? I've checked the usual suspects (NPD, Dennis Carpenter, etc.) but they don't seem to carry Continental parts.

Any recommendations would be greatly appreciated!`,
      createdAt: "2 hours ago",
      views: 156,
      replies: [
        {
          id: 1,
          author: "JamesW",
          authorAvatar: "/placeholder-user.jpg",
          authorJoined: "Mar 2022",
          authorPosts: 234,
          content:
            "I had the same issue with my '66. Try contacting Lincoln Land - they specialize in Continental parts and might have what you need. Their prices are fair too.",
          createdAt: "1 hour ago",
          likes: 3,
        },
        {
          id: 2,
          author: "AnthonyG",
          authorAvatar: "/placeholder-user.jpg",
          authorJoined: "Jun 2021",
          authorPosts: 445,
          content:
            "Another option is to have them rebuilt. There's a shop in Michigan that does excellent work on Continental hinges. I can PM you their contact info if interested.",
          createdAt: "45 minutes ago",
          likes: 2,
        },
      ],
    },
  }

  return topics[id as keyof typeof topics]
}

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const topic = await getTopic(id)

  if (!topic) {
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
            <Link href={`/forum/category/${topic.categoryId}`} className="text-gray-400 hover:text-white">
              {topic.category}
            </Link>
            <span className="mx-2 text-gray-600">/</span>
            <span className="text-white">{topic.title}</span>
          </nav>

          {/* Topic Header */}
          <div className="mb-6 rounded-lg border border-gray-800 bg-gray-900 p-6">
            <h1 className="mb-2 text-2xl font-bold">{topic.title}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
              <span className="flex items-center">
                <Users className="mr-1 h-3 w-3" />
                by {topic.author}
              </span>
              <span className="flex items-center">
                <Clock className="mr-1 h-3 w-3" />
                {topic.createdAt}
              </span>
              <span className="flex items-center">
                <Eye className="mr-1 h-3 w-3" />
                {topic.views} views
              </span>
              <span className="flex items-center">
                <MessageSquare className="mr-1 h-3 w-3" />
                {topic.replies.length} replies
              </span>
            </div>
          </div>

          {/* Original Post */}
          <div className="mb-6 rounded-lg border border-gray-800 bg-gray-900 overflow-hidden">
            <div className="flex">
              {/* Author Info */}
              <div className="w-48 border-r border-gray-800 bg-gray-800/50 p-4">
                <div className="text-center">
                  <img
                    src={topic.authorAvatar || "/placeholder.svg"}
                    alt={topic.author}
                    className="mx-auto mb-2 h-16 w-16 rounded-full"
                  />
                  <h3 className="font-bold">{topic.author}</h3>
                  <p className="text-xs text-gray-400">Member</p>
                  <div className="mt-2 text-xs text-gray-400">
                    <p>Joined: {topic.authorJoined}</p>
                    <p>Posts: {topic.authorPosts}</p>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="flex-1 p-4">
                <div className="mb-4 whitespace-pre-wrap text-gray-200">{topic.content}</div>
                <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-gray-600 hover:bg-gray-700">
                      <ThumbsUp className="mr-1 h-3 w-3" />
                      Like
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-600 hover:bg-gray-700">
                      <Reply className="mr-1 h-3 w-3" />
                      Quote
                    </Button>
                    <Button variant="outline" size="sm" className="border-gray-600 hover:bg-gray-700">
                      <Flag className="mr-1 h-3 w-3" />
                      Report
                    </Button>
                  </div>
                  <span className="text-xs text-gray-400">{topic.createdAt}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Replies */}
          {topic.replies.map((reply, index) => (
            <div key={reply.id} className="mb-4 rounded-lg border border-gray-800 bg-gray-900 overflow-hidden">
              <div className="flex">
                {/* Author Info */}
                <div className="w-48 border-r border-gray-800 bg-gray-800/50 p-4">
                  <div className="text-center">
                    <img
                      src={reply.authorAvatar || "/placeholder.svg"}
                      alt={reply.author}
                      className="mx-auto mb-2 h-12 w-12 rounded-full"
                    />
                    <h4 className="font-medium">{reply.author}</h4>
                    <p className="text-xs text-gray-400">Member</p>
                    <div className="mt-2 text-xs text-gray-400">
                      <p>Joined: {reply.authorJoined}</p>
                      <p>Posts: {reply.authorPosts}</p>
                    </div>
                  </div>
                </div>

                {/* Reply Content */}
                <div className="flex-1 p-4">
                  <div className="mb-4 text-gray-200">{reply.content}</div>
                  <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-gray-600 hover:bg-gray-700">
                        <ThumbsUp className="mr-1 h-3 w-3" />
                        Like ({reply.likes})
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-600 hover:bg-gray-700">
                        <Reply className="mr-1 h-3 w-3" />
                        Quote
                      </Button>
                      <Button variant="outline" size="sm" className="border-gray-600 hover:bg-gray-700">
                        <Flag className="mr-1 h-3 w-3" />
                        Report
                      </Button>
                    </div>
                    <span className="text-xs text-gray-400">{reply.createdAt}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Reply Form */}
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <h3 className="mb-4 text-lg font-bold">Post a Reply</h3>
            <form className="space-y-4">
              <Textarea
                placeholder="Write your reply here..."
                className="min-h-32 border-gray-700 bg-gray-800 text-white"
              />
              <div className="flex justify-between">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-gray-600 hover:bg-gray-700">
                    Preview
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-600 hover:bg-gray-700">
                    Attach File
                  </Button>
                </div>
                <Button className="bg-white text-black hover:bg-gray-200">Post Reply</Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
