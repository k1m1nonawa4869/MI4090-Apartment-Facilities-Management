import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const logs = await db.getHistoryLogs();
        // Sort by timestamp descending
        logs.sort((a: any, b: any) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime());
        return NextResponse.json(logs);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 });
    }
}
