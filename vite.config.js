import { defineConfig } from 'vite';
import { resolve } from 'path';

// Path aliases for new folder structure
// These allow cleaner imports like '@core/services/api.service.js'
// instead of '../../../services/api.js'
export default defineConfig({
  resolve: {
    alias: {
      '@core': resolve(__dirname, './src/core'),
      '@shared': resolve(__dirname, './src/shared'),
      '@modules': resolve(__dirname, './src/modules'),
      '@services': resolve(__dirname, './src/services'),
      '@assets': resolve(__dirname, './src/assets'),
      '@config': resolve(__dirname, './src/config'),
      '@mocks': resolve(__dirname, './src/mocks'),
    }
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  server: {
    port: 3000
  }
});
