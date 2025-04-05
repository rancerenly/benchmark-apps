import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 4202,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  base: '/',
})
