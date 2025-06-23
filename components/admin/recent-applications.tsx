import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

// This would typically come from an API
const recentApplications = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    chapter: "SKIE",
    chapterName: "Inland Empire",
    date: "2023-05-15",
    status: "pending",
    car: "1967 Lincoln Continental",
    avatar: "/short-haired-man.png",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
    chapter: "SKLA",
    chapterName: "Los Angeles",
    date: "2023-05-14",
    status: "pending",
    car: "1964 Lincoln Continental",
    avatar: "/long-haired-woman.png",
  },
  {
    id: 3,
    name: "Michael Williams",
    email: "michael.williams@example.com",
    chapter: "SKWA",
    chapterName: "Washington",
    date: "2023-05-13",
    status: "pending",
    car: "1965 Lincoln Continental",
    avatar: "/thoughtful-man-glasses.png",
  },
  {
    id: 4,
    name: "Jessica Brown",
    email: "jessica.brown@example.com",
    chapter: "SKNC",
    chapterName: "Northern California",
    date: "2023-05-12",
    status: "pending",
    car: "1963 Lincoln Continental",
    avatar: "/short-haired-woman.png",
  },
  {
    id: 5,
    name: "David Miller",
    email: "david.miller@example.com",
    chapter: "SKCV",
    chapterName: "Coachella Valley",
    date: "2023-05-11",
    status: "pending",
    car: "1968 Lincoln Continental",
    avatar: "/bearded-man-portrait.png",
  },
]

export default function RecentApplications() {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
        <h3 className="text-lg font-bold text-white">Recent Applications</h3>
        <Button variant="outline" size="sm" className="border-gray-700 text-white hover:bg-gray-800" asChild>
          <Link href="/admin/members/applications">View All</Link>
        </Button>
      </div>
      <div className="divide-y divide-gray-800">
        {recentApplications.map((application) => (
          <div key={application.id} className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Image
                src={application.avatar || "/placeholder.svg"}
                alt={application.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h4 className="font-medium text-white">{application.name}</h4>
                <div className="flex flex-col text-sm text-gray-400 sm:flex-row sm:space-x-4">
                  <span>
                    {application.chapter} - {application.chapterName}
                  </span>
                  <span>{application.car}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="border-green-700 bg-green-900/20 text-green-400 hover:bg-green-900/40 hover:text-green-300"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-700 bg-red-900/20 text-red-400 hover:bg-red-900/40 hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-800 p-4 text-center">
        <p className="text-sm text-gray-400">
          Showing 5 of 24 recent applications.{" "}
          <Link href="/admin/members/applications" className="text-white underline-offset-4 hover:underline">
            View all
          </Link>
        </p>
      </div>
    </div>
  )
}
