importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyB59UYg3ERnPAfhZXM0NR6_2boQzp_amh4",
  authDomain: "results-hub-job.firebaseapp.com",
  projectId: "results-hub-job",
  storageBucket: "results-hub-job.appspot.com",
  messagingSenderId: "949728586046",
  appId: "1:949728586046:web:bafd0e6a281c9a4f2b246f"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || "Resultshub";
  const options = {
    body: payload.notification?.body || "",
    icon: "/icons/icon-192.png",
    data: payload.data || {},
  };
  self.registration.showNotification(title, options);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const link = event.notification.data?.url || "/";
  event.waitUntil(clients.openWindow(link));
});
