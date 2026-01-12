"use client"

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HistoryLog } from "@/types";

export default function HistoryPage() {
    const [logs, setLogs] = useState<HistoryLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    async function fetchData() {
        try {
            const res = await fetch("/api/history");
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    if (!mounted) return null;

    const getActionColor = (action: string) => {
        switch (action) {
            case "Create": return "bg-green-500/10 text-green-400 border-green-500/20";
            case "Modify": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
            case "Delete": return "bg-red-500/10 text-red-400 border-red-500/20";
            case "StatusChange": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
            default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-white">System History</h2>
            </div>

            <div className="space-y-4">
                {loading ? <p className="text-muted-foreground">Loading...</p> : logs.map((log) => (
                    <Card key={log.Id} className="p-4 bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-mono text-muted-foreground w-32">
                                    {new Date(log.Timestamp).toLocaleString()}
                                </span>
                                <Badge variant="outline" className={`${getActionColor(log.Action)} border`}>
                                    {log.Action}
                                </Badge>
                                <div className="flex flex-col">
                                    <span className="text-sm text-gray-200">{log.Details}</span>
                                    <span className="text-xs text-gray-500 font-mono">Target: {log.TargetId}</span>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
                {!loading && logs.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground border border-dashed border-white/10 rounded-xl">
                        No history records found.
                    </div>
                )}
            </div>
        </div>
    );
}
