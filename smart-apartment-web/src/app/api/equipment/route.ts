import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { Equipment, HistoryLog } from "@/types";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";

export async function GET() {
    const equipment = db.getEquipment();
    return NextResponse.json(equipment);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const equipment = db.getEquipment();

        const newItem: Equipment = {
            Id: uuidv4(),
            Name: body.Name,
            Type: body.Type,
            Condition: "Good",
            IsAvailable: true,
            Location: body.Location || "Storage",
        };

        equipment.push(newItem);
        db.saveEquipment(equipment);

        const logs = db.getHistoryLogs();
        logs.push({
            Id: uuidv4(),
            Action: "Create",
            TargetId: newItem.Id,
            Details: `Added new ${newItem.Type}: ${newItem.Name}`,
            Timestamp: new Date().toISOString()
        });
        db.saveHistoryLogs(logs);

        return NextResponse.json(newItem);
    } catch (error) {
        return NextResponse.json({ error: "Failed to add equipment" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { Id, Name, Type, Location, Status } = body;

        const equipment = db.getEquipment();
        const itemIndex = equipment.findIndex(e => e.Id === Id);

        if (itemIndex === -1) {
            return NextResponse.json({ error: "Item not found" }, { status: 404 });
        }

        const oldItem = equipment[itemIndex];
        const updates: string[] = [];

        if (Name && Name !== oldItem.Name) {
            updates.push(`Name: ${oldItem.Name} -> ${Name}`);
            equipment[itemIndex].Name = Name;
        }
        if (Type && Type !== oldItem.Type) {
            updates.push(`Type: ${oldItem.Type} -> ${Type}`);
            equipment[itemIndex].Type = Type;
        }
        if (Location && Location !== oldItem.Location) {
            updates.push(`Location: ${oldItem.Location} -> ${Location}`);
            equipment[itemIndex].Location = Location;
        }

        if (updates.length > 0) {
            db.saveEquipment(equipment);

            const logs = db.getHistoryLogs();
            logs.push({
                Id: uuidv4(),
                Action: "Modify",
                TargetId: Id,
                Details: `Updated: ${updates.join(", ")}`,
                Timestamp: new Date().toISOString()
            });
            db.saveHistoryLogs(logs);
        }

        return NextResponse.json(equipment[itemIndex]);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

        const equipment = db.getEquipment();
        const item = equipment.find(e => e.Id === id);

        if (!item) return NextResponse.json({ error: "Item not found" }, { status: 404 });

        const newEquipment = equipment.filter(e => e.Id !== id);
        db.saveEquipment(newEquipment);

        const logs = db.getHistoryLogs();
        logs.push({
            Id: uuidv4(),
            Action: "Delete",
            TargetId: id,
            Details: `Removed item: ${item.Name}`,
            Timestamp: new Date().toISOString()
        });
        db.saveHistoryLogs(logs);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }
}
