import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Use a relative base so assets load correctly when the app is served from a subfolder (e.g. GitHub Pages /docs)
  base: './',
  plugins: [react()],
  build: {
    outDir: 'docs',
  },
})
