import { effectScope } from '@usevibejs/ui';
import { expect, it } from 'vitest';
import { useFormControl } from '../registry/lib/form.ts';
it('derives VibeForm control props and errors with defaults and explicit options', () => {
  const scope = effectScope();
  const field = { name: 'title', invalid: true, messages: ['Required'] };
  const control = scope.run(() => useFormControl(field))!;
  expect(control.inputProps.value['aria-invalid']).toBe(true);
  expect(control.errors.value).toEqual([{ message: 'Required' }]);
  const required = scope.run(() => useFormControl(field, { required: true, described: true }))!;
  expect(required.inputProps.value['aria-required']).toBe(true);
  expect(required.inputProps.value['aria-describedby']).toContain(required.ids.description);
  scope.stop();
});
