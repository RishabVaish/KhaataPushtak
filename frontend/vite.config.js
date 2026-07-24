import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // tailwindcss() plugin handles CSS generation directly inside Vite's
  // build pipeline — no separate PostCSS config file needed (this is
  // new in Tailwind v4 and simplifies setup significantly).
  plugins: [react(), tailwindcss()],
})
