import { resolve } from 'node:path';
import { vibe } from '@usevibejs/compiler/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      { test: { name: 'unit', environment: 'node', include: ['src/**/*.test.ts'] } },
      {
        resolve: { alias: { '@': resolve('site/src') } },
        plugins: [
          vibe(),
          {
            // Installed components import the copied helpers; test the registry sources instead, so
            // their coverage counts.
            name: 'registry-lib',
            enforce: 'pre',
            resolveId(source, importer) {
              if (importer?.includes('/site/src/components/ui/') && source.startsWith('../../lib/'))
                return resolve('registry/lib', source.slice('../../lib/'.length));
            },
          },
        ],
        test: {
          name: 'components',
          environment: 'jsdom',
          include: ['test/*.vibe.test.ts'],
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
