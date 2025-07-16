"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  Package,
  ShoppingCart,
  BarChart3,
  DollarSign,
  Truck
} from "lucide-react"

export default function AdminStorePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading products
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Store Management
            </h1>
            <p className="text-gray-400 mt-2">
              Manage products, orders, and inventory for the club store
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="bg-black/40 border border-gray-700 backdrop-blur-sm">
          <TabsTrigger value="products" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <Package className="w-4 h-4 mr-2" />
            Products
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="inventory" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <BarChart3 className="w-4 h-4 mr-2" />
            Inventory
          </TabsTrigger>
          <TabsTrigger value="shipping" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
            <Truck className="w-4 h-4 mr-2" />
            Shipping
          </TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/40 border-gray-700 text-white"
            />
          </div>
        </div>

        <TabsContent value="products" className="space-y-4">
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Product Catalog</CardTitle>
              <CardDescription className="text-gray-400">
                Manage club merchandise and products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">Product management system coming soon...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Features will include product listings, pricing, and variant management
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Order Management</CardTitle>
              <CardDescription className="text-gray-400">
                Track and manage customer orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                <p className="text-gray-400">Order tracking system coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Inventory Management</CardTitle>
              <CardDescription className="text-gray-400">
                Track stock levels and inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <p className="text-gray-400">Inventory tracking system coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-4">
          <Card className="bg-black/40 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Shipping & Fulfillment</CardTitle>
              <CardDescription className="text-gray-400">
                Manage shipping and order fulfillment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Truck className="w-16 h-16 mx-auto text-purple-500 mb-4" />
                <p className="text-gray-400">Shipping management system coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}