import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, Mail } from "lucide-react"

// This would typically come from an API
const upcomingRenewals = [
  {
    id: 1,
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    chapter: "SKIE",
    chapterName: "Inland Empire",
    renewalDate: "2023-06-01",
    daysLeft: 7,
    status: "pending",
    avatar: "/short-haired-man.png",
  },
  {
    id: 2,
    name: "Jennifer Davis",
    email: "jennifer.davis@example.com",
    chapter: "SKLA",
    chapterName: "Los Angeles",
    renewalDate: "2023-06-05",
    daysLeft: 11,
    status: "pending",
    avatar: "/long-haired-woman.png",
  },
  {
    id: 3,
    name: "Thomas Wilson",
    email: "thomas.wilson@example.com",
    chapter: "SKWA",
    chapterName: "Washington",
    renewalDate: "2023-06-10",
    daysLeft: 16,
    status: "pending",
    avatar: "/thoughtful-man-glasses.png",
  },
  {
    id: 4,
    name: "Patricia Moore",
    email: "patricia.moore@example.com",
    chapter: "SKNC",
    chapterName: "Northern California",
    renewalDate: "2023-06-15",
    daysLeft: 21,
    status: "pending",
    avatar: "/short-haired-woman.png",
  },
  {
    id: 5,
    name: "Christopher Taylor",
    email: "christopher.taylor@example.com",
    chapter: "SKCV",
    chapterName: "Coachella Valley",
    renewalDate: "2023-06-20",
    daysLeft: 26,
    status: "pending",
    avatar: "/bearded-man-portrait.png",
  },
]

export default function UpcomingRenewals() {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900">
      <div className="flex items-center justify-between border-b border-gray-800 px-6 py-4">
        <h3 className="text-lg font-bold text-white">Upcoming Renewals</h3>
        <Button variant="outline" size="sm" className="border-gray-700 text-white hover:bg-gray-800" asChild>
          <Link href="/admin/members/renewals">View All</Link>
        </Button>
      </div>
      <div className="divide-y divide-gray-800">
        {upcomingRenewals.map((renewal) => (
          <div key={renewal.id} className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-4">
              <Image
                src={renewal.avatar || "/placeholder.svg"}
                alt={renewal.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h4 className="font-medium text-white">{renewal.name}</h4>
                <div className="flex flex-col text-sm text-gray-400 sm:flex-row sm:space-x-4">
                  <span>
                    {renewal.chapter} - {renewal.chapterName}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="mr-1 h-3 w-3" />
                    {renewal.renewalDate} ({renewal.daysLeft} days)
                  </span>
                </div>
              </div>
            </div>
            <div>
              <Button
                size="sm"
                variant="outline"
                className="border-blue-700 bg-blue-900/20 text-blue-400 hover:bg-blue-900/40 hover:text-blue-300"
              >
                <Mail className="mr-2 h-4 w-4" />
                Remind
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-800 p-4 text-center">
        <p className="text-sm text-gray-400">
          Showing 5 of 37 upcoming renewals.{" "}
          <Link href="/admin/members/renewals" className="text-white underline-offset-4 hover:underline">
            View all
          </Link>
        </p>
      </div>
    </div>
  )
}
