"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface LocationSelectorProps {
  value: string
  onValueChange: (value: string) => void
}

export function LocationSelector({ value, onValueChange }: LocationSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select location" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="nakawa">Nakawa</SelectItem>
        <SelectItem value="kireka">Kireka</SelectItem>
        <SelectItem value="nansana">Nansana</SelectItem>
      </SelectContent>
    </Select>
  )
}

