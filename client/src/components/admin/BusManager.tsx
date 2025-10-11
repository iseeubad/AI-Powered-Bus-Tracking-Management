"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Upload, Trash2, Edit, Bus as BusIcon } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Bus } from "@/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import dynamic from "next/dynamic"

// Dynamically import AdminMap with SSR disabled
const DynamicAdminMap = dynamic(() => import("./AdminMap").then(mod => ({ default: mod.AdminMap })), {
  ssr: false,
})

export function BusManager() {
  const [buses, setBuses] = useState<Bus[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isBatchUploadOpen, setIsBatchUploadOpen] = useState(false)
  const [editingBus, setEditingBus] = useState<Bus | null>(null)
  const [newBus, setNewBus] = useState<Partial<Bus>>({
    fleet_no: "",
    plate: "",
    operator: "",
    busModel: "",
    capacity: {
      seated: 0,
      standing: 0,
    },
    features: [],
    status: "IN_SERVICE",
    assigned_routes: "",
    last_telemetry: {
      ts: new Date(),
      location: {
        type: "Point",
        coordinates: [0, 0],
      },
    },
  })

  const markers = useMemo(
    () =>
      buses
        .filter((bus) => bus.last_telemetry?.location)
        .map((bus) => ({
          id: bus._id || bus.fleet_no,
          position: [
            bus.last_telemetry!.location.coordinates[1],
            bus.last_telemetry!.location.coordinates[0],
          ] as [number, number],
          label: `${bus.fleet_no} - ${bus.status}`,
          color:
            bus.status === "IN_SERVICE"
              ? "#22c55e"
              : bus.status === "MAINTENANCE"
              ? "#f59e0b"
              : "#ef4444",
        })),
    [buses]
  )

  const handleMapClick = (lat: number, lon: number) => {
    setNewBus((prev) => ({
      ...prev,
      last_telemetry: {
        ts: new Date(),
        location: {
          type: "Point",
          coordinates: [lon, lat],
        },
      },
    }))
    setIsAddDialogOpen(true)
  }

  const handleAddBus = () => {
    if (!newBus.fleet_no) {
      alert("Please enter a fleet number")
      return
    }

    const bus: Bus = {
      _id: Date.now().toString(),
      fleet_no: newBus.fleet_no!,
      plate: newBus.plate,
      operator: newBus.operator,
      busModel: newBus.busModel,
      capacity: newBus.capacity,
      features: newBus.features || [],
      status: newBus.status!,
      assigned_routes: newBus.assigned_routes,
      last_telemetry: newBus.last_telemetry,
    }

    setBuses([...buses, bus])
    setIsAddDialogOpen(false)
    resetForm()
  }

  const handleEditBus = () => {
    if (!editingBus) return

    setBuses(buses.map((b) => (b._id === editingBus._id ? editingBus : b)))
    setIsEditDialogOpen(false)
    setEditingBus(null)
  }

  const handleDeleteBus = (busId: string) => {
    if (confirm("Are you sure you want to delete this bus?")) {
      setBuses(buses.filter((b) => b._id !== busId))
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

        // Convert data to Bus objects
        const newBuses: Bus[] = data.map((item, index) => ({
          _id: Date.now().toString() + index,
          fleet_no: item.fleet_no || `BUS${Date.now()}${index}`,
          plate: item.plate,
          operator: item.operator,
          busModel: item.busModel || item.model,
          capacity: {
            seated: parseInt(item.seated || item.capacity_seated || "0"),
            standing: parseInt(item.standing || item.capacity_standing || "0"),
          },
          features: item.features ? item.features.split(";") : [],
          status: (item.status || "IN_SERVICE") as Bus["status"],
          assigned_routes: item.assigned_routes,
          last_telemetry: item.latitude
            ? {
                ts: new Date(),
                location: {
                  type: "Point",
                  coordinates: [parseFloat(item.longitude || "0"), parseFloat(item.latitude || "0")],
                },
              }
            : undefined,
        }))

        setBuses([...buses, ...newBuses])
        setIsBatchUploadOpen(false)
        alert(`Successfully uploaded ${newBuses.length} buses!`)
      } catch (error) {
        alert("Error parsing file: " + (error as Error).message)
      }
    }
    reader.readAsText(file)
  }

  const resetForm = () => {
    setNewBus({
      fleet_no: "",
      plate: "",
      operator: "",
      busModel: "",
      capacity: {
        seated: 0,
        standing: 0,
      },
      features: [],
      status: "IN_SERVICE",
      assigned_routes: "",
      last_telemetry: {
        ts: new Date(),
        location: {
          type: "Point",
          coordinates: [0, 0],
        },
      },
    })
  }

  const exportBuses = () => {
    const dataStr = JSON.stringify(buses, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `buses-${Date.now()}.json`
    link.click()
  }

  const getStatusBadgeColor = (status: Bus["status"]) => {
    switch (status) {
      case "IN_SERVICE":
        return "bg-green-100 text-green-800"
      case "MAINTENANCE":
        return "bg-yellow-100 text-yellow-800"
      case "OUT_OF_SERVICE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Bus Fleet Management</CardTitle>
          <CardDescription>
            Manage your bus fleet - add, edit, or import buses
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Add Bus
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Bus</DialogTitle>
                <DialogDescription>Enter bus details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fleet_no">Fleet Number *</Label>
                  <Input
                    id="fleet_no"
                    value={newBus.fleet_no}
                    onChange={(e) => setNewBus({ ...newBus, fleet_no: e.target.value })}
                    placeholder="BUS001"
                  />
                </div>
                <div>
                  <Label htmlFor="plate">License Plate</Label>
                  <Input
                    id="plate"
                    value={newBus.plate}
                    onChange={(e) => setNewBus({ ...newBus, plate: e.target.value })}
                    placeholder="ABC123"
                  />
                </div>
                <div>
                  <Label htmlFor="operator">Operator</Label>
                  <Input
                    id="operator"
                    value={newBus.operator}
                    onChange={(e) => setNewBus({ ...newBus, operator: e.target.value })}
                    placeholder="City Transit"
                  />
                </div>
                <div>
                  <Label htmlFor="busModel">Bus Model</Label>
                  <Input
                    id="busModel"
                    value={newBus.busModel}
                    onChange={(e) => setNewBus({ ...newBus, busModel: e.target.value })}
                    placeholder="Mercedes Citaro"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="seated">Seated Capacity</Label>
                    <Input
                      id="seated"
                      type="number"
                      value={newBus.capacity?.seated}
                      onChange={(e) =>
                        setNewBus({
                          ...newBus,
                          capacity: {
                            ...newBus.capacity,
                            seated: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="standing">Standing Capacity</Label>
                    <Input
                      id="standing"
                      type="number"
                      value={newBus.capacity?.standing}
                      onChange={(e) =>
                        setNewBus({
                          ...newBus,
                          capacity: {
                            ...newBus.capacity,
                            standing: parseInt(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newBus.status}
                    onValueChange={(value) =>
                      setNewBus({ ...newBus, status: value as Bus["status"] })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN_SERVICE">In Service</SelectItem>
                      <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                      <SelectItem value="OUT_OF_SERVICE">Out of Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="routes">Assigned Routes</Label>
                  <Input
                    id="routes"
                    value={newBus.assigned_routes}
                    onChange={(e) => setNewBus({ ...newBus, assigned_routes: e.target.value })}
                    placeholder="1, 5, 12"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="lat">Latitude</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="any"
                      value={newBus.last_telemetry?.location.coordinates[1] || 0}
                      onChange={(e) =>
                        setNewBus({
                          ...newBus,
                          last_telemetry: {
                            ts: new Date(),
                            location: {
                              type: "Point",
                              coordinates: [
                                newBus.last_telemetry?.location.coordinates[0] || 0,
                                parseFloat(e.target.value),
                              ],
                            },
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
                      value={newBus.last_telemetry?.location.coordinates[0] || 0}
                      onChange={(e) =>
                        setNewBus({
                          ...newBus,
                          last_telemetry: {
                            ts: new Date(),
                            location: {
                              type: "Point",
                              coordinates: [
                                parseFloat(e.target.value),
                                newBus.last_telemetry?.location.coordinates[1] || 0,
                              ],
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="features">Features (comma-separated)</Label>
                  <Input
                    id="features"
                    value={newBus.features?.join(", ")}
                    onChange={(e) =>
                      setNewBus({
                        ...newBus,
                        features: e.target.value.split(",").map((f) => f.trim()).filter(Boolean),
                      })
                    }
                    placeholder="WiFi, AC, USB Charging"
                  />
                </div>
                <Button onClick={handleAddBus} className="w-full">
                  Add Bus
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
                <DialogTitle>Batch Upload Buses</DialogTitle>
                <DialogDescription>Upload a JSON or CSV file with bus data</DialogDescription>
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
    "fleet_no": "BUS001",
    "plate": "ABC123",
    "operator": "City Transit",
    "model": "Mercedes",
    "seated": 40,
    "standing": 20,
    "status": "IN_SERVICE",
    "assigned_routes": "1, 5",
    "latitude": 36.7783,
    "longitude": -119.4179
  }
]`}
                  </pre>
                  <p>
                    CSV headers: fleet_no, plate, operator, model, seated, standing, status,
                    assigned_routes, latitude, longitude
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={exportBuses} disabled={buses.length === 0}>
            Export Buses
          </Button>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BusIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Bus Locations
          </CardTitle>
          <CardDescription>View all buses on the map</CardDescription>
        </CardHeader>
        <CardContent>
          <DynamicAdminMap markers={markers} onMapClick={handleMapClick} height="500px" clickToAdd={false} />
        </CardContent>
      </Card>

      {/* Buses List */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet List ({buses.length})</CardTitle>
          <CardDescription>All buses in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {buses.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No buses yet. Click "Add Bus" or "Batch Upload" to add buses.
            </p>
          ) : (
            <div className="space-y-2">
              {buses.map((bus) => (
                <div
                  key={bus._id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{bus.fleet_no}</h4>
                      {bus.plate && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">{bus.plate}</span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded ${getStatusBadgeColor(bus.status)}`}>
                        {bus.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {bus.operator && `${bus.operator} • `}
                      {bus.busModel && `${bus.busModel} • `}
                      {bus.capacity && `${(bus.capacity.seated ?? 0) + (bus.capacity.standing || 0)} capacity`}
                    </p>
                    {bus.assigned_routes && (
                      <p className="text-xs text-muted-foreground">Routes: {bus.assigned_routes}</p>
                    )}
                    {bus.features && bus.features.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Features: {bus.features.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingBus(bus)
                        setIsEditDialogOpen(true)
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteBus(bus._id!)}>
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
            <DialogTitle>Edit Bus</DialogTitle>
            <DialogDescription>Update bus details</DialogDescription>
          </DialogHeader>
          {editingBus && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-fleet_no">Fleet Number</Label>
                <Input
                  id="edit-fleet_no"
                  value={editingBus.fleet_no}
                  onChange={(e) => setEditingBus({ ...editingBus, fleet_no: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-plate">License Plate</Label>
                <Input
                  id="edit-plate"
                  value={editingBus.plate}
                  onChange={(e) => setEditingBus({ ...editingBus, plate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-operator">Operator</Label>
                <Input
                  id="edit-operator"
                  value={editingBus.operator}
                  onChange={(e) => setEditingBus({ ...editingBus, operator: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-busModel">Bus Model</Label>
                <Input
                  id="edit-busModel"
                  value={editingBus.busModel}
                  onChange={(e) => setEditingBus({ ...editingBus, busModel: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="edit-seated">Seated Capacity</Label>
                  <Input
                    id="edit-seated"
                    type="number"
                    value={editingBus.capacity?.seated}
                    onChange={(e) =>
                      setEditingBus({
                        ...editingBus,
                        capacity: {
                          ...editingBus.capacity,
                          seated: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-standing">Standing Capacity</Label>
                  <Input
                    id="edit-standing"
                    type="number"
                    value={editingBus.capacity?.standing}
                    onChange={(e) =>
                      setEditingBus({
                        ...editingBus,
                        capacity: {
                          ...editingBus.capacity,
                          standing: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editingBus.status}
                  onValueChange={(value) =>
                    setEditingBus({ ...editingBus, status: value as Bus["status"] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN_SERVICE">In Service</SelectItem>
                    <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    <SelectItem value="OUT_OF_SERVICE">Out of Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-routes">Assigned Routes</Label>
                <Input
                  id="edit-routes"
                  value={editingBus.assigned_routes}
                  onChange={(e) => setEditingBus({ ...editingBus, assigned_routes: e.target.value })}
                />
              </div>
              <Button onClick={handleEditBus} className="w-full">
                Save Changes
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
