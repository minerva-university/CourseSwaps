import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: { 
    proxy: {
      '/api': ' http://127.0.0.1:7000'
    }
  },
  plugins: [react()],
});

