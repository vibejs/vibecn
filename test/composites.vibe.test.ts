import { flushPromises, mount } from '@usevibejs/ui/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createTypeahead, isRtl, logicalKey, nextItem } from '../registry/lib/collection.ts';
import { mirror } from '../registry/lib/overlay.ts';
import { toast, toasts } from '../registry/lib/toast.ts';
import Toaster from '../site/src/components/ui/Toaster.vibe';
import Composites from './Composites.vibe';

const state = (wrapper: ReturnType<typeof mount>): Record<string, unknown> =>
  JSON.parse(wrapper.get('output').text());
const key = (element: Element, name: string): void => {
  element.dispatchEvent(
    new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }),
  );
};

afterEach(() => {
  vi.useRealTimers();
  toast.dismiss();
});

describe('collection helpers', () => {
  const items = ['a', 'b', 'c'].map((text) =>
    Object.assign(document.createElement('button'), { textContent: text }),
  );

  it('moves along an orientation, loops and stops at the ends', () => {
    expect(nextItem([], null, 'ArrowDown', 'vertical')).toBeUndefined();
    expect(nextItem(items, items[0], 'ArrowDown', 'vertical')).toBe(items[1]);
    expect(nextItem(items, items[0], 'ArrowUp', 'vertical')).toBe(items[2]);
    expect(nextItem(items, items[2], 'ArrowRight', 'horizontal', false)).toBe(items[2]);
    expect(nextItem(items, items[1], 'ArrowLeft', 'both')).toBe(items[0]);
    expect(nextItem(items, items[1], 'ArrowDown', 'horizontal')).toBeUndefined();
    expect(nextItem(items, items[1], 'Home', 'vertical')).toBe(items[0]);
    expect(nextItem(items, items[1], 'End', 'vertical')).toBe(items[2]);
    expect(nextItem(items, null, 'ArrowDown', 'vertical')).toBe(items[0]);
    expect(nextItem(items, null, 'ArrowUp', 'vertical')).toBe(items[2]);
  });
  it('matches typed text and cycles through repeated letters', () => {
    vi.useFakeTimers();
    const names = ['Apple', 'Apricot', 'Banana', 'Cherry'].map((text) =>
      Object.assign(document.createElement('div'), { textContent: text }),
    );
    names[3].dataset.label = 'Blueberry';
    const find = createTypeahead();
    expect(find('Enter', names, null)).toBeUndefined();
    expect(find(' ', names, null)).toBeUndefined();
    expect(find('a', names, null)).toBe(names[0]);
    expect(find('a', names, names[0])).toBe(names[1]);
    vi.advanceTimersByTime(500);
    expect(find('b', names, null)).toBe(names[2]);
    expect(find('l', names, names[2])).toBe(names[3]);
    vi.advanceTimersByTime(500);
    expect(find('z', names, names[1])).toBeUndefined();
  });
});

describe('direction', () => {
  it('reads the nearest dir attribute and swaps horizontal arrows in right-to-left text', () => {
    const outer = Object.assign(document.createElement('div'), { dir: 'rtl' });
    const inner = document.createElement('span');
    outer.append(inner);
    expect(isRtl(inner)).toBe(true);
    expect(isRtl(null)).toBe(false);
    expect(logicalKey('ArrowLeft', inner)).toBe('ArrowRight');
    expect(logicalKey('ArrowRight', inner)).toBe('ArrowLeft');
    expect(logicalKey('ArrowUp', inner)).toBe('ArrowUp');
    expect(logicalKey('ArrowLeft', document.body)).toBe('ArrowLeft');
    const placement = { side: 'right', align: 'start', sideOffset: 4, alignOffset: 0 } as const;
    expect(mirror(placement, true)).toEqual({ ...placement, side: 'left', align: 'end' });
    expect(mirror({ ...placement, side: 'top', align: 'center' }, true)).toMatchObject({
      side: 'top',
      align: 'center',
    });
    expect(mirror(placement, false)).toBe(placement);
  });
  it('moves tabs with ArrowLeft in right-to-left text', async () => {
    const wrapper = mount(Composites, { attachTo: document.body });
    wrapper.element.setAttribute('dir', 'rtl');
    const tabs = wrapper.findAll('[role="tab"]');
    (tabs[0].element as HTMLElement).focus();
    key(wrapper.get('[role="tablist"]').element, 'ArrowLeft');
    await flushPromises();
    expect(document.activeElement).toBe(tabs[2].element);
    wrapper.unmount();
  });
});

