import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api' :{
        // target: 'http://13.236.159.92:8080', 아마존 aws주소
        target: 'http://localhost:8080', //로컬주소
        changeOrigin: true,
      }
    }
  }
})
