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

  const apiProxyTarget = process.env.VITE_API_PROXY_TARGET || 'http://localhost:3000';

  const getCliPort = () => {
    const argv = process.argv;
    const direct = argv.find((arg) => arg.startsWith('--port='));
    if (direct) {
      const value = direct.split('=')[1];
      return value ? String(value) : undefined;
    }
    const idx = argv.findIndex((arg) => arg === '--port' || arg === '-p');
    if (idx >= 0 && argv[idx + 1]) return String(argv[idx + 1]);
    return undefined;
  };

  const selfPort = getCliPort() || process.env.PORT;
  const shouldEnableApiProxy = (() => {
    if (!selfPort) return true;
    try {
      const url = new URL(apiProxyTarget);
      const targetPort = url.port || (url.protocol === 'https:' ? '443' : '80');
      return targetPort !== String(selfPort);
    } catch {
      return true;
    }
  })();

  return {
    plugins,
    server: {
      proxy: shouldEnableApiProxy
        ? {
            '/api': {
              target: apiProxyTarget,
              changeOrigin: true,
              rewrite: (path: string) => path,
            },
          }
        : undefined,
    }
  };
})
