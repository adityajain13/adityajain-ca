import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const page = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      // One HTML entry per page; the worker maps each subdomain to its folder.
      input: {
        main: page('./index.html'),
        atlas: page('./atlas/index.html'),
        vibething: page('./vibething/index.html'),
        cal: page('./cal/index.html'),
        genre: page('./genre/index.html'),
        dates: page('./dates/index.html'),
        travel: page('./travel/index.html'),
        paladins: page('./paladins/index.html'),
        datesApp: page('./dates-app/index.html'),
      },
    },
  },
})
