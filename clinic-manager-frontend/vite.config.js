// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // 👈 IMPORTANT for static site deployment on Render
  server: {
    port: 3000
  }
})
