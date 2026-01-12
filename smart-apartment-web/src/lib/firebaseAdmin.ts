import "server-only";
import admin from "firebase-admin";

export function getFirestore() {
    if (!admin.apps.length) {
        try {
            if (process.env.FIREBASE_PRIVATE_KEY) {
                let privateKey = process.env.FIREBASE_PRIVATE_KEY;

                // 1. Remove surrounding quotes (if mistakenly pasted with quotes)
                privateKey = privateKey.replace(/^"|"$/g, "");

                // 2. Handle escaped newlines (replace literal \n with actual newlines)
                privateKey = privateKey.replace(/\\n/g, "\n");

                // 3. Add missing headers if user pasted just the base64 content
                if (!privateKey.includes("-----BEGIN PRIVATE KEY-----")) {
                    console.log("Auto-fixing missing Private Key headers...");
                    privateKey = "-----BEGIN PRIVATE KEY-----\n" + privateKey;
                }
                if (!privateKey.includes("-----END PRIVATE KEY-----")) {
                    privateKey = privateKey + "\n-----END PRIVATE KEY-----";
                }

                admin.initializeApp({
                    credential: admin.credential.cert({
                        projectId: process.env.FIREBASE_PROJECT_ID,
                        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                        privateKey: privateKey,
                    }),
                });
                console.log("Firebase Admin Initialized successfully.");
            } else {
                console.warn("Firebase Private Key not found in environment.");
                throw new Error("Missing FIREBASE_PRIVATE_KEY");
            }
        } catch (error) {
            console.error("Firebase admin initialization error", error);
            throw error; // Re-throw to be caught by API route
        }
    }
    return admin.firestore();
}
