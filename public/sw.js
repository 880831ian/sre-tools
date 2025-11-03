const CACHE_NAME = 'sre-tools-v1'
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.js',
  '/src/App.vue',
  '/src/style.css',
  'https://cdn.jsdelivr.net/npm/@tabler/core@1.0.0-beta20/dist/css/tabler.min.css',
  'https://cdn.jsdelivr.net/npm/@tabler/icons@2.40.0/tabler-sprite.svg'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache)
      })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 如果在緩存中找到，返回緩存版本
        if (response) {
          return response
        }
        
        // 否則從網路獲取
        return fetch(event.request).then((response) => {
          // 檢查是否是有效的響應
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response
          }
          
          // 複製響應
          const responseToCache = response.clone()
          
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })
          
          return response
        })
      })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})