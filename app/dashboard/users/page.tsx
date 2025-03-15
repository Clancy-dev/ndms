"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash, Lock } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"


const initialUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "admin", location: "Nakawa", isActive: true },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "manager", location: "Kireka", isActive: true },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "staff", location: "Nansana", isActive: true },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "staff", location: "Nakawa", isActive: false },
]

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers)
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "", location: "" })
  const [editingUser, setEditingUser] = useState<null | {
    id: number
    name: string
    email: string
    role: string
    location: string
    isActive: boolean
  }>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const locations = ["Nakawa", "Kireka", "Nansana"]
  const roles = ["admin", "manager", "staff"]

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.location) {
      toast.error("Error", {
        description: "All fields are required",
      })
      return
    }

    const id = Math.max(0, ...users.map((u) => u.id)) + 1
    setUsers([...users, { id, ...newUser, isActive: true }])
    setNewUser({ name: "", email: "", role: "", location: "" })
    setIsDialogOpen(false)

    toast.success("User added", {
      description: `${newUser.name} has been added successfully`,
    })
  }

  const handleUpdateUser = () => {
    if (!editingUser || !editingUser.name || !editingUser.email) return

    setUsers(users.map((u) => (u.id === editingUser.id ? editingUser : u)))
    setEditingUser(null)

    toast.success("User updated", {
      description: `${editingUser.name} has been updated successfully`,
    })
  }

  const handleToggleUserStatus = (id: number) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, isActive: !u.isActive } : u)))

    const user = users.find((u) => u.id === id)
    const newStatus = !user?.isActive

    toast.success(`User ${newStatus ? "activated" : "deactivated"}`, {
      description: `${user?.name} has been ${newStatus ? "activated" : "deactivated"}`,
    })
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-purple-500">Admin</Badge>
      case "manager":
        return <Badge className="bg-blue-500">Manager</Badge>
      case "staff":
        return <Badge className="bg-green-500">Staff</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Users</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user for your inventory system</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Full name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Email address"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select onValueChange={(value) => setNewUser({ ...newUser, role: value })} value={newUser.role}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Select
                    onValueChange={(value) => setNewUser({ ...newUser, location: value })}
                    value={newUser.location}
                  >
                    <SelectTrigger id="location">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddUser}>Add User</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Users</CardTitle>
          <CardDescription>Create and manage users for your inventory system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    {editingUser?.id === user.id ? (
                      <Input
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      />
                    ) : (
                      user.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser?.id === user.id ? (
                      <Input
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      />
                    ) : (
                      user.email
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser?.id === user.id ? (
                      <Select
                        value={editingUser.role}
                        onValueChange={(value) => setEditingUser({ ...editingUser, role: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role.charAt(0).toUpperCase() + role.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      getRoleBadge(user.role)
                    )}
                  </TableCell>
                  <TableCell>
                    {editingUser?.id === user.id ? (
                      <Select
                        value={editingUser.location}
                        onValueChange={(value) => setEditingUser({ ...editingUser, location: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      user.location
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? "default" : "secondary"}>
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {editingUser?.id === user.id ? (
                        <Button size="sm" onClick={handleUpdateUser}>
                          Save
                        </Button>
                      ) : (
                        <>
                          <Button size="icon" variant="ghost" onClick={() => setEditingUser(user)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost">
                            <Lock className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleToggleUserStatus(user.id)}>
                            {user.isActive ? <Trash className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                          </Button>
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

