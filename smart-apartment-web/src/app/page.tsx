"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Armchair, Wrench, AlertTriangle, CheckCircle } from "lucide-react";
import { Equipment, WorkOrder } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"];

const stats = [
  {
    title: "Total Inventory",
    key: "totalEquipment",
    icon: Armchair,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    title: "Maintenance Requests",
    key: "pendingMaintenance",
    icon: Wrench,
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
  {
    title: "Faults / Broken",
    key: "brokenItems",
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    title: "Available Items",
    key: "availableItems",
    icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
];

export default function Home() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function fetchData() {
      try {
        const [eqRes, woRes] = await Promise.all([
          fetch("/api/equipment"),
          fetch("/api/workorders"),
        ]);
        if (eqRes.ok) setEquipment(await eqRes.json());
        if (woRes.ok) setWorkOrders(await woRes.json());
      } catch (e) {
        console.error("Failed to fetch data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (!mounted) return null;

  const totalEquipment = equipment.length;
  const pendingMaintenance = workOrders.filter(w => w.Status === "Pending").length;
  const brokenItems = equipment.filter(e => e.Condition === "Broken").length;
  const availableItems = equipment.filter(e => e.IsAvailable).length;

  const values: Record<string, number> = {
    totalEquipment,
    pendingMaintenance,
    brokenItems,
    availableItems,
  };

  // --- Price Dashboard Logic ---
  const totalAssetValue = equipment.reduce((sum, item) => sum + (item.InitialCost || 0), 0);
  const assetsByCategory = equipment.reduce((acc, item) => {
    const cost = item.InitialCost || 0;
    if (cost > 0) acc[item.Type] = (acc[item.Type] || 0) + cost;
    return acc;
  }, {} as Record<string, number>);
  const assetData = Object.entries(assetsByCategory).map(([name, value]) => ({ name, value }));

  const totalRepairCost = workOrders.reduce((sum, wo) => sum + (wo.Cost || 0), 0);
  const equipmentMap = new Map(equipment.map(e => [e.Id, e]));
  const repairsByCategory = workOrders.reduce((acc, wo) => {
    const cost = wo.Cost || 0;
    if (cost > 0) {
      const item = equipmentMap.get(wo.EquipmentId);
      const type = item ? item.Type : "Unknown";
      acc[type] = (acc[type] || 0) + cost;
    }
    return acc;
  }, {} as Record<string, number>);
  const repairData = Object.entries(repairsByCategory).map(([name, value]) => ({ name, value }));
  // ---------------------------

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard Overview</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {loading ? "..." : values[stat.key]}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                +0% from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : equipment.slice(-5).reverse().map((item) => (
                <div key={item.Id} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 hover:bg-white/5 p-2 rounded transition-colors">
                  <div className="flex flex-col">
                    <span className="font-medium text-white">{item.Name}</span>
                    <span className="text-xs text-muted-foreground">{item.Type} • {item.Condition}</span>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${item.IsAvailable ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {item.IsAvailable ? "Available" : "In Use"}
                  </div>
                </div>
              ))}
              {!loading && equipment.length === 0 && (
                <p className="text-sm text-muted-foreground">No equipment found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 md:col-span-1">
          <CardHeader>
            <CardTitle>Recent Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : workOrders.slice(-5).reverse().map((wo) => (
                <div key={wo.Id} className="flex items-center justify-between border-b border-white/5 pb-2 last:border-0 hover:bg-white/5 p-2 rounded transition-colors">
                  <div className="flex flex-col">
                    <span className="font-medium text-white">{wo.Description}</span>
                    <span className="text-xs text-muted-foreground">Status: {wo.Status}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(wo.CreatedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
              {!loading && workOrders.length === 0 && (
                <p className="text-sm text-muted-foreground">No work orders found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- Price Dashboard Section --- */}
      <h2 className="text-2xl font-bold tracking-tight text-white mt-12 mb-6">Financial Overview</h2>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Asset Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalAssetValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total initial cost of all inventory</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Repair Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalRepairCost.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total spent on maintenance</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Buying Cost by Category</CardTitle>
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
