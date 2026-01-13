import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Equipment, HistoryLog } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

export async function GET() {
    const equipment = await db.getEquipment();
    return NextResponse.json(equipment);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const newItem: Equipment = {
            Id: uuidv4(),
            Name: body.Name,
            Type: body.Type,
            Condition: "Good",
            IsAvailable: true,
            Location: body.Location || "Storage",
            InitialCost: body.InitialCost || 0,
        };

        await db.addEquipment(newItem);

        await db.addHistoryLog({
            Id: uuidv4(),
            Action: "Create",
            TargetId: newItem.Id,
            Details: `Added new ${newItem.Type}: ${newItem.Name}`,
            Timestamp: new Date().toISOString()
        });

        return NextResponse.json(newItem);
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to add equipment" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { Id, Name, Type, Location, Status } = body;

        // Fetch all to find the item (not efficient but matches logic)
        // Optimization: Could fetch just one doc if we trust ID, but we need previous values for logs
        // Let's optimize: fetch all for now to keep logic simple
        const equipment = await db.getEquipment();
        const itemIndex = equipment.findIndex(e => e.Id === Id);

        if (itemIndex === -1) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        const oldItem = equipment[itemIndex];
        const updates: string[] = [];
        const updatedItem = { ...oldItem };

        if (Name && Name !== oldItem.Name) {
            updates.push(`Name: ${oldItem.Name} -> ${Name}`);
            updatedItem.Name = Name;
        }
        if (Type && Type !== oldItem.Type) {
            updates.push(`Type: ${oldItem.Type} -> ${Type}`);
            updatedItem.Type = Type;
        }
        if (Location && Location !== oldItem.Location) {
            updates.push(`Location: ${oldItem.Location} -> ${Location}`);
            updatedItem.Location = Location;
        }
        if (body.InitialCost !== undefined && body.InitialCost !== oldItem.InitialCost) {
            updates.push(`Price: ${oldItem.InitialCost} -> ${body.InitialCost}`);
            updatedItem.InitialCost = body.InitialCost;
        }

        if (updates.length > 0) {
            await db.updateEquipment(updatedItem);

            await db.addHistoryLog({
                Id: uuidv4(),
                Action: "Modify",
                TargetId: Id,
                Details: `Updated: ${updates.join(", ")}`,
                Timestamp: new Date().toISOString()
            });
        }

        return NextResponse.json(updatedItem);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const equipment = await db.getEquipment();
        const item = equipment.find(e => e.Id === id);

        if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

        await db.deleteEquipment(id);

        await db.addHistoryLog({
            Id: uuidv4(),
            Action: "Delete",
            TargetId: id,
            Details: `Removed item: ${item.Name}`,
            Timestamp: new Date().toISOString()
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }
}
