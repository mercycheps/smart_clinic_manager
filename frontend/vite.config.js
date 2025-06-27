import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5177, // Match current frontend port
    host: true,
    hmr: {
      clientPort: 5177,
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // or http://192.168.1.3:5000
        changeOrigin: true,
        secure: false,
      },
    },
  },
});