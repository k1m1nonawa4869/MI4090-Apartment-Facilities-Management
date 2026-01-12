import { getFirestore } from './firebaseAdmin';
import { Equipment, WorkOrder } from '@/types';

// Convert Firestore doc to T
const converter = <T>() => ({
    toFirestore: (data: T) => data,
    fromFirestore: (snap: FirebaseFirestore.QueryDocumentSnapshot) => snap.data() as T,
});

export const db = {
    // Equipment
    getEquipment: async (): Promise<Equipment[]> => {
        const snapshot = await getFirestore().collection("equipment").withConverter(converter<Equipment>()).get();
        return snapshot.docs.map(doc => doc.data());
    },
    addEquipment: async (item: Equipment) => {
        await getFirestore().collection("equipment").doc(item.Id).set(item);
    },
    updateEquipment: async (item: Equipment) => {
        await getFirestore().collection("equipment").doc(item.Id).set(item, { merge: true });
    },
    deleteEquipment: async (id: string) => {
        await getFirestore().collection("equipment").doc(id).delete();
    },

    // Work Orders
    getWorkOrders: async (): Promise<WorkOrder[]> => {
        const snapshot = await getFirestore().collection("workOrders").withConverter(converter<WorkOrder>()).get();
        return snapshot.docs.map(doc => doc.data());
    },
    addWorkOrder: async (item: WorkOrder) => {
        await getFirestore().collection("workOrders").doc(item.Id).set(item);
    },
    updateWorkOrder: async (item: WorkOrder) => {
        await getFirestore().collection("workOrders").doc(item.Id).set(item, { merge: true });
    },

    // History
    getHistoryLogs: async (): Promise<any[]> => {
        const snapshot = await getFirestore().collection("history").get();
        return snapshot.docs.map(doc => doc.data());
    },
    addHistoryLog: async (item: any) => {
        await getFirestore().collection("history").doc(item.Id).set(item);
    },
};

