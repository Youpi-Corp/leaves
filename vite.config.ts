import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
  },
  build: {
    rollupOptions: {
      // Disable native module usage to prevent cross-platform issues
      context: 'globalThis',
      output: {
        manualChunks: (id) => {
          // Vendor dependencies (node_modules)
          if (id.includes('node_modules')) {
            // Group React and related packages
            if (
              id.includes('react') ||
              id.includes('react-dom') ||
              id.includes('react-router')
            ) {
              return 'vendor-react'
            }

            // Group large UI libraries together
            if (id.includes('@dnd-kit') || id.includes('react-grid-layout')) {
              return 'vendor-ui-libs'
            }

            // Group state management together
            if (
              id.includes('@tanstack') ||
              id.includes('zustand') ||
              id.includes('redux') ||
              id.includes('recoil')
            ) {
              return 'vendor-state-mgmt'
            }

            // Everything else: auto-chunk by top-level package name
            const packageName = id
              .toString()
              .split('node_modules/')[1]
              ?.split('/')[0]
            if (packageName) {
              return `vendor-${packageName}`
            }
          }

          // Application code - use directory pattern matching
          // Auto-chunking by first-level directory under src
          const srcMatch = id.match(/src\/([^/]+)/)
          if (srcMatch && srcMatch[1]) {
            const topLevelDir = srcMatch[1]

            // Special case - split widgets into their own category
            if (topLevelDir === 'components' && id.includes('/widget/')) {
              return 'feature-widgets'
            }

            // Special case - group auth-related code
            if (id.includes('/auth/')) {
              return 'feature-auth'
            }

            // Everything else grouped by top-level directory
            return `app-${topLevelDir}`
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
