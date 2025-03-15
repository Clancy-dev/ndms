"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, FileText, Check, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { format } from "date-fns"

// Mock data
const products = [
  { id: 1, name: "Classic Bread", categoryId: 1, sellingPrice: 2000, threshold: 10 },
  { id: 2, name: "Bus Bread", categoryId: 1, sellingPrice: 2500, threshold: 5 },
  { id: 3, name: "Milk Bread", categoryId: 1, sellingPrice: 3000, threshold: 8 },
]

const initialOrders = [
  {
    id: 1,
    date: new Date(2025, 2, 10),
    location: "Nakawa",
    status: "pending",
    items: [
      { productId: 1, quantity: 20, price: 2000 },
      { productId: 3, quantity: 15, price: 3000 },
    ],
  },
  {
    id: 2,
    date: new Date(2025, 2, 12),
    location: "Kireka",
    status: "approved",
    items: [{ productId: 2, quantity: 30, price: 2500 }],
  },
  {
    id: 3,
    date: new Date(2025, 2, 13),
    location: "Nansana",
    status: "delivered",
    items: [
      { productId: 1, quantity: 25, price: 2000 },
      { productId: 2, quantity: 15, price: 2500 },
      { productId: 3, quantity: 10, price: 3000 },
    ],
  },
]

export default function OrdersPage() {
  const [orders, setOrders] = useState(initialOrders)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newOrder, setNewOrder] = useState({
    location: "nakawa",
    items: [{ productId: "", quantity: 1 }],
  })

  const locations = ["nakawa", "kireka", "nansana"]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "approved":
        return "bg-blue-500"
      case "delivered":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getProductName = (productId: number) => {
    return products.find((p) => p.id === productId)?.name || "Unknown Product"
  }

  const handleAddItem = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { productId: "", quantity: 1 }],
    })
  }

  const handleRemoveItem = (index: number) => {
    setNewOrder({
      ...newOrder,
      items: newOrder.items.filter((_, i) => i !== index),
    })
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...newOrder.items]
    updatedItems[index] = { ...updatedItems[index], [field]: field === "productId" ? value : Number.parseInt(value) }
    setNewOrder({ ...newOrder, items: updatedItems })
  }

  const handleCreateOrder = () => {
    // Validate order
    if (newOrder.items.some((item) => !item.productId || item.quantity < 1)) {
      toast.error("Error", {
        description: "Please select products and valid quantities for all items",
      })
      return
    }

    const id = Math.max(0, ...orders.map((o) => o.id)) + 1
    const newOrderData = {
      id,
      date: new Date(),
      location: newOrder.location,
      status: "pending",
      items: newOrder.items.map((item) => ({
        productId: Number.parseInt(item.productId as string),
        quantity: item.quantity,
        price: products.find((p) => p.id === Number.parseInt(item.productId as string))?.sellingPrice || 0,
      })),
    }

    setOrders([...orders, newOrderData])
    setNewOrder({
      location: "nakawa",
      items: [{ productId: "", quantity: 1 }],
    })
    setIsDialogOpen(false)

    toast.success("Order created", {
      description: `Order #${id} has been created successfully`,
    })
  }

  const handleUpdateOrderStatus = (id: number, status: string) => {
    setOrders(orders.map((order) => (order.id === id ? { ...order, status } : order)))

    toast.success("Order updated", {
      description: `Order #${id} status changed to ${status}`,
    })
  }

  const calculateOrderTotal = (order: any) => {
    return order.items.reduce((total: number, item: any) => total + item.quantity * item.price, 0)
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Orders</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Order
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>Create a new order for products below threshold</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="location">Location</Label>
                <Select
                  value={newOrder.location}
                  onValueChange={(value) => setNewOrder({ ...newOrder, location: value })}
                >
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location.charAt(0).toUpperCase() + location.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Order Items</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                    <Plus className="h-4 w-4 mr-1" /> Add Item
                  </Button>
                </div>

                {newOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1">
                      <Select
                        value={item.productId as string}
                        onValueChange={(value) => handleItemChange(index, "productId", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="w-24">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                      disabled={newOrder.items.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateOrder}>Create Order</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Orders</CardTitle>
          <CardDescription>View and manage orders for your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id}</TableCell>
                  <TableCell>{format(order.date, "MMM d, yyyy")}</TableCell>
                  <TableCell>{order.location}</TableCell>
                  <TableCell>{order.items.length} items</TableCell>
                  <TableCell>{calculateOrderTotal(order).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="icon" variant="ghost">
                        <FileText className="h-4 w-4" />
                      </Button>
                      {order.status === "pending" && (
                        <>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleUpdateOrderStatus(order.id, "approved")}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleUpdateOrderStatus(order.id, "cancelled")}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      {order.status === "approved" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleUpdateOrderStatus(order.id, "delivered")}
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
        </CardContent>
      </Card>
    </div>
  )
}

