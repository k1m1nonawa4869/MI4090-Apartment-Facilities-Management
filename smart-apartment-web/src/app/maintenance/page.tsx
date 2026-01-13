"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BadgeAlert, CheckCircle2, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { WorkOrder, Equipment } from "@/types";

export default function MaintenancePage() {
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [equipment, setEquipment] = useState<Equipment[]>([]); // To lookup equipment details
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    // Complete Maintenance State
    const [selectedOrder, setSelectedOrder] = useState<WorkOrder | null>(null);
    const [technicianNotes, setTechnicianNotes] = useState("Fixed issue.");
    const [maintenanceCost, setMaintenanceCost] = useState("");
    const [strategy, setStrategy] = useState("combine");
    // "combine" = Repair with Note & Cost
    // "false" = False Report (Cost 0)

    const [hideCompleted, setHideCompleted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchData();
        const interval = setInterval(fetchData, 5000); // Poll for updates
        return () => clearInterval(interval);
    }, []);

    async function fetchData() {
        try {
            const [woRes, eqRes] = await Promise.all([
                fetch("/api/workorders"),
                fetch("/api/equipment")
            ]);
            if (woRes.ok) setWorkOrders(await woRes.json());
            if (eqRes.ok) setEquipment(await eqRes.json());
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function handleCompleteOrder() {
        if (!selectedOrder) return;

        try {
            const res = await fetch("/api/workorders", {
                method: "PATCH",
                body: JSON.stringify({
                    id: selectedOrder.Id,
                    status: "Completed",
                    notes: technicianNotes,
                    strategy: strategy,
                    cost: strategy === "false" ? 0 : parseFloat(maintenanceCost) || 0
                })
            });

            if (res.ok) {
                setSelectedOrder(null);
                setTechnicianNotes("Fixed issue.");
                setMaintenanceCost("");
                setStrategy("combine");
                fetchData();
            }
        } catch (e) {
            console.error("Failed to complete", e);
        }
    }

    if (!mounted) return null;

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "Completed": return CheckCircle2;
            case "In Progress": return Clock;
            default: return BadgeAlert; // Pending
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed": return "text-green-500";
            case "In Progress": return "text-orange-500";
            default: return "text-red-500";
        }
    };

    // Create lookup for equipment
    const equipmentMap = new Map(equipment.map(e => [e.Id, e]));

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-white">Maintenance Log</h2>
                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="hide-completed"
                        checked={hideCompleted}
                        onCheckedChange={(checked) => setHideCompleted(checked as boolean)}
                    />
                    <Label htmlFor="hide-completed" className="text-white">Hide Completed / False Reports</Label>
                </div>
            </div>

            <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Complete Maintenance</DialogTitle>
                        <DialogDescription>
                            Marking order as completed for: <span className="font-mono text-white">{selectedOrder?.EquipmentId.substring(0, 8)}...</span>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="strategy">Strategy</Label>
                            <select
                                id="strategy"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                value={strategy}
                                onChange={(e) => setStrategy(e.target.value)}
                            >
                                <option value="combine">Combine Repair (Note + Cost)</option>
                                <option value="false">False Report (No Issue)</option>
                            </select>
                        </div>

                        {strategy === "combine" && (
                            <div className="grid gap-2">
                                <Label htmlFor="cost">Repair Cost ($)</Label>
                                <Input id="cost" type="number" value={maintenanceCost} onChange={(e) => setMaintenanceCost(e.target.value)} placeholder="0.00" />
                            </div>
                        )}

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Technician Notes</Label>
                            <Input id="notes" value={technicianNotes} onChange={(e) => setTechnicianNotes(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleCompleteOrder}>
                            <Check className="mr-2 h-4 w-4" /> Mark Completed
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <div className="space-y-4">
                {loading ? <p className="text-muted-foreground">Loading...</p> : workOrders
                    .filter(wo => !hideCompleted || wo.Status !== "Completed")
                    .slice().reverse().map((wo) => {
                        const Icon = getStatusIcon(wo.Status);
                        const color = getStatusColor(wo.Status);
                        const item = equipmentMap.get(wo.EquipmentId);

                        return (
                            <Card key={wo.Id} className="flex flex-col md:flex-row items-center border-l-4 border-l-blue-500 bg-white/5 hover:bg-white/10 transition-colors">
                                <div className="p-6 md:w-64 flex flex-col items-center md:items-start border-b md:border-b-0 md:border-r border-white/5">
                                    <span className="text-xs text-muted-foreground">{new Date(wo.CreatedAt).toLocaleDateString()}</span>
                                    <span className="text-xs text-muted-foreground mb-2">{new Date(wo.CreatedAt).toLocaleTimeString()}</span>
                                    <div className={`flex items-center gap-2 ${color}`}>
                                        <Icon className="h-5 w-5" />
                                        <span className="font-medium">{wo.Status}</span>
                                    </div>
                                </div>
                                <div className="p-6 flex-1 w-full">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-semibold text-white">{wo.Description}</h3>
                                            {item ? (
                                                <div className="text-sm text-gray-400">
                                                    <span className="font-medium text-blue-300">{item.Name}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>Loc: <span className="text-white">{item.Location || "N/A"}</span></span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground italic">Item Removed</span>
                                            )}
                                        </div>
                                        {wo.Status !== 'Completed' && (
                                            <Button size="sm" variant="outline" onClick={() => setSelectedOrder(wo)}>
                                                Mark Done
                                            </Button>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-4 mt-2">
                                        ID: <span className="font-mono text-xs bg-white/10 px-1 rounded mr-2">{wo.EquipmentId.substring(0, 8)}</span>
                                        {wo.Cost !== undefined && <span className="text-green-400 font-bold ml-2">Cost: ${wo.Cost}</span>}
                                        {wo.Strategy && <span className="text-blue-400 text-xs ml-2 uppercase">[{wo.Strategy}]</span>}
                                    </p>
                                    {wo.TechnicianNotes && (
                                        <div className="bg-black/20 p-3 rounded-lg text-sm text-gray-300">
                                            <span className="font-semibold text-blue-400 block text-xs mb-1">Technician Notes:</span>
                                            {wo.TechnicianNotes}
                                        </div>
                                    )}
                                </div>
                            </Card>
                        );
                    })}
                {!loading && workOrders.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground border border-dashed border-white/10 rounded-xl">
                        No maintenance records found.
                    </div>
                )}
            </div>
        </div>
    );
}
