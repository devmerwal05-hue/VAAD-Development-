import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import type { Plugin } from 'vite'

// https://vite.dev/config/
export default defineConfig(async () => {
  const plugins = [react(), tailwindcss()].flat() as Plugin[];
  try {
    const sourceTagsPath = './.vite-source-tags.js';
    const sourceTagModule = await import(sourceTagsPath) as { sourceTags?: () => Plugin };
    if ('sourceTags' in sourceTagModule && typeof sourceTagModule.sourceTags === 'function') {
      plugins.push(sourceTagModule.sourceTags());
    }
  } catch {
    // Source tags are optional in local development.
  }
  return {
    plugins,
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path: string) => path
        }
      }
    }
  };
})
