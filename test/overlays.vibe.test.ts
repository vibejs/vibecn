import { mount } from '@usevibejs/ui/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { injectOverlay, place, type Placement } from '../registry/lib/overlay.ts';
import Overlays from './Overlays.vibe';

const state = (wrapper: ReturnType<typeof mount>): Record<string, unknown> =>
  JSON.parse(wrapper.get('output').text());
const box = (element: Element, rect: Partial<DOMRect>): void => {
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
    right: 0,
    bottom: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
    ...rect,
  } as DOMRect);
};

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('place', () => {
  const anchor = { top: 100, left: 100, width: 50, height: 20 };
  const size = { width: 80, height: 40 };
  const viewport = { width: 400, height: 300 };
  const at = (placement: Partial<Placement>, view = viewport) =>
    place(anchor, size, view, {
      side: 'bottom',
      align: 'center',
      sideOffset: 4,
      alignOffset: 0,
      ...placement,
    });

  it('places on the requested side, aligned to the anchor', () => {
    expect(at({})).toEqual({ x: 85, y: 124, side: 'bottom' });
    expect(at({ side: 'top', align: 'start', alignOffset: 2 })).toEqual({
      x: 102,
      y: 56,
      side: 'top',
    });
    expect(at({ align: 'end' })).toEqual({ x: 70, y: 124, side: 'bottom' });
    expect(at({ side: 'right' })).toEqual({ x: 154, y: 90, side: 'right' });
    expect(at({ side: 'left', align: 'start' })).toEqual({ x: 16, y: 100, side: 'left' });
  });
  it('flips to the opposite side when the requested one has no room', () => {
    expect(at({}, { width: 400, height: 150 }).side).toBe('top');
    expect(at({ side: 'left' }, { width: 400, height: 300 }).side).toBe('left');
    expect(
      place({ ...anchor, left: 20 }, size, viewport, {
        side: 'left',
        align: 'center',
        sideOffset: 4,
        alignOffset: 0,
      }).side,
    ).toBe('right');
  });
  it('shifts inside the viewport', () => {
    expect(
      place({ ...anchor, left: 0 }, size, viewport, {
        side: 'bottom',
        align: 'center',
        sideOffset: 4,
        alignOffset: 0,
      }).x,
    ).toBe(8);
    expect(
      place({ ...anchor, left: 390 }, size, viewport, {
        side: 'bottom',
        align: 'center',
        sideOffset: 4,
        alignOffset: 0,
      }).x,
    ).toBe(312);
    expect(
      place(anchor, { width: 500, height: 40 }, viewport, {
        side: 'bottom',
        align: 'center',
        sideOffset: 4,
        alignOffset: 0,
      }).x,
    ).toBe(8);
  });
});

