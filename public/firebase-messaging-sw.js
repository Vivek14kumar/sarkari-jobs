import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getMessaging, onBackgroundMessage } 
  from "https://www.gstatic.com/firebasejs/12.6.0/firebase-messaging-sw.js";

const firebaseConfig = {
  apiKey: "AIzaSyB59UYg3ERnPAfhZXM0NR6_2boQzp_amh4",
  authDomain: "results-hub-job.firebaseapp.com",
  projectId: "results-hub-job",
  storageBucket: "results-hub-job.firebasestorage.app",
  messagingSenderId: "949728586046",
  appId: "1:949728586046:web:bafd0e6a281c9a4f2b246f"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: payload.notification.icon,
    data: payload.data
  });
});
