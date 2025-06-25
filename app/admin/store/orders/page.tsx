"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader2, Package, Truck, CheckCircle, XCircle, Eye, Edit, Search, Filter } from "lucide-react"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import AdminNav from "@/components/admin/admin-nav"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { useAuth } from "@/hooks/use-auth"

interface OrderItem {
  productId: number
  productName: string
  sku: string
  quantity: number
  price: number
}

interface Order {
  id: number
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded"
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  orderDate: string
  shippedDate?: string
  deliveredDate?: string
  trackingNumber?: string
  notes?: string
}

export default function StoreOrdersPage() {
  const { isLoading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Mock data for demonstration
  useEffect(() => {
    if (authLoading) return
    
    // Simulate API call
    setTimeout(() => {
      setOrders([
        {
          id: 1,
          orderNumber: "SK-2024-001",
          customerName: "John Smith",
          customerEmail: "john@example.com",
          customerPhone: "(555) 123-4567",
          shippingAddress: {
            street: "123 Main St",
            city: "Los Angeles",
            state: "CA",
            zipCode: "90210"
          },
          items: [
            {
              productId: 1,
              productName: "Suicide Kings T-Shirt",
              sku: "SK-TS-001",
              quantity: 2,
              price: 25.99
            },
            {
              productId: 2,
              productName: "Club Sticker Pack",
              sku: "SK-ST-001",
              quantity: 1,
              price: 9.99
            }
          ],
          subtotal: 61.97,
          shipping: 8.99,
          tax: 5.52,
          total: 76.48,
          status: "shipped",
          paymentStatus: "paid",
          orderDate: "2024-06-20T10:30:00Z",
          shippedDate: "2024-06-22T14:20:00Z",
          trackingNumber: "1Z12345E1234567890",
          notes: "Customer requested expedited shipping"
        },
        {
          id: 2,
          orderNumber: "SK-2024-002",
          customerName: "Sarah Johnson",
          customerEmail: "sarah@example.com",
          shippingAddress: {
            street: "456 Oak Ave",
            city: "San Francisco",
            state: "CA",
            zipCode: "94102"
          },
          items: [
            {
              productId: 3,
              productName: "Racing Jacket",
              sku: "SK-JK-001",
              quantity: 1,
              price: 89.99
            }
          ],
          subtotal: 89.99,
          shipping: 12.99,
          tax: 8.19,
          total: 111.17,
          status: "processing",
          paymentStatus: "paid",
          orderDate: "2024-06-22T09:45:00Z"
        },
        {
          id: 3,
          orderNumber: "SK-2024-003",
          customerName: "Mike Davis",
          customerEmail: "mike@example.com",
          shippingAddress: {
            street: "789 Pine St",
            city: "Seattle",
            state: "WA",
            zipCode: "98101"
          },
          items: [
            {
              productId: 1,
              productName: "Suicide Kings T-Shirt",
              sku: "SK-TS-001",
              quantity: 1,
              price: 25.99
            },
            {
              productId: 4,
              productName: "License Plate Frame",
              sku: "SK-LPF-001",
              quantity: 2,
              price: 15.99
            }
          ],
          subtotal: 57.97,
          shipping: 8.99,
          tax: 5.45,
          total: 72.41,
          status: "pending",
          paymentStatus: "pending",
          orderDate: "2024-06-24T16:30:00Z"
        }
      ])
      setLoading(false)
    }, 1000)
  }, [authLoading])

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter
    
    return matchesSearch && matchesStatus && matchesPayment
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "processing":
        return <Badge className="bg-blue-500">Processing</Badge>
      case "shipped":
        return <Badge className="bg-purple-500">Shipped</Badge>
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      case "refunded":
        return <Badge variant="outline">Refunded</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500">Paid</Badge>
      case "pending":
        return <Badge variant="secondary">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      case "refunded":
        return <Badge variant="outline">Refunded</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const updateOrderStatus = async (orderId: number, newStatus: Order['status']) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
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
            <h1 className="text-2xl font-bold text-white">Store Orders</h1>
            <p className="text-gray-400">Manage and track customer orders</p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search orders..."
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
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="border-gray-700 bg-gray-800 text-white w-48">
                <SelectValue placeholder="Filter by payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending Payment</SelectItem>
                <SelectItem value="failed">Failed Payment</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
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
                    <TableHead className="text-gray-300">Order #</TableHead>
                    <TableHead className="text-gray-300">Customer</TableHead>
                    <TableHead className="text-gray-300">Items</TableHead>
                    <TableHead className="text-gray-300">Total</TableHead>
                    <TableHead className="text-gray-300">Order Status</TableHead>
                    <TableHead className="text-gray-300">Payment</TableHead>
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="border-gray-800">
                      <TableCell className="text-white font-medium">
                        <div>
                          <div>{order.orderNumber}</div>
                          {order.trackingNumber && (
                            <div className="text-xs text-gray-400">
                              Tracking: {order.trackingNumber}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div>
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-gray-400">{order.customerEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        <div>
                          <div>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
                          <div className="text-sm text-gray-400">
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} total qty
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-white font-medium">${order.total.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{getPaymentBadge(order.paymentStatus)}</TableCell>
                      <TableCell className="text-gray-300">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setSelectedOrder(order)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="border-gray-800 bg-gray-900 max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="text-white">Order Details</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                  Complete order information and items
                                </DialogDescription>
                              </DialogHeader>
                              {selectedOrder && (
                                <div className="space-y-6">
                                  {/* Order Info */}
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Order Number</label>
                                      <p className="text-white">{selectedOrder.orderNumber}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Order Date</label>
                                      <p className="text-white">{new Date(selectedOrder.orderDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Customer</label>
                                      <p className="text-white">{selectedOrder.customerName}</p>
                                      <p className="text-sm text-gray-400">{selectedOrder.customerEmail}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Status</label>
                                      <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
                                    </div>
                                  </div>

                                  {/* Shipping Address */}
                                  <div>
                                    <label className="text-sm font-medium text-gray-300">Shipping Address</label>
                                    <div className="text-white mt-1">
                                      <p>{selectedOrder.shippingAddress.street}</p>
                                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                                    </div>
                                  </div>

                                  {/* Order Items */}
                                  <div>
                                    <label className="text-sm font-medium text-gray-300">Order Items</label>
                                    <div className="mt-2 space-y-2">
                                      {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-800 rounded">
                                          <div>
                                            <p className="text-white font-medium">{item.productName}</p>
                                            <p className="text-sm text-gray-400">SKU: {item.sku}</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="text-white">{item.quantity} × ${item.price.toFixed(2)}</p>
                                            <p className="text-sm text-gray-400">${(item.quantity * item.price).toFixed(2)}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Order Total */}
                                  <div className="border-t border-gray-700 pt-4">
                                    <div className="space-y-2">
                                      <div className="flex justify-between text-gray-300">
                                        <span>Subtotal:</span>
                                        <span>${selectedOrder.subtotal.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between text-gray-300">
                                        <span>Shipping:</span>
                                        <span>${selectedOrder.shipping.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between text-gray-300">
                                        <span>Tax:</span>
                                        <span>${selectedOrder.tax.toFixed(2)}</span>
                                      </div>
                                      <div className="flex justify-between text-white font-bold text-lg border-t border-gray-700 pt-2">
                                        <span>Total:</span>
                                        <span>${selectedOrder.total.toFixed(2)}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {selectedOrder.notes && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-300">Notes</label>
                                      <p className="text-white mt-1">{selectedOrder.notes}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Update Status</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "processing")}>
                                <Package className="mr-2 h-4 w-4" />
                                Mark as Processing
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "shipped")}>
                                <Truck className="mr-2 h-4 w-4" />
                                Mark as Shipped
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "delivered")}>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Mark as Delivered
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "cancelled")} className="text-red-600">
                                <XCircle className="mr-2 h-4 w-4" />
                                Cancel Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredOrders.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  No orders found matching your criteria.
                </div>
              )}
            </div>
          )}

          {/* Stats Cards */}
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-2xl font-bold text-white">{orders.length}</p>
                  <p className="text-sm text-gray-400">Total Orders</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-2xl font-bold text-yellow-400">
                    {orders.filter(o => o.status === "pending").length}
                  </p>
                  <p className="text-sm text-gray-400">Pending Orders</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-2xl font-bold text-blue-400">
                    {orders.filter(o => o.status === "processing").length}
                  </p>
                  <p className="text-sm text-gray-400">Processing</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div>
                  <p className="text-2xl font-bold text-green-400">
                    ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-400">Total Revenue</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}