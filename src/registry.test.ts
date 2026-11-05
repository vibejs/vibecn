import { describe, expect, it } from 'vitest';
import { registry, resolveItems } from './index.ts';

describe('registry dependencies', () => {
  it('deduplicates shared dependencies and preserves dependency order', () => {
    expect(resolveItems(['card', 'button', 'card', 'utils']).map((item) => item.name)).toEqual([
      'utils',
      'card',
      'button',
    ]);
    expect(resolveItems(registry.map((item) => item.name))).toHaveLength(registry.length);
    expect(resolveItems([])).toEqual([]);
    expect(registry.find((item) => item.name === 'card')?.files).toHaveLength(7);
    expect(registry.find((item) => item.name === 'data-table')).toMatchObject({
      dependencies: ['@usevibejs/table'],
      registryDependencies: ['utils', 'table', 'button'],
    });
    expect(registry.find((item) => item.name === 'login-form')?.dependencies).toEqual([
      '@usevibejs/form',
      '@usevibejs/auth',
    ]);
    expect(
      registry.find((item) => item.name === 'language-switcher')?.registryDependencies,
    ).toEqual(['utils', 'combobox']);
    expect(registry.find((item) => item.name === 'dropzone')?.dependencies).toEqual([]);
  });
  it('rejects unknown names before an installation starts', () => {
    expect(() => resolveItems(['button', '../../escape'])).toThrow('Unknown component');
  });
});
