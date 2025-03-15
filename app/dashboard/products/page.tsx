"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash, ImageIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

// First, let's add proper TypeScript interfaces at the top of the file, after the imports
interface ProductStatus {
  isActive: boolean
  deletedAt: Date | null
}

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

// Mock data
const categories = [
  { id: 1, name: "Bread" },
  { id: 2, name: "Pastries" },
  { id: 3, name: "Beverages" },
]

const initialProducts = [
  {
    id: 1,
    name: "Classic Bread",
    categoryId: 1,
    buyingPrice: 1500,
    sellingPrice: 2000,
    expiryDays: 3,
    threshold: 10,
    image: "/placeholder.svg?height=80&width=80",
    status: {
      isActive: true,
      deletedAt: null,
    },
  },
  {
    id: 2,
    name: "Bus Bread",
    categoryId: 1,
    buyingPrice: 2000,
    sellingPrice: 2500,
    expiryDays: 4,
    threshold: 5,
    image: "/placeholder.svg?height=80&width=80",
    status: {
      isActive: true,
      deletedAt: null,
    },
  },
  {
    id: 3,
    name: "Milk Bread",
    categoryId: 1,
    buyingPrice: 2200,
    sellingPrice: 3000,
    expiryDays: 2,
    threshold: 8,
    image: "/placeholder.svg?height=80&width=80",
    status: {
      isActive: true,
      deletedAt: null,
    },
  },
]

export default function ProductsPage() {
  // Then update the useState declaration to use the Product type
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [newProduct, setNewProduct] = useState({
    name: "",
    categoryId: "",
    buyingPrice: "",
    sellingPrice: "",
    expiryDays: "",
    threshold: "",
    image: "/placeholder.svg?height=80&width=80",
  })
  // Update the useState declaration to use the Product type
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.categoryId) {
      toast.error("Error", {
        description: "Product name and category are required",
      })
      return
    }

    const id = Math.max(0, ...products.map((p) => p.id)) + 1
    setProducts([
      ...products,
      {
        id,
        ...newProduct,
        categoryId: Number.parseInt(newProduct.categoryId),
        buyingPrice: Number.parseFloat(newProduct.buyingPrice),
        sellingPrice: Number.parseFloat(newProduct.sellingPrice),
        expiryDays: Number.parseInt(newProduct.expiryDays),
        threshold: Number.parseInt(newProduct.threshold),
        status: {
          isActive: true,
          deletedAt: null,
        },
      },
    ])

    setNewProduct({
      name: "",
      categoryId: "",
      buyingPrice: "",
      sellingPrice: "",
      expiryDays: "",
      threshold: "",
      image: "/placeholder.svg?height=80&width=80",
    })

    setIsDialogOpen(false)

    toast.success("Product added", {
      description: `${newProduct.name} has been added successfully`,
    })
  }

  const handleUpdateProduct = () => {
    if (!editingProduct || !editingProduct.name) return

    setProducts(products.map((p) => (p.id === editingProduct.id ? editingProduct : p)))
    setEditingProduct(null)

    toast.success("Product updated", {
      description: `${editingProduct.name} has been updated successfully`,
    })
  }

  // Update the handleDeleteProduct function to properly handle the status
  const handleDeleteProduct = (id: number) => {
    const productToDelete = products.find((p) => p.id === id)

    // In a real application, you would update the product status in the database
    // Here we're just updating the local state
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            status: {
              ...p.status,
              isActive: false,
              deletedAt: new Date(),
            },
          }
        }
        return p
      }),
    )

    toast.success("Product deleted", {
      description: `${productToDelete?.name} has been deleted. Historical data will be preserved.`,
    })
  }

  // Update the handleRestoreProduct function similarly
  const handleRestoreProduct = (id: number) => {
    const productToRestore = products.find((p) => p.id === id)

    // In a real application, you would update the product status in the database
    // Here we're just updating the local state
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          return {
            ...p,
            status: {
              ...p.status,
              isActive: true,
              deletedAt: null,
            },
          }
        }
        return p
      }),
    )

    toast.success("Product restored", {
      description: `${productToRestore?.name} has been restored.`,
    })
  }

  const getCategoryName = (categoryId: number) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown"
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Products</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>Create a new product for your inventory</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Product name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    onValueChange={(value) => setNewProduct({ ...newProduct, categoryId: value })}
                    value={newProduct.categoryId}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="buyingPrice">Buying Price</Label>
                  <Input
                    id="buyingPrice"
                    type="number"
                    value={newProduct.buyingPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, buyingPrice: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sellingPrice">Selling Price</Label>
                  <Input
                    id="sellingPrice"
                    type="number"
                    value={newProduct.sellingPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiryDays">Expiry Days</Label>
                  <Input
                    id="expiryDays"
                    type="number"
                    value={newProduct.expiryDays}
                    onChange={(e) => setNewProduct({ ...newProduct, expiryDays: e.target.value })}
                    placeholder="Days until expiry"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="threshold">Threshold</Label>
                  <Input
                    id="threshold"
                    type="number"
                    value={newProduct.threshold}
                    onChange={(e) => setNewProduct({ ...newProduct, threshold: e.target.value })}
                    placeholder="Reorder threshold"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="image">Product Image</Label>
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-md border flex items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <Button variant="outline" className="h-10">
                    Upload Image
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>Add Product</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Products</CardTitle>
          <CardDescription>Create and manage products for your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Buying Price</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead>Expiry Days</TableHead>
                <TableHead>Threshold</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id} className={!product.status?.isActive ? "bg-gray-50" : ""}>
                  <TableCell>
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded-md"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {editingProduct?.id === product.id ? (
                      <Input
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        {product.name}
                        {!product.status?.isActive && (
                          <Badge variant="outline" className="text-gray-500 border-gray-300">
                            Deleted
                          </Badge>
                        )}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProduct?.id === product.id ? (
                      <Select
                        value={editingProduct.categoryId.toString()}
                        onValueChange={(value) =>
                          setEditingProduct({ ...editingProduct, categoryId: Number.parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      getCategoryName(product.categoryId)
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProduct?.id === product.id ? (
                      <Input
                        type="number"
                        value={editingProduct.buyingPrice}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, buyingPrice: Number.parseFloat(e.target.value) })
                        }
                      />
                    ) : (
                      product.buyingPrice.toLocaleString()
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProduct?.id === product.id ? (
                      <Input
                        type="number"
                        value={editingProduct.sellingPrice}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, sellingPrice: Number.parseFloat(e.target.value) })
                        }
                      />
                    ) : (
                      product.sellingPrice.toLocaleString()
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProduct?.id === product.id ? (
                      <Input
                        type="number"
                        value={editingProduct.expiryDays}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, expiryDays: Number.parseInt(e.target.value) })
                        }
                      />
                    ) : (
                      product.expiryDays
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProduct?.id === product.id ? (
                      <Input
                        type="number"
                        value={editingProduct.threshold}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, threshold: Number.parseInt(e.target.value) })
                        }
                      />
                    ) : (
                      product.threshold
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {editingProduct?.id === product.id ? (
                        <Button size="sm" onClick={handleUpdateProduct}>
                          Save
                        </Button>
                      ) : (
                        <>
                          {product.status?.isActive ? (
                            <>
                              <Button size="icon" variant="ghost" onClick={() => setEditingProduct(product)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" onClick={() => handleDeleteProduct(product.id)}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => handleRestoreProduct(product.id)}>
                              Restore
                            </Button>
                          )}
                        </>
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

