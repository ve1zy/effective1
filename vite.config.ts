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
          'User-Agent': 'Mozilla/5.0 (Comic App) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'en-US,en;q=0.9',
          'Connection': 'keep-alive',
          'Referer': 'https://comicvine.gamespot.com/'
        }
      },
    },
  },
})
