# Frontend-Backend Architecture

This document explains how the **Smart Apartment Web App** connects its Frontend (UI) to its Backend (Data).

## Overview
The application uses a **Serverless Architecture** powered by **Next.js**.

-   **Frontend**: React Client Components (running in your browser).
-   **Backend**: Next.js API Routes (running on the server/Vercel).
-   **Database**: Firebase Firestore (NoSQL cloud database).

---

## 1. The Frontend (Client-Side)
Located in `src/app/.../page.tsx`

The User Interface is built with React. When a user interacts with the page (e.g., clicks "Save Equipment" or "Complete Maintenance"), the browser sends an **HTTP Request** to the internal API.

### Example: Adding Equipment
**File**: `src/app/inventory/page.tsx`

```typescript
// 1. User fills form and clicks "Save"
async function handleAddEquipment() {
    // 2. Frontend sends POST request to internal API
    const res = await fetch("/api/equipment", {
        method: "POST",
        body: JSON.stringify({ 
            Name: "Gaming PC", 
            Type: "Electronics", 
            InitialCost: 2500 
        })
    });
    
    // 3. Frontend waits for response and updates UI
    if (res.ok) {
        fetchData(); // Refresh list
    }
}
```

---

## 2. The Backend (API Routes)
Located in `src/app/api/.../route.ts`

These files act as the server. They receive the request from the frontend, perform security checks or validation, and then talk to the database. This hides your database credentials from the public.

### Example: API Handler
**File**: `src/app/api/equipment/route.ts`

```typescript
// 1. Receive POST request
export async function POST(req: Request) {
    const body = await req.json();

    // 2. Prepare data object
    const newItem = {
        Id: uuidv4(),
        Name: body.Name,
        InitialCost: body.InitialCost,
        // ...
    };

    // 3. Call Database Helper (see Section 3)
    await db.addEquipment(newItem);

    // 4. Send success response back to Frontend
    return NextResponse.json(newItem);
}
```

---

## 3. The Database Layer
Located in `src/lib/db.ts`

This is a helper file that manages the actual connection to **Firestore** using the `firebase-admin` SDK.

### Example: Database Operation
**File**: `src/lib/db.ts`

```typescript
import { getFirestore } from './firebaseAdmin';

export const db = {
    addEquipment: async (item: Equipment) => {
        // Writes data to the "equipment" collection in Firestore
        await getFirestore().collection("equipment").doc(item.Id).set(item);
    }
};
```

---

## Data Flow Summary

1.  **User Action**: User clicks button.
2.  **Frontend**: `fetch('/api/resource')`  -> **HTTP Request**
3.  **API Route**: `POST()` handler receives request.
4.  **Database Logic**: `db.add()` calls Firestore.
5.  **Cloud DB**: Firestore saves the data.
6.  **Response**: Success message travels back up the chain -> API -> Frontend.
7.  **UI Update**: Frontend updates state to show new data.
