import { afterEach, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.restoreAllMocks();
  process.exitCode = 0;
});

it('runs the executable entry point with the process arguments', async () => {
  vi.spyOn(process, 'argv', 'get').mockReturnValue(['node', 'vibecn', '--help']);
  const output = vi.spyOn(console, 'log').mockImplementation(() => {});
  await import('./bin.ts');
  expect(output).toHaveBeenCalledWith(expect.stringContaining('vibecn init'));
  expect(process.exitCode).toBe(0);
});
