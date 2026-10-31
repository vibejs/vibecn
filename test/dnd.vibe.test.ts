import { nextTick } from '@usevibejs/ui';
import { mount } from '@usevibejs/ui/testing';
import { expect, it } from 'vitest';
import DndPatterns from './DndPatterns.vibe';
it('compiles optional DND sources and renders real handles, columns and empty targets', async () => {
  const wrapper = mount(DndPatterns, { attachTo: document.body });
  await nextTick();
  expect(wrapper.findAll('[data-slot="sortable-item"]')).toHaveLength(5);
  expect(wrapper.findAll('[data-slot="drag-handle"]')).toHaveLength(5);
  expect(wrapper.findAll('[data-slot="kanban-column"]')).toHaveLength(2);
  expect(wrapper.find('[data-slot="drop-zone"]').exists()).toBe(true);
  expect(wrapper.findAll('button').every((button) => button.attributes('type') === 'button')).toBe(
    true,
  );
  wrapper.unmount();
  expect(document.querySelector('[data-vibednd-overlay]')).toBe(null);
});
