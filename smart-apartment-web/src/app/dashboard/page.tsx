"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Equipment, WorkOrder } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"];

export default function DashboardPage() {
    const [equipment, setEquipment] = useState<Equipment[]>([]);
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAll() {
            try {
                const [eqRes, woRes] = await Promise.all([
                    fetch("/api/equipment"),
                    fetch("/api/workorders")
                ]);
                if (eqRes.ok) setEquipment(await eqRes.json());
                if (woRes.ok) setWorkOrders(await woRes.json());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchAll();
    }, []);

    // 1. Calculate Total Asset Value (Buying)
    const totalAssetValue = equipment.reduce((sum, item) => sum + (item.InitialCost || 0), 0);

    // Group Asset Value by Category (Type)
    const assetsByCategory = equipment.reduce((acc, item) => {
        const cost = item.InitialCost || 0;
        if (cost > 0) {
            acc[item.Type] = (acc[item.Type] || 0) + cost;
        }
        return acc;
    }, {} as Record<string, number>);

    const assetData = Object.entries(assetsByCategory).map(([name, value]) => ({ name, value }));

    // 2. Calculate Total Repair Cost (Fixing)
    const totalRepairCost = workOrders.reduce((sum, wo) => sum + (wo.Cost || 0), 0);

    // Group Repair Cost by Category (need to map WO -> Equipment Type)
    // Create Map for quick lookup
    const equipmentMap = new Map(equipment.map(e => [e.Id, e]));

    const repairsByCategory = workOrders.reduce((acc, wo) => {
        const cost = wo.Cost || 0;
        if (cost > 0) {
            const item = equipmentMap.get(wo.EquipmentId);
            const type = item ? item.Type : "Unknown"; // Handle deleted items
            acc[type] = (acc[type] || 0) + cost;
        }
        return acc;
    }, {} as Record<string, number>);

    const repairData = Object.entries(repairsByCategory).map(([name, value]) => ({ name, value }));

    if (loading) return <div className="text-white">Loading Dashboard...</div>;

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold tracking-tight text-white">Price Dashboard</h2>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Asset Value</CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalAssetValue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total initial cost of all inventory</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Repair Cost</CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="h-4 w-4 text-muted-foreground"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRepairCost.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total spent on maintenance</p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Buying Cost by Category</CardTitle>
                        <CardDescription>Where your budget went (Assets)</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={assetData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {assetData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: any) => `$${value}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Repair Cost by Category</CardTitle>
                        <CardDescription>Which items cost the most to fix</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={repairData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {repairData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: any) => `$${value}`} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