describe('dialogs', () => {
  it('opens from the trigger, labels the dialog and closes from the footer', async () => {
    const wrapper = mount(Overlays);
    const trigger = wrapper.get('#dialog-trigger');
    const dialog = wrapper.get('[data-slot="dialog-content"]');
    expect(trigger.attributes()).toMatchObject({
      'aria-haspopup': 'dialog',
      'aria-expanded': 'false',
    });
    await trigger.trigger('click');
    expect(dialog.attributes('open')).toBe('');
    expect(trigger.attributes('aria-expanded')).toBe('true');
    expect(wrapper.get(`#${dialog.attributes('aria-labelledby')}`).text()).toBe('Title');
    expect(wrapper.get(`#${dialog.attributes('aria-describedby')}`).text()).toBe('Description');
    await wrapper.get('[data-slot="dialog-footer"] button').trigger('click');
    expect(dialog.attributes('open')).toBeUndefined();
    expect(state(wrapper).dialog).toBe(false);
  });
  it('syncs a close from the browser and closes on a backdrop click only', async () => {
    const wrapper = mount(Overlays);
    await wrapper.get('#dialog-trigger').trigger('click');
    const dialog = wrapper.get('[data-slot="dialog-content"]');
    box(dialog.element, { left: 100, top: 100, right: 300, bottom: 300 });
    await dialog.trigger('click', { clientX: 150, clientY: 150 });
    expect(state(wrapper).dialog).toBe(true);
    await wrapper.get('[data-slot="dialog-title"]').trigger('click', { clientX: 10, clientY: 10 });
    expect(state(wrapper).dialog).toBe(true);
    await dialog.trigger('click', { clientX: 10, clientY: 10 });
    expect(state(wrapper).dialog).toBe(false);
    await wrapper.get('#dialog-trigger').trigger('click');
    (dialog.element as HTMLDialogElement).close();
    await wrapper.get('#dialog-trigger').trigger('focus');
    expect(state(wrapper).dialog).toBe(false);
    await wrapper.get('#dialog-trigger').trigger('click');
    await wrapper.get('[data-slot="dialog-close-button"]').trigger('click');
    expect(state(wrapper).dialog).toBe(false);
  });
  it('keeps an alert dialog open on a backdrop click and runs the action before closing', async () => {
    const wrapper = mount(Overlays);
    await wrapper.get('#alert-trigger').trigger('click');
    const content = wrapper.get('[data-slot="alert-dialog-content"]');
    expect(content.attributes('role')).toBe('alertdialog');
    expect(content.find('[data-slot="dialog-close-button"]').exists()).toBe(false);
    box(content.element, { left: 100, top: 100, right: 300, bottom: 300 });
    await content.trigger('click', { clientX: 10, clientY: 10 });
    expect(state(wrapper).alert).toBe(true);
    await wrapper.get('#alert-action').trigger('click');
    expect(state(wrapper)).toMatchObject({ alert: false, confirmed: 1 });
  });
  it('requires its root', () => {
    expect(() => injectOverlay('Dialog')).toThrow('This part must be placed inside Dialog.');
  });
});

describe('popovers, tooltips and hover cards', () => {
  it('shows the popover through the browser and positions it at its trigger', async () => {
    const wrapper = mount(Overlays, { attachTo: document.body });
    const trigger = wrapper.get('#popover-trigger');
    const content = wrapper.get('[data-slot="popover-content"]');
    expect(trigger.attributes('popovertarget')).toBe(content.attributes('id'));
    box(trigger.element, { top: 200, left: 100, width: 60, height: 20, bottom: 220, right: 160 });
    (content.element as HTMLElement).showPopover();
    await wrapper.get('output').trigger('focus');
    expect(state(wrapper).popover).toBe(true);
    expect((content.element as HTMLElement).style.top).not.toBe('');
    expect(content.attributes('data-side')).toBe('top');
    window.dispatchEvent(new Event('resize'));
    window.dispatchEvent(new Event('scroll'));
    // Without an anchor, the content keeps its last position.
    const top = (content.element as HTMLElement).style.top;
    trigger.element.removeAttribute('data-anchor');
    window.dispatchEvent(new Event('resize'));
    expect((content.element as HTMLElement).style.top).toBe(top);
    (content.element as HTMLElement).hidePopover();
    await wrapper.get('output').trigger('focus');
    expect(state(wrapper).popover).toBe(false);
    wrapper.unmount();
  });
  it('opens a tooltip on hover and closes it on a press or Escape', async () => {
    const wrapper = mount(Overlays);
    const trigger = wrapper.get('#tooltip-trigger');
    await trigger.trigger('pointerenter');
    expect(state(wrapper).tooltip).toBe(true);
    expect(trigger.attributes('aria-describedby')).toBe(
      wrapper.get('[role="tooltip"]').attributes('id'),
    );
    await trigger.trigger('keydown', { key: 'Enter' });
    expect(state(wrapper).tooltip).toBe(true);
    await trigger.trigger('keydown', { key: 'Escape' });
    expect(state(wrapper).tooltip).toBe(false);
    await trigger.trigger('pointerenter');
    await trigger.trigger('pointerdown');
    expect(state(wrapper).tooltip).toBe(false);
    await trigger.trigger('focus');
    await trigger.trigger('blur');
    expect(state(wrapper).tooltip).toBe(false);
  });
  it('opens a hover card after its delay and keeps it open over the card', async () => {
    vi.useFakeTimers();
    const wrapper = mount(Overlays);
    const trigger = wrapper.get('#hover-trigger');
    await trigger.trigger('pointerenter');
    expect(state(wrapper).hoverCard).toBe(false);
    vi.advanceTimersByTime(100);
    await trigger.trigger('focus');
    expect(state(wrapper).hoverCard).toBe(true);
    await trigger.trigger('pointerleave');
    await wrapper.get('[data-slot="hover-card-content"]').trigger('pointerenter');
    vi.advanceTimersByTime(100);
    await wrapper.get('output').trigger('focus');
    expect(state(wrapper).hoverCard).toBe(true);
    await wrapper.get('[data-slot="hover-card-content"]').trigger('pointerleave');
    vi.advanceTimersByTime(50);
    await wrapper.get('output').trigger('focus');
    expect(state(wrapper).hoverCard).toBe(false);
    wrapper.unmount();
  });
});

