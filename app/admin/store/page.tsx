"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Loader2, Plus, DollarSign, Package, ShoppingCart, TrendingUp, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminNav from "@/components/admin/admin-nav"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { useAuth } from "@/hooks/use-auth"

interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  stock: number
  sold: number
  status: "active" | "inactive" | "out_of_stock"
  imageUrl?: string
  sku: string
}

interface Order {
  id: number
  orderNumber: string
  customerName: string
  customerEmail: string
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  items: number
  date: string
}

export default function StorePage() {
  const { isLoading: authLoading } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // Mock data for demonstration
  useEffect(() => {
    if (authLoading) return
    
    // Simulate API call
    setTimeout(() => {
      setProducts([
        {
          id: 1,
          name: "Suicide Kings T-Shirt",
          description: "Premium cotton t-shirt with club logo",
          price: 25.99,
          category: "Apparel",
          stock: 50,
          sold: 125,
          status: "active",
          imageUrl: "/images/tshirt.jpg",
          sku: "SK-TS-001"
        },
        {
          id: 2,
          name: "Club Sticker Pack",
          description: "Set of 5 vinyl stickers",
          price: 9.99,
          category: "Accessories",
          stock: 200,
          sold: 89,
          status: "active",
          imageUrl: "/images/stickers.jpg",
          sku: "SK-ST-001"
        },
        {
          id: 3,
          name: "Racing Jacket",
          description: "Embroidered racing jacket",
          price: 89.99,
          category: "Apparel",
          stock: 0,
          sold: 45,
          status: "out_of_stock",
          imageUrl: "/images/jacket.jpg",
          sku: "SK-JK-001"
        },
        {
          id: 4,
          name: "Car Club License Plate Frame",
          description: "Custom license plate frame",
          price: 15.99,
          category: "Car Accessories",
          stock: 75,
          sold: 78,
          status: "active",
          sku: "SK-LPF-001"
        }
      ])

      setOrders([
        {
          id: 1,
          orderNumber: "SK-2024-001",
          customerName: "John Smith",
          customerEmail: "john@example.com",
          total: 35.98,
          status: "shipped",
          items: 2,
          date: "2024-06-20"
        },
        {
          id: 2,
          orderNumber: "SK-2024-002",
          customerName: "Sarah Johnson",
          customerEmail: "sarah@example.com",
          total: 89.99,
          status: "processing",
          items: 1,
          date: "2024-06-22"
        },
        {
          id: 3,
          orderNumber: "SK-2024-003",
          customerName: "Mike Davis",
          customerEmail: "mike@example.com",
          total: 51.97,
          status: "pending",
          items: 3,
          date: "2024-06-24"
        }
      ])
      setLoading(false)
    }, 1000)
  }, [authLoading])

  const getProductStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>
      case "out_of_stock":
        return <Badge variant="destructive">Out of Stock</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getOrderStatusBadge = (status: string) => {
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

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
  const totalProducts = products.length
  const totalOrders = orders.length
  const lowStockProducts = products.filter(p => p.stock < 10 && p.stock > 0).length

  return (
    <div className="min-h-screen bg-gray-900">
      <AdminNav />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Store Management</h1>
            <Button className="bg-white text-black hover:bg-gray-200" asChild>
              <Link href="/admin/store/products/create">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-green-500/20 p-3">
                  <DollarSign className="h-6 w-6 text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
                  <p className="text-sm text-gray-400">Total Revenue</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-500/20 p-3">
                  <Package className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{totalProducts}</p>
                  <p className="text-sm text-gray-400">Products</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-purple-500/20 p-3">
                  <ShoppingCart className="h-6 w-6 text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{totalOrders}</p>
                  <p className="text-sm text-gray-400">Orders</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-800 bg-black p-6">
              <div className="flex items-center">
                <div className="rounded-full bg-yellow-500/20 p-3">
                  <TrendingUp className="h-6 w-6 text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-white">{lowStockProducts}</p>
                  <p className="text-sm text-gray-400">Low Stock</p>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          ) : (
            <Tabs defaultValue="products" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="inventory">Inventory</TabsTrigger>
              </TabsList>

              <TabsContent value="products" className="space-y-4">
                <div className="rounded-lg border border-gray-800 bg-black overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead className="text-gray-300">Product</TableHead>
                        <TableHead className="text-gray-300">Category</TableHead>
                        <TableHead className="text-gray-300">Price</TableHead>
                        <TableHead className="text-gray-300">Stock</TableHead>
                        <TableHead className="text-gray-300">Sold</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id} className="border-gray-800">
                          <TableCell className="text-white">
                            <div className="flex items-center space-x-3">
                              {product.imageUrl && (
                                <div className="relative h-10 w-10">
                                  <Image
                                    src={product.imageUrl}
                                    alt={product.name}
                                    fill
                                    className="rounded object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{product.name}</div>
                                <div className="text-sm text-gray-400">{product.sku}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">{product.category}</TableCell>
                          <TableCell className="text-gray-300">${product.price}</TableCell>
                          <TableCell className="text-gray-300">{product.stock}</TableCell>
                          <TableCell className="text-gray-300">{product.sold}</TableCell>
                          <TableCell>{getProductStatusBadge(product.status)}</TableCell>
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
                                  <Link href={`/admin/store/products/${product.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/store/products/${product.id}/edit`}>
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
                </div>
              </TabsContent>

              <TabsContent value="orders" className="space-y-4">
                <div className="rounded-lg border border-gray-800 bg-black overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800">
                        <TableHead className="text-gray-300">Order #</TableHead>
                        <TableHead className="text-gray-300">Customer</TableHead>
                        <TableHead className="text-gray-300">Items</TableHead>
                        <TableHead className="text-gray-300">Total</TableHead>
                        <TableHead className="text-gray-300">Status</TableHead>
                        <TableHead className="text-gray-300">Date</TableHead>
                        <TableHead className="text-gray-300 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id} className="border-gray-800">
                          <TableCell className="text-white font-medium">{order.orderNumber}</TableCell>
                          <TableCell className="text-gray-300">
                            <div>
                              <div>{order.customerName}</div>
                              <div className="text-sm text-gray-400">{order.customerEmail}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-300">{order.items}</TableCell>
                          <TableCell className="text-gray-300">${order.total.toFixed(2)}</TableCell>
                          <TableCell>{getOrderStatusBadge(order.status)}</TableCell>
                          <TableCell className="text-gray-300">
                            {new Date(order.date).toLocaleDateString()}
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
                                  <Link href={`/admin/store/orders/${order.id}`}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Order
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Update Status
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="inventory" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => (
                    <div key={product.id} className="rounded-lg border border-gray-800 bg-black p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-white">{product.name}</h3>
                        {getProductStatusBadge(product.status)}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Current Stock:</span>
                          <span className={`text-white ${product.stock < 10 ? 'text-red-400' : ''}`}>
                            {product.stock}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Total Sold:</span>
                          <span className="text-white">{product.sold}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">SKU:</span>
                          <span className="text-white">{product.sku}</span>
                        </div>
                      </div>
                      {product.stock < 10 && product.stock > 0 && (
                        <div className="mt-4 p-2 bg-yellow-500/20 rounded text-yellow-400 text-sm">
                          ⚠️ Low stock warning
                        </div>
                      )}
                      {product.stock === 0 && (
                        <div className="mt-4 p-2 bg-red-500/20 rounded text-red-400 text-sm">
                          🚫 Out of stock
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  )
}