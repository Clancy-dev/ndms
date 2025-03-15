"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash, Users } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"

// Mock data for locations
const initialLocations = [
  { id: 1, name: "Nakawa", address: "Plot 123, Nakawa Industrial Area", users: 3, isActive: true },
  { id: 2, name: "Kireka", address: "Kireka Trading Center, Main Street", users: 2, isActive: true },
  { id: 3, name: "Nansana", address: "Nansana Town, Highway Road", users: 1, isActive: true },
]

export default function LocationsPage() {
  const [locations, setLocations] = useState(initialLocations)
  const [newLocation, setNewLocation] = useState({ name: "", address: "" })
  const [editingLocation, setEditingLocation] = useState<null | {
    id: number
    name: string
    address: string
    users: number
    isActive: boolean
  }>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleAddLocation = () => {
    if (!newLocation.name || !newLocation.address) {
      toast.error("Error", {
        description: "Location name and address are required",
      })
      return
    }

    const id = Math.max(0, ...locations.map((l) => l.id)) + 1
    setLocations([...locations, { id, ...newLocation, users: 0, isActive: true }])
    setNewLocation({ name: "", address: "" })
    setIsDialogOpen(false)

    toast.success("Location added", {
      description: `${newLocation.name} has been added successfully`,
    })
  }

  const handleUpdateLocation = () => {
    if (!editingLocation || !editingLocation.name || !editingLocation.address) return

    setLocations(locations.map((l) => (l.id === editingLocation.id ? editingLocation : l)))
    setEditingLocation(null)

    toast.success("Location updated", {
      description: `${editingLocation.name} has been updated successfully`,
    })
  }

  const handleToggleLocationStatus = (id: number) => {
    setLocations(locations.map((l) => (l.id === id ? { ...l, isActive: !l.isActive } : l)))

    const location = locations.find((l) => l.id === id)
    const newStatus = !location?.isActive

    toast.success(`Location ${newStatus ? "activated" : "deactivated"}`, {
      description: `${location?.name} has been ${newStatus ? "activated" : "deactivated"}`,
    })
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Locations</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
              <DialogDescription>Create a new location for your inventory system</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                  placeholder="Location name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newLocation.address}
                  onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                  placeholder="Location address"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddLocation}>Add Location</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Locations</CardTitle>
          <CardDescription>Create and manage locations for your inventory system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium">
                    {editingLocation?.id === location.id ? (
                      <Input
                        value={editingLocation.name}
                        onChange={(e) => setEditingLocation({ ...editingLocation, name: e.target.value })}
                      />
                    ) : (
                      location.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingLocation?.id === location.id ? (
                      <Input
                        value={editingLocation.address}
                        onChange={(e) => setEditingLocation({ ...editingLocation, address: e.target.value })}
                      />
                    ) : (
                      location.address
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{location.users}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={location.isActive ? "default" : "secondary"}>
                      {location.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      {editingLocation?.id === location.id ? (
                        <Button size="sm" onClick={handleUpdateLocation}>
                          Save
                        </Button>
                      ) : (
                        <Button size="icon" variant="ghost" onClick={() => setEditingLocation(location)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      <Button size="icon" variant="ghost" onClick={() => handleToggleLocationStatus(location.id)}>
                        {location.isActive ? <Trash className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
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

