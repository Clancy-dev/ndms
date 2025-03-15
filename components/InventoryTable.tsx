"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { format, addDays, differenceInDays } from "date-fns"
import { CalendarIcon, Plus, Minus } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"
import { Calendar } from "@/components/ui/calendar"

// First, let's fix the ProductStatus interface to match what we need
interface ProductStatus {
  id: number
  isActive: boolean
  deletedAt: Date | null
  createdAt: Date
}

// Update the Product interface to include the status
interface Product {
  id: number
  name: string
  categoryId: number
  buyingPrice: number
  sellingPrice: number
  expiryDays: number
  threshold: number
  image: string
  status: ProductStatus
}

// Update the InventoryItem interface to allow null for isRecentlyDeleted
interface InventoryItem {
  productId: number
  productName: string
  productImage: string
  qtyYesterday: number
  qtyRestocked: number
  quantityAtStart: number
  quantityAtEnd: number
  quantitySold: number
  sales: number
  profit: number
  expiryStatus: string
  batches: any[]
  previousBatches: any[]
  soldBatches: any[]
  statusCounts: {
    expired: number
    warning: number
    safe: number
  }
  newBatches: any[]
  isRecentlyDeleted?: boolean | null
  productStatus?: ProductStatus
}

// Mock data for products
const categories = [
  { id: 1, name: "Bread" },
  { id: 2, name: "Pastries" },
  { id: 3, name: "Beverages" },
]

// Fix the placeholder image paths to ensure they work correctly
// Update the image paths in the products array
const products = [
  {
    id: 1,
    name: "Classic Bread",
    categoryId: 1,
    buyingPrice: 1500,
    sellingPrice: 2000,
    expiryDays: 7,
    threshold: 10,
    image: "/placeholder.svg?height=40&width=40",
    status: {
      id: 1,
      isActive: true,
      deletedAt: null,
      createdAt: new Date(2024, 0, 1), // January 1, 2024
    },
  },
  {
    id: 2,
    name: "Bus Bread",
    categoryId: 1,
    buyingPrice: 2000,
    sellingPrice: 2500,
    expiryDays: 7,
    threshold: 5,
    image: "/placeholder.svg?height=40&width=40",
    status: {
      id: 2,
      isActive: true,
      deletedAt: null,
      createdAt: new Date(2024, 0, 15), // January 15, 2024
    },
  },
  {
    id: 3,
    name: "Katafali Bread",
    categoryId: 1,
    buyingPrice: 1800,
    sellingPrice: 2200,
    expiryDays: 7,
    threshold: 8,
    image: "/placeholder.svg?height=40&width=40",
    status: {
      id: 3,
      isActive: false, // This product has been deleted
      deletedAt: new Date(2025, 2, 10), // March 10, 2025
      createdAt: new Date(2024, 1, 5), // February 5, 2024
    },
  },
  {
    id: 4,
    name: "Yellow Bread",
    categoryId: 1,
    buyingPrice: 2200,
    sellingPrice: 2800,
    expiryDays: 7,
    threshold: 7,
    image: "/placeholder.svg?height=40&width=40",
    status: {
      id: 4,
      isActive: true,
      deletedAt: null,
      createdAt: new Date(2024, 1, 20), // February 20, 2024
    },
  },
  {
    id: 5,
    name: "Swirl Bread",
    categoryId: 1,
    buyingPrice: 2500,
    sellingPrice: 3200,
    expiryDays: 7,
    threshold: 6,
    image: "/placeholder.svg?height=40&width=40",
    status: {
      id: 5,
      isActive: true,
      deletedAt: null,
      createdAt: new Date(2024, 2, 1), // March 1, 2024
    },
  },
  {
    id: 6,
    name: "Cake Bread",
    categoryId: 1,
    buyingPrice: 3000,
    sellingPrice: 3800,
    expiryDays: 7,
    threshold: 4,
    image: "/placeholder.svg?height=40&width=40",
    status: {
      id: 6,
      isActive: true,
      deletedAt: null,
      createdAt: new Date(2024, 2, 15), // March 15, 2024
    },
  },
  {
    id: 7,
    name: "Milk Bread",
    categoryId: 1,
    buyingPrice: 2200,
    sellingPrice: 3000,
    expiryDays: 7,
    threshold: 8,
    image: "/placeholder.svg?height=40&width=40",
    status: {
      id: 7,
      isActive: true,
      deletedAt: null,
      createdAt: new Date(2024, 0, 10), // January 10, 2024
    },
  },
  // Example of a product that was deleted and then recreated with the same ID
  {
    id: 8,
    name: "Chocolate Bread",
    categoryId: 1,
    buyingPrice: 2800,
    sellingPrice: 3500,
    expiryDays: 7,
    threshold: 6,
    image: "/placeholder.svg?height=40&width=40",
    status: {
      id: 8,
      isActive: false, // This version was deleted
      deletedAt: new Date(2024, 11, 15), // December 15, 2024
      createdAt: new Date(2024, 3, 1), // April 1, 2024
    },
  },
  {
    id: 9, // New ID for the recreated product
    name: "Chocolate Bread", // Same name as the deleted product
    categoryId: 1,
    buyingPrice: 3000, // Updated price
    sellingPrice: 3800, // Updated price
    expiryDays: 7,
    threshold: 5,
    image: "/placeholder.svg?height=40&width=40",
    status: {
      id: 9,
      isActive: true,
      deletedAt: null,
      createdAt: new Date(2025, 0, 10), // January 10, 2025 - recreated later
    },
  },
]