describe('Tabs', () => {
  it('links tabs and panels and selects with arrow keys, skipping disabled tabs', async () => {
    const wrapper = mount(Composites, { attachTo: document.body });
    const tabs = wrapper.findAll('[role="tab"]');
    expect([tabs[0], tabs[2]].map((tab) => tab.element.tabIndex)).toEqual([0, -1]);
    expect(wrapper.get(`#${tabs[0].attributes('aria-controls')}`).text()).toBe('First');
    expect(tabs[1].attributes('id')).toMatch(/-tab-two_disabled$/);
    (tabs[0].element as HTMLElement).focus();
    key(wrapper.get('[role="tablist"]').element, 'ArrowRight');
    await flushPromises();
    expect(document.activeElement).toBe(tabs[2].element);
    expect(state(wrapper).tab).toBe('three');
    expect(
      wrapper.findAll('[role="tabpanel"]').map((panel) => (panel.element as HTMLElement).hidden),
    ).toEqual([true, false]);
    key(wrapper.get('[role="tablist"]').element, 'a');
    expect(state(wrapper).tab).toBe('three');
    wrapper.unmount();
  });
  it('waits for Enter in manual mode', async () => {
    const wrapper = mount(Composites, { props: { manual: true }, attachTo: document.body });
    const tabs = wrapper.findAll('[role="tab"]');
    (tabs[0].element as HTMLElement).focus();
    key(wrapper.get('[role="tablist"]').element, 'End');
    await flushPromises();
    expect(state(wrapper).tab).toBe('one');
    await tabs[2].trigger('click');
    expect(state(wrapper).tab).toBe('three');
    wrapper.unmount();
  });
});

describe('ToggleGroup', () => {
  it('presses one item, or several, and keeps one tab stop', async () => {
    const wrapper = mount(Composites, { attachTo: document.body });
    const single = wrapper.findAll('.single button');
    expect(single.map((item) => item.element.tabIndex)).toEqual([0, -1]);
    await single[1].trigger('click');
    expect(state(wrapper).single).toBe('b');
    await single[1].trigger('click');
    expect(state(wrapper).single).toBe('');
    (single[0].element as HTMLElement).focus();
    key(wrapper.get('.single').element, 'ArrowRight');
    expect(document.activeElement).toBe(single[1].element);
    const enabled = wrapper.findAll('.enabled button');
    await enabled[0].trigger('click');
    await enabled[1].trigger('click');
    expect(state(wrapper).multiple).toEqual(['x', 'y']);
    await enabled[0].trigger('click');
    expect(state(wrapper).multiple).toEqual(['y']);
    expect((wrapper.get('.multiple button').element as HTMLButtonElement).disabled).toBe(true);
    wrapper.unmount();
  });
});

describe('InputOTP', () => {
  it('keeps allowed characters, shows them in the slots and reports completion', async () => {
    const wrapper = mount(Composites, { attachTo: document.body });
    const input = wrapper.get('[data-slot="input-otp"] input');
    (input.element as HTMLInputElement).focus();
    await input.trigger('focus');
    await input.setValue('1a2');
    expect(state(wrapper).code).toBe('12');
    const slots = wrapper.findAll('[data-slot="input-otp-slot"]');
    expect(slots.map((slot) => slot.text())).toEqual(['1', '2', '', '']);
    expect(slots[2].attributes('data-active')).toBe('true');
    await input.setValue('123456');
    expect(state(wrapper)).toMatchObject({ code: '1234', completed: '1234' });
    expect(slots[3].attributes('data-active')).toBe('true');
    await input.trigger('blur');
    expect(slots[3].attributes('data-active')).toBe('false');
    wrapper.unmount();
  });
});

describe('Resizable and ScrollArea', () => {
  it('shares space, resizes within limits and reports the layout', async () => {
    const wrapper = mount(Composites, { attachTo: document.body });
    const panels = wrapper.findAll('[data-slot="resizable-panel"]');
    expect(panels.map((panel) => panel.attributes('style'))).toEqual([
      'flex: 30 1 0px;',
      'flex: 70 1 0px;',
    ]);
    const handle = wrapper.get('[data-slot="resizable-handle"]');
    await flushPromises();
    expect(handle.attributes()).toMatchObject({
      role: 'separator',
      'aria-valuenow': '30',
      'aria-orientation': 'vertical',
    });
    key(handle.element, 'ArrowRight');
    await flushPromises();
    expect(state(wrapper).layout).toEqual([35, 65]);
    key(handle.element, 'End');
    await flushPromises();
    expect(state(wrapper).layout).toEqual([60, 40]);
    key(handle.element, 'Home');
    key(handle.element, 'ArrowUp');
    await flushPromises();
    expect(state(wrapper).layout).toEqual([20, 80]);
    Object.defineProperty(handle.element.parentElement, 'offsetWidth', { value: 200 });
    const pointer = (type: string, clientX: number): void => {
      handle.element.dispatchEvent(new MouseEvent(type, { clientX, clientY: 0 }));
    };
    pointer('pointermove', 50);
    pointer('pointerdown', 0);
    pointer('pointermove', 20);
    pointer('pointerup', 20);
    pointer('pointermove', 80);
    await flushPromises();
    expect(state(wrapper).layout).toEqual([30, 70]);
    expect(wrapper.get('.scroll [data-slot="scroll-area-viewport"]').classes()).toContain(
      'overflow-x-auto',
    );
    wrapper.unmount();
  });
  it('resizes vertical groups with the vertical arrow keys', async () => {
    const wrapper = mount(Composites, { props: { horizontal: false } });
    const handle = wrapper.get('[data-slot="resizable-handle"]');
    expect(handle.attributes('aria-orientation')).toBe('horizontal');
    key(handle.element, 'ArrowDown');
    await flushPromises();
    expect(state(wrapper).layout).toEqual([35, 65]);
    expect(wrapper.get('.scroll [data-slot="scroll-area-viewport"]').classes()).toContain(
      'overflow-x-hidden',
    );
  });
});

