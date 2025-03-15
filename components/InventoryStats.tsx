"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { format, subDays } from "date-fns"

// Mock data for statistics
const generateSalesData = (location: string) => {
  const today = new Date()
  const data = []

  for (let i = 30; i >= 0; i--) {
    const date = subDays(today, i)
    data.push({
      date: format(date, "MMM dd"),
      sales: Math.floor(Math.random() * 50000) + 10000,
      profit: Math.floor(Math.random() * 20000) + 5000,
    })
  }

  return data
}

const generateCategoryData = (location: string) => {
  return [
    { name: "Bread", value: Math.floor(Math.random() * 500) + 100 },
    { name: "Pastries", value: Math.floor(Math.random() * 300) + 50 },
    { name: "Beverages", value: Math.floor(Math.random() * 200) + 30 },
    { name: "Snacks", value: Math.floor(Math.random() * 150) + 20 },
    { name: "Other", value: Math.floor(Math.random() * 100) + 10 },
  ]
}

const generateExpiryData = (location: string) => {
  return [
    { name: "Expired", value: Math.floor(Math.random() * 20) + 5 },
    { name: "Near Expiry", value: Math.floor(Math.random() * 30) + 10 },
    { name: "Safe", value: Math.floor(Math.random() * 200) + 100 },
  ]
}

const generateInventoryData = (location: string) => {
  const today = new Date()
  const data = []

  for (let i = 30; i >= 0; i--) {
    const date = subDays(today, i)
    data.push({
      date: format(date, "MMM dd"),
      inStock: Math.floor(Math.random() * 300) + 100,
      sold: Math.floor(Math.random() * 100) + 20,
    })
  }

  return data
}

interface InventoryStatsProps {
  location: string
}

export function InventoryStats({ location }: InventoryStatsProps) {
  const [salesData, setSalesData] = useState<any[]>([])
  const [categoryData, setCategoryData] = useState<any[]>([])
  const [expiryData, setExpiryData] = useState<any[]>([])
  const [inventoryData, setInventoryData] = useState<any[]>([])

  useEffect(() => {
    // Generate new data when location changes
    setSalesData(generateSalesData(location))
    setCategoryData(generateCategoryData(location))
    setExpiryData(generateExpiryData(location))
    setInventoryData(generateInventoryData(location))
  }, [location])

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]
  const EXPIRY_COLORS = ["#FF0000", "#FFBB28", "#0088FE"]

  return (
    <div className="space-y-6">
      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales & Profit</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="expiry">Expiry Status</TabsTrigger>
        </TabsList>

        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales & Profit Trends</CardTitle>
              <CardDescription>
                Daily sales and profit for {location.charAt(0).toUpperCase() + location.slice(1)} location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={salesData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="profit" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Trends</CardTitle>
              <CardDescription>
                Daily inventory levels for {location.charAt(0).toUpperCase() + location.slice(1)} location
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={inventoryData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="inStock" fill="#8884d8" name="In Stock" />
                    <Bar dataKey="sold" fill="#82ca9d" name="Sold" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Distribution of sales across product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expiry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Expiry Status</CardTitle>
              <CardDescription>Distribution of products by expiry status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expiryData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {expiryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={EXPIRY_COLORS[index % EXPIRY_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