// Add this function to filter products based on the selected date
const getProductsForDate = (date: Date) => {
  return products.filter((product) => {
    // Include product if it was created before or on the selected date
    const wasCreatedBeforeOrOnDate = product.status.createdAt <= date

    // Include product if it was either not deleted or deleted after the selected date
    const wasNotDeletedOrDeletedAfterDate = !product.status.deletedAt || product.status.deletedAt > date

    return wasCreatedBeforeOrOnDate && wasNotDeletedOrDeletedAfterDate
  })
}

// Add a function to get batch expiry status
const getBatchExpiryStatus = (expiryDate: Date, currentDate: Date) => {
  const daysToExpiry = differenceInDays(expiryDate, currentDate)
  if (daysToExpiry <= 0) {
    return "expired" // red
  } else if (daysToExpiry <= 2) {
    return "warning" // yellow
  } else {
    return "safe" // blue
  }
}

// Add a function to get batch expiry color
const getBatchExpiryColor = (status: string) => {
  switch (status) {
    case "expired":
      return "bg-red-500"
    case "warning":
      return "bg-yellow-500"
    case "safe":
      return "bg-blue-500"
    default:
      return "bg-gray-500"
  }
}

// Fix the generateInventoryData function to ensure consistent types
const generateInventoryData = (date: Date, location: string): InventoryItem[] => {
  // Get products that were active on the selected date
  const activeProducts = getProductsForDate(date)

  // First, let's simulate yesterday's end-of-day inventory
  const yesterday = new Date(date)
  yesterday.setDate(yesterday.getDate() - 1)

  // This would normally come from a database, but for simulation we'll generate it
  // In a real application, you would fetch the previous day's data from your database
  const yesterdayEndInventory = activeProducts.map((product) => {
    // For simulation purposes, generate a random quantity for yesterday's end
    const batches = generateBatchesForDate(product.id, yesterday, 2)
    const totalQuantity = batches.reduce((sum, batch) => sum + batch.remaining, 0)

    return {
      productId: product.id,
      batches,
      quantityAtEnd: totalQuantity,
    }
  })

  // Now generate today's inventory based on yesterday's end inventory
  return activeProducts.map((product) => {
    // Find yesterday's end inventory for this product
    const yesterdayProduct = yesterdayEndInventory.find((p) => p.productId === product.id)

    // Yesterday's end quantity becomes today's "Qty Yesterday"
    // This ensures Qty Yesterday = Qty at End of previous day
    const qtyYesterday = yesterdayProduct ? yesterdayProduct.quantityAtEnd : 0

    // Generate some random restocked quantity (in a real app, this would be entered by the user)
    const qtyRestocked = Math.floor(Math.random() * 5) // 0-4 items restocked

    // Generate new batches for restocked items
    const newBatches =
      qtyRestocked > 0
        ? [
            {
              id: `${product.id}-${date.getTime()}-new`,
              productId: product.id,
              entryDate: new Date(date),
              expiryDate: addDays(date, product.expiryDays),
              quantity: qtyRestocked,
              remaining: qtyRestocked,
              isNew: true,
            },
          ]
        : []

    // Yesterday's end batches become today's carried over batches
    const previousBatches = yesterdayProduct ? yesterdayProduct.batches : []

    // Combine previous batches with new batches
    const todayBatches = [...previousBatches, ...newBatches]

    // Calculate Qty at Start = Qty Yesterday + Qty Restocked
    const quantityAtStart = qtyYesterday + qtyRestocked

    // Ensure Qty at End is never greater than Qty at Start
    // Simulate some sales (but ensure we don't sell more than we have)
    const maxSales = Math.min(10, quantityAtStart) // Don't sell more than we have
    const quantityAtEnd = Math.max(0, quantityAtStart - Math.floor(Math.random() * maxSales))
    const quantitySold = quantityAtStart - quantityAtEnd

    const sales = quantitySold * product.sellingPrice
    const profit = quantitySold * (product.sellingPrice - product.buyingPrice)

    // Determine expiry status based on majority of batches
    const batchStatuses = todayBatches.map((batch) => getBatchExpiryStatus(batch.expiryDate, date))

    // Count occurrences of each status
    const statusCounts = {
      expired: batchStatuses.filter((status) => status === "expired").length,
      warning: batchStatuses.filter((status) => status === "warning").length,
      safe: batchStatuses.filter((status) => status === "safe").length,
    }

    // Determine majority status
    let expiryStatus = "safe"
    if (statusCounts.expired > statusCounts.warning && statusCounts.expired > statusCounts.safe) {
      expiryStatus = "expired"
    } else if (statusCounts.warning > statusCounts.expired && statusCounts.warning > statusCounts.safe) {
      expiryStatus = "warning"
    }

    // Add expiry status to each batch
    const batchesWithStatus = todayBatches.map((batch) => ({
      ...batch,
      expiryStatus: getBatchExpiryStatus(batch.expiryDate, date),
    }))

    const previousBatchesWithStatus = previousBatches.map((batch) => ({
      ...batch,
      expiryStatus: getBatchExpiryStatus(batch.expiryDate, date),
    }))

    // Check if this product was recently deleted (within 30 days after the selected date)
    const isRecentlyDeleted =
      product.status.deletedAt &&
      differenceInDays(product.status.deletedAt, date) <= 30 &&
      differenceInDays(product.status.deletedAt, date) >= 0

    return {
      productId: product.id,
      productName: product.name,
      productImage: product.image,
      qtyYesterday,
      qtyRestocked,
      quantityAtStart,
      quantityAtEnd,
      quantitySold,
      sales,
      profit,
      expiryStatus,
      batches: batchesWithStatus,
      previousBatches: previousBatchesWithStatus,
      soldBatches: calculateSoldBatches(previousBatches, todayBatches),
      statusCounts,
      newBatches: newBatches.map((batch) => ({
        ...batch,
        expiryStatus: getBatchExpiryStatus(batch.expiryDate, date),
      })),
      isRecentlyDeleted, // This is now boolean, not null
      productStatus: product.status,
    }
  })
}

