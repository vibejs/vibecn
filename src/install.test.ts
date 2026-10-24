import { existsSync, mkdirSync, readFileSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { project, write } from '../test/project.ts';
import {
  applyPlan,
  destination,
  planAdd,
  planInit,
  readConfig,
  type Config,
  type InstallPlan,
} from './index.ts';

const initialized = (): string => {
  const root = project();
  applyPlan(planInit(root));
  return root;
};
const config = (root: string, paths: Config['paths']): void =>
  write(root, 'vibecn.json', JSON.stringify({ version: 1, paths }));

describe('initialization', () => {
  it('plans without writing, then installs the theme and full license notices', () => {
    const root = project();
    const plan = planInit(root);
    expect(plan.files.every((file) => file.action === 'create')).toBe(true);
    expect(existsSync(join(root, 'vibecn.json'))).toBe(false);
    applyPlan(plan);
    expect(readConfig(root).paths.styles).toBe('src/vibecn.css');
    expect(readFileSync(join(root, 'src/vibecn.css'), 'utf8')).toContain('--color-primary');
    const notice = readFileSync(join(root, 'vibecn.LICENSE'), 'utf8');
    expect(notice).toContain('Copyright (c) 2023 shadcn');
    expect(notice).toContain('Copyright (c) 2026 vibecn contributors');
    expect(notice).toContain('Permission is hereby granted');
    expect(planInit(root).files.every((file) => file.action === 'skip')).toBe(true);
  });
  it('detects a full-stack ui directory and accepts development dependencies', () => {
    const root = project({ devDependencies: { '@usevibejs/ui': '0.1.0' } });
    mkdirSync(join(root, 'ui'));
    applyPlan(planInit(root));
    expect(readConfig(root).paths.components).toBe('ui/src/components/ui');
  });
  it('requires an actual vibe.js application', () => {
    expect(() => planInit(project({}))).toThrow('@usevibejs/ui');
    expect(() => planInit(project({ dependencies: {}, devDependencies: {} }))).toThrow(
      '@usevibejs/ui',
    );
  });
});

describe('configuration', () => {
  it('requires initialization before adding sources', () => {
    expect(() => planAdd(project(), ['button'])).toThrow('vibecn init');
  });
  it.each([
    null,
    1,
    {},
    { version: 2 },
    { version: 1 },
    { version: 1, paths: null },
    { version: 1, paths: false },
    { version: 1, paths: {} },
    { version: 1, paths: { components: 1 } },
    { version: 1, paths: { components: 'ui' } },
    { version: 1, paths: { components: 'ui', lib: 1 } },
    { version: 1, paths: { components: 'ui', lib: 'lib' } },
    { version: 1, paths: { components: 'ui', lib: 'lib', styles: 1 } },
  ])('rejects invalid configuration %j', (value) => {
    const root = project();
    write(root, 'vibecn.json', JSON.stringify(value));
    expect(() => readConfig(root)).toThrow('Invalid vibecn.json');
  });
  it('rejects invalid JSON and non-CSS theme destinations', () => {
    const root = project();
    write(root, 'vibecn.json', '{');
    expect(() => readConfig(root)).toThrow(SyntaxError);
    config(root, { components: 'ui', lib: 'lib', styles: 'theme.js' });
    expect(() => readConfig(root)).toThrow('end in .css');
  });
});

describe('source installation', () => {
  it('copies a complete card, resolves a shared utility once, and rewrites relative imports', () => {
    const root = initialized();
    config(root, { components: 'app/widgets', lib: 'app/helpers', styles: 'src/vibecn.css' });
    const plan = planAdd(root, ['card', 'button', 'card']);
    expect(plan.files).toHaveLength(10);
    expect(plan.dependencies).toEqual(['clsx', 'tailwind-merge']);
    applyPlan(plan);
    expect(readFileSync(join(root, 'app/widgets/Button.vibe'), 'utf8')).toContain(
      "from '../helpers/utils.ts'",
    );
    expect(readFileSync(join(root, 'app/widgets/CardTitle.vibe'), 'utf8')).toContain('<h3');
    expect(readFileSync(join(root, 'app/helpers/utils.ts'), 'utf8')).toContain('twMerge');
    expect(planAdd(root, ['button']).files.every((file) => file.action === 'skip')).toBe(true);
    expect(planAdd(root, []).dependencies).toEqual([]);
  });
  it('supports a utility in the same directory as the components', () => {
    const root = initialized();
    config(root, { components: 'src/ui', lib: 'src/ui', styles: 'src/vibecn.css' });
    applyPlan(planAdd(root, ['badge']));
    expect(readFileSync(join(root, 'src/ui/Badge.vibe'), 'utf8')).toContain("from './utils.ts'");
  });
  it('preflights every conflict before writing and overwrites only when explicit', () => {
    const root = initialized();
    write(root, 'src/components/ui/Button.vibe', 'user source');
    expect(() => planAdd(root, ['card', 'button'])).toThrow('already exists');
    expect(existsSync(join(root, 'src/lib'))).toBe(false);
    expect(existsSync(join(root, 'src/components/ui/Card.vibe'))).toBe(false);
    const plan = planAdd(root, ['button'], true);
    expect(plan.files.find((file) => file.path.endsWith('Button.vibe'))?.action).toBe('overwrite');
    applyPlan(plan);
    expect(readFileSync(join(root, 'src/components/ui/Button.vibe'), 'utf8')).toContain(
      'data-slot="button"',
    );
  });
  it('detects new conflicts that appear after planning', () => {
    const root = initialized();
    const plan = planAdd(root, ['button']);
    write(root, 'src/components/ui/Button.vibe', 'created while reviewing');
    expect(() => applyPlan(plan)).toThrow('already exists');
    expect(existsSync(join(root, 'src/lib'))).toBe(false);
  });
  it('rejects directory targets, overlapping paths and duplicate destinations', () => {
    const root = initialized();
    mkdirSync(join(root, 'src/components/ui/Button.vibe'), { recursive: true });
    expect(() => planAdd(root, ['button'])).toThrow('regular file');
    const file = { path: 'new.txt', content: '', action: 'create' as const };
    const plan: InstallPlan = { root, overwrite: false, dependencies: [], files: [file, file] };
    expect(() => applyPlan(plan)).toThrow('Multiple registry files');
    plan.files = [file, { ...file, path: 'new.txt/nested.txt' }];
    expect(() => applyPlan(plan)).toThrow('also used as a parent');
  });
});

describe('destination boundaries', () => {
  it.each([
    '../escape',
    '/tmp/escape',
    'a/../b',
    './a',
    '',
    'a//b',
    'a/',
    'a\\b',
    'C:/escape',
    'a\0b',
  ])('rejects %j', (path) => {
    expect(() => destination(project(), path)).toThrow('Invalid destination');
  });
  it('rejects files used as parent directories', () => {
    const root = project();
    write(root, 'parent', 'a file');
    expect(() => destination(root, 'parent/child')).toThrow('Invalid destination');
  });
  it('rejects symlinked parents, files, configuration, and dangling links', () => {
    const root = initialized();
    const outside = project();
    symlinkSync(outside, join(root, 'src/components'));
    expect(() => planAdd(root, ['button'])).toThrow('symlink');
    symlinkSync(join(outside, 'missing'), join(root, 'dangling'));
    expect(() => destination(root, 'dangling')).toThrow('symlink');
    symlinkSync(join(outside, 'package.json'), join(root, 'linked.json'));
    expect(() => destination(root, 'linked.json')).toThrow('symlink');
    write(
      root,
      'vibecn.json',
      JSON.stringify({
        version: 1,
        paths: { components: '../outside', lib: 'lib', styles: 'theme.css' },
      }),
    );
    expect(() => readConfig(root)).toThrow('Invalid destination');
    expect(readFileSync(join(outside, 'package.json'), 'utf8')).toContain('@usevibejs/ui');
  });
  it('rechecks symlinks introduced after planning', () => {
    const root = initialized();
    const plan = planAdd(root, ['button']);
    symlinkSync(project(), join(root, 'src/components'));
    expect(() => applyPlan(plan)).toThrow('symlink');
    expect(existsSync(join(root, 'src/lib'))).toBe(false);
  });
});
