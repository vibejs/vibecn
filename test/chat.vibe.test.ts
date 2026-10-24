import { flushPromises, mount } from '@usevibejs/ui/testing';
import { describe, expect, it, vi } from 'vitest';
import Chat from './Chat.vibe';

// jsdom does not lay out; the viewport's scroll metrics are set by hand.
function metrics(element: HTMLElement, height: number, scrollHeight: number): void {
  Object.defineProperty(element, 'clientHeight', { value: height, configurable: true });
  Object.defineProperty(element, 'scrollHeight', { value: scrollHeight, configurable: true });
}

describe('chat components', () => {
  it('marks busy attachments and aligns messages', async () => {
    const wrapper = mount(Chat);
    expect(wrapper.get('[data-slot="attachment"]').attributes()).toMatchObject({
      'data-state': 'uploading',
      'aria-busy': 'true',
    });
    await wrapper.get('[data-slot="attachment-action"]').trigger('click');
    expect(wrapper.get('output').text()).toBe('1');
    expect(wrapper.get('[data-slot="message"]').attributes('data-align')).toBe('end');
    expect(wrapper.get('[data-slot="bubble"]').attributes()).toMatchObject({
      'data-variant': 'tinted',
      'data-align': 'end',
    });
  });

  it('starts at the end, follows growing content and shows buttons away from the edges', async () => {
    const wrapper = mount(Chat);
    const viewport = wrapper.get('[data-slot="message-scroller-viewport"]').element as HTMLElement;
    const end = wrapper.get('.end');
    const start = wrapper.get('.start');
    viewport.scrollTo = vi.fn<(options?: ScrollToOptions | number, y?: number) => void>();
    metrics(viewport, 100, 300);
    viewport.scrollTop = 200;
    await wrapper.get('[data-slot="message-scroller-viewport"]').trigger('scroll');
    expect(end.attributes('data-active')).toBe('false');
    expect(start.attributes()).toMatchObject({ 'data-active': 'true' });
    expect(end.attributes('tabindex')).toBe('-1');
    // Content grows while the reader is at the end: the view follows.
    metrics(viewport, 100, 400);
    ResizeObserver.resize();
    await flushPromises();
    expect(viewport.scrollTop).toBe(400);
    // The reader scrolls up: growing content leaves the view alone.
    viewport.scrollTop = 0;
    await wrapper.get('[data-slot="message-scroller-viewport"]').trigger('scroll');
    expect(end.attributes('data-active')).toBe('true');
    metrics(viewport, 100, 500);
    ResizeObserver.resize();
    expect(viewport.scrollTop).toBe(0);
    await end.trigger('click');
    expect(viewport.scrollTo).toHaveBeenCalledWith({ top: 500, behavior: 'smooth' });
    await start.trigger('click');
    expect(viewport.scrollTo).toHaveBeenLastCalledWith({ top: 0, behavior: 'smooth' });
    wrapper.unmount();
  });

  it('scrolls an anchored item to the top when it appears', async () => {
    const wrapper = mount(Chat, { props: { items: ['one'] } });
    const viewport = wrapper.get('[data-slot="message-scroller-viewport"]').element as HTMLElement;
    const scrollTo = vi.fn<(options?: ScrollToOptions | number, y?: number) => void>();
    viewport.scrollTo = scrollTo;
    await wrapper.setProps({ items: ['one', 'anchor two'] });
    await flushPromises();
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });
});
