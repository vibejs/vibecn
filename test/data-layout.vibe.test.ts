import { flushPromises, mount } from '@usevibejs/ui/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { addDays, addMonths, dateKey, firstWeekday, parseDate } from '../registry/lib/calendar.ts';
import Calendar from '../site/src/components/ui/Calendar.vibe';
import Chart from '../site/src/components/ui/Chart.vibe';
import DataTable from '../site/src/examples/data-table-demo.vibe';
import DataLayout from './DataLayout.vibe';

const mounted: ReturnType<typeof mount>[] = [];
function render(component: Parameters<typeof mount>[0], options = {}): ReturnType<typeof mount> {
  const wrapper = mount(component, { attachTo: document.body, ...options });
  mounted.push(wrapper);
  return wrapper;
}
const state = (wrapper: ReturnType<typeof mount>): Record<string, unknown> =>
  JSON.parse(wrapper.get('output').text());
async function key(element: Element, name: string, options = {}): Promise<KeyboardEvent> {
  const event = new KeyboardEvent('keydown', {
    key: name,
    bubbles: true,
    cancelable: true,
    ...options,
  });
  element.dispatchEvent(event);
  await flushPromises();
  return event;
}
let mobile = false;
let mediaChange: (() => void) | undefined;
beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      get matches() {
        return mobile;
      },
      addEventListener: (_: string, callback: () => void) => {
        mediaChange = callback;
      },
      removeEventListener: vi.fn<() => void>(),
    })),
  );
});
afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount());
  mobile = false;
  mediaChange = undefined;
  localStorage.clear();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('calendar date arithmetic', () => {
  it('validates real dates, retains early years and clamps month transitions', () => {
    for (const invalid of ['', '2026-2-01', '2026-02-29', '2024-02-30', '2026-13-01'])
      expect(parseDate(invalid)).toBeUndefined();
    expect(dateKey(parseDate('0099-02-03')!)).toBe('0099-02-03');
    expect(dateKey(addDays(parseDate('2024-02-28')!, 1))).toBe('2024-02-29');
    expect(dateKey(addDays(parseDate('2024-03-01')!, -1))).toBe('2024-02-29');
    expect(dateKey(addMonths(parseDate('2024-01-31')!, 1))).toBe('2024-02-29');
    expect(dateKey(addMonths(parseDate('2024-02-29')!, 12))).toBe('2025-02-28');
    expect(dateKey(addMonths(parseDate('2026-10-12')!, -1))).toBe('2026-09-12');
  });
  it('uses Intl week APIs and falls back to the maximized region on older browsers', () => {
    expect(firstWeekday('en-US')).toBe(0);
    expect(firstWeekday('en-GB')).toBe(1);
    const locale = vi.spyOn(Intl, 'Locale');
    locale.mockImplementation(function () {
      return { weekInfo: { firstDay: 6 } };
    } as never);
    expect(firstWeekday('ar')).toBe(6);
    for (const [region, first] of [
      ['US', 0],
      ['GB', 1],
      ['AF', 6],
      ['MV', 5],
      [undefined, 1],
    ] as const) {
      locale.mockImplementation(function () {
        return { maximize: () => ({ region }) };
      } as never);
      expect(firstWeekday('en')).toBe(first);
    }
  });
});