describe('toast', () => {
  it('adds, replaces and dismisses toasts', () => {
    const id = toast('Saved', { description: 'All changes saved' });
    expect(toasts.value).toEqual([
      { id, type: 'default', title: 'Saved', description: 'All changes saved' },
    ]);
    toast.info('Info');
    toast.success('Done', { id });
    toast.warning('Careful');
    toast.error('Failed');
    expect(toasts.value.map((item) => item.type)).toEqual(['success', 'info', 'warning', 'error']);
    expect(toasts.value[0].title).toBe('Done');
    toast.dismiss(id);
    expect(toasts.value).toHaveLength(3);
    toast.dismiss();
    expect(toasts.value).toEqual([]);
  });
  it('turns a promise into a loading, then a result toast', async () => {
    const ok = toast.promise(Promise.resolve(2), {
      loading: 'Saving',
      success: (value) => `Saved ${value}`,
      error: 'Failed',
    });
    const failed = toast.promise(Promise.reject(new Error('no')), {
      loading: 'Saving',
      success: 'Saved',
      error: (error) => (error as Error).message,
    });
    const plain = toast.promise(Promise.resolve(1), {
      loading: 'Saving',
      success: 'Saved',
      error: 'Failed',
    });
    const plainError = toast.promise(Promise.reject(new Error('no')), {
      loading: 'Saving',
      success: 'Saved',
      error: 'Failed',
    });
    expect(toasts.value.map((item) => item.type)).toEqual([
      'loading',
      'loading',
      'loading',
      'loading',
    ]);
    await flushPromises();
    expect(toasts.value.find((item) => item.id === plain)?.title).toBe('Saved');
    expect(toasts.value.find((item) => item.id === plainError)?.title).toBe('Failed');
    expect(toasts.value.find((item) => item.id === ok)).toMatchObject({
      type: 'success',
      title: 'Saved 2',
    });
    expect(toasts.value.find((item) => item.id === failed)).toMatchObject({
      type: 'error',
      title: 'no',
    });
  });
});

describe('Toaster', () => {
  it('renders toasts, runs actions and closes them after their duration unless hovered', async () => {
    vi.useFakeTimers();
    const wrapper = mount(Toaster, {
      props: { duration: 1000, closeButton: true },
      attachTo: document.body,
    });
    const action = vi.fn<(event: MouseEvent) => void>();
    toast('Saved', { action: { label: 'Undo', onClick: action } });
    toast.error('Failed', { duration: Infinity });
    toast.loading('Working');
    await flushPromises();
    const items = wrapper.findAll('li');
    expect(items.map((item) => item.attributes('role'))).toEqual(['status', 'alert', 'status']);
    await wrapper.get('section').trigger('pointerenter');
    vi.advanceTimersByTime(2000);
    await flushPromises();
    expect(toasts.value).toHaveLength(3);
    await wrapper.get('section').trigger('focusout', { relatedTarget: wrapper.get('li').element });
    await wrapper.get('section').trigger('pointerleave');
    vi.advanceTimersByTime(1000);
    await flushPromises();
    expect(toasts.value.map((item) => item.title)).toEqual(['Failed', 'Working']);
    toast('Again', { action: { label: 'Undo', onClick: action } });
    await flushPromises();
    await wrapper.get('li button').trigger('click');
    expect(action).toHaveBeenCalledOnce();
    await wrapper.get('[aria-label="Close notification"]').trigger('click');
    await flushPromises();
    // The close button of the newest toast comes first.
    expect(toasts.value.map((item) => item.title)).toEqual(['Failed']);
    wrapper.unmount();
  });
  it('places toasts at the top and expands them when asked', async () => {
    const wrapper = mount(Toaster, { props: { position: 'top-center', expand: true } });
    toast('One');
    toast('Two');
    await flushPromises();
    expect(wrapper.get('section').classes()).toContain('top-4');
    expect(wrapper.findAll('li')[1].attributes('style')).toContain('scale(1)');
  });
});
