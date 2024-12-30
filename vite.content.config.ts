import { defineConfig } from 'vite';
import sharedConfig from './vite.config';
import { join } from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const isDev = process.env.NODE_ENV !== 'production';

export default defineConfig({
  ...sharedConfig,
  resolve: {
    alias: {
      process: 'process/browser',
    },
  },
  build: {
    watch: isDev ? {} : void 0,
    outDir: join(__dirname, 'dist/contentScript'),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: isDev ? 'inline' : false,
    lib: {
      entry: join(__dirname, 'src/content/main.tsx'),
      name: 'content',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        entryFileNames: 'index.global.js',
        extend: true,
      },
    },
  },
  plugins: [...(sharedConfig.plugins ?? []), nodePolyfills()],
});
