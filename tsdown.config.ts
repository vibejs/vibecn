import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/bin.ts', 'src/index.ts'],
  format: 'esm',
  clean: true,
  tsconfig: 'tsconfig.tools.json',
  dts: true,
  outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
});
