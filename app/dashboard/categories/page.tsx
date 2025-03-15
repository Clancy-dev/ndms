"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"

// Mock data for categories
const initialCategories = [
  { id: 1, name: "Bread", description: "All types of bread products" },
  { id: 2, name: "Pastries", description: "Cakes, cookies, and other pastries" },
  { id: 3, name: "Beverages", description: "Drinks and liquid refreshments" },
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories)
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })
  const [editingCategory, setEditingCategory] = useState<null | { id: number; name: string; description: string }>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddCategory = () => {
    if (!newCategory.name) {
      toast.error("Error", {
        description: "Category name is required",
      })
      return
    }

    const id = Math.max(0, ...categories.map((c) => c.id)) + 1
    setCategories([...categories, { id, ...newCategory }])
    setNewCategory({ name: "", description: "" })
    setIsDialogOpen(false)

    toast.success("Category added", {
      description: `${newCategory.name} has been added successfully`,
    })
  }

  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.name) return

    setCategories(categories.map((c) => (c.id === editingCategory.id ? editingCategory : c)))
    setEditingCategory(null)

    toast.success("Category updated", {
      description: `${editingCategory.name} has been updated successfully`,
    })
  }

  const handleDeleteCategory = (id: number) => {
    const categoryToDelete = categories.find((c) => c.id === id)
    setCategories(categories.filter((c) => c.id !== id))

    toast.success("Category deleted", {
      description: `${categoryToDelete?.name} has been deleted`,
    })
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Categories</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
              <DialogDescription>Create a new product category for your inventory</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Category name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Category description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
          <CardDescription>Create and manage product categories for your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    {editingCategory?.id === category.id ? (
                      <Input
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      />
                    ) : (
                      category.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingCategory?.id === category.id ? (
                      <Input
                        value={editingCategory.description}
                        onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                      />
                    ) : (
                      category.description
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {editingCategory?.id === category.id ? (
                        <Button size="sm" onClick={handleUpdateCategory}>
                          Save
                        </Button>
                      ) : (
                        <Button size="icon" variant="ghost" onClick={() => setEditingCategory(category)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" onClick={() => handleDeleteCategory(category.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
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

