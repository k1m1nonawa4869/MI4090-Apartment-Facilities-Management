import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { WorkOrder } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

export async function GET() {
    const workOrders = db.getWorkOrders();
    return NextResponse.json(workOrders);
}

export async function POST(req: Request) {
    try {
        // 1. Create Work Order
        const body = await req.json();
        const workOrders = db.getWorkOrders();

        const newOrder: WorkOrder = {
            Id: uuidv4(),
            EquipmentId: body.EquipmentId,
            Description: body.Description,
            Status: "Pending",
            CreatedAt: new Date().toISOString(),
        };

        workOrders.push(newOrder);
        db.saveWorkOrders(workOrders);

        // 2. Update Equipment Condition to "Broken" and Unavailable
        const equipment = db.getEquipment();
        const itemIndex = equipment.findIndex(e => e.Id === body.EquipmentId);
        if (itemIndex !== -1) {
            equipment[itemIndex].Condition = "Broken";
            equipment[itemIndex].IsAvailable = false;
            db.saveEquipment(equipment);
        }

        return NextResponse.json(newOrder);
    } catch (error) {
        return NextResponse.json({ error: "Failed to create work order" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const { id, status, notes } = body;

        const workOrders = db.getWorkOrders();
        const orderIndex = workOrders.findIndex(w => w.Id === id);

        if (orderIndex === -1) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        // Update Work Order
        workOrders[orderIndex].Status = status;
        if (notes) workOrders[orderIndex].TechnicianNotes = notes;
        db.saveWorkOrders(workOrders);

        // If completed, fix the equipment!
        if (status === "Completed") {
            const equipment = db.getEquipment();
            const itemIndex = equipment.findIndex(e => e.Id === workOrders[orderIndex].EquipmentId);
            if (itemIndex !== -1) {
                equipment[itemIndex].Condition = "Good";
                equipment[itemIndex].IsAvailable = true;
                db.saveEquipment(equipment);
            }
        }

        return NextResponse.json(workOrders[orderIndex]);

    } catch (error) {
        return NextResponse.json({ error: "Failed to update work order" }, { status: 500 });
    }
}
