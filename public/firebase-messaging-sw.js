importScripts("https://www.gstatic.com/firebasejs/12.6.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.6.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyB59UYg3ERnPAfhZXM0NR6_2boQzp_amh4",
  authDomain: "results-hub-job.firebaseapp.com",
  projectId: "results-hub-job",
  storageBucket: "results-hub-job.firebasestorage.app",
  messagingSenderId: "949728586046",
  appId: "1:949728586046:web:bafd0e6a281c9a4f2b246f"
});

const messaging = firebase.messaging();

// 🔥 Handle background notifications
messaging.onBackgroundMessage((payload) => {
  console.log("[Service Worker] Background message:", payload);

  const title =
    payload.notification?.title ||
    payload.data?.title ||
    "Resultshub Notification";

  const body =
    payload.notification?.body ||
    payload.data?.body ||
    "Tap to open the update";

  const url =
    payload.data?.url ||
    payload.notification?.click_action ||
    "https://resultshub.in/";

  const options = {
    body: body,
    icon: "/icons/icon-192.png",
    badge: "/icons/badge.png", // optional
    vibrate: [100, 50, 100],
    data: { url },
    requireInteraction: false, // notification auto closes
    tag: payload.data?.tag || "resultshub-notification",
    renotify: false
  };

  self.registration.showNotification(title, options);
});

// 🔥 Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || "https://resultshub.in/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      // If website tab already open → focus it
      for (const client of windowClients) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      // Else open new tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
