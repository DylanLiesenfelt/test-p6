// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/test-p6/', // REPLACE this with your GitHub repo name!
  plugins: [react()],
})
