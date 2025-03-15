"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, ClipboardList, Package, ShoppingCart, Store } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock user data
const userData = {
  name: "Daphine",
  role: "Store Manager",
  location: "Nakawa Branch",
  avatar: "/placeholder.svg?height=100&width=100",
  lastLogin: new Date(),
}

// Mock sales and profit data for each location
const locationData = [
  {
    id: 1,
    name: "Nakawa",
    totalSales: "2,850,000",
    totalProfit: "745,000",
    salesChange: "+8%",
    profitChange: "+12%",
    products: 42,
    orders: 156,
  },
  {
    id: 2,
    name: "Kireka",
    totalSales: "1,250,000",
    totalProfit: "320,000",
    salesChange: "+5%",
    profitChange: "+7%",
    products: 35,
    orders: 89,
  },
  {
    id: 3,
    name: "Nansana",
    totalSales: "750,000",
    totalProfit: "180,000",
    salesChange: "+3%",
    profitChange: "+4%",
    products: 28,
    orders: 67,
  },
]

// Calculate totals across all locations
const totalSales = locationData
  .reduce((sum, location) => {
    return sum + Number.parseInt(location.totalSales.replace(/,/g, ""))
  }, 0)
  .toLocaleString()

const totalProfit = locationData
  .reduce((sum, location) => {
    return sum + Number.parseInt(location.totalProfit.replace(/,/g, ""))
  }, 0)
  .toLocaleString()

// Quick access links
const quickLinks = [
  {
    title: "Inventory",
    description: "View and manage your current inventory",
    icon: Package,
    href: "/dashboard/activity",
    color: "bg-blue-500",
  },
  {
    title: "Products",
    description: "Add or edit products in your catalog",
    icon: ClipboardList,
    href: "/dashboard/products",
    color: "bg-green-500",
  },
  {
    title: "Reports",
    description: "View sales and inventory reports",
    icon: BarChart3,
    href: "/dashboard/statistics",
    color: "bg-purple-500",
  },
  {
    title: "Locations",
    description: "Manage your store locations",
    icon: Store,
    href: "/dashboard/locations",
    color: "bg-amber-500",
  },
]

export default function WelcomePage() {
  const [greeting, setGreeting] = useState("Good day")
  const [currentTime, setCurrentTime] = useState(new Date())

  // Set the appropriate greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting("Good morning")
    } else if (hour < 18) {
      setGreeting("Good afternoon")
    } else {
      setGreeting("Good evening")
    }

    // Update current time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="p-4 md:p-8 space-y-8">
      {/* Welcome header with user info */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold">
              {greeting}, <span className="text-primary">{userData.name}</span>
            </h1>
            <p className="text-muted-foreground">
              Welcome back to Ntake Depot Management System. Today is{" "}
              <span className="font-medium">{format(currentTime, "EEEE, MMMM d, yyyy")}</span> and the time is{" "}
              <span className="font-medium">{format(currentTime, "h:mm a")}</span>.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">{userData.role}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{userData.location}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">Last login: {format(userData.lastLogin, "MMM d, h:mm a")}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <div className="font-medium">{userData.name}</div>
              <div className="text-sm text-muted-foreground">{userData.role}</div>
            </div>
            <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm">
              <Image
                src={userData.avatar || "/placeholder.svg"}
                alt={userData.name}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sales and Profit Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle>Sales & Profit Summary</CardTitle>
          <CardDescription>Overall performance across all locations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Total Sales (All Locations)</div>
              <div className="text-4xl font-bold">{totalSales} UGX</div>
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Total Profit (All Locations)</div>
              <div className="text-4xl font-bold text-green-600">{totalProfit} UGX</div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Performance by Location</h3>
            <Tabs defaultValue={locationData[0].id.toString()}>
              <TabsList className="mb-4">
                {locationData.map((location) => (
                  <TabsTrigger key={location.id} value={location.id.toString()}>
                    {location.name}
                  </TabsTrigger>
                ))}
              </TabsList>

              {locationData.map((location) => (
                <TabsContent key={location.id} value={location.id.toString()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-muted-foreground">Sales</div>
                        <div className="text-2xl font-bold mt-1">{location.totalSales} UGX</div>
                        <div className="text-sm text-green-600 mt-1">{location.salesChange} from previous period</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-muted-foreground">Profit</div>
                        <div className="text-2xl font-bold text-green-600 mt-1">{location.totalProfit} UGX</div>
                        <div className="text-sm text-green-600 mt-1">{location.profitChange} from previous period</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-muted-foreground">Products</div>
                        <div className="text-2xl font-bold mt-1">{location.products}</div>
                        <div className="text-sm text-muted-foreground mt-1">Active products</div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm font-medium text-muted-foreground">Orders</div>
                        <div className="text-2xl font-bold mt-1">{location.orders}</div>
                        <div className="text-sm text-muted-foreground mt-1">Total orders</div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Quick access */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
          <CardDescription>Frequently used sections of the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickLinks.map((link, index) => (
              <Link href={link.href} key={index} className="block">
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow h-full flex flex-col">
                  <div className={`${link.color} text-white p-2 rounded-full w-fit mb-3`}>
                    <link.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium mb-1">{link.title}</h3>
                  <p className="text-sm text-muted-foreground">{link.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent actions in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
                <Package className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Updated inventory for Milk Bread</p>
                <p className="text-sm text-muted-foreground">Today at 9:30 AM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-green-100 text-green-700 p-2 rounded-full">
                <ShoppingCart className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Processed order #1234</p>
                <p className="text-sm text-muted-foreground">Yesterday at 4:15 PM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-amber-100 text-amber-700 p-2 rounded-full">
                <ClipboardList className="h-4 w-4" />
              </div>
              <div>
                <p className="font-medium">Added new product: Chocolate Bread</p>
                <p className="text-sm text-muted-foreground">Yesterday at 2:45 PM</p>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button variant="outline" className="w-full">
              View All Activity
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Get started button */}
      <div className="flex justify-center">
        <Button size="lg" asChild>
          <Link href="/dashboard/activity">Go to Activity Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}

