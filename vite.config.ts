import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // This enables the React Refresh plugin for HMR
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }), 
    tailwindcss(),
  ],
  base: '/',
  server: {
    port: 3000,
    // For SPA routing in development
    strictPort: true,
    proxy: {
      // Proxy API requests to the backend
      '/api': {
        target: 'https://kapekalakal-backend-molg.onrender.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          vendor: ['axios'],
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit to 1000KB
  },
});
