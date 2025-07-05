"use client"

import { useState, useEffect } from "react"
import { Loader2, DollarSign, TrendingUp, CreditCard, Receipt, Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AdminNav from "@/components/admin/admin-nav"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { useAuth } from "@/hooks/use-auth"

interface Transaction {
  id: number
  type: "income" | "expense"
  category: string
  description: string
  amount: number
  date: string
  status: "completed" | "pending" | "failed"
  method: string
  reference?: string
}

interface MembershipPayment {
  id: number
  memberName: string
  memberEmail: string
  amount: number
  dueDate: string
  paidDate?: string
  status: "paid" | "overdue" | "pending"
  membershipType: string
}

export default function FinancesPage() {
  const { isLoading: authLoading } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [payments, setPayments] = useState<MembershipPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [filterPeriod, setFilterPeriod] = useState("30")

  // Mock data for demonstration
  useEffect(() => {
    if (authLoading) return
    
    // Simulate API call
    setTimeout(() => {
      setTransactions([
        {
          id: 1,
          type: "income",
          category: "Membership Dues",
          description: "Monthly membership payment - John Smith",
          amount: 50.00,
          date: "2024-06-20T10:30:00Z",
          status: "completed",
          method: "PayPal",
          reference: "PP-001-2024"
        },
        {
          id: 2,
          type: "expense",
          category: "Event Costs",
          description: "Track day facility rental",
          amount: 1200.00,
          date: "2024-06-18T14:20:00Z",
          status: "completed",
          method: "Bank Transfer",
          reference: "BT-002-2024"
        },
        {
          id: 3,
          type: "income",
          category: "Store Sales",
          description: "T-shirt and sticker sales",
          amount: 89.99,
          date: "2024-06-22T09:45:00Z",
          status: "completed",
          method: "Credit Card"
        },
        {
          id: 4,
          type: "expense",
          category: "Insurance",
          description: "Event liability insurance",
          amount: 350.00,
          date: "2024-06-15T16:30:00Z",
          status: "pending",
          method: "Check"
        }
      ])

      setPayments([
        {
          id: 1,
          memberName: "John Smith",
          memberEmail: "john@example.com",
          amount: 50.00,
          dueDate: "2024-06-01",
          paidDate: "2024-06-02",
          status: "paid",
          membershipType: "Premium"
        },
        {
          id: 2,
          memberName: "Sarah Johnson",
          memberEmail: "sarah@example.com",
          amount: 30.00,
          dueDate: "2024-06-01",
          status: "overdue",
          membershipType: "Standard"
        },
        {
          id: 3,
          memberName: "Mike Davis",
          memberEmail: "mike@example.com",
          amount: 50.00,
          dueDate: "2024-07-01",
          status: "pending",
          membershipType: "Premium"
        }
      ])

      setLoading(false)
    }, 1000)
  }, [authLoading])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
      case "paid":
        return <Badge className="bg-green-500">Completed</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      case "overdue":
        return <Badge variant="destructive">Overdue</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getTypeColor = (type: string) => {
    return type === "income" ? "text-green-400" : "text-red-400"
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

  const totalIncome = transactions
    .filter(t => t.type === "income" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === "expense" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const netProfit = totalIncome - totalExpenses

  const overduePayments = payments.filter(p => p.status === "overdue").length
  const pendingPayments = payments.filter(p => p.status === "pending").length

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminNav />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Financial Management</h1>
            <div className="flex space-x-2">
              <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="border-gray-700 bg-gray-800 text-white w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="90">90 Days</SelectItem>
                  <SelectItem value="365">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-green-500/20 p-3">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-green-400">${totalIncome.toFixed(2)}</p>
                  <p className="text-sm text-gray-400">Total Income</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-red-500/20 p-3">
                  <DollarSign className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-red-400">${totalExpenses.toFixed(2)}</p>
                  <p className="text-sm text-gray-400">Total Expenses</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div className={`rounded-full p-3 ${netProfit >= 0 ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  <Receipt className={`h-6 w-6 ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                </div>
                <div className="ml-4">
                  <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    ${Math.abs(netProfit).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-400">Net {netProfit >= 0 ? 'Profit' : 'Loss'}</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-yellow-500/20 p-3">
                  <CreditCard className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{overduePayments}</p>
                  <p className="text-sm text-gray-400">Overdue Payments</p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          ) : (
            <Tabs defaultValue="transactions" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="memberships">Membership Payments</TabsTrigger>
              </TabsList>

              <TabsContent value="transactions" className="space-y-4">
                <div className="rounded-lg border border-gray-800 bg-black overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead className="text-gray-300">Date</TableHead>
                        <TableHead className="text-gray-300">Type</TableHead>
                        <TableHead className="text-gray-300">Category</TableHead>
                        <TableHead className="text-gray-300">Description</TableHead>
                        <TableHead className="text-gray-300">Amount</TableHead>
                        <TableHead className="text-gray-300">Method</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Reference</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((transaction) => (
                        <TableRow key={transaction.id} className="border-gray-800">
                          <TableCell className="text-gray-300">
                            {new Date(transaction.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={transaction.type === "income" ? "text-green-400" : "text-red-400"}
                            >
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">{transaction.category}</TableCell>
                          <TableCell className="text-white">{transaction.description}</TableCell>
                          <TableCell className={`font-medium ${getTypeColor(transaction.type)}`}>
                            {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                          </TableCell>
                          <TableCell className="text-gray-300">{transaction.method}</TableCell>
                          <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                          <TableCell className="text-gray-300">{transaction.reference || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="memberships" className="space-y-4">
                <div className="rounded-lg border border-gray-800 bg-black overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead className="text-gray-300">Member</TableHead>
                        <TableHead className="text-gray-300">Membership Type</TableHead>
                        <TableHead className="text-gray-300">Amount</TableHead>
                        <TableHead className="text-gray-300">Due Date</TableHead>
                        <TableHead className="text-gray-300">Paid Date</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {payments.map((payment) => (
                        <TableRow key={payment.id} className="border-gray-800">
                          <TableCell className="text-white">
                            <div>
                              <div className="font-medium">{payment.memberName}</div>
                              <div className="text-sm text-gray-400">{payment.memberEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">{payment.membershipType}</TableCell>
                          <TableCell className="text-white font-medium">${payment.amount.toFixed(2)}</TableCell>
                          <TableCell className="text-gray-300">
                            {new Date(payment.dueDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : "-"}
                          </TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell className="text-right">
                            {payment.status !== "paid" && (
                              <Button variant="ghost" size="sm" className="text-blue-400">
                                Send Reminder
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Payment Summary */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-gray-800 bg-black p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Payment Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Paid:</span>
                        <span className="text-green-400">{payments.filter(p => p.status === "paid").length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Pending:</span>
                        <span className="text-yellow-400">{pendingPayments}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Overdue:</span>
                        <span className="text-red-400">{overduePayments}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-800 bg-black p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Revenue Breakdown</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Membership Dues:</span>
                        <span className="text-white">
                          ${payments.filter(p => p.status === "paid").reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Expected This Month:</span>
                        <span className="text-gray-300">
                          ${payments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-800 bg-black p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Quick Actions</h3>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full border-gray-700 text-white hover:bg-gray-800">
                        Send Payment Reminders
                      </Button>
                      <Button variant="outline" size="sm" className="w-full border-gray-700 text-white hover:bg-gray-800">
                        Generate Invoice
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  )
}