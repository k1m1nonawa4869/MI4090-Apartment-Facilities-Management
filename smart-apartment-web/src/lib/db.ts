import fs from 'fs';
import path from 'path';
import { Equipment, WorkOrder } from '@/types';

// Path to C# bin directory relative to this Next.js project
// D:\GitHub\CurrentRepo\smart-apartment-web -> D:\GitHub\CurrentRepo\SmartApartment\bin\Debug\net9.0
const DATA_DIR = path.resolve(process.cwd(), '../SmartApartment/bin/Debug/net9.0');
const EQUIPMENT_FILE = path.join(DATA_DIR, 'equipment_db.txt');
const WORK_ORDER_FILE = path.join(DATA_DIR, 'maintenance_log.txt');
const HISTORY_FILE = path.join(DATA_DIR, 'history_log.txt');

function readJsonFile<T>(filePath: string): T[] {
    try {
        if (!fs.existsSync(filePath)) {
            console.warn(`File not found: ${filePath}, returning empty array.`);
            return [];
        }
        const data = fs.readFileSync(filePath, 'utf-8');
        if (!data) return [];
        return JSON.parse(data) as T[];
    } catch (error) {
        // console.error(`Error reading file ${filePath}:`, error);
        return [];
    }
}

function writeJsonFile<T>(filePath: string, data: T[]): void {
    try {
        // Ensure directory exists (though it should from C# build)
        if (!fs.existsSync(path.dirname(filePath))) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Error writing file ${filePath}:`, error);
    }
}

export const db = {
    getEquipment: () => readJsonFile<Equipment>(EQUIPMENT_FILE),
    saveEquipment: (items: Equipment[]) => writeJsonFile(EQUIPMENT_FILE, items),

    getWorkOrders: () => readJsonFile<WorkOrder>(WORK_ORDER_FILE),
    saveWorkOrders: (items: WorkOrder[]) => writeJsonFile(WORK_ORDER_FILE, items),

    getHistoryLogs: () => readJsonFile<any>(HISTORY_FILE), // Use any to avoid circular import or define Type locally if needed
    saveHistoryLogs: (items: any[]) => writeJsonFile(HISTORY_FILE, items),
};
