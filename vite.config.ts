import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
  ],
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          vendor: ['axios', 'jwt-decode'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit to 1000KB
  },
  server: {
    port: 3000,
  },
});
