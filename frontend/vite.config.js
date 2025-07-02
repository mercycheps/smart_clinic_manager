// frontend/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // ✅ Important for deploying to subpaths or static hosting
  server: {
    port: 3000, // Local dev server port
    open: true, // Automatically open in browser on `npm run dev`
  },
  preview: {
    port: 4173, // Preview build server port
  }
})