describe('Calendar', () => {
  it('selects and clears local dates and forwards attributes and classes', async () => {
    const wrapper = render(Calendar, {
      props: { month: '2026-10', modelValue: '2026-10-24', class: 'custom', id: 'dates' },
    });
    expect(wrapper.get('#dates').classes()).toContain('custom');
    expect(wrapper.get('[data-date="2026-10-24"]').attributes('tabindex')).toBe('0');
    await wrapper.get('[data-date="2026-10-25"]').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['2026-10-25']);
    await wrapper.setProps({ modelValue: '2026-10-25' });
    await wrapper.get('[data-date="2026-10-25"]').trigger('click');
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null]);
    expect(wrapper.findAll('[data-date][tabindex="0"]')).toHaveLength(1);
  });
  it('moves focus by day, week, month and year across leap boundaries', async () => {
    const wrapper = render(Calendar, { props: { modelValue: '2024-01-31', locale: 'en-GB' } });
    let active = wrapper.get('[data-date="2024-01-31"]').element as HTMLElement;
    active.focus();
    await key(active, 'PageDown');
    expect((document.activeElement as HTMLElement).dataset.date).toBe('2024-02-29');
    await key(document.activeElement!, 'PageDown', { shiftKey: true });
    expect((document.activeElement as HTMLElement).dataset.date).toBe('2025-02-28');
    await key(document.activeElement!, 'PageUp');
    expect((document.activeElement as HTMLElement).dataset.date).toBe('2025-01-28');
    await key(document.activeElement!, 'Home');
    expect((document.activeElement as HTMLElement).dataset.date).toBe('2025-01-27');
    await key(document.activeElement!, 'End');
    expect((document.activeElement as HTMLElement).dataset.date).toBe('2025-02-02');
    for (const [name, expected] of [
      ['ArrowLeft', '2025-02-01'],
      ['ArrowRight', '2025-02-02'],
      ['ArrowUp', '2025-01-26'],
      ['ArrowDown', '2025-02-02'],
    ]) {
      await key(document.activeElement!, name);
      expect((document.activeElement as HTMLElement).dataset.date).toBe(expected);
    }
    expect((await key(document.activeElement!, 'Tab')).defaultPrevented).toBe(false);
    expect(wrapper.get('th').text()).toBe('Mon');
    expect(wrapper.get('th').attributes('abbr')).toBe('Monday');
  });
  it('enforces bounds and disabled dates while keeping them keyboard discoverable', async () => {
    const wrapper = render(Calendar, {
      props: { month: '2026-10', min: '2026-10-05', max: '2026-10-28', disabled: ['2026-10-12'] },
    });
    expect(wrapper.get('[aria-label="Previous month"]').element.disabled).toBe(true);
    expect(wrapper.get('[aria-label="Next month"]').element.disabled).toBe(true);
    await wrapper.get('[data-date="2026-10-12"]').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    expect(wrapper.get('[data-date="2026-10-12"]').attributes('aria-disabled')).toBe('true');
    await key(wrapper.get('[data-date="2026-10-05"]').element, 'ArrowLeft');
    expect((document.activeElement as HTMLElement).dataset.date).toBe('2026-10-05');
    await key(wrapper.get('[data-date="2026-10-28"]').element, 'ArrowRight');
    expect((document.activeElement as HTMLElement).dataset.date).toBe('2026-10-28');
    await wrapper.setProps({ disabled: true, showOutsideDays: false, weekStartsOn: 0 });
    expect(wrapper.find('[data-date="2026-09-30"]').exists()).toBe(false);
    await wrapper.get('[data-date="2026-10-15"]').trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
    await wrapper.setProps({ disabled: (date: string) => date.endsWith('15') });
    expect(wrapper.get('[data-date="2026-10-15"]').attributes('aria-disabled')).toBe('true');
  });
  it('adds and removes multiple dates and builds ordered ranges without disabled interiors', async () => {
    const wrapper = render(Calendar, {
      props: { month: '2026-10', mode: 'multiple', values: ['2026-10-15'] },
    });
    await wrapper.get('[data-date="2026-10-12"]').trigger('click');
    expect(wrapper.emitted('update:values')?.at(-1)).toEqual([['2026-10-12', '2026-10-15']]);
    await wrapper.setProps({ values: ['2026-10-12', '2026-10-15'] });
    await wrapper.get('[data-date="2026-10-15"]').trigger('click');
    expect(wrapper.emitted('update:values')?.at(-1)).toEqual([['2026-10-12']]);
    await wrapper.setProps({ mode: 'range', range: {} });
    await wrapper.get('[data-date="2026-10-15"]').trigger('click');
    expect(wrapper.emitted('update:range')?.at(-1)).toEqual([{ from: '2026-10-15' }]);
    await wrapper.setProps({ range: { from: '2026-10-15' } });
    await wrapper.get('[data-date="2026-10-12"]').trigger('click');
    expect(wrapper.emitted('update:range')?.at(-1)).toEqual([
      { from: '2026-10-12', to: '2026-10-15' },
    ]);
    await wrapper.setProps({ range: { from: '2026-10-12', to: '2026-10-15' } });
    expect(wrapper.get('[data-date="2026-10-13"]').attributes('data-range-middle')).toBe('true');
    await wrapper.get('[data-date="2026-10-20"]').trigger('click');
    expect(wrapper.emitted('update:range')?.at(-1)).toEqual([{ from: '2026-10-20' }]);
    await wrapper.setProps({ range: { from: '2026-10-12' }, disabled: ['2026-10-14'] });
    await wrapper.get('[data-date="2026-10-16"]').trigger('click');
    expect(wrapper.emitted('update:range')?.at(-1)).toEqual([{ from: '2026-10-16' }]);
  });
  it('navigates with month controls and initializes its month from the selection', async () => {
    const wrapper = render(Calendar, { props: { modelValue: '2024-02-29' } });
    expect(wrapper.get('[aria-live="polite"]').text()).toBe('February 2024');
    await wrapper.get('[aria-label="Next month"]').trigger('click');
    expect(wrapper.get('[aria-live="polite"]').text()).toBe('March 2024');
    await wrapper.get('[aria-label="Previous month"]').trigger('click');
    expect(wrapper.get('[aria-live="polite"]').text()).toBe('February 2024');
  });
});

