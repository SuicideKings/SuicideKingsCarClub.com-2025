"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader2, Plus, Search, Filter, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import AdminNav from "@/components/admin/admin-nav"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { useAuth } from "@/hooks/use-auth"

interface Member {
  id: number
  name: string
  email: string
  chapter: string
  membershipType: string
  status: string
  joinDate: string
  lastPayment: string
  phoneNumber?: string
}

export default function MembersPage() {
  const { isLoading: authLoading } = useAuth()
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [chapterFilter, setChapterFilter] = useState("all")

  // Mock data for demonstration
  useEffect(() => {
    if (authLoading) return
    
    // Simulate API call
    setTimeout(() => {
      setMembers([
        {
          id: 1,
          name: "John Smith",
          email: "john.smith@example.com",
          chapter: "Los Angeles",
          membershipType: "Premium",
          status: "Active",
          joinDate: "2023-01-15",
          lastPayment: "2024-01-15",
          phoneNumber: "(555) 123-4567"
        },
        {
          id: 2,
          name: "Mike Johnson",
          email: "mike.johnson@example.com",
          chapter: "Inland Empire",
          membershipType: "Standard",
          status: "Active",
          joinDate: "2023-03-22",
          lastPayment: "2024-03-22",
          phoneNumber: "(555) 234-5678"
        },
        {
          id: 3,
          name: "Sarah Davis",
          email: "sarah.davis@example.com",
          chapter: "Washington",
          membershipType: "Premium",
          status: "Pending Renewal",
          joinDate: "2022-06-10",
          lastPayment: "2023-06-10",
          phoneNumber: "(555) 345-6789"
        },
        {
          id: 4,
          name: "Chris Wilson",
          email: "chris.wilson@example.com",
          chapter: "Northern California",
          membershipType: "Standard",
          status: "Inactive",
          joinDate: "2022-11-05",
          lastPayment: "2023-11-05",
          phoneNumber: "(555) 456-7890"
        }
      ])
      setLoading(false)
    }, 1000)
  }, [authLoading])

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || member.status.toLowerCase().replace(" ", "") === statusFilter
    const matchesChapter = chapterFilter === "all" || member.chapter === chapterFilter
    
    return matchesSearch && matchesStatus && matchesChapter
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500">Active</Badge>
      case "Pending Renewal":
        return <Badge variant="secondary">Pending Renewal</Badge>
      case "Inactive":
        return <Badge variant="destructive">Inactive</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
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
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Members</h1>
            <Button className="bg-white text-black hover:bg-gray-200" asChild>
              <Link href="/admin/members/create">
                <Plus className="mr-2 h-4 w-4" />
                Add Member
              </Link>
            </Button>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search members..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pendingrenewal">Pending Renewal</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Select value={chapterFilter} onValueChange={setChapterFilter}>
              <SelectTrigger className="border-gray-700 bg-gray-800 text-white w-48">
                <SelectValue placeholder="Filter by chapter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chapters</SelectItem>
                <SelectItem value="Los Angeles">Los Angeles</SelectItem>
                <SelectItem value="Inland Empire">Inland Empire</SelectItem>
                <SelectItem value="Washington">Washington</SelectItem>
                <SelectItem value="Northern California">Northern California</SelectItem>
                <SelectItem value="Coachella Valley">Coachella Valley</SelectItem>
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
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-300">Chapter</TableHead>
                    <TableHead className="text-gray-300">Membership</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Join Date</TableHead>
                    <TableHead className="text-gray-300">Last Payment</TableHead>
                    <TableHead className="text-gray-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((member) => (
                    <TableRow key={member.id} className="border-gray-800">
                      <TableCell className="text-white font-medium">{member.name}</TableCell>
                      <TableCell className="text-gray-300">{member.email}</TableCell>
                      <TableCell className="text-gray-300">{member.chapter}</TableCell>
                      <TableCell className="text-gray-300">{member.membershipType}</TableCell>
                      <TableCell>{getStatusBadge(member.status)}</TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(member.joinDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(member.lastPayment).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/members/${member.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/members/${member.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredMembers.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  No members found matching your criteria.
                </div>
              )}
            </div>
          )}

          {/* Stats Cards */}
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-2xl font-bold text-white">{members.length}</p>
                  <p className="text-sm text-gray-400">Total Members</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-2xl font-bold text-green-400">
                    {members.filter(m => m.status === "Active").length}
                  </p>
                  <p className="text-sm text-gray-400">Active Members</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-2xl font-bold text-yellow-400">
                    {members.filter(m => m.status === "Pending Renewal").length}
                  </p>
                  <p className="text-sm text-gray-400">Pending Renewal</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-2xl font-bold text-red-400">
                    {members.filter(m => m.status === "Inactive").length}
                  </p>
                  <p className="text-sm text-gray-400">Inactive Members</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}