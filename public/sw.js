const CACHE_NAME = 'sre-tools-v1.1'
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
  // 強制跳過等待，立即激活新的 Service Worker
  self.skipWaiting()
  
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
  // 立即控制所有客戶端
  event.waitUntil(
    Promise.all([
      // 清除舊緩存
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName)
            }
          })
        )
      }),
      // 立即接管所有頁面
      self.clients.claim()
    ])
  )
})

// 監聽來自客戶端的消息
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            return caches.delete(cacheName)
          })
        )
      }).then(() => {
        return self.clients.matchAll()
      }).then((clients) => {
        clients.forEach(client => {
          client.postMessage({ type: 'CACHE_CLEARED' })
        })
      })
    )
  }
})