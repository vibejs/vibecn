import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { project } from '../test/project.ts';
import { help, run } from './cli.ts';

const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

function invoke(args: string[], root = project()): { code: number; output: string; root: string } {
  const output = vi.fn<(message: string) => void>();
  const code = run(args, root, output);
  return { code, output: output.mock.calls.map(([message]) => String(message)).join('\n'), root };
}

describe('CLI commands', () => {
  it.each([[], ['--help'], ['-h']].map((args) => ({ args })))(
    'shows help with $args',
    ({ args }) => {
      expect(invoke(args).output).toBe(help);
    },
  );
  it('prints its version and component catalog in text or JSON', () => {
    expect(invoke(['--version']).output).toBe(manifest.version);
    expect(invoke(['list']).output).toContain('button');
    const result = JSON.parse(invoke(['list', '--json']).output);
    expect(result.ok).toBe(true);
    expect(result.components).toHaveLength(8);
  });
  it('initializes a different application and supports previewing without writes', () => {
    const root = project();
    const result = invoke(['init', '--cwd', root, '--dry-run', '--json']);
    expect(result.code).toBe(0);
    expect(JSON.parse(result.output).dryRun).toBe(true);
    expect(existsSync(join(root, 'vibecn.json'))).toBe(false);
    expect(invoke(['init', '--cwd', root, '--overwrite']).output).toContain('Source files ready.');
    expect(invoke(['add', 'button', '--dry-run'], root).output).toContain(
      'Dry run. No files written.',
    );
    expect(existsSync(join(root, 'src/components/ui/Button.vibe'))).toBe(false);
  });
  it('adds all components, provides dependency guidance and skips identical files', () => {
    const { root } = invoke(['init']);
    expect(invoke(['add', '--all'], root).code).toBe(0);
    expect(readFileSync(join(root, 'src/components/ui/Textarea.vibe'), 'utf8')).toContain(
      'defineModel',
    );
    const result = JSON.parse(invoke(['add', 'button', '--json'], root).output);
    expect(result.files.every((file: { action: string }) => file.action === 'skip')).toBe(true);
    expect(result.dependencies).toEqual(['clsx', 'tailwind-merge']);
    expect(invoke(['add', 'utils'], root).output).toContain('Required npm dependencies');
  });
  it.each(
    [
      ['--wat'],
      ['init', '--cwd'],
      ['init', '--cwd', '--json'],
      ['unknown'],
      ['init', 'button'],
      ['init', '--all'],
      ['add'],
      ['add', 'button', '--all'],
      ['list', 'button'],
      ['list', '--all'],
      ['list', '--dry-run'],
      ['list', '--overwrite'],
    ].map((args) => ({ args })),
  )('reports invalid usage $args', ({ args }) => {
    const result = invoke(args);
    expect(result.code).toBe(1);
    expect(result.output).toContain(args.includes('--json') ? '"ok":false' : 'Error:');
  });
  it('reports an actionable machine-readable failure', () => {
    const result = invoke(['add', 'unknown', '--json']);
    expect(result.code).toBe(1);
    expect(JSON.parse(result.output)).toEqual({
      ok: false,
      error: expect.stringContaining('vibecn init'),
    });
  });
});
