import { defineConfig } from '@playwright/test'

// e2e runs against the production build: the backend (repo root, test mode,
// in-memory MongoDB) serves frontend/dist on :3003, just like on Fly.
export default defineConfig({
  testDir: './e2e',
  timeout: 30000,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://localhost:3003',
  },
  webServer: {
    command: 'npm run build && npm --prefix .. run start:test',
    url: 'http://localhost:3003/health',
    timeout: 120000,
    reuseExistingServer: !process.env.CI,
  },
})
