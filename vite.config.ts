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
        entrepreneur: resolve(__dirname, 'entrepreneur.html'),
        investor: resolve(__dirname, 'investor.html'),
        programmer: resolve(__dirname, 'programmer.html'),
        consultant: resolve(__dirname, 'consultant.html'),
        designer: resolve(__dirname, 'designer.html'),
        admin: resolve(__dirname, 'admin.html'),
        pricing: resolve(__dirname, 'pricing.html'),
        auth: resolve(__dirname, 'auth.html'),
        about: resolve(__dirname, 'about.html'),
        logout: resolve(__dirname, 'logout.html'),
      },
    },
  },
})
