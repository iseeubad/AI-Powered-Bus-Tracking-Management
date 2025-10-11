"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Bus as BusIcon, MapPin, Route, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { StopManager } from "@/components/admin/StopManager"
import { BusManager } from "@/components/admin/BusManager"
import { RouteManager } from "@/components/admin/RouteManager"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState("stops")

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 admin-bg">
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-900 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Manage buses, stops, and routes
                </p>
              </div>
            </div>
            <Link href="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Map
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="inline-flex h-auto p-1 mb-6 bg-slate-100 dark:bg-slate-800">
            <TabsTrigger value="stops" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Stops</span>
            </TabsTrigger>
            <TabsTrigger value="routes" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
              <Route className="w-4 h-4" />
              <span className="hidden sm:inline">Routes</span>
            </TabsTrigger>
            <TabsTrigger value="buses" className="gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
              <BusIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Buses</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stops" className="space-y-4">
            <StopManager />
          </TabsContent>

          <TabsContent value="routes" className="space-y-4">
            <RouteManager />
          </TabsContent>

          <TabsContent value="buses" className="space-y-4">
            <BusManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