// Generate batches for a specific date
const generateBatchesForDate = (productId: number, date: Date, batchCount: number, previousBatches: any[] = []) => {
  // Get products that were active on the selected date
  const activeProducts = getProductsForDate(date)
  const product = activeProducts.find((p) => p.id === productId)
  if (!product) return []

  const batches = [...previousBatches.map((b) => ({ ...b }))] // Copy previous batches

  // Add new batches
  for (let i = 0; i < batchCount; i++) {
    const entryDate = new Date(date)
    entryDate.setDate(entryDate.getDate() - Math.floor(Math.random() * 3)) // Random entry date within last 3 days

    const expiryDate = new Date(entryDate)
    expiryDate.setDate(expiryDate.getDate() + product.expiryDays)

    const quantity = Math.floor(Math.random() * 10) + 5 // Random quantity between 5-15

    batches.push({
      id: `${productId}-${date.getTime()}-${i}`,
      productId,
      entryDate,
      expiryDate,
      quantity,
      remaining: quantity,
    })
  }

  return batches
}

// Update the calculateSoldBatches function to better track which batches items were sold from
const calculateSoldBatches = (previousBatches: any[], currentBatches: any[]) => {
  const soldBatches = []

  // Sort previous batches by expiry date (FIFO - oldest first)
  const sortedPreviousBatches = [...previousBatches].sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime())

  // Check each previous batch
  for (const prevBatch of sortedPreviousBatches) {
    // Find the same batch in current inventory
    const currentBatch = currentBatches.find((b) => b.id === prevBatch.id)

    // If not found, the entire batch was sold
    if (!currentBatch) {
      soldBatches.push({
        ...prevBatch,
        soldQuantity: prevBatch.remaining,
        soldAll: true,
      })
    }
    // If quantity reduced, some items from this batch were sold
    else if (currentBatch.remaining < prevBatch.remaining) {
      soldBatches.push({
        ...prevBatch,
        soldQuantity: prevBatch.remaining - currentBatch.remaining,
        soldAll: false,
      })
    }
  }

  return soldBatches
}