describe('Carousel', () => {
  it('labels slides, clamps controls and synchronizes external models and mutations', async () => {
    const scroll = vi.spyOn(Element.prototype, 'scrollIntoView');
    const wrapper = render(DataLayout);
    await flushPromises();
    expect(wrapper.get('[aria-roledescription="carousel"]').attributes('aria-label')).toBe(
      'Test slides',
    );
    expect(
      wrapper
        .findAll('[aria-roledescription="slide"]')
        .map((item) => item.attributes('aria-label')),
    ).toEqual(['1 of 3', '2 of 3', '3 of 3']);
    expect(wrapper.get('[data-slot="carousel-previous"]').element.disabled).toBe(true);
    await wrapper.get('[data-slot="carousel-next"]').trigger('click');
    expect(state(wrapper).index).toBe(1);
    expect(state(wrapper).clicks).toBe(1);
    expect(scroll).toHaveBeenCalled();
    await wrapper.get('#external-index').trigger('click');
    expect(state(wrapper).index).toBe(2);
    expect(wrapper.get('[data-slot="carousel-next"]').element.disabled).toBe(true);
    await wrapper.get('[data-slot="carousel-previous"]').trigger('click');
    expect(state(wrapper).index).toBe(1);
    await wrapper.get('#add').trigger('click');
    await flushPromises();
    expect(wrapper.findAll('[aria-roledescription="slide"]')[3].attributes('aria-label')).toBe(
      '4 of 4',
    );
    await wrapper.get('#remove').trigger('click');
    await flushPromises();
    expect(state(wrapper).index).toBe(0);
    expect(wrapper.get('[data-slot="carousel"]').text()).toContain('No slides');
  });
  it('uses orientation keys, preserves editable controls and permits canceled clicks', async () => {
    const wrapper = render(DataLayout);
    await flushPromises();
    const content = wrapper.get('[data-slot="carousel-content"]').element;
    await key(content, 'ArrowRight');
    expect(state(wrapper).index).toBe(1);
    await key(wrapper.get('[aria-label="Slide input"]').element, 'ArrowRight');
    expect(state(wrapper).index).toBe(1);
    await wrapper.setProps({ orientation: 'vertical' });
    await key(content, 'ArrowDown');
    expect(state(wrapper).index).toBe(2);
    await key(content, 'ArrowUp');
    expect(state(wrapper).index).toBe(1);
    expect((await key(content, 'ArrowRight')).defaultPrevented).toBe(false);
    await wrapper.setProps({ cancel: true });
    await wrapper.get('[data-slot="carousel-next"]').trigger('click');
    expect(state(wrapper).index).toBe(1);
  });
  it('reads the nearest visible slide after pointer scrolling without starting another scroll', async () => {
    const wrapper = render(DataLayout);
    await flushPromises();
    const items = wrapper.findAll('[data-slot="carousel-item"]');
    items.forEach((item, index) =>
      vi
        .spyOn(item.element, 'getBoundingClientRect')
        .mockReturnValue({ left: (index - 1) * 300, top: (index - 1) * 300 } as DOMRect),
    );
    const scroll = vi.spyOn(Element.prototype, 'scrollIntoView');
    scroll.mockClear();
    await wrapper.get('[data-slot="carousel-content"]').trigger('scroll');
    expect(state(wrapper).index).toBe(1);
    expect(scroll).not.toHaveBeenCalled();
  });
});

