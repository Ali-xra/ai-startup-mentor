import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  //base: '/idea-maker/',
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        login: resolve(__dirname, 'login.html'),
        sessionManager: resolve(__dirname, 'session-manager.html'),
        entrepreneur: resolve(__dirname, 'entrepreneur.html'),
        investor: resolve(__dirname, 'investor.html'),
        programmer: resolve(__dirname, 'programmer.html'),
        consultant: resolve(__dirname, 'consultant.html'),
        designer: resolve(__dirname, 'designer.html'),
        // Temporarily disabled - will be fixed in later phases
        // admin: resolve(__dirname, 'admin.html'), // inline CSS issue
        // pricing: resolve(__dirname, 'pricing.html'), // inline CSS issue
        // about: resolve(__dirname, 'about.html'), // inline CSS issue
      },
    },
  },
})
