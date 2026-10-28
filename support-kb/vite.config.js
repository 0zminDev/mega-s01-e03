import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [svelte({ compilerOptions: { css: 'injected' } })],
  resolve: {
    alias: { '#lib': fileURLToPath(new URL('./src/lib', import.meta.url)) },
    conditions: ['svelte'],
  },
  ssr: { noExternal: ['svelte'] },
  build: {
    ssr: 'scripts/render-entry.js',
    outDir: '.render',
    rollupOptions: { output: { entryFileNames: 'render-entry.js' } },
  },
});
