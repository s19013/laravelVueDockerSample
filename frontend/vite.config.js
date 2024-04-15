import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // --hostと同義,とりあえずこれでコンテナの外から通信できると思う?
    host: true,
    // 立ち上げる際のポートを変更できる。
    port: 5173,

    // ポーリングを使用してファイルの変更を監視し、ホットリロードを有効にします。
    // 後でviteの公式サイト見るなり確認するべき
    watch: {
      usePolling: true,
      interval: 1000 //インターバルを長くして負荷を抑える
    }
  }
})
