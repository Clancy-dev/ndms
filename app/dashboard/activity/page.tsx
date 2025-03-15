"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { LocationSelector } from "@/components/LocationSelector"
import { DatePickerWithRange } from "@/components/DataPickerWithRange"
import { InventoryTable } from "@/components/InventoryTable"
import { InventoryStats } from "@/components/InventoryStats"

export default function ActivityPage() {
  const [date, setDate] = useState<Date>(new Date())
  const [location, setLocation] = useState("nakawa")

  return (
    <div className="flex flex-col p-4 md:p-8 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Activity Dashboard</h1>
          <p className="text-muted-foreground">Inventory for {format(date, "MMMM d, yyyy")}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <LocationSelector value={location} onValueChange={setLocation} />
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
      </div>

      <Tabs defaultValue="inventory" className="space-y-4">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <TabsContent value="inventory" className="space-y-4">
          <InventoryTable date={date} location={location} />
        </TabsContent>
        <TabsContent value="statistics" className="space-y-4">
          <InventoryStats location={location} />
        </TabsContent>
        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Calendar</CardTitle>
              <CardDescription>View inventory data by date</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                className="rounded-md border mx-auto"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

