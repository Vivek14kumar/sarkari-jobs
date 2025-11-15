import { initializeApp } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-app-compat.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/9.24.0/firebase-messaging-compat.js";

const firebaseConfig = {
  apiKey: "AIzaSyB59UYg3ERnPAfhZXM0NR6_2boQzp_amh4",
  authDomain: "results-hub-job.firebaseapp.com",
  projectId: "results-hub-job",
  storageBucket: "results-hub-job.appspot.com",
  messagingSenderId: "949728586046",
  appId: "1:949728586046:web:bafd0e6a281c9a4f2b246f"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// ---- THIS PART SHOWS THE POPUP ----
Notification.requestPermission().then((permission) => {
  if (permission === "granted") {
    console.log("Notification permission granted.");

    getToken(messaging, {
      vapidKey: "BHYSaJN4NumqCEjGb3BXRQudWwBTRVp0gHCM0VQ-3sjMafxJQJbQfgkrn2uInwVnh4h8B-IXVuIk4i1zr63s_Wg",
    }).then((currentToken) => {
      if (currentToken) {
        console.log("FCM Token:", currentToken);

        // Save the token to database
      } else {
        console.log("No registration token available.");
      }
    });
  } else {
    console.log("Notification permission denied.");
  }
});
