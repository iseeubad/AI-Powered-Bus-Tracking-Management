"use client"

import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  icon: LucideIcon
  label: string
  value: string | number
  iconColor?: string
}

export function StatsCard({ icon: Icon, label, value, iconColor = "text-primary" }: StatsCardProps) {
  return (
    <div className="bg-background/95 backdrop-blur-sm rounded-lg border shadow-sm p-3">
      <div className="flex flex-col items-center gap-1">
        <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <p className="text-xs text-muted-foreground text-center leading-tight">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  )
}
