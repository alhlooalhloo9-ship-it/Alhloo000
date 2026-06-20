// ══ Service Worker لاستقبال الإشعارات حتى لو التطبيق مغلق ══
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDy28MaXr8WucMu2Jh72Ll6_F9ojNuiv7A",
  authDomain: "mrkz-alhloo.firebaseapp.com",
  projectId: "mrkz-alhloo",
  storageBucket: "mrkz-alhloo.appspot.com",
  messagingSenderId: "197049690415",
  appId: "1:197049690415:web:70fc92fcbe009948f7d9da"
});

const messaging = firebase.messaging();

// عند استقبال إشعار والتطبيق مغلق أو في الخلفية
messaging.onBackgroundMessage((payload) => {
  const title = (payload.notification && payload.notification.title) || 'مركز الحلو';
  const options = {
    body: (payload.notification && payload.notification.body) || '',
    icon: 'https://i.ibb.co/7J03gvrH/mtn.png',
    badge: 'https://i.ibb.co/7J03gvrH/mtn.png',
    dir: 'rtl',
    lang: 'ar'
  };
  self.registration.showNotification(title, options);
});

// عند الضغط على الإشعار — فتح التطبيق
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientsArr) => {
      if (clientsArr.length > 0) {
        return clientsArr[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});
