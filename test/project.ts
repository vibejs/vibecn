import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach } from 'vitest';

const roots: string[] = [];
afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true });
});

export function project(
  manifest: unknown = { dependencies: { '@usevibejs/ui': '0.1.0' } },
): string {
  const root = mkdtempSync(join(tmpdir(), 'vibecn-test-'));
  roots.push(root);
  writeFileSync(join(root, 'package.json'), JSON.stringify(manifest));
  return root;
}

export function write(root: string, path: string, content: string): void {
  const file = join(root, path);
  mkdirSync(join(file, '..'), { recursive: true });
  writeFileSync(file, content);
}