describe('Carousel scroll boundaries', () => {
  it('disables navigation at the measured boundary when several slides fit', async () => {
    const wrapper = render(DataLayout);
    await flushPromises();
    const content = wrapper.get('[data-slot="carousel-content"]');
    Object.defineProperties(content.element, {
      clientWidth: { value: 600 },
      scrollWidth: { value: 900 },
      scrollLeft: { value: 300 },
    });
    wrapper
      .findAll('[data-slot="carousel-item"]')
      .forEach((item, index) =>
        vi
          .spyOn(item.element, 'getBoundingClientRect')
          .mockReturnValue({ left: (index - 1) * 300 } as DOMRect),
      );
    await content.trigger('scroll');
    expect(state(wrapper).index).toBe(1);
    expect(wrapper.get('[data-slot="carousel-next"]').element.disabled).toBe(true);
    expect(wrapper.get('[data-slot="carousel-previous"]').element.disabled).toBe(false);
    await key(content.element, 'ArrowRight');
    expect(state(wrapper).index).toBe(1);
  });
});

describe('Chart', () => {
  it('renders all chart types, preserves negative values and provides accessible data', async () => {
    const wrapper = render(Chart, {
      props: {
        label: 'Revenue',
        description: 'Quarterly revenue',
        data: [
          { label: 'Q1', value: -10 },
          { label: 'Q2', value: 30 },
          { label: 'Q3', value: 0 },
        ],
      },
    });
    expect(wrapper.findAll('rect')).toHaveLength(3);
    expect(wrapper.get('svg').attributes('aria-labelledby')).toBe(
      wrapper.get('figcaption').attributes('id'),
    );
    expect(wrapper.findAll('tbody td').map((cell) => cell.text())).toEqual(['-10', '30', '0']);
    for (const type of ['line', 'area', 'pie']) {
      await wrapper.setProps({ type });
      expect(wrapper.get('svg').element.outerHTML).not.toMatch(/NaN|Infinity/);
      expect(wrapper.find('polyline').exists()).toBe(type !== 'pie');
    }
    expect(wrapper.find('circle').exists()).toBe(true); // One positive pie entry fills the circle.
    await wrapper.setProps({
      data: [
        { label: 'A', value: 1 },
        { label: 'B', value: 2 },
      ],
    });
    expect(wrapper.findAll('path')).toHaveLength(2);
    await wrapper.setProps({
      data: [
        { label: 'A', value: NaN },
        { label: 'B', value: -1 },
      ],
    });
    expect(wrapper.text()).toContain('No data');
    await wrapper.setProps({ data: [], type: 'area' });
    expect(wrapper.text()).toContain('No data');
    expect(wrapper.get('svg').element.outerHTML).not.toMatch(/NaN|Infinity/);
  });
});

