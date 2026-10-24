import { expect, it } from 'vitest';
import { cn } from '../registry/lib/utils.ts';

it('merges conditional classes and gives consumer Tailwind classes precedence', () => {
  expect(
    cn(
      'px-3 bg-primary',
      undefined,
      false,
      ['px-6'],
      { 'text-sm': true, hidden: false },
      'bg-red-500',
    ),
  ).toBe('px-6 text-sm bg-red-500');
  expect(cn()).toBe('');
});
