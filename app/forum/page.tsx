import Image from "next/image"
import Link from "next/link"
import { MessageSquare, Users, Clock, Eye, Search, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import MainNav from "@/components/main-nav"
import Footer from "@/components/footer"

// This would typically come from a database
const forumCategories = [
  {
    id: 1,
    name: "General Discussion",
    description: "General topics related to the Lincoln Continental and the club",
    topics: 124,
    posts: 1872,
    icon: MessageSquare,
  },
  {
    id: 2,
    name: "Technical Help",
    description: "Technical questions, repairs, and maintenance discussions",
    topics: 256,
    posts: 3541,
    icon: MessageSquare,
  },
  {
    id: 3,
    name: "Parts Exchange",
    description: "Buy, sell, and trade Lincoln Continental parts",
    topics: 189,
    posts: 2103,
    icon: MessageSquare,
  },
  {
    id: 4,
    name: "Chapter Discussions",
    description: "Chapter-specific discussions and announcements",
    topics: 97,
    posts: 1456,
    icon: MessageSquare,
  },
  {
    id: 5,
    name: "Events & Meetups",
    description: "Upcoming events, meetups, and post-event discussions",
    topics: 78,
    posts: 1209,
    icon: MessageSquare,
  },
  {
    id: 6,
    name: "Restoration Projects",
    description: "Share and discuss your Lincoln Continental restoration projects",
    topics: 143,
    posts: 2567,
    icon: MessageSquare,
  },
]

const recentTopics = [
  {
    id: 1,
    title: "Best source for 1967 Continental door hinges?",
    author: "MichaelR",
    date: "2 hours ago",
    replies: 12,
    views: 156,
    category: "Parts Exchange",
  },
  {
    id: 2,
    title: "Electrical issues with 1964 Continental",
    author: "JamesW",
    date: "5 hours ago",
    replies: 8,
    views: 97,
    category: "Technical Help",
  },
  {
    id: 3,
    title: "Photos from the LA Chapter meet last weekend",
    author: "AnthonyG",
    date: "Yesterday",
    replies: 24,
    views: 312,
    category: "Chapter Discussions",
  },
  {
    id: 4,
    title: "Suicide door adjustment techniques",
    author: "RobertJ",
    date: "2 days ago",
    replies: 19,
    views: 245,
    category: "Technical Help",
  },
  {
    id: 5,
    title: "Upcoming Fall Road Trip details",
    author: "PaulJ",
    date: "3 days ago",
    replies: 31,
    views: 478,
    category: "Events & Meetups",
  },
]

export default function ForumPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />

      {/* Page Header */}
      <div className="relative pt-16">
        <div className="absolute inset-0 z-0">
          <div className="h-48 w-full bg-black">
            <Image
              src="/images/forum/forum-header.jpg"
              alt="Suicide Kings Forum"
              fill
              className="object-cover opacity-40"
            />
          </div>
        </div>
        <div className="container relative z-10 mx-auto px-4 py-16 text-white">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <h1 className="mb-2 text-3xl font-bold">Suicide Kings Forum</h1>
              <p className="text-gray-300">Connect with fellow Lincoln Continental enthusiasts</p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search the forum..."
                  className="w-full rounded-md border border-gray-700 bg-black px-10 py-2 text-white placeholder:text-gray-500 focus:border-gray-600 focus:outline-none"
                />
              </div>
              <Button className="bg-white text-black hover:bg-gray-200">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Forum Stats */}
      <div className="bg-gray-900 py-4 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <p className="text-2xl font-bold">887</p>
              <p className="text-sm text-gray-400">Topics</p>
            </div>
            <div>
              <p className="text-2xl font-bold">12,748</p>
              <p className="text-sm text-gray-400">Posts</p>
            </div>
            <div>
              <p className="text-2xl font-bold">1,243</p>
              <p className="text-sm text-gray-400">Members</p>
            </div>
            <div>
              <p className="text-2xl font-bold">MichaelR</p>
              <p className="text-sm text-gray-400">Newest Member</p>
            </div>
          </div>
        </div>
      </div>

      {/* Forum Content */}
      <section className="flex-1 bg-black py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Forum Content */}
            <div className="lg:col-span-2">
              {/* Categories */}
              <div className="mb-8 rounded-lg border border-gray-800 bg-gray-900 overflow-hidden">
                <div className="bg-gray-800 p-4">
                  <h2 className="text-xl font-bold">Forum Categories</h2>
                </div>
                <div className="divide-y divide-gray-800">
                  {forumCategories.map((category) => (
                    <div key={category.id} className="p-4 hover:bg-gray-800/50">
                      <Link href={`/forum/category/${category.id}`} className="flex items-start gap-4">
                        <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-800 text-gray-300">
                          <category.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold hover:text-gray-300">{category.name}</h3>
                          <p className="text-sm text-gray-400">{category.description}</p>
                          <div className="mt-2 flex gap-4 text-xs text-gray-500">
                            <span>{category.topics} topics</span>
                            <span>{category.posts} posts</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Topics */}
              <div className="rounded-lg border border-gray-800 bg-gray-900 overflow-hidden">
                <div className="flex items-center justify-between bg-gray-800 p-4">
                  <h2 className="text-xl font-bold">Recent Topics</h2>
                  <Button variant="outline" size="sm" className="border-gray-600 hover:bg-gray-700" asChild>
                    <Link href="/forum/recent">View All</Link>
                  </Button>
                </div>
                <div className="divide-y divide-gray-800">
                  {recentTopics.map((topic) => (
                    <div key={topic.id} className="p-4 hover:bg-gray-800/50">
                      <Link href={`/forum/topic/${topic.id}`} className="block">
                        <h3 className="mb-1 text-lg font-medium hover:text-gray-300">{topic.title}</h3>
                        <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                          <span className="flex items-center">
                            <Users className="mr-1 h-3 w-3" />
                            {topic.author}
                          </span>
                          <span className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {topic.date}
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="mr-1 h-3 w-3" />
                            {topic.replies} replies
                          </span>
                          <span className="flex items-center">
                            <Eye className="mr-1 h-3 w-3" />
                            {topic.views} views
                          </span>
                        </div>
                        <span className="inline-block rounded bg-gray-800 px-2 py-1 text-xs">{topic.category}</span>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-800 p-4 text-center">
                  <Button className="bg-white text-black hover:bg-gray-200" asChild>
                    <Link href="/forum/new-topic">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create New Topic
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Member Login */}
              <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-4 text-lg font-bold">Member Area</h3>
                <p className="mb-4 text-sm text-gray-400">
                  Login to participate in discussions, create topics, and connect with other members.
                </p>
                <div className="space-y-2">
                  <Button className="w-full bg-white text-black hover:bg-gray-200" asChild>
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800" asChild>
                    <Link href="/signup">Register</Link>
                  </Button>
                </div>
              </div>

              {/* Active Users */}
              <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-4 text-lg font-bold">Currently Online</h3>
                <p className="mb-2 text-sm text-gray-400">Members online in the last 15 minutes:</p>
                <div className="flex flex-wrap gap-1">
                  {["MichaelR", "JamesW", "AnthonyG", "RobertJ", "DavidM"].map((user, index) => (
                    <Link
                      key={index}
                      href={`/forum/user/${user}`}
                      className="rounded bg-gray-800 px-2 py-1 text-xs hover:bg-gray-700"
                    >
                      {user}
                    </Link>
                  ))}
                  <span className="rounded bg-gray-800 px-2 py-1 text-xs">+12 more</span>
                </div>
              </div>

              {/* Forum Statistics */}
              <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-4 text-lg font-bold">Forum Statistics</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Topics:</span>
                    <span>887</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Posts:</span>
                    <span>12,748</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Members:</span>
                    <span>1,243</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Newest Member:</span>
                    <Link href="/forum/user/MichaelR" className="hover:underline">
                      MichaelR
                    </Link>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Most Active:</span>
                    <Link href="/forum/user/AnthonyG" className="hover:underline">
                      AnthonyG
                    </Link>
                  </div>
                </div>
              </div>

              {/* Recent Topics */}
              <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
                <h3 className="mb-4 text-lg font-bold">Hot Topics</h3>
                <div className="space-y-3">
                  {recentTopics.slice(0, 3).map((topic) => (
                    <div key={topic.id} className="border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                      <Link href={`/forum/topic/${topic.id}`} className="block hover:text-gray-300">
                        <h4 className="mb-1 line-clamp-1 text-sm font-medium">{topic.title}</h4>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>{topic.author}</span>
                          <span>{topic.replies} replies</span>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <Link href="/forum/popular" className="text-sm text-white underline-offset-4 hover:underline">
                    View All Hot Topics
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
