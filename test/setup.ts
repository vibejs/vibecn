import { vi } from 'vitest';

vi.stubGlobal('__DEV__', true);

// jsdom implements neither modal dialogs nor the popover API: these stand-ins follow the events
// the browser fires, which is what the components rely on.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.hasAttribute('open')) return;
    this.removeAttribute('open');
    this.dispatchEvent(new Event('close'));
  };
}
const toggle = (element: HTMLElement, newState: 'open' | 'closed'): void => {
  element.dispatchEvent(Object.assign(new Event('beforetoggle'), { newState }));
  element.toggleAttribute('data-popover-open', newState === 'open');
};
HTMLElement.prototype.showPopover = function showPopover(this: HTMLElement) {
  toggle(this, 'open');
};
HTMLElement.prototype.hidePopover = function hidePopover(this: HTMLElement) {
  toggle(this, 'closed');
};
Element.prototype.setPointerCapture ??= function setPointerCapture() {};
// Tests call `ResizeObserver.resize()` to run every observer's callback.
globalThis.ResizeObserver = class {
  static observers = new Set<{ callback: ResizeObserverCallback }>();
  static resize(): void {
    for (const observer of this.observers) observer.callback([], observer as never);
  }
  callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe(): void {
    (globalThis.ResizeObserver as unknown as { observers: Set<unknown> }).observers.add(this);
  }
  unobserve(): void {}
  disconnect(): void {
    (globalThis.ResizeObserver as unknown as { observers: Set<unknown> }).observers.delete(this);
  }
} as unknown as typeof ResizeObserver;
Element.prototype.scrollIntoView ??= function scrollIntoView() {};
// jsdom hides closed popovers, which makes their items unfocusable; the stand-ins above track
// the open state instead.
document.head.append(
  Object.assign(document.createElement('style'), {
    textContent: '[popover] { display: block !important; }',
  }),
);
