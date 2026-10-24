import tailwindcss from '@tailwindcss/vite';
import { vibe } from '@usevibejs/compiler/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vibe(), tailwindcss()],
  publicDir: '../public',
  build: { target: 'es2022' },
});
