import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      console.log("[FCM] Token:", token);
    }
  } catch (error) {
    console.error("[FCM] Error requesting permission:", error);
  }
};

export const listenForMessages = () => {
  onMessage(messaging, (payload) => {
    console.log("[FCM] Message received:", payload);

    if (payload.notification && payload.notification.title) {
      if (Notification.permission === "granted") {
        new Notification(payload.notification.title, {
          body: payload.notification.body || "No additional information",
        });
      }
    }
  });
};