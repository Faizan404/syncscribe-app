import { readFile } from "fs/promises";

import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let app;

async function loadServiceKey() {
  try {
    const data = await readFile("./data/service-key.json", "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading service key:", error);
    throw error;
  }
}

if (getApps().length === 0) {
  const serviceKey = await loadServiceKey();

  app = initializeApp({
    credential: cert(serviceKey),
  });
} else {
  app = getApp();
}

const adminDb = getFirestore(app);

export { app as adminApp, adminDb };
