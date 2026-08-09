import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

// Plugin to cleanly resolve Vite HMR client requests as a stub when HMR is disabled in cloud environment
function disableHmrClientPlugin(): Plugin {
  return {
    name: 'disable-hmr-client',
    enforce: 'pre',
    resolveId(id) {
      if (id === '/@vite/client' || id === '@vite/client') {
        return '\0vite-client-noop';
      }
    },
    load(id) {
      if (id === '\0vite-client-noop') {
        return `
          export function createHotContext() {
            return {
              accept() {},
              prune() {},
              dispose() {},
              decline() {},
              invalidate() {},
              on() {},
              send() {},
              data: {}
            };
          }
          export function updateStyle() {}
          export function removeStyle() {}
        `;
      }
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [disableHmrClientPlugin(), react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in cloud container environment
      hmr: false,
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
