export type EquipmentType = "Chair" | "Table" | "Router" | "Microscope";

export interface Equipment {
    Id: string; // C# Guid serialized is a string
    Name: string;
    Type: EquipmentType;
    Condition: "Good" | "Fair" | "Poor" | "Broken";
    IsAvailable: boolean;
    Location?: string;
    InitialCost?: number;
}

export interface WorkOrder {
    Id: string;
    EquipmentId: string;
    Description: string;
    Status: "Pending" | "In Progress" | "Completed";
    CreatedAt: string; // DateTime serialized
    TechnicianNotes?: string;
    Cost?: number;
    Strategy?: string; // "Combine" | "FalseReport"
}

export interface HistoryLog {
    Id: string;
    Action: "Create" | "Modify" | "Delete" | "StatusChange";
    TargetId: string;
    Details: string;
    Timestamp: string;
}
