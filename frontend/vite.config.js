import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3003',
    },
  },
  test: {
    environment: 'jsdom',
    exclude: ['e2e/**', '**/node_modules/**', '**/dist/**'],
    globals: true,
    setupFiles: './src/test-setup.js',
    testEnvironmentOptions: {
      customExportConditions: ['react-dom'],
    },
  },
})
