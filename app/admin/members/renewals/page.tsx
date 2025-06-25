"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Loader2, Mail, Calendar, AlertCircle, Check, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import AdminNav from "@/components/admin/admin-nav"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { useAuth } from "@/hooks/use-auth"

interface Renewal {
  id: number
  name: string
  email: string
  phone: string
  chapter: string
  chapterName: string
  membershipType: string
  currentExpiry: string
  daysUntilExpiry: number
  status: "current" | "expiring_soon" | "expired" | "renewed"
  lastPayment: string
  totalDue: number
  avatar?: string
  remindersSent: number
  lastReminderSent?: string
}

export default function MemberRenewalsPage() {
  const { isLoading: authLoading } = useAuth()
  const [renewals, setRenewals] = useState<Renewal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [chapterFilter, setChapterFilter] = useState("all")

  // Mock data for demonstration
  useEffect(() => {
    if (authLoading) return
    
    // Simulate API call
    setTimeout(() => {
      setRenewals([
        {
          id: 1,
          name: "Robert Johnson",
          email: "robert.johnson@example.com",
          phone: "(555) 123-4567",
          chapter: "SKIE",
          chapterName: "Inland Empire",
          membershipType: "Premium",
          currentExpiry: "2024-07-01",
          daysUntilExpiry: 7,
          status: "expiring_soon",
          lastPayment: "2023-07-01",
          totalDue: 50.00,
          avatar: "/short-haired-man.png",
          remindersSent: 2,
          lastReminderSent: "2024-06-20"
        },
        {
          id: 2,
          name: "Jennifer Davis",
          email: "jennifer.davis@example.com",
          phone: "(555) 234-5678",
          chapter: "SKLA",
          chapterName: "Los Angeles",
          membershipType: "Standard",
          currentExpiry: "2024-07-05",
          daysUntilExpiry: 11,
          status: "expiring_soon",
          lastPayment: "2023-07-05",
          totalDue: 30.00,
          avatar: "/long-haired-woman.png",
          remindersSent: 1,
          lastReminderSent: "2024-06-15"
        },
        {
          id: 3,
          name: "Thomas Wilson",
          email: "thomas.wilson@example.com",
          phone: "(555) 345-6789",
          chapter: "SKWA",
          chapterName: "Washington",
          membershipType: "Premium",
          currentExpiry: "2024-06-15",
          daysUntilExpiry: -9,
          status: "expired",
          lastPayment: "2023-06-15",
          totalDue: 50.00,
          remindersSent: 3,
          lastReminderSent: "2024-06-22"
        },
        {
          id: 4,
          name: "Patricia Moore",
          email: "patricia.moore@example.com",
          phone: "(555) 456-7890",
          chapter: "SKNC",
          chapterName: "Northern California",
          membershipType: "Standard",
          currentExpiry: "2024-08-15",
          daysUntilExpiry: 52,
          status: "current",
          lastPayment: "2023-08-15",
          totalDue: 30.00,
          avatar: "/short-haired-woman.png",
          remindersSent: 0
        },
        {
          id: 5,
          name: "Christopher Taylor",
          email: "christopher.taylor@example.com",
          phone: "(555) 567-8901",
          chapter: "SKCV",
          chapterName: "Coachella Valley",
          membershipType: "Premium",
          currentExpiry: "2024-07-20",
          daysUntilExpiry: 26,
          status: "renewed",
          lastPayment: "2024-06-20",
          totalDue: 0.00,
          avatar: "/bearded-man-portrait.png",
          remindersSent: 0
        }
      ])
      setLoading(false)
    }, 1000)
  }, [authLoading])

  const filteredRenewals = renewals.filter(renewal => {
    const matchesSearch = renewal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         renewal.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || renewal.status === statusFilter
    const matchesChapter = chapterFilter === "all" || renewal.chapter === chapterFilter
    
    return matchesSearch && matchesStatus && matchesChapter
  })

  const getStatusBadge = (renewal: Renewal) => {
    switch (renewal.status) {
      case "current":
        return <Badge className="bg-green-500">Current</Badge>
      case "expiring_soon":
        return <Badge className="bg-yellow-500">Expiring Soon</Badge>
      case "expired":
        return <Badge variant="destructive">Expired</Badge>
      case "renewed":
        return <Badge className="bg-blue-500">Renewed</Badge>
      default:
        return <Badge variant="outline">{renewal.status}</Badge>
    }
  }

  const getPriorityIcon = (renewal: Renewal) => {
    if (renewal.status === "expired") {
      return <AlertCircle className="h-4 w-4 text-red-500" />
    }
    if (renewal.daysUntilExpiry <= 7 && renewal.daysUntilExpiry > 0) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />
    }
    return null
  }

  const sendReminder = async (id: number) => {
    // Update reminder count
    setRenewals(prev => 
      prev.map(renewal => 
        renewal.id === id 
          ? { 
              ...renewal, 
              remindersSent: renewal.remindersSent + 1,
              lastReminderSent: new Date().toISOString().split('T')[0]
            } 
          : renewal
      )
    )
  }

  const markAsRenewed = async (id: number) => {
    setRenewals(prev => 
      prev.map(renewal => 
        renewal.id === id 
          ? { 
              ...renewal, 
              status: "renewed" as const,
              totalDue: 0,
              lastPayment: new Date().toISOString().split('T')[0]
            } 
          : renewal
      )
    )
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <AdminNav />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminNav />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Member Renewals</h1>
            <p className="text-gray-400">Manage membership renewals and send reminders</p>
          </div>

          {/* Quick Actions */}
          <div className="mb-6 flex flex-wrap gap-4">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              <Mail className="mr-2 h-4 w-4" />
              Send Bulk Reminders
            </Button>
            <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
              Export Renewal Report
            </Button>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search renewals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-gray-700 bg-gray-800 pl-10 text-white w-64"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-gray-700 bg-gray-800 text-white w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="renewed">Renewed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={chapterFilter} onValueChange={setChapterFilter}>
              <SelectTrigger className="border-gray-700 bg-gray-800 text-white w-48">
                <SelectValue placeholder="Filter by chapter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chapters</SelectItem>
                <SelectItem value="SKIE">Inland Empire</SelectItem>
                <SelectItem value="SKLA">Los Angeles</SelectItem>
                <SelectItem value="SKWA">Washington</SelectItem>
                <SelectItem value="SKNC">Northern California</SelectItem>
                <SelectItem value="SKCV">Coachella Valley</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          ) : (
            <div className="rounded-lg border border-gray-800 bg-black overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800">
                    <TableHead className="text-gray-300">Member</TableHead>
                    <TableHead className="text-gray-300">Chapter</TableHead>
                    <TableHead className="text-gray-300">Membership</TableHead>
                    <TableHead className="text-gray-300">Expiry Date</TableHead>
                    <TableHead className="text-gray-300">Days Left</TableHead>
                    <TableHead className="text-gray-300">Amount Due</TableHead>
                    <TableHead className="text-gray-300">Reminders</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRenewals.map((renewal) => (
                    <TableRow key={renewal.id} className="border-gray-800">
                      <TableCell className="text-white">
                        <div className="flex items-center space-x-3">
                          <Image
                            src={renewal.avatar || "/placeholder.svg"}
                            alt={renewal.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div>
                            <div className="font-medium flex items-center gap-2">
                              {renewal.name}
                              {getPriorityIcon(renewal)}
                            </div>
                            <div className="text-sm text-gray-400">{renewal.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div>
                          <div>{renewal.chapter}</div>
                          <div className="text-sm text-gray-400">{renewal.chapterName}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{renewal.membershipType}</TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(renewal.currentExpiry).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell className={`font-medium ${
                        renewal.daysUntilExpiry < 0 ? 'text-red-400' : 
                        renewal.daysUntilExpiry <= 7 ? 'text-yellow-400' : 'text-gray-300'
                      }`}>
                        {renewal.daysUntilExpiry < 0 
                          ? `${Math.abs(renewal.daysUntilExpiry)} days overdue`
                          : `${renewal.daysUntilExpiry} days`
                        }
                      </TableCell>
                      <TableCell className="text-white font-medium">
                        ${renewal.totalDue.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div>
                          <div>{renewal.remindersSent} sent</div>
                          {renewal.lastReminderSent && (
                            <div className="text-xs text-gray-400">
                              Last: {new Date(renewal.lastReminderSent).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(renewal)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {renewal.status !== "renewed" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-blue-400 hover:bg-blue-900/20"
                              onClick={() => sendReminder(renewal.id)}
                            >
                              <Mail className="h-4 w-4" />
                            </Button>
                          )}
                          {renewal.totalDue > 0 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-green-400 hover:bg-green-900/20"
                              onClick={() => markAsRenewed(renewal.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredRenewals.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  No renewals found matching your criteria.
                </div>
              )}
            </div>
          )}

          {/* Stats Cards */}
          <div className="mt-8 grid gap-4 md:grid-cols-5">
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-2xl font-bold text-white">{renewals.length}</p>
                  <p className="text-sm text-gray-400">Total Members</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-2xl font-bold text-green-400">
                    {renewals.filter(r => r.status === "current").length}
                  </p>
                  <p className="text-sm text-gray-400">Current</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-2xl font-bold text-yellow-400">
                    {renewals.filter(r => r.status === "expiring_soon").length}
                  </p>
                  <p className="text-sm text-gray-400">Expiring Soon</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-2xl font-bold text-red-400">
                    {renewals.filter(r => r.status === "expired").length}
                  </p>
                  <p className="text-sm text-gray-400">Expired</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-2xl font-bold text-blue-400">
                    {renewals.filter(r => r.status === "renewed").length}
                  </p>
                  <p className="text-sm text-gray-400">Recently Renewed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Summary */}
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Outstanding Revenue</h3>
              <p className="text-3xl font-bold text-yellow-400">
                ${renewals.filter(r => r.totalDue > 0).reduce((sum, r) => sum + r.totalDue, 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-400">From {renewals.filter(r => r.totalDue > 0).length} members</p>
            </div>
            
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <h3 className="text-lg font-semibold text-white mb-2">This Month's Renewals</h3>
              <p className="text-3xl font-bold text-blue-400">
                {renewals.filter(r => r.status === "renewed").length}
              </p>
              <p className="text-sm text-gray-400">Members renewed</p>
            </div>

            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Renewal Rate</h3>
              <p className="text-3xl font-bold text-green-400">
                {renewals.length > 0 
                  ? ((renewals.filter(r => r.status === "renewed").length / renewals.length) * 100).toFixed(1)
                  : 0
                }%
              </p>
              <p className="text-sm text-gray-400">This period</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}