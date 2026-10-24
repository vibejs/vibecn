import { flushPromises, mount } from '@usevibejs/ui/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Menus from './Menus.vibe';

type Wrapper = ReturnType<typeof mount>;
const state = (wrapper: Wrapper): Record<string, unknown> =>
  JSON.parse(wrapper.get('output').text());
const key = async (element: Element, name: string): Promise<KeyboardEvent> => {
  const event = new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true });
  element.dispatchEvent(event);
  await flushPromises();
  return event;
};
const active = (): string => (document.activeElement as HTMLElement).id;
const shown = (element: Element): boolean => element.hasAttribute('data-popover-open');
let wrapper: Wrapper;
const setup = async (): Promise<Wrapper> => {
  wrapper = mount(Menus, { attachTo: document.body });
  await flushPromises();
  return wrapper;
};
afterEach(() => wrapper?.unmount());

describe('DropdownMenu', () => {
  it('opens from the keyboard on the first or last item and moves with arrows and typing', async () => {
    await setup();
    const trigger = wrapper.get('#menu-trigger');
    const content = wrapper.get('[data-slot="dropdown-menu-content"]');
    expect(trigger.attributes()).toMatchObject({
      'aria-haspopup': 'menu',
      popovertarget: content.attributes('id'),
    });
    await key(trigger.element, 'Enter');
    await key(trigger.element, 'ArrowDown');
    expect(shown(content.element)).toBe(true);
    expect(active()).toBe('profile');
    await key(document.activeElement!, 'ArrowDown');
    expect(active()).toBe('keep');
    await key(document.activeElement!, 'ArrowDown');
    expect(active()).toBe('check');
    await key(document.activeElement!, 'm');
    expect(active()).toBe('sub-trigger');
    await key(document.activeElement!, 'Escape');
    expect(state(wrapper).menu).toBe(false);
    expect(active()).toBe('menu-trigger');
    await key(trigger.element, 'ArrowUp');
    expect(active()).toBe('sub-trigger');
    await key(trigger.element, 'x');
    // A menu without items takes focus itself.
    await key(wrapper.get('#empty-trigger').element, 'ArrowDown');
    expect(active()).toBe('empty-content');
  });
  it('selects items, keeps the menu open when asked and toggles checkbox and radio items', async () => {
    await setup();
    const open = async () => {
      await wrapper.get('#menu-trigger').trigger('click');
      wrapper.get('[data-slot="dropdown-menu-content"]').element.showPopover();
      await flushPromises();
    };
    await open();
    await wrapper.get('#keep').trigger('click');
    expect(state(wrapper).menu).toBe(true);
    await wrapper.get('#disabled').trigger('click');
    await wrapper.get('#disabled').trigger('pointermove');
    await key(wrapper.get('#profile').element, 'Enter');
    expect(state(wrapper)).toMatchObject({ menu: false, selected: ['profile'] });
    await open();
    await key(wrapper.get('#check').element, ' ');
    expect(state(wrapper).checked).toBe(true);
    await open();
    await wrapper.get('#radio-b').trigger('click');
    expect(state(wrapper).radio).toBe('b');
    expect(wrapper.get('#radio-b').attributes('aria-checked')).toBe('true');
    await open();
    await key(wrapper.get('#profile').element, 'a');
    await wrapper.get('#profile').trigger('pointerleave');
    expect(document.activeElement).toBe(wrapper.get('[data-slot="dropdown-menu-content"]').element);
    await key(document.activeElement!, 'Tab');
    expect(state(wrapper).menu).toBe(false);
  });
  it('opens submenus by hover and keyboard and closes them with ArrowLeft', async () => {
    await setup();
    await wrapper.get('#menu-trigger').trigger('click');
    wrapper.get('[data-slot="dropdown-menu-content"]').element.showPopover();
    await flushPromises();
    const sub = wrapper.get('#sub-trigger');
    const subContent = wrapper.findAll('[data-slot="dropdown-menu-sub-content"]')[0];
    await sub.trigger('pointermove');
    expect(shown(subContent.element)).toBe(true);
    await sub.trigger('pointermove');
    await wrapper.get('#profile').trigger('pointermove');
    expect(shown(subContent.element)).toBe(false);
    await key(sub.element, 'ArrowRight');
    expect(active()).toBe('sub-item');
    await key(document.activeElement!, 'ArrowLeft');
    expect(shown(subContent.element)).toBe(false);
    expect(active()).toBe('sub-trigger');
    await key(sub.element, 'Tab');
    await sub.trigger('click');
    await wrapper.get('#sub-item').trigger('click');
    expect(state(wrapper)).toMatchObject({ menu: false, selected: ['sub'] });
    const disabled = wrapper.get('#disabled-sub');
    await disabled.trigger('pointermove');
    await disabled.trigger('click');
    expect(shown(wrapper.findAll('[data-slot="dropdown-menu-sub-content"]')[1].element)).toBe(
      false,
    );
  });
});

