// ===== مركز الحلو - Service Worker =====
// غيّر هذا الرقم عند كل تحديث جديد لإعادة تحميل الكاش
const CACHE_VERSION = 'halou-v1.5-1775308269';
const CACHE_NAME = CACHE_VERSION;

// الملفات الأساسية للتخزين المؤقت (تعمل بدون نت)
const CORE_FILES = [
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&family=Tajawal:wght@400;500;700;900&family=Amiri:wght@400;700&display=swap'
];

// ===== تثبيت: تخزين الملفات الأساسية =====
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching core files...');
      // نخزن index.html بالتأكيد، الباقي نحاول
      return cache.addAll(CORE_FILES.slice(0, 2))
        .then(() => {
          // نحاول الفونت بشكل منفصل (قد يفشل بسبب CORS)
          return cache.add(CORE_FILES[2]).catch(() => {});
        });
    }).then(() => self.skipWaiting())
  );
});

// ===== التفعيل: حذف الكاش القديم =====
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ===== الطلبات: Cache First للملفات، Network First للـ API =====
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API calls (JSONBin, TinyURL, rates) → Network only, no cache
  if (
    url.hostname.includes('jsonbin.io') ||
    url.hostname.includes('tinyurl.com') ||
    url.hostname.includes('api.') ||
    url.hostname.includes('archive.org')
  ) {
    event.respondWith(
      fetch(event.request).catch(() => new Response('{}', {
        headers: { 'Content-Type': 'application/json' }
      }))
    );
    return;
  }

  // Google Fonts → Cache First
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        }).catch(() => new Response('', { status: 200 }));
      })
    );
    return;
  }

  // باقي الطلبات (index.html, manifest, etc.) → Cache First ثم Network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) {
        // في الخلفية: حاول تحديث الكاش من الشبكة
        fetch(event.request).then(response => {
          if (response && response.status === 200) {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, response));
          }
        }).catch(() => {});
        return cached;
      }
      // مش موجود في الكاش → اجلبه من الشبكة
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200) return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => {
        // بدون نت ولا يوجد في الكاش → صفحة بديلة
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
