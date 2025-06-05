import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: process.env.GPH == "1" ? "/ollama-rag-book-assistant-ui/" : "/"
})
