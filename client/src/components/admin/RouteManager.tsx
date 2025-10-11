"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Upload, Trash2, Edit, Route as RouteIcon, MapPin } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Route } from "@/types"
import { Textarea } from "@/components/ui/textarea"
import dynamic from "next/dynamic"

// Dynamically import AdminMap with SSR disabled
const DynamicAdminMap = dynamic(() => import("./AdminMap").then(mod => ({ default: mod.AdminMap })), {
  ssr: false,
})

export function RouteManager() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isBatchUploadOpen, setIsBatchUploadOpen] = useState(false)
  const [editingRoute, setEditingRoute] = useState<Route | null>(null)
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)
  const [isDrawingMode, setIsDrawingMode] = useState(false)
  const [currentPath, setCurrentPath] = useState<[number, number][]>([])
  const [newRoute, setNewRoute] = useState<Partial<Route>>({
    name: "",
    code: "",
    stops: [],
    path: [],
    description: "",
    color: "#3b82f6",
  })

  const selectedRoute = useMemo(() => {
    return routes.find(r => r._id === selectedRouteId)
  }, [routes, selectedRouteId])

  const handleMapClick = (lat: number, lon: number) => {
    if (isDrawingMode) {
      setCurrentPath([...currentPath, [lat, lon]])
    }
  }

  const handleStartDrawing = () => {
    setIsDrawingMode(true)
    setCurrentPath([])
    setIsAddDialogOpen(true)
  }

  const handleFinishDrawing = () => {
    setIsDrawingMode(false)
    setNewRoute({ ...newRoute, path: currentPath })
  }

  const handleClearPath = () => {
    setCurrentPath([])
    setNewRoute({ ...newRoute, path: [] })
  }

  const handleAddRoute = () => {
    if (!newRoute.code || !newRoute.name) {
      alert("Please fill in all required fields")
      return
    }

    const route: Route = {
      _id: Date.now().toString(),
      code: newRoute.code!,
      name: newRoute.name!,
      stops: newRoute.stops || [],
      path: currentPath.length > 0 ? currentPath : newRoute.path || [],
      description: newRoute.description,
      color: newRoute.color || "#3b82f6",
    }

    setRoutes([...routes, route])
    setIsAddDialogOpen(false)
    setIsDrawingMode(false)
    resetForm()
  }

  const handleEditRoute = () => {
    if (!editingRoute) return

    setRoutes(routes.map((r) => (r._id === editingRoute._id ? editingRoute : r)))
    setIsEditDialogOpen(false)
    setEditingRoute(null)
  }

  const handleDeleteRoute = (routeId: string) => {
    if (confirm("Are you sure you want to delete this route?")) {
      setRoutes(routes.filter((r) => r._id !== routeId))
      if (selectedRouteId === routeId) {
        setSelectedRouteId(null)
      }
    }
  }

  const handleBatchUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)

        // Convert data to Route objects
        const newRoutes: Route[] = (Array.isArray(data) ? data : [data]).map((item, index) => ({
          _id: Date.now().toString() + index,
          code: item.code || `ROUTE${Date.now()}${index}`,
          name: item.name || "Unnamed Route",
          stops: item.stops || [],
          path: item.path || [],
          description: item.description,
          color: item.color || "#3b82f6",
        }))

        setRoutes([...routes, ...newRoutes])
        setIsBatchUploadOpen(false)
        alert(`Successfully uploaded ${newRoutes.length} routes!`)
      } catch (error) {
        alert("Error parsing file: " + (error as Error).message)
      }
    }
    reader.readAsText(file)
  }

  const resetForm = () => {
    setNewRoute({
      name: "",
      code: "",
      stops: [],
      path: [],
      description: "",
      color: "#3b82f6",
    })
    setCurrentPath([])
  }

  const exportRoutes = () => {
    const dataStr = JSON.stringify(routes, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `routes-${Date.now()}.json`
    link.click()
  }

  // Get markers for path points
  const pathMarkers = useMemo(() => {
    if (isDrawingMode && currentPath.length > 0) {
      return currentPath.map((point, index) => ({
        id: `path-${index}`,
        position: point as [number, number],
        label: `Point ${index + 1}`,
        color: "#3b82f6",
      }))
    }
    return []
  }, [isDrawingMode, currentPath])

  // Get polylines for selected route
  const polylines = useMemo(() => {
    if (selectedRoute && selectedRoute.path.length > 0) {
      return [selectedRoute.path]
    }
    if (isDrawingMode && currentPath.length > 1) {
      return [currentPath]
    }
    return []
  }, [selectedRoute, isDrawingMode, currentPath])

  return (
    <div className="space-y-6">
      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Route Management</CardTitle>
          <CardDescription>
            Create routes by clicking on the map or uploading data
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button className="gap-2" onClick={handleStartDrawing}>
            <Plus className="w-4 h-4" />
            Draw New Route
          </Button>

          <Dialog open={isBatchUploadOpen} onOpenChange={setIsBatchUploadOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Batch Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Batch Upload Routes</DialogTitle>
                <DialogDescription>Upload a JSON file with route data</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file">Select File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".json"
                    onChange={handleBatchUpload}
                    className="cursor-pointer"
                  />
                </div>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>Expected JSON format:</p>
                  <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                    {`[
  {
    "code": "R1",
    "name": "Downtown Loop",
    "stops": ["STOP001", "STOP002"],
    "path": [[36.7783, -119.4179], [36.7800, -119.4200]],
    "description": "Main route",
    "color": "#3b82f6"
  }
]`}
                  </pre>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={exportRoutes} disabled={routes.length === 0}>
            Export Routes
          </Button>

          {isDrawingMode && (
            <>
              <Button variant="destructive" onClick={handleClearPath}>
                Clear Path
              </Button>
              <Button onClick={handleFinishDrawing}>Finish Drawing</Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RouteIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Interactive Map
          </CardTitle>
          <CardDescription>
            {isDrawingMode
              ? `Click on the map to add points to your route (${currentPath.length} points)`
              : "Select a route to view it on the map"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicAdminMap
            markers={pathMarkers}
            onMapClick={handleMapClick}
            height="500px"
            clickToAdd={isDrawingMode}
            polylines={polylines}
          />
        </CardContent>
      </Card>

      {/* Routes List */}
      <Card>
        <CardHeader>
          <CardTitle>Routes List ({routes.length})</CardTitle>
          <CardDescription>Manage all routes in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {routes.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No routes yet. Click "Draw New Route" to create one.
            </p>
          ) : (
            <div className="space-y-2">
              {routes.map((route) => (
                <div
                  key={route._id}
                  className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedRouteId === route._id
                      ? "bg-blue-50 dark:bg-blue-950 border-blue-500"
                      : "bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600"
                  }`}
                  onClick={() => setSelectedRouteId(route._id!)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: route.color }}
                      />
                      <h4 className="font-semibold">{route.name}</h4>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                        {route.code}
                      </span>
                    </div>
                    {route.description && (
                      <p className="text-sm text-muted-foreground mt-1">{route.description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {route.path.length} points • {route.stops.length} stops
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingRoute(route)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteRoute(route._id!)
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
        setIsAddDialogOpen(open)
        if (!open) {
          setIsDrawingMode(false)
          resetForm()
        }
      }}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Route</DialogTitle>
            <DialogDescription>
              Enter route details. Path: {currentPath.length} points
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={newRoute.code}
                onChange={(e) => setNewRoute({ ...newRoute, code: e.target.value })}
                placeholder="R1"
              />
            </div>
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={newRoute.name}
                onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                placeholder="Downtown Loop"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newRoute.description}
                onChange={(e) => setNewRoute({ ...newRoute, description: e.target.value })}
                placeholder="Main route through downtown"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={newRoute.color}
                  onChange={(e) => setNewRoute({ ...newRoute, color: e.target.value })}
                  className="w-20 h-10"
                />
                <Input
                  value={newRoute.color}
                  onChange={(e) => setNewRoute({ ...newRoute, color: e.target.value })}
                  placeholder="#3b82f6"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="stops">Stop IDs (comma-separated)</Label>
              <Input
                id="stops"
                value={newRoute.stops?.join(", ")}
                onChange={(e) =>
                  setNewRoute({
                    ...newRoute,
                    stops: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
                placeholder="STOP001, STOP002, STOP003"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClearPath} className="flex-1">
                Clear Path
              </Button>
              <Button onClick={handleAddRoute} className="flex-1">
                Add Route
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Route</DialogTitle>
            <DialogDescription>Update route details</DialogDescription>
          </DialogHeader>
          {editingRoute && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-code">Code</Label>
                <Input
                  id="edit-code"
                  value={editingRoute.code}
                  onChange={(e) => setEditingRoute({ ...editingRoute, code: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingRoute.name}
                  onChange={(e) => setEditingRoute({ ...editingRoute, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingRoute.description}
                  onChange={(e) =>
                    setEditingRoute({ ...editingRoute, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="edit-color">Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="edit-color"
                    type="color"
                    value={editingRoute.color}
                    onChange={(e) => setEditingRoute({ ...editingRoute, color: e.target.value })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={editingRoute.color}
                    onChange={(e) => setEditingRoute({ ...editingRoute, color: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-stops">Stop IDs (comma-separated)</Label>
                <Input
                  id="edit-stops"
                  value={editingRoute.stops.join(", ")}
                  onChange={(e) =>
                    setEditingRoute({
                      ...editingRoute,
                      stops: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                />
              </div>
              <Button onClick={handleEditRoute} className="w-full">
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
