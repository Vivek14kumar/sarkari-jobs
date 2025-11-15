// firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

let app = null;
let messaging = null;

export function initFirebase() {
  if (typeof window === "undefined") return;

  if (!app) {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    console.log("🔥 Firebase Config Loaded:", firebaseConfig);

    app = initializeApp(firebaseConfig);
    messaging = getMessaging(app);

    console.log("🔥 Firebase Initialized");
  }
}

export async function requestNotificationToken() {
  try {
    if (!messaging) initFirebase();

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    console.log("🔑 FCM Token:", token);
    return token;
  } catch (err) {
    console.error("❌ Token Error:", err);
    return null;
  }
}

export function onMessageListener(cb) {
  if (!messaging) initFirebase();
  return onMessage(messaging, cb);
}
