// /firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB59UYg3ERnPAfhZXM0NR6_2boQzp_amh4",
  authDomain: "results-hub-job.firebaseapp.com",
  projectId: "results-hub-job",
  storageBucket: "results-hub-job.appspot.com",
  messagingSenderId: "949728586046",
  appId: "1:949728586046:web:bafd0e6a281c9a4f2b246f"
};

let messaging;

export const initFirebase = () => {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
};

// ⚠ REQUEST PERMISSION
export async function requestNotificationToken() {
  try {
    console.log("Requesting permission...");

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Permission not granted");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: "BHYSaJN4NumqCEjGb3BXRQudWwBTRVp0gHCM0VQ-3sjMafxJQJbQfgkrn2uInwVnh4h8B-IXVuIk4i1zr63s_Wg"
    });

    console.log("TOKEN:", token);
    return token;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
}
