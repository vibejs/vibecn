import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, it } from 'vitest';
import { isComponent, registry } from '../src/registry.ts';
import { project } from './project.ts';

it('installs from a packed artifact outside the checkout with full license notices', () => {
  const root = project();
  execFileSync('pnpm', ['pack', '--pack-destination', root], {
    cwd: fileURLToPath(new URL('..', import.meta.url)),
    encoding: 'utf8',
    timeout: 30_000,
  });
  const archive = readdirSync(root).find((file) => file.endsWith('.tgz'));
  expect(archive).toBeDefined();
  const unpacked = join(root, 'unpacked');
  mkdirSync(unpacked);
  execFileSync('tar', ['-xzf', join(root, archive!), '-C', unpacked]);
  const pkg = join(unpacked, 'package');
  const bin = join(pkg, 'dist/bin.js');
  const execute = (args: string[]): string =>
    execFileSync(process.execPath, [bin, ...args], { cwd: root, encoding: 'utf8' });
  const manifest = JSON.parse(readFileSync(join(pkg, 'package.json'), 'utf8'));
  expect(execute(['--version']).trim()).toBe(manifest.version);
  expect(JSON.parse(execute(['list', '--json'])).components).toHaveLength(
    registry.filter(isComponent).length,
  );
  expect(JSON.parse(execute(['init', '--dry-run', '--json'])).dryRun).toBe(true);
  expect(existsSync(join(root, 'vibecn.json'))).toBe(false);
  execute(['init']);
  const beforeManifest = readFileSync(join(root, 'package.json'), 'utf8');
  const table = JSON.parse(execute(['add', 'data-table', '--json']));
  expect(table.ok).toBe(true);
  expect(table.dependencies).toContain('@usevibejs/table@0.1.0');
  expect(existsSync(join(root, 'src/components/ui/DataTable.vibe'))).toBe(true);
  expect(readFileSync(join(root, 'src/components/ui/DataTable.vibe'), 'utf8')).not.toContain(
    '__VIBECN_',
  );
  expect(readFileSync(join(root, 'src/lib/data-table.ts'), 'utf8')).toContain('DataTableInstance');
  expect(readFileSync(join(root, 'package.json'), 'utf8')).toBe(beforeManifest);
  expect(JSON.stringify(manifest)).not.toMatch(/catalog:|workspace:|link:|file:|\/Users\//);
  const result = JSON.parse(execute(['add', '--all', '--json']));
  expect(result.ok).toBe(true);
  expect(existsSync(join(root, 'src/components/ui/Button.vibe'))).toBe(true);
  expect(readFileSync(join(root, 'vibecn.LICENSE'), 'utf8')).toContain('Copyright (c) 2023 shadcn');
  expect(readFileSync(join(pkg, 'THIRD-PARTY-NOTICES.md'), 'utf8')).toContain(
    'ffd225775bbb7955a673f08bb9be4a63600d9dfb',
  );
  expect(existsSync(join(pkg, 'node_modules'))).toBe(false);
  writeFileSync(join(root, 'src/components/ui/Button.vibe'), 'user customization');
  expect(() => execute(['add', 'button'])).toThrow('Command failed');
  expect(readFileSync(join(root, 'src/components/ui/Button.vibe'), 'utf8')).toBe(
    'user customization',
  );
  expect(manifest.private).toBeUndefined();
  expect(manifest.publishConfig.access).toBe('public');
  expect(manifest.bin.vibecn).toBe('./dist/bin.js');
});

it('builds complete registry payloads with resolvable file paths and embedded licenses', () => {
  const root = resolve('public/r');
  const catalog = JSON.parse(readFileSync(join(root, 'registry.json'), 'utf8'));
  expect(catalog.name).toBe('vibecn');
  expect(catalog.items).toHaveLength(registry.length);
  for (const item of registry) {
    const payload = JSON.parse(readFileSync(join(root, `${item.name}.json`), 'utf8'));
    expect(payload.files).toHaveLength(item.files.length + 1);
    expect(payload.files.at(-1).content).toContain('MIT License');
    for (const file of payload.files) expect(file.content).not.toContain('__VIBECN_UTILS__');
    for (const dependency of payload.registryDependencies)
      expect(existsSync(join(root, `${dependency}.json`))).toBe(true);
  }
});
