import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/auth0': {
        target: 'https://dev-absd5fge5ponxhnd.us.auth0.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth0/, '')
      }
    }
  }
})