describe('disclosures and drawers', () => {
  it('opens one item of a single accordion and any items of a multiple one', async () => {
    const wrapper = mount(Overlays);
    const single = wrapper.findAll('.single details');
    expect(single.map((item) => (item.element as HTMLDetailsElement).open)).toEqual([true, false]);
    expect(single[0].attributes('name')).toBe(single[1].attributes('name'));
    (single[1].element as HTMLDetailsElement).open = true;
    await single[1].trigger('toggle');
    expect(state(wrapper).single).toBe('b');
    (single[0].element as HTMLDetailsElement).open = false;
    await single[0].trigger('toggle');
    expect(state(wrapper).single).toBe('b');
    (single[1].element as HTMLDetailsElement).open = false;
    await single[1].trigger('toggle');
    expect(state(wrapper).single).toBe('');
    const multiple = wrapper.findAll('.multiple details');
    expect(multiple[0].attributes('name')).toBeUndefined();
    (multiple[0].element as HTMLDetailsElement).open = true;
    await multiple[0].trigger('toggle');
    expect(state(wrapper).multiple).toEqual(['x']);
    (multiple[0].element as HTMLDetailsElement).open = false;
    await multiple[0].trigger('toggle');
    expect(state(wrapper).multiple).toEqual([]);
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    multiple[1].get('summary').element.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
  });
  it('toggles a collapsible and opens it for find in page', async () => {
    const wrapper = mount(Overlays, { attachTo: document.body });
    const trigger = wrapper.get('#collapsible-trigger');
    const content = wrapper.get('[data-slot="collapsible-content"]');
    // Browsers keep the until-found value; jsdom reduces the hidden property to a boolean.
    expect((content.element as HTMLElement).hidden).toBeTruthy();
    await trigger.trigger('click');
    expect((content.element as HTMLElement).hidden).toBe(false);
    expect(trigger.attributes('aria-expanded')).toBe('true');
    await trigger.trigger('click');
    content.element.dispatchEvent(new Event('beforematch'));
    await trigger.trigger('focus');
    expect(state(wrapper).collapsible).toBe(true);
    wrapper.unmount();
  });
  it('closes a drawer dragged down by more than a quarter of its height', async () => {
    const wrapper = mount(Overlays);
    const content = wrapper.get('[data-slot="drawer-content"]');
    Object.defineProperty(content.element, 'offsetHeight', { value: 400 });
    const handle = wrapper.get('[data-slot="drawer-handle"]');
    // jsdom has no PointerEvent; a MouseEvent carries the same coordinates.
    const pointer = (type: string, clientY: number): boolean =>
      handle.element.dispatchEvent(new MouseEvent(type, { clientX: 0, clientY }));
    const drag = async (distance: number) => {
      pointer('pointerdown', 0);
      pointer('pointermove', distance);
      pointer('pointerup', distance);
      await wrapper.get('output').trigger('focus');
    };
    await wrapper.get('#drawer-trigger').trigger('click');
    await drag(50);
    expect(state(wrapper).drawer).toBe(true);
    pointer('pointermove', 10);
    await drag(150);
    expect(state(wrapper).drawer).toBe(false);
  });
});
