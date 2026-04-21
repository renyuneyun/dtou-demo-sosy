import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@dtou-demo/dtou-client': new URL('../../packages/dtou-client/src/index.ts', import.meta.url).pathname,
    },
  },
})
