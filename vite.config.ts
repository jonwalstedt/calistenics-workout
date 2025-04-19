import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg', 'offline.html'],
      manifest: {
        name: 'Calisthenics Workout',
        short_name: 'Calisthenics',
        description: 'Your personal calisthenics workout companion',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        cleanupOutdatedCaches: true,
        sourcemap: true,
        // Set maximum file size for precaching to accommodate large assets
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024, // 4MB
        // Navigation routes including SPA fallbacks
        navigationPreload: true,
        navigateFallback: 'index.html',
        navigateFallbackDenylist: [/^\/api/], // Don't fallback API routes
        // Handle offline fallback
        offlineGoogleAnalytics: false,
        // Only precache essential files
        globPatterns: ['**/*.{js,css,html,ico,json,woff2}'],
        // Skip large exercise images to avoid precaching issues
        globIgnores: ['**/assets/*.png'],
        runtimeCaching: [
          {
            // Match any same-origin route
            urlPattern: /^\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
              }
            }
          },
          {
            // Cache exercise images when accessed
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 60,
                maxAgeSeconds: 60 * 24 * 60 * 60 // 60 days
              }
            }
          },
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'static-resources',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    host: true, // Expose to all network interfaces
    port: 5173, // Default Vite port
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    sourcemap: true
  }
})