describe('ContextMenu', () => {
  it('opens at the pointer, or at the area for the keyboard, unless disabled', async () => {
    await setup();
    const area = wrapper.get('#area');
    const content = wrapper.findAll('[data-slot="context-menu-content"]')[0];
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 40,
      clientY: 30,
    });
    area.element.dispatchEvent(event);
    await flushPromises();
    expect(event.defaultPrevented).toBe(true);
    expect(shown(content.element)).toBe(true);
    expect((content.element as HTMLElement).style.left).toBe('40px');
    area.element.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }));
    await flushPromises();
    expect(document.activeElement?.textContent).toBe('Copy');
    await wrapper.get('[data-slot="context-menu-item"]').trigger('click');
    expect(state(wrapper).context).toBe('copy');
    const off = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
    wrapper.get('#disabled-area').element.dispatchEvent(off);
    expect(off.defaultPrevented).toBe(false);
  });
});

describe('Menubar', () => {
  it('moves between triggers and menus and switches menus on hover', async () => {
    await setup();
    const [file, edit, help] = ['#file', '#edit', '#help'].map((id) => wrapper.get(id));
    const contents = wrapper.findAll('[data-slot="menubar-content"]');
    expect([file, edit].map((trigger) => trigger.element.tabIndex)).toEqual([0, -1]);
    (file.element as HTMLElement).focus();
    await key(wrapper.get('[role="menubar"]').element, 'ArrowRight');
    expect(active()).toBe('edit');
    await key(edit.element, 'Enter');
    await key(edit.element, 'ArrowDown');
    expect(shown(contents[1].element)).toBe(true);
    await key(document.activeElement!, 'ArrowRight');
    expect(shown(contents[0].element)).toBe(true);
    expect(document.activeElement?.textContent).toBe('New');
    await key(document.activeElement!, 'ArrowLeft');
    expect(shown(contents[1].element)).toBe(true);
    await edit.trigger('pointerenter');
    await file.trigger('pointerenter');
    expect(shown(contents[0].element)).toBe(true);
    await help.trigger('pointerenter');
    await file.trigger('pointerenter');
    await file.trigger('click');
    await contents[0].get('[role="menuitem"]').trigger('click');
    expect(state(wrapper).bar).toBe('new');
    await file.trigger('pointerenter');
    expect(shown(contents[0].element)).toBe(false);
  });
});

describe('Select', () => {
  it('opens on the selected option, selects with the keyboard and shows the label', async () => {
    await setup();
    const trigger = wrapper.get('#select-trigger');
    const content = wrapper.get('[data-slot="select-content"]');
    expect(trigger.text()).toBe('Pick');
    expect(trigger.attributes('data-placeholder')).toBe('true');
    await key(trigger.element, 'Enter');
    await key(trigger.element, 'ArrowDown');
    expect(shown(content.element)).toBe(true);
    expect(document.activeElement?.textContent).toBe('Apple');
    await key(document.activeElement!, 'b');
    expect(document.activeElement?.textContent).toBe('Banana');
    await key(document.activeElement!, 'ArrowDown');
    expect(document.activeElement?.textContent).toBe('Banana');
    await key(document.activeElement!, 'Enter');
    expect(state(wrapper).fruit).toBe('banana');
    expect(trigger.text()).toBe('Banana');
    expect(wrapper.get('input[name="fruit"]').attributes('value')).toBe('banana');
    expect(document.activeElement).toBe(trigger.element);
    content.element.showPopover();
    await flushPromises();
    expect(document.activeElement?.textContent).toBe('Banana');
    await key(document.activeElement!, 'x');
    await key(document.activeElement!, 'Escape');
    expect(shown(content.element)).toBe(false);
    content.element.showPopover();
    await flushPromises();
    const items = wrapper.findAll('[data-slot="select-item"]');
    await items[2].trigger('click');
    await items[2].trigger('pointermove');
    await key(items[0].element, 'a');
    await items[0].trigger('pointermove');
    expect(document.activeElement).toBe(items[0].element);
    await items[0].trigger('click');
    expect(state(wrapper).fruit).toBe('apple');
    content.element.showPopover();
    await flushPromises();
    await key(document.activeElement!, 'Tab');
    expect(shown(content.element)).toBe(false);
  });
});

