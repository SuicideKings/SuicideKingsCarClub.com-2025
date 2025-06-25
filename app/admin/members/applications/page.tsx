"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Loader2, Check, X, Eye, Filter, Search } from "lucide-react"
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

interface Application {
  id: number
  name: string
  email: string
  phone: string
  chapter: string
  chapterName: string
  car: string
  carYear: string
  applicationDate: string
  status: "pending" | "approved" | "rejected"
  notes?: string
  references?: string[]
  avatar?: string
}

export default function MemberApplicationsPage() {
  const { isLoading: authLoading } = useAuth()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [chapterFilter, setChapterFilter] = useState("all")
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

  // Mock data for demonstration
  useEffect(() => {
    if (authLoading) return
    
    // Simulate API call
    setTimeout(() => {
      setApplications([
        {
          id: 1,
          name: "John Smith",
          email: "john.smith@example.com",
          phone: "(555) 123-4567",
          chapter: "SKIE",
          chapterName: "Inland Empire",
          car: "Lincoln Continental",
          carYear: "1967",
          applicationDate: "2024-06-20T10:30:00Z",
          status: "pending",
          notes: "Interested in track events and car shows. Has extensive modification experience.",
          references: ["Mike Johnson", "Sarah Davis"],
          avatar: "/short-haired-man.png"
        },
        {
          id: 2,
          name: "Sarah Johnson",
          email: "sarah.johnson@example.com",
          phone: "(555) 234-5678",
          chapter: "SKLA",
          chapterName: "Los Angeles",
          car: "Lincoln Continental",
          carYear: "1964",
          applicationDate: "2024-06-19T14:20:00Z",
          status: "pending",
          notes: "Active in local car community. Recommended by existing member.",
          references: ["Chris Wilson"],
          avatar: "/long-haired-woman.png"
        },
        {
          id: 3,
          name: "Michael Williams",
          email: "michael.williams@example.com",
          phone: "(555) 345-6789",
          chapter: "SKWA",
          chapterName: "Washington",
          car: "Lincoln Continental",
          carYear: "1965",
          applicationDate: "2024-06-18T09:45:00Z",
          status: "approved",
          notes: "Excellent application. Clean driving record and strong references.",
          references: ["Robert Johnson", "Jennifer Davis"]
        },
        {
          id: 4,
          name: "Jessica Brown",
          email: "jessica.brown@example.com",
          phone: "(555) 456-7890",
          chapter: "SKNC",
          chapterName: "Northern California",
          car: "Lincoln Continental",
          carYear: "1963",
          applicationDate: "2024-06-17T16:30:00Z",
          status: "rejected",
          notes: "Application incomplete. Missing required documentation.",
          references: []
        }
      ])
      setLoading(false)
    }, 1000)
  }, [authLoading])

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || app.status === statusFilter
    const matchesChapter = chapterFilter === "all" || app.chapter === chapterFilter
    
    return matchesSearch && matchesStatus && matchesChapter
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleApprove = async (id: number) => {
    // Update application status
    setApplications(prev => 
      prev.map(app => 
        app.id === id ? { ...app, status: "approved" as const } : app
      )
    )
  }

  const handleReject = async (id: number) => {
    // Update application status
    setApplications(prev => 
      prev.map(app => 
        app.id === id ? { ...app, status: "rejected" as const } : app
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
            <h1 className="text-2xl font-bold text-white">Member Applications</h1>
            <p className="text-gray-400">Review and manage membership applications</p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search applications..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
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
                    <TableHead className="text-gray-300">Applicant</TableHead>
                    <TableHead className="text-gray-300">Contact</TableHead>
                    <TableHead className="text-gray-300">Chapter</TableHead>
                    <TableHead className="text-gray-300">Vehicle</TableHead>
                    <TableHead className="text-gray-300">Applied</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.map((application) => (
                    <TableRow key={application.id} className="border-gray-800">
                      <TableCell className="text-white">
                        <div className="flex items-center space-x-3">
                          <Image
                            src={application.avatar || "/placeholder.svg"}
                            alt={application.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div>
                            <div className="font-medium">{application.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div>
                          <div>{application.email}</div>
                          <div className="text-sm">{application.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div>
                          <div>{application.chapter}</div>
                          <div className="text-sm text-gray-400">{application.chapterName}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {application.carYear} {application.car}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(application.applicationDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(application.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedApplication(application)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="border-gray-800 bg-gray-900">
                              <DialogHeader>
                                <DialogTitle className="text-white">Application Details</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                  Review the complete application information
                                </DialogDescription>
                              </DialogHeader>
                              {selectedApplication && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Name</label>
                                      <p className="text-white">{selectedApplication.name}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Email</label>
                                      <p className="text-white">{selectedApplication.email}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Phone</label>
                                      <p className="text-white">{selectedApplication.phone}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Chapter</label>
                                      <p className="text-white">{selectedApplication.chapterName}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Vehicle</label>
                                      <p className="text-white">{selectedApplication.carYear} {selectedApplication.car}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Applied</label>
                                      <p className="text-white">{new Date(selectedApplication.applicationDate).toLocaleDateString()}</p>
                                    </div>
                                  </div>
                                  
                                  {selectedApplication.notes && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Notes</label>
                                      <p className="text-white mt-1">{selectedApplication.notes}</p>
                                    </div>
                                  )}

                                  {selectedApplication.references && selectedApplication.references.length > 0 && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">References</label>
                                      <div className="flex flex-wrap gap-2 mt-1">
                                        {selectedApplication.references.map((ref, index) => (
                                          <Badge key={index} variant="outline">{ref}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          {application.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-green-400 hover:bg-green-900/20"
                                onClick={() => handleApprove(application.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-400 hover:bg-red-900/20"
                                onClick={() => handleReject(application.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredApplications.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  No applications found matching your criteria.
                </div>
              )}
            </div>
          )}

          {/* Stats Cards */}
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-2xl font-bold text-white">{applications.length}</p>
                  <p className="text-sm text-gray-400">Total Applications</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-2xl font-bold text-yellow-400">
                    {applications.filter(a => a.status === "pending").length}
                  </p>
                  <p className="text-sm text-gray-400">Pending Review</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-2xl font-bold text-green-400">
                    {applications.filter(a => a.status === "approved").length}
                  </p>
                  <p className="text-sm text-gray-400">Approved</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-2xl font-bold text-red-400">
                    {applications.filter(a => a.status === "rejected").length}
                  </p>
                  <p className="text-sm text-gray-400">Rejected</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}