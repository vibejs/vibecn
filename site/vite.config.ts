import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { vibe } from '@usevibejs/compiler/vite';
import { defineConfig } from 'vite';
import { docs } from './plugins/docs.ts';

const src = fileURLToPath(new URL('src', import.meta.url));

export default defineConfig({
  plugins: [
    vibe(),
    tailwindcss(),
    docs({ src, registry: fileURLToPath(new URL('../registry', import.meta.url)) }),
  ],
  resolve: { alias: { '@': src } },
  publicDir: '../public',
  build: { target: 'es2022' },
});
