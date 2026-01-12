"use client"

import dynamic from "next/dynamic";

const SidebarContent = dynamic(
    () => import("./Sidebar").then(mod => mod.Sidebar),
    {
        ssr: false,
        loading: () => <div className="w-64 h-screen bg-card/50 animate-pulse" />,
    }
);

export function ClientSidebar() {
    return <SidebarContent />;
}
