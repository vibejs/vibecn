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
  });
  it('rejects unknown names before an installation starts', () => {
    expect(() => resolveItems(['button', '../../escape'])).toThrow('Unknown component');
  });
});
