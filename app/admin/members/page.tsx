"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Users, 
  Search, 
  Plus, 
  MoreHorizontal,
  Mail,
  Calendar,
  Shield,
  UserCheck,
  UserX,
  Edit,
  Trash2,
  Phone,
  MapPin,
  Car,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Download,
  Upload,
  Eye
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface Member {
  id: number
  name: string
  email: string
  phone?: string
  role: string
  joinDate: string
  membershipStatus: string
  profileImageUrl?: string
  bio?: string
  carInfo?: any
  isEmailVerified: boolean
  paypalSubscriptionId?: string
  subscriptionStatus?: string
  subscriptionStartDate?: string
  subscriptionEndDate?: string
  membershipTier?: string
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
  club?: {
    id: number
    name: string
    slug: string
    location: string
  }
}

interface Club {
  id: number
  name: string
  slug: string
  description?: string
  location?: string
  memberCount: number
  isActive: boolean
}

interface MemberStats {
  total: number
  active: number
  pending: number
  expired: number
}

export default function AdminMembersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [members, setMembers] = useState<Member[]>([])
  const [clubs, setClubs] = useState<Club[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<MemberStats>({ total: 0, active: 0, pending: 0, expired: 0 })
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedClub, setSelectedClub] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    clubId: "",
    role: "member",
    membershipStatus: "active",
    bio: "",
    carInfo: "",
    membershipTier: "",
  })

  const fetchMembers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        ...(searchTerm && { search: searchTerm }),
        ...(selectedStatus !== "all" && { status: selectedStatus }),
        ...(selectedClub !== "all" && { clubId: selectedClub }),
      })

      const response = await fetch(`/api/admin/members?${params}`)
      const data = await response.json()

      if (response.ok) {
        setMembers(data.members)
        setStats(data.stats)
        setTotalPages(data.pagination.totalPages)
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to fetch members",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch members",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchClubs = async () => {
    try {
      const response = await fetch("/api/admin/clubs")
      const data = await response.json()

      if (response.ok) {
        setClubs(data)
      }
    } catch (error) {
      console.error("Failed to fetch clubs:", error)
    }
  }

  useEffect(() => {
    fetchClubs()
  }, [])

  useEffect(() => {
    fetchMembers()
  }, [currentPage, searchTerm, selectedStatus, selectedClub])

  const handleAddMember = async () => {
    try {
      const response = await fetch("/api/admin/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          carInfo: formData.carInfo ? JSON.parse(formData.carInfo) : null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Member added successfully",
        })
        setShowAddDialog(false)
        setFormData({
          name: "",
          email: "",
          phone: "",
          clubId: "",
          role: "member",
          membershipStatus: "active",
          bio: "",
          carInfo: "",
          membershipTier: "",
        })
        fetchMembers()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to add member",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add member",
        variant: "destructive",
      })
    }
  }

  const handleEditMember = async () => {
    if (!selectedMember) return

    try {
      const response = await fetch(`/api/admin/members/${selectedMember.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          carInfo: formData.carInfo ? JSON.parse(formData.carInfo) : null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Member updated successfully",
        })
        setShowEditDialog(false)
        setSelectedMember(null)
        fetchMembers()
      } else {
        toast({
          title: "Error",
          description: data.error || "Failed to update member",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update member",
        variant: "destructive",
      })
    }
  }

  const handleDeleteMember = async (memberId: number) => {
    if (!confirm("Are you sure you want to delete this member?")) return

    try {
      const response = await fetch(`/api/admin/members/${memberId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Member deleted successfully",
        })
        fetchMembers()
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Failed to delete member",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete member",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (member: Member) => {
    setSelectedMember(member)
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || "",
      clubId: member.club?.id.toString() || "",
      role: member.role,
      membershipStatus: member.membershipStatus,
      bio: member.bio || "",
      carInfo: member.carInfo ? JSON.stringify(member.carInfo, null, 2) : "",
      membershipTier: member.membershipTier || "",
    })
    setShowEditDialog(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600 text-white"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-600 text-white"><Clock className="w-3 h-3 mr-1" />Pending</Badge>
      case "expired":
        return <Badge className="bg-red-600 text-white"><XCircle className="w-3 h-3 mr-1" />Expired</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Member Management
            </h1>
            <p className="text-gray-400 mt-2">
              Manage club members, applications, and renewals
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[625px] bg-gray-900 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New Member</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Create a new member profile
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-white">Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-black/40 border-gray-700 text-white"
                        placeholder="Member name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-black/40 border-gray-700 text-white"
                        placeholder="member@example.com"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-white">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="bg-black/40 border-gray-700 text-white"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="club" className="text-white">Chapter</Label>
                      <Select value={formData.clubId} onValueChange={(value) => setFormData({ ...formData, clubId: value })}>
                        <SelectTrigger className="bg-black/40 border-gray-700 text-white">
                          <SelectValue placeholder="Select chapter" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          {clubs.map((club) => (
                            <SelectItem key={club.id} value={club.id.toString()} className="text-white">
                              {club.name} - {club.location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="role" className="text-white">Role</Label>
                      <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                        <SelectTrigger className="bg-black/40 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="member" className="text-white">Member</SelectItem>
                          <SelectItem value="officer" className="text-white">Officer</SelectItem>
                          <SelectItem value="admin" className="text-white">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="status" className="text-white">Status</Label>
                      <Select value={formData.membershipStatus} onValueChange={(value) => setFormData({ ...formData, membershipStatus: value })}>
                        <SelectTrigger className="bg-black/40 border-gray-700 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="active" className="text-white">Active</SelectItem>
                          <SelectItem value="pending" className="text-white">Pending</SelectItem>
                          <SelectItem value="expired" className="text-white">Expired</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tier" className="text-white">Tier</Label>
                      <Select value={formData.membershipTier} onValueChange={(value) => setFormData({ ...formData, membershipTier: value })}>
                        <SelectTrigger className="bg-black/40 border-gray-700 text-white">
                          <SelectValue placeholder="Select tier" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-900 border-gray-700">
                          <SelectItem value="basic" className="text-white">Basic</SelectItem>
                          <SelectItem value="premium" className="text-white">Premium</SelectItem>
                          <SelectItem value="lifetime" className="text-white">Lifetime</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio" className="text-white">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="bg-black/40 border-gray-700 text-white"
                      placeholder="Member bio..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="carInfo" className="text-white">Car Information (JSON)</Label>
                    <Textarea
                      id="carInfo"
                      value={formData.carInfo}
                      onChange={(e) => setFormData({ ...formData, carInfo: e.target.value })}
                      className="bg-black/40 border-gray-700 text-white"
                      placeholder='{"make": "Lincoln", "model": "Continental", "year": 1967}'
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                    className="border-gray-700 text-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddMember}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Add Member
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-black/40 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Members</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active</p>
                <p className="text-2xl font-bold text-white">{stats.active}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Expired</p>
                <p className="text-2xl font-bold text-white">{stats.expired}</p>
              </div>
              <UserX className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-black/40 border-gray-700 text-white"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px] bg-black/40 border-gray-700 text-white">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="all" className="text-white">All Status</SelectItem>
            <SelectItem value="active" className="text-white">Active</SelectItem>
            <SelectItem value="pending" className="text-white">Pending</SelectItem>
            <SelectItem value="expired" className="text-white">Expired</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedClub} onValueChange={setSelectedClub}>
          <SelectTrigger className="w-[200px] bg-black/40 border-gray-700 text-white">
            <SelectValue placeholder="All Chapters" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="all" className="text-white">All Chapters</SelectItem>
            {clubs.map((club) => (
              <SelectItem key={club.id} value={club.id.toString()} className="text-white">
                {club.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Members Table */}
      <Card className="bg-black/40 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Members</CardTitle>
          <CardDescription className="text-gray-400">
            {loading ? "Loading members..." : `${members.length} members found`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading members...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto text-gray-500 mb-4" />
              <p className="text-gray-400">No members found</p>
              <p className="text-sm text-gray-500 mt-2">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Member</TableHead>
                    <TableHead className="text-gray-300">Chapter</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Role</TableHead>
                    <TableHead className="text-gray-300">Joined</TableHead>
                    <TableHead className="text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id} className="border-gray-700 hover:bg-gray-800/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                            {member.profileImageUrl ? (
                              <img
                                src={member.profileImageUrl}
                                alt={member.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <span className="text-sm font-medium text-white">
                                {member.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white">{member.name}</p>
                            <p className="text-sm text-gray-400">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-white">
                          {member.club?.name || "No chapter"}
                        </div>
                        <div className="text-sm text-gray-400">
                          {member.club?.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(member.membershipStatus)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-white">
                          {member.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {formatDate(member.joinDate)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-gray-900 border-gray-700">
                            <DropdownMenuItem
                              onClick={() => openEditDialog(member)}
                              className="text-white hover:bg-gray-800"
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-gray-800">
                              <Eye className="mr-2 h-4 w-4" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-white hover:bg-gray-800">
                              <Mail className="mr-2 h-4 w-4" />
                              Send Email
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-gray-700" />
                            <DropdownMenuItem
                              onClick={() => handleDeleteMember(member.id)}
                              className="text-red-400 hover:bg-gray-800"
                            >
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="border-gray-700 text-gray-300"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="border-gray-700 text-gray-300"
          >
            Next
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[625px] bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Member</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update member information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name" className="text-white">Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-black/40 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-email" className="text-white">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-black/40 border-gray-700 text-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-phone" className="text-white">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-black/40 border-gray-700 text-white"
                />
              </div>
              <div>
                <Label htmlFor="edit-club" className="text-white">Chapter</Label>
                <Select value={formData.clubId} onValueChange={(value) => setFormData({ ...formData, clubId: value })}>
                  <SelectTrigger className="bg-black/40 border-gray-700 text-white">
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {clubs.map((club) => (
                      <SelectItem key={club.id} value={club.id.toString()} className="text-white">
                        {club.name} - {club.location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="edit-role" className="text-white">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger className="bg-black/40 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="member" className="text-white">Member</SelectItem>
                    <SelectItem value="officer" className="text-white">Officer</SelectItem>
                    <SelectItem value="admin" className="text-white">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-status" className="text-white">Status</Label>
                <Select value={formData.membershipStatus} onValueChange={(value) => setFormData({ ...formData, membershipStatus: value })}>
                  <SelectTrigger className="bg-black/40 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="active" className="text-white">Active</SelectItem>
                    <SelectItem value="pending" className="text-white">Pending</SelectItem>
                    <SelectItem value="expired" className="text-white">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-tier" className="text-white">Tier</Label>
                <Select value={formData.membershipTier} onValueChange={(value) => setFormData({ ...formData, membershipTier: value })}>
                  <SelectTrigger className="bg-black/40 border-gray-700 text-white">
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    <SelectItem value="basic" className="text-white">Basic</SelectItem>
                    <SelectItem value="premium" className="text-white">Premium</SelectItem>
                    <SelectItem value="lifetime" className="text-white">Lifetime</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-bio" className="text-white">Bio</Label>
              <Textarea
                id="edit-bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="bg-black/40 border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="edit-carInfo" className="text-white">Car Information (JSON)</Label>
              <Textarea
                id="edit-carInfo"
                value={formData.carInfo}
                onChange={(e) => setFormData({ ...formData, carInfo: e.target.value })}
                className="bg-black/40 border-gray-700 text-white"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowEditDialog(false)}
              className="border-gray-700 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditMember}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}