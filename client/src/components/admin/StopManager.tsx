"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdminMap } from "./AdminMap"
import { Plus, Upload, Trash2, Edit, MapPin } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Stop } from "@/types"
import { Switch } from "@/components/ui/switch"
import dynamic from "next/dynamic"

// Dynamically import AdminMap with SSR disabled
const DynamicAdminMap = dynamic(() => import("./AdminMap").then(mod => ({ default: mod.AdminMap })), {
  ssr: false,
})

export function StopManager() {
  const [stops, setStops] = useState<Stop[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isBatchUploadOpen, setIsBatchUploadOpen] = useState(false)
  const [editingStop, setEditingStop] = useState<Stop | null>(null)
  const [newStop, setNewStop] = useState<Partial<Stop>>({
    code: "",
    name: "",
    location: {
      type: "Point",
      coordinates: [0, 0],
    },
    zone: "",
    amenities: [],
    is_active: true,
    served_routes: [],
  })

  const markers = useMemo(
    () =>
      stops.map((stop) => ({
        id: stop._id || stop.code,
        position: [stop.location.coordinates[1], stop.location.coordinates[0]] as [number, number],
        label: stop.name,
        color: stop.is_active ? "#22c55e" : "#ef4444",
      })),
    [stops]
  )

  const handleMapClick = (lat: number, lon: number) => {
    setNewStop((prev) => ({
      ...prev,
      location: {
        type: "Point",
        coordinates: [lon, lat],
      },
    }))
    setIsAddDialogOpen(true)
  }

  const handleAddStop = () => {
    if (!newStop.code || !newStop.name) {
      alert("Please fill in all required fields")
      return
    }

    const stop: Stop = {
      _id: Date.now().toString(),
      code: newStop.code!,
      name: newStop.name!,
      location: newStop.location!,
      zone: newStop.zone,
      amenities: newStop.amenities || [],
      is_active: newStop.is_active ?? true,
      served_routes: newStop.served_routes || [],
    }

    setStops([...stops, stop])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditStop = () => {
    if (!editingStop) return

    setStops(stops.map((s) => (s._id === editingStop._id ? editingStop : s)))
    setIsEditDialogOpen(false)
    setEditingStop(null)
  }

  const handleDeleteStop = (stopId: string) => {
    if (confirm("Are you sure you want to delete this stop?")) {
      setStops(stops.filter((s) => s._id !== stopId))
    }
  }

  const handleBatchUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        let data: any[]

        if (file.name.endsWith(".json")) {
          data = JSON.parse(content)
        } else if (file.name.endsWith(".csv")) {
          // Simple CSV parser
          const lines = content.split("\n")
          const headers = lines[0].split(",").map((h) => h.trim())
          data = lines.slice(1).map((line) => {
            const values = line.split(",").map((v) => v.trim())
            const obj: any = {}
            headers.forEach((header, index) => {
              obj[header] = values[index]
            })
            return obj
          })
        } else {
          alert("Unsupported file format. Please use JSON or CSV.")
          return
        }

        // Convert data to Stop objects
        const newStops: Stop[] = data.map((item, index) => ({
          _id: Date.now().toString() + index,
          code: item.code || `STOP${Date.now()}${index}`,
          name: item.name || "Unnamed Stop",
          location: {
            type: "Point",
            coordinates: [
              parseFloat(item.longitude || item.lon || item.lng || "0"),
              parseFloat(item.latitude || item.lat || "0"),
            ],
          },
          zone: item.zone,
          amenities: item.amenities ? item.amenities.split(";") : [],
          is_active: item.is_active !== "false",
          served_routes: item.served_routes ? item.served_routes.split(";") : [],
        }))

        setStops([...stops, ...newStops])
        setIsBatchUploadOpen(false)
        alert(`Successfully uploaded ${newStops.length} stops!`)
      } catch (error) {
        alert("Error parsing file: " + (error as Error).message)
      }
    }
    reader.readAsText(file)
  }

  const resetForm = () => {
    setNewStop({
      code: "",
      name: "",
      location: {
        type: "Point",
        coordinates: [0, 0],
      },
      zone: "",
      amenities: [],
      is_active: true,
      served_routes: [],
    })
  }

  const exportStops = () => {
    const dataStr = JSON.stringify(stops, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `stops-${Date.now()}.json`
    link.click()
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Stop Management</CardTitle>
          <CardDescription>
            Click on the map to add stops, or use the buttons below for other options
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Stop Manually
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Stop</DialogTitle>
                <DialogDescription>
                  Enter stop details or click on the map to set location
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="code">Code *</Label>
                  <Input
                    id="code"
                    value={newStop.code}
                    onChange={(e) => setNewStop({ ...newStop, code: e.target.value })}
                    placeholder="STOP001"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={newStop.name}
                    onChange={(e) => setNewStop({ ...newStop, name: e.target.value })}
                    placeholder="Main Street Station"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="lat">Latitude</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="any"
                      value={newStop.location?.coordinates[1] || 0}
                      onChange={(e) =>
                        setNewStop({
                          ...newStop,
                          location: {
                            type: "Point",
                            coordinates: [
                              newStop.location?.coordinates[0] || 0,
                              parseFloat(e.target.value),
                            ],
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="lon">Longitude</Label>
                    <Input
                      id="lon"
                      type="number"
                      step="any"
                      value={newStop.location?.coordinates[0] || 0}
                      onChange={(e) =>
                        setNewStop({
                          ...newStop,
                          location: {
                            type: "Point",
                            coordinates: [
                              parseFloat(e.target.value),
                              newStop.location?.coordinates[1] || 0,
                            ],
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="zone">Zone</Label>
                  <Input
                    id="zone"
                    value={newStop.zone}
                    onChange={(e) => setNewStop({ ...newStop, zone: e.target.value })}
                    placeholder="Zone A"
                  />
                </div>
                <div>
                  <Label htmlFor="routes">Served Routes (comma-separated)</Label>
                  <Input
                    id="routes"
                    value={newStop.served_routes?.join(", ")}
                    onChange={(e) =>
                      setNewStop({
                        ...newStop,
                        served_routes: e.target.value.split(",").map((r) => r.trim()),
                      })
                    }
                    placeholder="1, 5, 12"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="active"
                    checked={newStop.is_active}
                    onCheckedChange={(checked) => setNewStop({ ...newStop, is_active: checked })}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
                <Button onClick={handleAddStop} className="w-full">
                  Add Stop
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isBatchUploadOpen} onOpenChange={setIsBatchUploadOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Upload className="w-4 h-4" />
                Batch Upload
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Batch Upload Stops</DialogTitle>
                <DialogDescription>
                  Upload a JSON or CSV file with stop data
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="file">Select File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".json,.csv"
                    onChange={handleBatchUpload}
                    className="cursor-pointer"
                  />
                </div>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>Expected JSON format:</p>
                  <pre className="bg-muted p-2 rounded text-xs overflow-x-auto">
                    {`[
  {
    "code": "STOP001",
    "name": "Main St",
    "latitude": 36.7783,
    "longitude": -119.4179,
    "zone": "Zone A",
    "served_routes": "1;5;12"
  }
]`}
                  </pre>
                  <p>CSV headers: code, name, latitude, longitude, zone, served_routes</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={exportStops} disabled={stops.length === 0}>
            Export Stops
          </Button>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Interactive Map
          </CardTitle>
          <CardDescription>Click anywhere on the map to add a new stop</CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicAdminMap
            markers={markers}
            onMapClick={handleMapClick}
            height="500px"
            clickToAdd={true}
          />
        </CardContent>
      </Card>

      {/* Stops List */}
      <Card>
        <CardHeader>
          <CardTitle>Stops List ({stops.length})</CardTitle>
          <CardDescription>Manage all stops in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {stops.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No stops yet. Click on the map or use the buttons above to add stops.
            </p>
          ) : (
            <div className="space-y-2">
              {stops.map((stop) => (
                <div
                  key={stop._id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{stop.name}</h4>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                        {stop.code}
                      </span>
                      {!stop.is_active && (
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded">
                          Inactive
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {stop.location.coordinates[1].toFixed(6)}, {stop.location.coordinates[0].toFixed(6)}
                      {stop.zone && ` • ${stop.zone}`}
                    </p>
                    {stop.served_routes.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Routes: {stop.served_routes.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingStop(stop)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteStop(stop._id!)}
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Stop</DialogTitle>
            <DialogDescription>Update stop details</DialogDescription>
          </DialogHeader>
          {editingStop && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-code">Code</Label>
                <Input
                  id="edit-code"
                  value={editingStop.code}
                  onChange={(e) => setEditingStop({ ...editingStop, code: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editingStop.name}
                  onChange={(e) => setEditingStop({ ...editingStop, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="edit-lat">Latitude</Label>
                  <Input
                    id="edit-lat"
                    type="number"
                    step="any"
                    value={editingStop.location.coordinates[1]}
                    onChange={(e) =>
                      setEditingStop({
                        ...editingStop,
                        location: {
                          type: "Point",
                          coordinates: [
                            editingStop.location.coordinates[0],
                            parseFloat(e.target.value),
                          ],
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-lon">Longitude</Label>
                  <Input
                    id="edit-lon"
                    type="number"
                    step="any"
                    value={editingStop.location.coordinates[0]}
                    onChange={(e) =>
                      setEditingStop({
                        ...editingStop,
                        location: {
                          type: "Point",
                          coordinates: [
                            parseFloat(e.target.value),
                            editingStop.location.coordinates[1],
                          ],
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-zone">Zone</Label>
                <Input
                  id="edit-zone"
                  value={editingStop.zone}
                  onChange={(e) => setEditingStop({ ...editingStop, zone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-routes">Served Routes (comma-separated)</Label>
                <Input
                  id="edit-routes"
                  value={editingStop.served_routes.join(", ")}
                  onChange={(e) =>
                    setEditingStop({
                      ...editingStop,
                      served_routes: e.target.value.split(",").map((r) => r.trim()),
                    })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-active"
                  checked={editingStop.is_active}
                  onCheckedChange={(checked) =>
                    setEditingStop({ ...editingStop, is_active: checked })
                  }
                />
                <Label htmlFor="edit-active">Active</Label>
              </div>
              <Button onClick={handleEditStop} className="w-full">
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
