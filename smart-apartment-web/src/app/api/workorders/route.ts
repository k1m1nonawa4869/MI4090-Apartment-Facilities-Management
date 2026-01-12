import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { WorkOrder } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

export async function GET() {
    const workOrders = await db.getWorkOrders();
    return NextResponse.json(workOrders);
}

export async function POST(req: Request) {
    try {
        // 1. Create Work Order
        const body = await req.json();

        const newOrder: WorkOrder = {
            Id: uuidv4(),
            EquipmentId: body.EquipmentId,
            Description: body.Description,
            Status: "Pending",
            CreatedAt: new Date().toISOString(),
        };

        await db.addWorkOrder(newOrder);

        // 2. Update Equipment Condition to "Broken" and Unavailable
        const equipment = await db.getEquipment();
        const itemIndex = equipment.findIndex(e => e.Id === body.EquipmentId);
        if (itemIndex !== -1) {
            const updatedItem = { ...equipment[itemIndex] };
            updatedItem.Condition = "Broken";
            updatedItem.IsAvailable = false;
            await db.updateEquipment(updatedItem);
        }

        return NextResponse.json(newOrder);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create work order" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, status, notes } = body;

        const workOrders = await db.getWorkOrders();
        const orderIndex = workOrders.findIndex(w => w.Id === id);

        if (orderIndex === -1) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Update Work Order
        const updatedOrder = { ...workOrders[orderIndex] };
        updatedOrder.Status = status;
        if (notes) updatedOrder.TechnicianNotes = notes;
        await db.updateWorkOrder(updatedOrder);

        // If completed, fix the equipment!
        if (status === "Completed") {
            const equipment = await db.getEquipment();
            const itemIndex = equipment.findIndex(e => e.Id === updatedOrder.EquipmentId);
            if (itemIndex !== -1) {
                const updatedItem = { ...equipment[itemIndex] };
                updatedItem.Condition = "Good";
                updatedItem.IsAvailable = true;
                await db.updateEquipment(updatedItem);
            }
        }

        return NextResponse.json(updatedOrder);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update work order" }, { status: 500 });
    }
}