describe('Combobox', () => {
  it('filters as you type, selects with the keyboard and restores the label', async () => {
    await setup();
    const input = wrapper.get('input[role="combobox"]');
    const content = wrapper.get('[data-slot="combobox-content"]');
    const visible = () =>
      wrapper
        .findAll('[data-slot="combobox-item"]')
        .filter((item) => !(item.element as HTMLElement).hidden)
        .map((item) => item.text());
    await key(input.element, 'x');
    await key(input.element, 'ArrowDown');
    expect(shown(content.element)).toBe(true);
    expect(visible()).toEqual(['vibe.js', 'Next.js', 'Off']);
    await input.setValue('next');
    await flushPromises();
    expect(visible()).toEqual(['Next.js']);
    expect(wrapper.get(`#${input.attributes('aria-activedescendant')}`).text()).toBe('Next.js');
    await key(input.element, 'ArrowDown');
    await key(input.element, 'Enter');
    expect(state(wrapper).framework).toBe('next');
    expect((input.element as HTMLInputElement).value).toBe('Next.js');
    expect(shown(content.element)).toBe(false);
    await input.setValue('zz');
    await flushPromises();
    expect(visible()).toEqual([]);
    await key(input.element, 'Enter');
    await key(input.element, 'Escape');
    expect((input.element as HTMLInputElement).value).toBe('Next.js');
    await wrapper.get('[data-slot="combobox-trigger"]').trigger('click');
    await flushPromises();
    const items = wrapper.findAll('[data-slot="combobox-item"]');
    await items[2].trigger('pointermove');
    await items[2].trigger('click');
    await items[0].trigger('pointermove');
    expect(input.attributes('aria-activedescendant')).toBe(items[0].attributes('id'));
    await items[0].trigger('click');
    expect(state(wrapper).framework).toBe('vibe');
    await wrapper.get('[data-slot="combobox-trigger"]').trigger('click');
    await flushPromises();
    await items[1].trigger('pointerdown');
    expect(shown(content.element)).toBe(true);
    wrapper.get('#outside').element.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true }));
    await flushPromises();
    expect(shown(content.element)).toBe(false);
    await wrapper.get('[data-slot="combobox-clear"]').trigger('click');
    expect(state(wrapper).framework).toBe('');
  });
});

describe('Command', () => {
  it('keeps the page still on mount and scrolls active items only while its input is focused', async () => {
    const scroll = vi.spyOn(Element.prototype, 'scrollIntoView');
    await setup();
    expect(scroll).not.toHaveBeenCalled();
    const input = wrapper.get('[data-slot="command-input"]');
    (input.element as HTMLInputElement).focus();
    await key(input.element, 'ArrowDown');
    expect(scroll).toHaveBeenCalledWith({ block: 'nearest' });
    await input.setValue('nothing');
    await flushPromises();
    expect(input.attributes('aria-activedescendant')).toBeUndefined();
    scroll.mockRestore();
  });

  it('filters by text and keywords, skips disabled items and selects with Enter', async () => {
    await setup();
    const input = wrapper.get('[data-slot="command-input"]');
    const activeText = () => wrapper.get(`#${input.attributes('aria-activedescendant')}`).text();
    expect(activeText()).toBe('Calendar⌘C');
    await key(input.element, 'ArrowDown');
    await key(input.element, 'ArrowDown');
    expect(activeText()).toBe('Settings');
    await key(input.element, 'Home');
    await input.setValue('prefer');
    await flushPromises();
    expect(activeText()).toBe('Settings');
    await key(input.element, 'Enter');
    expect(state(wrapper).commands).toEqual(['Settings']);
    await input.setValue('');
    await flushPromises();
    const items = wrapper.findAll('[data-slot="command-item"]');
    await items[2].trigger('pointermove');
    await items[2].trigger('click');
    await items[0].trigger('pointermove');
    await items[0].trigger('click');
    expect(state(wrapper).commands).toEqual(['Settings', 'Calendar']);
    await input.setValue('nothing');
    await flushPromises();
    expect(input.attributes('aria-activedescendant')).toBeUndefined();
    expect(await key(input.element, 'Enter')).toHaveProperty('defaultPrevented', false);
  });
});

describe('NavigationMenu', () => {
  it('opens on click, hover and ArrowDown and closes on Escape or outside focus', async () => {
    vi.useFakeTimers();
    await setup();
    const trigger = wrapper.get('#nav-one');
    const content = wrapper.get('[data-slot="navigation-menu-content"]');
    await trigger.trigger('click');
    expect(state(wrapper).nav).toBe('one');
    expect(trigger.attributes('aria-expanded')).toBe('true');
    await trigger.trigger('click');
    expect(state(wrapper).nav).toBe('');
    await trigger.trigger('pointerenter');
    await content.trigger('pointerenter');
    expect(state(wrapper).nav).toBe('one');
    await content.trigger('pointerleave');
    await key(content.element, 'Enter');
    await key(content.element, 'Escape');
    expect(state(wrapper).nav).toBe('');
    await key(trigger.element, 'Enter');
    await key(trigger.element, 'ArrowDown');
    expect(document.activeElement?.textContent).toBe('A');
    expect(wrapper.get('[data-slot="navigation-menu-link"]').attributes('aria-current')).toBe(
      'page',
    );
    (wrapper.get('#outside').element as HTMLElement).focus();
    await flushPromises();
    expect(state(wrapper).nav).toBe('');
    vi.useRealTimers();
  });
});
