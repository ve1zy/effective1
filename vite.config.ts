import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/vine': {
        target: 'https://comicvine.gamespot.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/vine/, '/api'),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Comic App) Chrome/120.0.0.0',
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive'
        }
      },
    },
  },
})
