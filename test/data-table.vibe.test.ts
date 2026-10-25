import { mount } from '@usevibejs/ui/testing';
import { expect, it, vi } from 'vitest';
import States from './DataTableStates.vibe';
import Payments from '../site/src/examples/data-table-demo.vibe';
it('renders loading, error, empty and populated semantic table states', async () => {
  const wrapper = mount(States, { props: { loading: true } });
  expect(wrapper.get('[data-slot="data-table"]').attributes('aria-busy')).toBe('true');
  expect(wrapper.get('[role="status"]').text()).toBe('Loading records');
  expect(wrapper.findAll('[data-slot="skeleton"]')).toHaveLength(5);
  await wrapper.setProps({ loading: false, error: 'Could not load customers.' });
  expect(wrapper.get('[role="alert"]').text()).toContain('Could not load customers.');
  expect(wrapper.get('button').text()).toBe('Retry request');
  await wrapper.setProps({ error: undefined, empty: true });
  expect(wrapper.text()).toContain('No results');
  await wrapper.setProps({ empty: false, density: 'compact' });
  expect(wrapper.get('[data-row-id="a"]').text()).toBe('a');
  expect(wrapper.get('[data-slot="data-table"]').attributes('data-density')).toBe('compact');
  const separator = wrapper.get('[role="separator"]');
  await separator.trigger('keydown', { key: 'ArrowRight' });
  expect(separator.attributes('aria-valuenow')).toBe('160');
  await separator.trigger('keydown', { key: 'ArrowLeft' });
  expect(separator.attributes('aria-valuenow')).toBe('150');
  await separator.trigger('keydown', { key: 'Enter' });
  expect(separator.attributes('aria-valuenow')).toBe('150');
});
it('performs real row actions and bulk changes through typed custom cell components', async () => {
  const wrapper = mount(Payments);
  const first = wrapper.get('[data-row-id="PAY-1048"]').element;
  const refund = wrapper
    .findAll('[data-row-id="PAY-1048"] [role="menuitem"]')
    .find((item) => item.text() === 'Refund payment')!;
  await refund.trigger('click');
  expect(first.textContent).toContain('Refunded');
  const check = wrapper.get('[aria-label="Select olivia.rhye@example.com"]');
  await check.setValue(true);
  const bulk = wrapper.get('[data-slot="data-table-selection-actions"] button');
  await bulk.trigger('click');
  expect(first.textContent).toContain('Paid');
  expect(wrapper.find('[data-slot="data-table-selection-actions"]').exists()).toBe(false);
  expect(wrapper.get('[data-row-id="PAY-1048"]').element).toBe(first);
});

it('ends a live resize and releases document handlers when the table unmounts', async () => {
  const added = vi.spyOn(document, 'addEventListener');
  const removed = vi.spyOn(document, 'removeEventListener');
  const wrapper = mount(States);
  await wrapper.get('[role="separator"]').trigger('mousedown', { clientX: 100 });
  const registrations = added.mock.calls.filter(
    ([type]) => type === 'mousemove' || type === 'mouseup',
  );
  expect(registrations).toHaveLength(2);
  wrapper.unmount();
  for (const [type, listener] of registrations)
    expect(
      removed.mock.calls.some(
        ([removedType, removedListener]) => removedType === type && removedListener === listener,
      ),
    ).toBe(true);
  added.mockRestore();
  removed.mockRestore();
});

it('cancels touch resizing when its owner is removed', async () => {
  const added = vi.spyOn(document, 'addEventListener');
  const removed = vi.spyOn(document, 'removeEventListener');
  const wrapper = mount(States);
  const start = new Event('touchstart', { bubbles: true });
  Object.defineProperty(start, 'touches', { value: [{ clientX: 100 }] });
  wrapper.get('[role="separator"]').element.dispatchEvent(start);
  const registrations = added.mock.calls.filter(([type]) =>
    ['touchmove', 'touchend', 'touchcancel'].includes(type),
  );
  expect(registrations).toHaveLength(3);
  wrapper.unmount();
  for (const [type, listener] of registrations)
    expect(
      removed.mock.calls.some(
        ([removedType, removedListener]) => removedType === type && removedListener === listener,
      ),
    ).toBe(true);
  added.mockRestore();
  removed.mockRestore();
});
