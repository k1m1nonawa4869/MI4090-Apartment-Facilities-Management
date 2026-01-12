"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Armchair, Wrench, Settings, LogOut } from "lucide-react"

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Armchair, label: "Inventory", href: "/inventory" },
    { icon: Wrench, label: "Maintenance", href: "/maintenance" },
    { icon: Settings, label: "History", href: "/history" }, // Reusing Settings icon for History temporarily or import History icon
    { icon: Settings, label: "Settings", href: "/settings" },
]

export function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex h-screen w-64 flex-col border-r border-border bg-card/50 backdrop-blur-xl">
            <div className="flex h-14 items-center border-b border-border px-6">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    SmartApt
                </span>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
                <nav className="grid gap-1 px-2">
                    {sidebarItems.map((item, index) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={index}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                                    isActive ? "bg-accent/50 text-accent-foreground shadow-sm" : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>
            <div className="border-t border-border p-4">
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive">
                    <LogOut className="h-4 w-4" />
                    Logout
                </button>
            </div>
        </div>
    )
}
