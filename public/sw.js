// Service Worker for Kokonsa PWA

const CACHE_NAME = 'kokonsa-cache-v2';
const STATIC_CACHE_NAME = 'kokonsa-static-v2';
const DYNAMIC_CACHE_NAME = 'kokonsa-dynamic-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/images/logo.svg',
  '/assets/images/logo-192.png',
  '/assets/images/logo-512.png',
  '/assets/index.css',
  '/assets/index.js',
  '/offline.html'
];

// Create offline page if it doesn't exist
self.addEventListener('install', event => {
  const offlineHtml = `
    <!DOCTYPE html>
    <html lang="en" class="">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/assets/images/logo.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0ea5e9" />
        <title>Kokonsa - Offline</title>
        <style>
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f9fafb;
            color: #1f2937;
          }
          .container {
            text-align: center;
            padding: 2rem;
            max-width: 28rem;
            background-color: white;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          .logo {
            width: 80px;
            height: 80px;
            margin-bottom: 1.5rem;
          }
          h1 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #0ea5e9;
          }
          p {
            margin-bottom: 1.5rem;
            line-height: 1.5;
          }
          button {
            background-color: #0ea5e9;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 0.375rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          button:hover {
            background-color: #0284c7;
          }
          /* Dark mode */
          @media (prefers-color-scheme: dark) {
            body {
              background-color: #111827;
              color: #f9fafb;
            }
            .container {
              background-color: #1f2937;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.1);
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="/assets/images/logo.svg" alt="Kokonsa Logo" class="logo" />
          <h1>You're Offline</h1>
          <p>It seems you're not connected to the internet. Please check your connection and try again.</p>
          <button onclick="window.location.reload()">Retry</button>
        </div>
        <script>
          // Check if we're back online
          window.addEventListener('online', () => {
            window.location.reload();
          });
        </script>
      </body>
    </html>
  `;
  
  event.waitUntil(
    fetch('/offline.html')
      .catch(() => {
        return new Response(offlineHtml, {
          headers: { 'Content-Type': 'text/html' }
        });
      })
      .then(response => {
        if (response.status === 404) {
          return new Response(offlineHtml, {
            headers: { 'Content-Type': 'text/html' }
          });
        }
        return response;
      })
      .then(response => {
        return caches.open(STATIC_CACHE_NAME)
          .then(cache => {
            const offlineRequest = new Request('/offline.html');
            const responseToCache = response.clone();
            return cache.put(offlineRequest, responseToCache);
          });
      })
  );

// Install a service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service worker installed');
        return self.skipWaiting();
      })
  );
});

// Cache and return requests
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Handle API requests differently
  if (event.request.url.includes('/api/')) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }
  
  // For HTML pages, use network first strategy
  if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response for caching
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If not in cache, return the offline page
              return caches.match('/offline.html');
            });
        })
    );
    return;
  }
  
  // For other assets, use cache first strategy
  event.respondWith(cacheFirstStrategy(event.request));
});

// Cache first, falling back to network strategy
function cacheFirstStrategy(request) {
  return caches.match(request)
    .then(cachedResponse => {
      if (cachedResponse) {
        // Update cache in the background
        fetch(request)
          .then(response => {
            if (response.ok) {
              caches.open(DYNAMIC_CACHE_NAME)
                .then(cache => cache.put(request, response));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }
      
      // Not in cache, get from network
      return fetch(request)
        .then(response => {
          // Check if valid response
          if (!response || !response.ok) {
            return response;
          }
          
          // Clone the response for cache and return
          const responseToCache = response.clone();
          
          caches.open(DYNAMIC_CACHE_NAME)
            .then(cache => {
              cache.put(request, responseToCache);
            });
            
          return response;
        })
        .catch(() => {
          // For images, return a placeholder
          if (request.url.match(/\.(jpe?g|png|gif|svg)$/)) {
            return caches.match('/assets/images/placeholder.svg');
          }
          
          // For other resources, just fail
          return new Response('Network error happened', {
            status: 408,
            headers: { 'Content-Type': 'text/plain' }
          });
        });
    });
}

// Network first, falling back to cache strategy
function networkFirstStrategy(request) {
  return fetch(request)
    .then(response => {
      // Cache the response for future
      if (response.ok) {
        const responseToCache = response.clone();
        caches.open(DYNAMIC_CACHE_NAME)
          .then(cache => {
            cache.put(request, responseToCache);
          });
      }
      return response;
    })
    .catch(() => {
      return caches.match(request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If API request fails and not in cache, return error
          return new Response(JSON.stringify({ error: 'Network error' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          });
        });
    });

// Update a service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [STATIC_CACHE_NAME, DYNAMIC_CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('Service worker activated');
      return self.clients.claim();
    })
  );
});

// Handle connectivity changes
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CONNECTIVITY_CHANGE') {
    const isOnline = event.data.isOnline;
    console.log('Connectivity changed:', isOnline ? 'online' : 'offline');
    
    // Notify all clients about connectivity change
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'CONNECTIVITY_STATUS',
          isOnline: isOnline
        });
      });
    });
  }
}); // End of message event listener

}; // End of networkFirstStrategy function
}); // End of fetch event listener
