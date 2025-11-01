import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/superhero': {
        target: 'https://superheroapi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/superhero/, '/api'),
      },
    },
  },
})
