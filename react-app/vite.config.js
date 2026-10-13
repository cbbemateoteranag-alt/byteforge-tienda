import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const base = process.env.PAGES_BASE_PATH || '/'

export default defineConfig({
  appType: 'spa',
  base,
  plugins: [react()],
})
