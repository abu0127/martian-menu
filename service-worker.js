const CACHE_NAME = "martian-menu-cache-v2";

const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/data.json",
  "/icons/icon-192.png",

  // Asosiy rasm va logolar
  "/images/logo.png",
  "/images/category_pizza.PNG",
  "/images/sweets.PNG",
  // Sweets
  "/images/sweets/sansebastian.PNG",
  "/images/sweets/cheesecake-strawberry.PNG",
  "/images/sweets/dubai.PNG",
  "/images/sweets/ekler.JPG",
  "/images/sweets/lotus.PNG",
  "/images/sweets/nutela.JPG",
  "/images/sweets/vafli.JPG",
  "/images/sweets/pistachio.PNG",

  //drinks 
  "/images/drinks/coctel-banan.PNG",
  "/images/drinks/cola.PNG",
  "/images/drinks/fanta.PNG",
  "/images/drinks/mango-maxitto.PNG",
  "/images/drinks/mojitto.PNG",
  "/images/drinks/moxitto.PNG",
  "/images/drinks/pepsi.PNG",
  "/images/drinks/sprite.PNG",
  "/images/drinks/strawberry-maxitto.PNG",


];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

// Fetch event (offline ishlashi uchun)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});

// Activate event (eski cache’larni o‘chirish)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
});
