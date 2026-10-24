import { vibe } from '@usevibejs/compiler/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      { test: { name: 'unit', environment: 'node', include: ['src/**/*.test.ts'] } },
      {
        plugins: [vibe()],
        test: {
          name: 'components',
          environment: 'jsdom',
          include: ['test/components.vibe.test.ts'],
          setupFiles: ['test/setup.ts'],
        },
      },
      {
        test: { name: 'integration', include: ['test/*.integration.test.ts'], testTimeout: 60_000 },
      },
    ],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts', 'registry/lib/**/*.ts'],
      exclude: ['**/*.test.ts'],
      thresholds: { 100: true, perFile: true },
    },
  },
});
