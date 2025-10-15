const CACHE_NAME = 'my-site-cache-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
        
  
];

// Install - keshga oldindan olamiz
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate - eski keshlarni tozalash
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

// Fetch - so'rovlarni ushlaymiz
self.addEventListener('fetch', event => {
  const { request } = event;

  // HTML sahifalar uchun network-first (eng so'nggi versiya)
  if (request.mode === 'navigate' || (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'))) {
    event.respondWith(
      fetch(request)
        .then(resp => {
          // muvaffaqiyatli javobni keshga yozamiz
          const copy = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return resp;
        })
        .catch(() => caches.match('/offline.html'))
    );
    return;
  }

  // API so'rovlar uchun network-first (agar offline bo'lsa keshga qayt)
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return resp;
      }).catch(() => caches.match(request))
    );
    return;
  }

  // Boshqa statik aktivalar uchun cache-first
  event.respondWith(
    caches.match(request)
      .then(cached => cached || fetch(request).then(resp => {
        // keshga yozish: faqat GET va  opaque bo'lmagan holatlar
        if (request.method === 'GET' && resp && resp.status === 200) {
          const respCopy = resp.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, respCopy));
        }
        return resp;
      })).catch(() => {
        // agar rasm bo'lsa yoki boshqa aktiv bo'lsa, fallback kerak bo'lsa qo'yish mumkin
        if (request.destination === 'image') return caches.match('/icons/icon-192.png');
      })
  );
});
