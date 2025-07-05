"use client"

import { useState, useEffect } from "react"
import { Loader2, BarChart, Download, Calendar, Users, DollarSign, TrendingUp, TrendingDown, FileText, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AdminNav from "@/components/admin/admin-nav"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { useAuth } from "@/hooks/use-auth"

interface ReportData {
  membershipGrowth: Array<{ month: string; count: number; growth: number }>
  revenueData: Array<{ month: string; revenue: number; expenses: number }>
  eventAttendance: Array<{ event: string; date: string; attendees: number; capacity: number }>
  topMembers: Array<{ name: string; chapter: string; events: number; spending: number }>
}

interface Report {
  id: number
  name: string
  type: string
  description: string
  lastGenerated: string
  size: string
  status: "ready" | "generating" | "error"
}

export default function ReportsPage() {
  const { isLoading: authLoading } = useAuth()
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("6months")

  // Mock data for demonstration
  useEffect(() => {
    if (authLoading) return
    
    // Simulate API call
    setTimeout(() => {
      setReportData({
        membershipGrowth: [
          { month: "Jan", count: 85, growth: 5.2 },
          { month: "Feb", count: 92, growth: 8.2 },
          { month: "Mar", count: 97, growth: 5.4 },
          { month: "Apr", count: 103, growth: 6.2 },
          { month: "May", count: 108, growth: 4.9 },
          { month: "Jun", count: 115, growth: 6.5 }
        ],
        revenueData: [
          { month: "Jan", revenue: 4250, expenses: 2100 },
          { month: "Feb", revenue: 4600, expenses: 2300 },
          { month: "Mar", revenue: 4850, expenses: 2800 },
          { month: "Apr", revenue: 5150, expenses: 2650 },
          { month: "May", revenue: 5400, expenses: 2400 },
          { month: "Jun", revenue: 5750, expenses: 2900 }
        ],
        eventAttendance: [
          { event: "Monthly Car Meet", date: "2024-06-15", attendees: 45, capacity: 50 },
          { event: "Track Day", date: "2024-06-22", attendees: 22, capacity: 25 },
          { event: "BBQ Social", date: "2024-06-08", attendees: 38, capacity: 40 },
          { event: "Charity Show", date: "2024-05-25", attendees: 67, capacity: 75 }
        ],
        topMembers: [
          { name: "John Smith", chapter: "Los Angeles", events: 8, spending: 245.50 },
          { name: "Sarah Johnson", chapter: "Inland Empire", events: 6, spending: 189.75 },
          { name: "Mike Davis", chapter: "Los Angeles", events: 7, spending: 312.25 },
          { name: "Lisa Wilson", chapter: "Northern CA", events: 5, spending: 156.00 }
        ]
      })

      setReports([
        {
          id: 1,
          name: "Monthly Membership Report",
          type: "Membership",
          description: "Detailed membership statistics and analytics",
          lastGenerated: "2024-06-24T10:30:00Z",
          size: "2.3 MB",
          status: "ready"
        },
        {
          id: 2,
          name: "Financial Summary Q2 2024",
          type: "Financial",
          description: "Quarterly financial performance report",
          lastGenerated: "2024-06-30T15:45:00Z",
          size: "1.8 MB",
          status: "ready"
        },
        {
          id: 3,
          name: "Event Attendance Analysis",
          type: "Events",
          description: "Event performance and attendance trends",
          lastGenerated: "2024-06-20T09:15:00Z",
          size: "3.1 MB",
          status: "generating"
        },
        {
          id: 4,
          name: "Chapter Performance Report",
          type: "Analytics",
          description: "Performance comparison across all chapters",
          lastGenerated: "2024-06-18T14:20:00Z",
          size: "4.2 MB",
          status: "ready"
        }
      ])

      setLoading(false)
    }, 1000)
  }, [authLoading])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-green-500">Ready</Badge>
      case "generating":
        return <Badge className="bg-blue-500">Generating</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
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

  if (loading || !reportData) {
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

  const currentMonth = reportData.membershipGrowth[reportData.membershipGrowth.length - 1]
  const currentRevenue = reportData.revenueData[reportData.revenueData.length - 1]
  const totalRevenue = reportData.revenueData.reduce((sum, item) => sum + item.revenue, 0)
  const totalExpenses = reportData.revenueData.reduce((sum, item) => sum + item.expenses, 0)
  const avgAttendanceRate = reportData.eventAttendance.reduce((sum, event) => sum + (event.attendees / event.capacity), 0) / reportData.eventAttendance.length

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminNav />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
            <div className="flex space-x-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="border-gray-700 bg-gray-800 text-white w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30days">30 Days</SelectItem>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                <Download className="mr-2 h-4 w-4" />
                Export All
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <Card className="border-gray-800 bg-black">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-500/20 p-3">
                    <Users className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-white">{currentMonth.count}</p>
                    <p className="text-sm text-gray-400">Total Members</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                      <span className="text-xs text-green-400">+{currentMonth.growth}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-black">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-green-500/20 p-3">
                    <DollarSign className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">Total Revenue</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                      <span className="text-xs text-green-400">+12.3%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-black">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-purple-500/20 p-3">
                    <Calendar className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-white">{reportData.eventAttendance.length}</p>
                    <p className="text-sm text-gray-400">Events This Period</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-400">{(avgAttendanceRate * 100).toFixed(1)}% attendance</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-black">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="rounded-full bg-yellow-500/20 p-3">
                    <BarChart className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-white">${(totalRevenue - totalExpenses).toLocaleString()}</p>
                    <p className="text-sm text-gray-400">Net Profit</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                      <span className="text-xs text-green-400">+8.7%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="membership">Membership</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="reports">Generated Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-gray-800 bg-black">
                  <CardHeader>
                    <CardTitle className="text-white">Membership Growth</CardTitle>
                    <CardDescription className="text-gray-400">
                      Member count over the past 6 months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reportData.membershipGrowth.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-300">{item.month}</span>
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{item.count}</span>
                            <div className="flex items-center">
                              {item.growth >= 0 ? (
                                <TrendingUp className="h-3 w-3 text-green-400 mr-1" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-red-400 mr-1" />
                              )}
                              <span className={`text-xs ${item.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                {item.growth > 0 ? '+' : ''}{item.growth}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-black">
                  <CardHeader>
                    <CardTitle className="text-white">Revenue vs Expenses</CardTitle>
                    <CardDescription className="text-gray-400">
                      Financial performance over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reportData.revenueData.map((item, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-300">{item.month}</span>
                            <span className="text-white">${(item.revenue - item.expenses).toLocaleString()}</span>
                          </div>
                          <div className="flex space-x-2">
                            <div className="flex-1 bg-gray-800 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full"
                                style={{ width: `${(item.revenue / 6000) * 100}%` }}
                              ></div>
                            </div>
                            <div className="flex-1 bg-gray-800 rounded-full h-2">
                              <div
                                className="bg-red-500 h-2 rounded-full"
                                style={{ width: `${(item.expenses / 6000) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-gray-800 bg-black">
                <CardHeader>
                  <CardTitle className="text-white">Recent Event Performance</CardTitle>
                  <CardDescription className="text-gray-400">
                    Attendance rates for recent events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead className="text-gray-300">Event</TableHead>
                        <TableHead className="text-gray-300">Date</TableHead>
                        <TableHead className="text-gray-300">Attendance</TableHead>
                        <TableHead className="text-gray-300">Rate</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reportData.eventAttendance.map((event, index) => {
                        const rate = (event.attendees / event.capacity) * 100
                        return (
                          <TableRow key={index} className="border-gray-800">
                            <TableCell className="text-white">{event.event}</TableCell>
                            <TableCell className="text-gray-300">
                              {new Date(event.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-gray-300">
                              {event.attendees} / {event.capacity}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-gray-800 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full ${rate >= 80 ? 'bg-green-500' : rate >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ width: `${rate}%` }}
                                  ></div>
                                </div>
                                <span className="text-white text-sm">{rate.toFixed(0)}%</span>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="membership" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-gray-800 bg-black">
                  <CardHeader>
                    <CardTitle className="text-white">Top Active Members</CardTitle>
                    <CardDescription className="text-gray-400">
                      Most engaged members by events and spending
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {reportData.topMembers.map((member, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <div className="text-white font-medium">{member.name}</div>
                            <div className="text-sm text-gray-400">{member.chapter}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-white">{member.events} events</div>
                            <div className="text-sm text-green-400">${member.spending}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-black">
                  <CardHeader>
                    <CardTitle className="text-white">Chapter Distribution</CardTitle>
                    <CardDescription className="text-gray-400">
                      Member distribution across chapters
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["Los Angeles", "Inland Empire", "Northern CA", "Washington", "Coachella Valley"].map((chapter) => {
                        const memberCount = Math.floor(Math.random() * 25) + 15
                        const percentage = (memberCount / currentMonth.count) * 100
                        return (
                          <div key={chapter} className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-300">{chapter}</span>
                              <span className="text-white">{memberCount} ({percentage.toFixed(1)}%)</span>
                            </div>
                            <div className="w-full bg-gray-800 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="financial" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-gray-800 bg-black">
                  <CardHeader>
                    <CardTitle className="text-white">Revenue Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Membership Dues</span>
                        <span className="text-white">68%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Event Fees</span>
                        <span className="text-white">22%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Store Sales</span>
                        <span className="text-white">10%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-black">
                  <CardHeader>
                    <CardTitle className="text-white">Expense Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Event Costs</span>
                        <span className="text-white">45%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Insurance</span>
                        <span className="text-white">25%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Operations</span>
                        <span className="text-white">30%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-gray-800 bg-black">
                  <CardHeader>
                    <CardTitle className="text-white">Profit Margin</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400">47%</div>
                      <div className="text-sm text-gray-400">Average Monthly</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <Card className="border-gray-800 bg-black">
                <CardHeader>
                  <CardTitle className="text-white">Available Reports</CardTitle>
                  <CardDescription className="text-gray-400">
                    Download or regenerate detailed reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead className="text-gray-300">Report Name</TableHead>
                        <TableHead className="text-gray-300">Type</TableHead>
                        <TableHead className="text-gray-300">Last Generated</TableHead>
                        <TableHead className="text-gray-300">Size</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reports.map((report) => (
                        <TableRow key={report.id} className="border-gray-800">
                          <TableCell className="text-white">
                            <div>
                              <div className="font-medium">{report.name}</div>
                              <div className="text-sm text-gray-400">{report.description}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{report.type}</Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {new Date(report.lastGenerated).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-gray-300">{report.size}</TableCell>
                          <TableCell>{getStatusBadge(report.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              {report.status === "ready" && (
                                <Button variant="ghost" size="sm">
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}