interface InventoryTableProps {
  date: Date
  location: string
}

// Add a new component for displaying deleted product notifications
const DeletedProductNotification = ({ deletedProducts }: { deletedProducts: any[] }) => {
  if (deletedProducts.length === 0) return null

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
      <h3 className="text-amber-800 font-medium mb-2">Product Status Changes</h3>
      <ul className="space-y-1 text-sm text-amber-700">
        {deletedProducts.map((product) => (
          <li key={product.productId} className="flex items-center">
            <span className="inline-block w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
            <span>
              <strong>{product.productName}</strong> was removed on{" "}
              {format(product.productStatus.deletedAt!, "MMMM d, yyyy")}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Update the InventoryTable component to include the notification
export function InventoryTable({ date, location }: InventoryTableProps) {
  // Add a new state for the lightbox at the top of the InventoryTable component, after the other useState declarations
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null)
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([])
  const [editingRow, setEditingRow] = useState<number | null>(null)
  const [editingBatches, setEditingBatches] = useState<any[]>([])
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isRestockDialogOpen, setIsRestockDialogOpen] = useState(false)
  const [restockData, setRestockData] = useState({
    quantity: 0,
    expiryDate: new Date(),
  })

  // Add state to track recently deleted products
  const [recentlyDeletedProducts, setRecentlyDeletedProducts] = useState<any[]>([])

  useEffect(() => {
    // Generate new inventory data when date or location changes
    const newInventoryData = generateInventoryData(date, location)
    setInventoryData(newInventoryData)

    // Find products that were recently deleted (within 30 days after the selected date)
    const deletedProducts = newInventoryData.filter((item) => item.isRecentlyDeleted)
    setRecentlyDeletedProducts(deletedProducts)

    // In a real application, you would also want to fetch products that were deleted
    // on or shortly after the selected date, but aren't included in the inventory data
    // This would require a separate API call to get deleted products
  }, [date, location])

  // Add a function to handle image click
  const handleImageClick = (src: string, alt: string) => {
    setLightboxImage({ src, alt })
  }

  // Add a function to close the lightbox
  const closeLightbox = () => {
    setLightboxImage(null)
  }

  const handleEditQuantity = (index: number) => {
    const item = inventoryData[index]
    setEditingRow(index)
    setEditingBatches(item.batches.map((batch: any) => ({ ...batch })))
    setIsEditDialogOpen(true)
  }

  const handleRestock = (index: number) => {
    setEditingRow(index)
    const product = products.find((p) => p.id === inventoryData[index].productId)
    if (product) {
      setRestockData({
        quantity: 0,
        expiryDate: addDays(new Date(), product.expiryDays),
      })
      setIsRestockDialogOpen(true)
    }
  }

  // Fix the product lookup in the handleSaveRestock function
  const handleSaveRestock = () => {
    if (editingRow === null) return
    if (restockData.quantity <= 0) {
      toast.error("Invalid quantity", {
        description: "Restock quantity must be greater than 0",
      })
      return
    }

    const updatedData = [...inventoryData]
    const item = updatedData[editingRow]
    const product = products.find((p) => p.id === item.productId)

    if (!product) return

    // Create a new batch for the restocked items
    const newBatch = {
      id: `${product.id}-${Date.now()}-restock`,
      productId: product.id,
      entryDate: new Date(),
      expiryDate: restockData.expiryDate,
      quantity: restockData.quantity,
      remaining: restockData.quantity,
      isNew: true,
      expiryStatus: getBatchExpiryStatus(restockData.expiryDate, date),
    }

    // Update the item with the new batch
    item.qtyRestocked += restockData.quantity
    item.quantityAtStart += restockData.quantity
    item.batches = [...item.batches, newBatch]
    item.newBatches = [...item.newBatches, newBatch]

    // Recalculate expiry status
    const batchStatuses = item.batches.map((batch: any) => batch.expiryStatus)
    const statusCounts = {
      expired: batchStatuses.filter((status: string) => status === "expired").length,
      warning: batchStatuses.filter((status: string) => status === "warning").length,
      safe: batchStatuses.filter((status: string) => status === "safe").length,
    }

    let expiryStatus = "safe"
    if (statusCounts.expired > statusCounts.warning && statusCounts.expired > statusCounts.safe) {
      expiryStatus = "expired"
    } else if (statusCounts.warning > statusCounts.expired && statusCounts.warning > statusCounts.safe) {
      expiryStatus = "warning"
    }

    item.expiryStatus = expiryStatus
    item.statusCounts = statusCounts

    setInventoryData(updatedData)
    setEditingRow(null)
    setIsRestockDialogOpen(false)

    toast.success("Restock successful", {
      description: `Added ${restockData.quantity} units of ${item.productName} to inventory`,
    })
  }

  const handleUpdateBatchQuantity = (batchIndex: number, newQuantity: number) => {
    if (newQuantity < 0) return

    const updatedBatches = [...editingBatches]
    updatedBatches[batchIndex] = {
      ...updatedBatches[batchIndex],
      remaining: newQuantity,
    }

    setEditingBatches(updatedBatches)
  }

  const handleUpdateBatchExpiryDate = (batchIndex: number, newDate: Date) => {
    const updatedBatches = [...editingBatches]
    updatedBatches[batchIndex] = {
      ...updatedBatches[batchIndex],
      expiryDate: newDate,
    }

    setEditingBatches(updatedBatches)
  }

  const handleAddNewBatch = () => {
    if (editingRow === null) return

    const product = products.find((p) => p.id === inventoryData[editingRow].productId)
    if (!product) return

    const newBatch = {
      id: `${product.id}-${Date.now()}-new`,
      productId: product.id,
      entryDate: new Date(),
      expiryDate: addDays(new Date(), product.expiryDays),
      quantity: 0,
      remaining: 0,
      isNew: true,
    }

    setEditingBatches([...editingBatches, newBatch])
  }

  const handleRemoveBatch = (batchIndex: number) => {
    const updatedBatches = [...editingBatches]
    updatedBatches.splice(batchIndex, 1)
    setEditingBatches(updatedBatches)
  }

  // Update the handleSaveQuantity function to validate quantities
  const handleSaveQuantity = () => {
    if (editingRow === null) return

    // Calculate total quantity from batches
    const totalQuantity = editingBatches.reduce((sum, batch) => sum + batch.remaining, 0)

    const updatedData = [...inventoryData]
    const item = updatedData[editingRow]

    // Validate: Qty at end cannot be greater than Qty at start
    if (totalQuantity > item.quantityAtStart) {
      toast.error("Invalid quantity", {
        description: "Quantity at end cannot be greater than quantity at start. This would result in negative sales.",
      })
      return
    }

    // Update quantity at end
    item.quantityAtEnd = totalQuantity

    // Add expiry status to each batch
    const batchesWithStatus = editingBatches.map((batch) => ({
      ...batch,
      expiryStatus: getBatchExpiryStatus(batch.expiryDate, date),
    }))

    // Update batches
    item.batches = batchesWithStatus

    // Recalculate quantity sold
    item.quantitySold = item.quantityAtStart - item.quantityAtEnd

    // Recalculate sold batches using the improved function
    item.soldBatches = calculateSoldBatches(item.previousBatches.concat(item.newBatches), item.batches)

    // Find the product for this item
    const product = products.find((p) => p.id === item.productId)

    // Recalculate sales and profit
    if (product) {
      item.sales = item.quantitySold * product.sellingPrice
      item.profit = item.quantitySold * (product.sellingPrice - product.buyingPrice)
    }

    // Count occurrences of each status
    const statusCounts = {
      expired: item.batches.filter((b: any) => b.expiryStatus === "expired").length,
      warning: item.batches.filter((b: any) => b.expiryStatus === "warning").length,
      safe: item.batches.filter((b: any) => b.expiryStatus === "safe").length,
    }

    // Determine majority status
    let expiryStatus = "safe"
    if (statusCounts.expired > statusCounts.warning && statusCounts.expired > statusCounts.safe) {
      expiryStatus = "expired"
    } else if (statusCounts.warning > statusCounts.expired && statusCounts.warning > statusCounts.safe) {
      expiryStatus = "warning"
    }

    // Update expiry status
    item.expiryStatus = expiryStatus
    item.statusCounts = statusCounts

    setInventoryData(updatedData)
    setEditingRow(null)
    setIsEditDialogOpen(false)

    toast.success("Quantity updated", {
      description: `${item.productName} quantity updated successfully`,
    })
  }

  const getExpiryColor = (status: string) => {
    switch (status) {
      case "expired":
        return "bg-red-500"
      case "warning":
        return "bg-yellow-500"
      case "safe":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const getCategoryByProductId = (productId: number) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return "Unknown"

    const category = categories.find((c) => c.id === product.categoryId)
    return category?.name || "Unknown"
  }

  // Group inventory data by category
  const groupedInventory = inventoryData.reduce(
    (acc, item) => {
      const category = getCategoryByProductId(item.productId)
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(item)
      return acc
    },
    {} as Record<string, InventoryItem[]>,
  )

  // Update the return statement to include the DeletedProductNotification component
  return (
    <div className="space-y-6">
      {/* Display notification for recently deleted products */}
      <DeletedProductNotification deletedProducts={recentlyDeletedProducts} />

      {Object.entries(groupedInventory).map(([category, items]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{category}</CardTitle>
            <CardDescription>
              Inventory for {format(date, "MMMM d, yyyy")} at {location.charAt(0).toUpperCase() + location.slice(1)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Item</TableHead>
                  <TableHead>Qty Yesterday</TableHead>
                  <TableHead>Qty Restocked</TableHead>
                  <TableHead>Qty at Start</TableHead>
                  <TableHead>Qty at End</TableHead>
                  <TableHead>Qty Sold</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead>Profit</TableHead>
                  <TableHead>Expiry</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item: InventoryItem, index: number) => {
                  const originalIndex = inventoryData.findIndex((i) => i.productId === item.productId)
                  return (
                    <TableRow key={item.productId}>
                      {/* Update the Image component in the TableCell to make it clickable */}
                      <TableCell className="flex items-center gap-2">
                        <div
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => handleImageClick(item.productImage || "/placeholder.svg", item.productName)}
                        >
                          <Image
                            src={item.productImage || "/placeholder.svg"}
                            alt={item.productName}
                            width={32}
                            height={32}
                            className="rounded-md"
                          />
                        </div>
                        <span className="font-medium">{item.productName}</span>
                      </TableCell>

                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 underline-offset-4 hover:underline">
                              {item.qtyYesterday}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium">Batch Details (Yesterday's End)</h4>
                              <div className="text-sm text-muted-foreground">
                                {item.previousBatches.length > 0 ? (
                                  <div className="space-y-2">
                                    {item.previousBatches.map((batch: any) => (
                                      <div key={batch.id} className="flex justify-between items-center border-b pb-1">
                                        <div>
                                          <div>Entry: {format(batch.entryDate, "MMM d, yyyy")}</div>
                                          <div className="flex items-center gap-1">
                                            <span>Expiry: {format(batch.expiryDate, "MMM d, yyyy")}</span>
                                            <div
                                              className={`w-3 h-3 rounded-full ${getBatchExpiryColor(batch.expiryStatus)}`}
                                            />
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div>Qty: {batch.remaining}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p>No batch information available</p>
                                )}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 underline-offset-4 hover:underline"
                          onClick={() => handleRestock(originalIndex)}
                        >
                          {item.qtyRestocked}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 underline-offset-4 hover:underline">
                              {item.quantityAtStart}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium">Batch Details (Start of Day)</h4>
                              <div className="text-sm text-muted-foreground">
                                {item.batches.length > 0 ? (
                                  <div className="space-y-2">
                                    {item.batches.map((batch: any) => (
                                      <div key={batch.id} className="flex justify-between items-center border-b pb-1">
                                        <div>
                                          <div>Entry: {format(batch.entryDate, "MMM d, yyyy")}</div>
                                          <div className="flex items-center gap-1">
                                            <span>Expiry: {format(batch.expiryDate, "MMM d, yyyy")}</span>
                                            <div
                                              className={`w-3 h-3 rounded-full ${getBatchExpiryColor(batch.expiryStatus)}`}
                                            />
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div>Qty: {batch.remaining}</div>
                                          {batch.isNew && <div className="text-xs text-blue-500">(New)</div>}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p>No batch information available</p>
                                )}
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 underline-offset-4 hover:underline"
                          onClick={() => handleEditQuantity(originalIndex)}
                        >
                          {item.quantityAtEnd}
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 underline-offset-4 hover:underline">
                              {item.quantitySold}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-medium">Sold Batch Details</h4>
                              <div className="text-sm">
                                <div className="mb-2">
                                  <span className="font-medium">Total Sold:</span> {item.quantitySold}
                                </div>
                                <div className="text-muted-foreground">
                                  {item.soldBatches && item.soldBatches.length > 0 ? (
                                    <div className="space-y-2">
                                      {item.soldBatches.map((batch: any) => (
                                        <div key={batch.id} className="flex flex-col border-b pb-2">
                                          <div className="flex justify-between items-center">
                                            <div className="font-medium">Batch {batch.id.split("-").pop()}</div>
                                            <div className="text-right">
                                              <span className="font-medium">Sold: {batch.soldQuantity}</span>
                                              {batch.soldAll && <span className="ml-1 text-xs">(entire batch)</span>}
                                            </div>
                                          </div>
                                          <div className="grid grid-cols-2 gap-2 mt-1">
                                            <div>
                                              <div className="text-xs text-muted-foreground">Entry Date:</div>
                                              <div>{format(batch.entryDate, "MMM d, yyyy")}</div>
                                            </div>
                                            <div>
                                              <div className="text-xs text-muted-foreground">Expiry Date:</div>
                                              <div className="flex items-center gap-1">
                                                {format(batch.expiryDate, "MMM d, yyyy")}
                                                <div
                                                  className={`w-2 h-2 rounded-full ${getBatchExpiryColor(batch.expiryStatus || getBatchExpiryStatus(batch.expiryDate, date))}`}
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p>No sold batch information available</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </TableCell>
                      <TableCell>{item.sales.toLocaleString()}</TableCell>
                      <TableCell>{item.profit.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className={`w-4 h-4 rounded-full ${getExpiryColor(item.expiryStatus)}`} />
                      </TableCell>
                    </TableRow>
                  )
                })}
                <TableRow>
                  <TableCell colSpan={6} />
                  <TableCell className="font-bold">
                    {items.reduce((sum: number, item: InventoryItem) => sum + item.sales, 0).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-bold">
                    {items.reduce((sum: number, item: InventoryItem) => sum + item.profit, 0).toLocaleString()}
                  </TableCell>
                  <TableCell />
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      {/* Grand Total Section */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Grand Total</CardTitle>
          <CardDescription>
            Total sales and profit across all categories for {format(date, "MMMM d, yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Total Sales</div>
              <div className="text-3xl font-bold">
                {Object.values(groupedInventory)
                  .flat()
                  .reduce((sum, item) => sum + item.sales, 0)
                  .toLocaleString()}{" "}
                UGX
              </div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Total Profit</div>
              <div className="text-3xl font-bold text-green-600">
                {Object.values(groupedInventory)
                  .flat()
                  .reduce((sum, item) => sum + item.profit, 0)
                  .toLocaleString()}{" "}
                UGX
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2 items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>Safe</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <span>Near Expiry</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Expired</span>
        </div>
      </div>

      {/* Edit Quantity Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Update Quantity for {editingRow !== null ? inventoryData[editingRow]?.productName : ""}
            </DialogTitle>
            <DialogDescription>Update quantities and expiry dates for each batch</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[400px] overflow-y-auto py-4">
            {editingBatches.map((batch, index) => {
              const batchStatus = getBatchExpiryStatus(batch.expiryDate, date)
              return (
                <div key={batch.id} className="flex flex-col space-y-2 p-3 border rounded-md">
                  <div className="flex justify-between items-center">
                    <div className="text-sm font-medium flex items-center gap-2">
                      Batch {index + 1} {batch.isNew ? "(New)" : ""}
                      <div className={`w-3 h-3 rounded-full ${getBatchExpiryColor(batchStatus)}`} />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveBatch(index)} className="h-6 w-6">
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor={`entry-date-${index}`}>Entry Date</Label>
                      <div className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm">
                        {format(batch.entryDate, "MMM d, yyyy")}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor={`expiry-date-${index}`}>Expiry Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal h-9">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Calendar
                            mode="single"
                            selected={batch.expiryDate}
                            onSelect={(date) => {
                              if (date) {
                                handleUpdateBatchExpiryDate(index, date)
                              }
                            }}
                            disabled={(date) => date < addDays(new Date(), -365) || date > addDays(new Date(), 365)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        id={`quantity-${index}`}
                        value={batch.remaining}
                        onChange={(e) => handleUpdateBatchQuantity(index, Number.parseInt(e.target.value))}
                        className="w-32"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
            <Button variant="outline" onClick={handleAddNewBatch} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add New Batch
            </Button>
          </div>

          <DialogFooter>
            <Button onClick={handleSaveQuantity}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restock Dialog */}
      <Dialog open={isRestockDialogOpen} onOpenChange={setIsRestockDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Restock {editingRow !== null ? inventoryData[editingRow]?.productName : ""}</DialogTitle>
            <DialogDescription>Enter the quantity and expiry date for the restocked items</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                type="number"
                id="quantity"
                value={restockData.quantity}
                onChange={(e) => setRestockData({ ...restockData, quantity: Number.parseInt(e.target.value) })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiry" className="text-right">
                Expiry Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={
                      "col-span-3 flex w-[280px] justify-start text-left font-normal" +
                      (restockData.expiryDate ? "pl-3.5" : "")
                    }
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {restockData.expiryDate ? format(restockData.expiryDate, "MMM d, yyyy") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={restockData.expiryDate}
                    onSelect={(date) => (date ? setRestockData({ ...restockData, expiryDate: date }) : null)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSaveRestock}>
              Restock
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{lightboxImage?.alt}</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center p-6">
            {lightboxImage && (
              <Image
                src={lightboxImage.src || "/placeholder.svg"}
                alt={lightboxImage.alt}
                width={300}
                height={300}
                className="rounded-md object-contain"
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeLightbox}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