describe('Sidebar', () => {
  it('toggles desktop state, preserves action listeners and restores persisted state', async () => {
    localStorage.setItem('test-sidebar', 'false');
    const wrapper = render(DataLayout, {
      props: { storageKey: 'test-sidebar', side: 'right', variant: 'floating' },
    });
    await flushPromises();
    expect(state(wrapper).open).toBe(false);
    expect(wrapper.get('[data-slot="sidebar"]').attributes()).toMatchObject({
      'data-collapsible': 'icon',
      'data-side': 'right',
      'data-variant': 'floating',
    });
    const trigger = wrapper.get('[data-slot="sidebar-trigger"]');
    expect(wrapper.get(`#${trigger.attributes('aria-controls')}`).element.tagName).toBe('ASIDE');
    await trigger.trigger('click');
    expect(state(wrapper)).toMatchObject({ open: true, clicks: 1 });
    expect(localStorage.getItem('test-sidebar')).toBe('true');
    await wrapper.get('[data-slot="sidebar-rail"]').trigger('click');
    expect(state(wrapper).open).toBe(false);
    await key(trigger.element, 'b', { metaKey: true });
    expect(state(wrapper).open).toBe(true);
    await key(wrapper.get('[aria-label="Editor"]').element, 'b', { ctrlKey: true });
    expect(state(wrapper).open).toBe(true);
    await wrapper.setProps({ cancel: true });
    await trigger.trigger('click');
    expect(state(wrapper).open).toBe(true);
    expect(wrapper.get('[data-slot="sidebar-menu-link"]').attributes('aria-current')).toBe('page');
  });
  it('makes closed offcanvas content inert and keeps permanent sidebars visible', async () => {
    const wrapper = render(DataLayout, { props: { collapsible: 'offcanvas' } });
    await flushPromises();
    await wrapper.get('[data-slot="sidebar-trigger"]').trigger('click');
    expect(wrapper.get('aside').attributes('inert')).toBeDefined();
    await wrapper.setProps({ collapsible: 'none' });
    expect(wrapper.get('aside').attributes('inert')).toBeUndefined();
    expect(wrapper.get('[data-slot="sidebar"]').element.tagName).toBe('ASIDE');
  });
  it('opens a mobile Sheet, keeps desktop state independent and closes at breakpoints', async () => {
    mobile = true;
    const wrapper = render(DataLayout);
    await flushPromises();
    await wrapper.get('[data-slot="sidebar-trigger"]').trigger('click');
    const dialog = wrapper.get('dialog');
    expect(dialog.attributes('open')).toBeDefined();
    expect(state(wrapper)).toMatchObject({ open: true, openMobile: true });
    await wrapper.get('[data-slot="sheet-close-button"]').trigger('click');
    expect(state(wrapper).openMobile).toBe(false);
    await key(wrapper.get('[data-slot="sidebar-trigger"]').element, 'b', { ctrlKey: true });
    expect(state(wrapper).openMobile).toBe(true);
    mobile = false;
    mediaChange?.();
    await flushPromises();
    expect(state(wrapper)).toMatchObject({ open: true, openMobile: false });
    expect(wrapper.find('dialog').exists()).toBe(false);
  });
  it('works when persistent storage is unavailable', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Unavailable');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Unavailable');
    });
    const wrapper = render(DataLayout, { props: { storageKey: 'blocked' } });
    await flushPromises();
    await wrapper.get('[data-slot="sidebar-trigger"]').trigger('click');
    expect(state(wrapper).open).toBe(false);
  });
});

describe('VibeTable payments dashboard', () => {
  it('filters, sorts, paginates, selects across pages and hides columns', async () => {
    const wrapper = render(DataTable);
    expect(wrapper.findAll('tbody tr')).toHaveLength(5);
    const checks = wrapper.findAll('input[type="checkbox"]');
    await checks[1].setValue(true);
    expect(checks[0].element.indeterminate).toBe(true);
    await checks[0].setValue(true);
    expect(wrapper.text()).toContain('5 selected');
    await wrapper.get('[aria-label="Next page"]').trigger('click');
    expect(wrapper.text()).toContain('natali.craig@example.com');
    expect(wrapper.text()).toContain('5 selected');
    const sort = wrapper
      .findAll('[data-slot="dropdown-menu-item"]')
      .find((item) => item.text() === 'Sort descending')!;
    await sort.trigger('click');
    expect(wrapper.get('[aria-sort]').attributes('aria-sort')).toBe('descending');
    await wrapper.get('input[type="search"]').setValue('olivia');
    expect(wrapper.findAll('tbody tr')).toHaveLength(3);
    expect(wrapper.text()).toContain('olivia.rhye@example.com');
    const hideAmount = wrapper
      .findAll('[data-slot="dropdown-menu-checkbox-item"]')
      .find((item) => item.text() === 'Amount')!;
    await hideAmount.trigger('click');
    expect(wrapper.findAll('thead th')).toHaveLength(6);
    await wrapper.get('input[type="search"]').setValue('missing');
    expect(wrapper.text()).toContain('No results');
    expect(wrapper.get('[aria-label="Select all payments on this page"]').element.disabled).toBe(
      true,
    );
  });
});
