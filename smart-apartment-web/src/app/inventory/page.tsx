"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Armchair, Wifi, Microscope, Table as TableIcon, Box, Plus, AlertTriangle } from "lucide-react";
import { Equipment } from "@/types";

const iconMap: Record<string, any> = {
    Chair: Armchair,
    Table: TableIcon,
    Router: Wifi,
    Microscope: Microscope,
    Default: Box
};

export default function InventoryPage() {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    // Add Equipment Form State
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [newItemType, setNewItemType] = useState("Chair");
    const [newItemLocation, setNewItemLocation] = useState("");

    // Edit Equipment State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Equipment | null>(null);
    const [editName, setEditName] = useState("");
    const [editType, setEditType] = useState<any>("Chair");
    const [editLocation, setEditLocation] = useState("");

    // Report Fault State
    const [isFaultOpen, setIsFaultOpen] = useState(false);
    const [selectedItemForFault, setSelectedItemForFault] = useState<Equipment | null>(null);
    const [faultDescription, setFaultDescription] = useState("Broken component");

    useEffect(() => {
        setMounted(true);
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const res = await fetch("/api/equipment");
            if (res.ok) setEquipment(await res.json());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddEquipment() {
        if (!newItemName) return;

        try {
            const res = await fetch("/api/equipment", {
                method: "POST",
                body: JSON.stringify({ Name: newItemName, Type: newItemType, Location: newItemLocation })
            });
            if (res.ok) {
                setNewItemName("");
                setNewItemLocation("");
                setIsAddOpen(false);
                fetchData(); // Refresh list
            }
        } catch (e) {
            console.error("Failed to add", e);
        }
    }

    function openEditDialog(item: Equipment) {
        setEditingItem(item);
        setEditName(item.Name);
        setEditType(item.Type);
        setEditLocation(item.Location || "");
        setIsEditOpen(true);
    }

    async function handleEditEquipment() {
        if (!editingItem) return;

        try {
            const res = await fetch("/api/equipment", {
                method: "PUT",
                body: JSON.stringify({
                    Id: editingItem.Id,
                    Name: editName,
                    Type: editType,
                    Location: editLocation
                })
            });
            if (res.ok) {
                setIsEditOpen(false);
                setEditingItem(null);
                fetchData();
            }
        } catch (e) {
            console.error("Failed to edit", e);
        }
    }

    async function handleDeleteEquipment(id: string) {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            const res = await fetch(`/api/equipment?id=${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchData();
            }
        } catch (e) {
            console.error("Failed to delete", e);
        }
    }

    async function handleReportFault() {
        if (!selectedItemForFault) return;

        try {
            const res = await fetch("/api/workorders", {
                method: "POST",
                body: JSON.stringify({
                    EquipmentId: selectedItemForFault.Id,
                    Description: faultDescription
                })
            });
            if (res.ok) {
                setFaultDescription("Broken component");
                setSelectedItemForFault(null);
                setIsFaultOpen(false);
                fetchData(); // Refresh list (updates status to Broken)
            }
        } catch (e) {
            console.error("Failed to report", e);
        }
    }

    if (!mounted) return null;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-white">Equipment Inventory</h2>

                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogTrigger asChild>
                        <Button variant="premium">
                            <Plus className="mr-2 h-4 w-4" /> Add Equipment
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Equipment</DialogTitle>
                            <DialogDescription>Add a new item to the facility inventory.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Item Name</Label>
                                <Input id="name" value={newItemName} onChange={(e) => setNewItemName(e.target.value)} placeholder="e.g. Executive Chair" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="location">Location</Label>
                                <Input id="location" value={newItemLocation} onChange={(e) => setNewItemLocation(e.target.value)} placeholder="e.g. Room 101" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="type">Type</Label>
                                <select
                                    id="type"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={newItemType}
                                    onChange={(e) => setNewItemType(e.target.value)}
                                >
                                    <option value="Chair">Chair</option>
                                    <option value="Table">Table</option>
                                    <option value="Router">Router</option>
                                    <option value="Microscope">Microscope</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleAddEquipment}>Save Equipment</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Equipment</DialogTitle>
                            <DialogDescription>Update equipment details.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name">Item Name</Label>
                                <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-location">Location</Label>
                                <Input id="edit-location" value={editLocation} onChange={(e) => setEditLocation(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-type">Type</Label>
                                <select
                                    id="edit-type"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={editType}
                                    onChange={(e) => setEditType(e.target.value)}
                                >
                                    <option value="Chair">Chair</option>
                                    <option value="Table">Table</option>
                                    <option value="Router">Router</option>
                                    <option value="Microscope">Microscope</option>
                                </select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleEditEquipment}>Save Changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Fault Report Dialog (controlled by state, not trigger) */}
            <Dialog open={!!selectedItemForFault} onOpenChange={(open) => !open && setSelectedItemForFault(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Report Fault</DialogTitle>
                        <DialogDescription>
                            Reporting issue for: <span className="font-semibold text-white">{selectedItemForFault?.Name}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="desc">Problem Description</Label>
                            <Input id="desc" value={faultDescription} onChange={(e) => setFaultDescription(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="destructive" onClick={handleReportFault}>Submit Report</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {loading ? <p className="text-muted-foreground">Loading...</p> : equipment.map((item) => {
                    const Icon = iconMap[item.Type] || iconMap.Default;
                    return (
                        <Card key={item.Id} className="group overflow-hidden relative">
                            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none`}>
                                <Icon className="w-24 h-24 text-white" />
                            </div>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className={`p-2 rounded-lg bg-gradient-to-br from-white/10 to-white/5`}>
                                        <Icon className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <div className="flex gap-2">
                                        {/* Edit Button */}
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-white" onClick={() => openEditDialog(item)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                        </Button>
                                        {/* Delete Button */}
                                        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-red-400" onClick={() => handleDeleteEquipment(item.Id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${item.IsAvailable ? 'border-green-500/50 text-green-400' : 'border-red-500/50 text-red-400'}`}>
                                        {item.IsAvailable ? 'Available' : 'In Use / Broken'}
                                    </span>
                                </div>
                                <CardTitle className="mt-2 truncate">{item.Name}</CardTitle>
                                <CardDescription className="flex justify-between">
                                    <span>{item.Type}</span>
                                    <span className="font-mono text-xs opacity-50 overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]" title={item.Id}>#{item.Id.substring(0, 8)}</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground space-y-1">
                                    <p>Location: <span className="text-white">{item.Location || "N/A"}</span></p>
                                    <p>Condition: <span className={item.Condition === 'Broken' ? 'text-red-400 font-bold' : 'text-gray-300'}>{item.Condition}</span></p>
                                    {item.Condition !== 'Broken' && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full mt-4 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                                            onClick={() => setSelectedItemForFault(item)}
                                        >
                                            <AlertTriangle className="mr-2 h-3 w-3" /> Report Fault
                                        </Button>
                                    )}
                                    {item.Condition === 'Broken' && (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            disabled
                                            className="w-full mt-4 opacity-50 cursor-not-allowed"
                                        >
                                            Maintenance Required
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
                {!loading && equipment.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground border border-dashed border-white/10 rounded-xl">
                        No equipment items found.
                    </div>
                )}
            </div>
        </div>
    );
}
