// Toast notifications: call `toast()` anywhere, render them with one <Toaster /> in the app.
import { ref, type Ref } from '@usevibejs/ui';

export type ToastType = 'default' | 'success' | 'info' | 'warning' | 'error' | 'loading';

export interface ToastAction {
  label: string;
  onClick: (event: MouseEvent) => void;
}

export interface ToastOptions {
  /** Reusing an id replaces that toast, for example to turn a loading toast into a result. */
  id?: string;
  description?: string;
  /** Milliseconds before the toast closes; `Infinity` keeps it. The Toaster sets the default. */
  duration?: number;
  action?: ToastAction;
}

export interface Toast extends ToastOptions {
  id: string;
  type: ToastType;
  title: string;
}

/** The toasts on screen, oldest first. */
export const toasts: Ref<Toast[]> = ref([]);

let count = 0;
function show(type: ToastType, title: string, options: ToastOptions = {}): string {
  const id = options.id ?? `toast-${++count}`;
  const next: Toast = { ...options, id, type, title };
  const exists = toasts.value.some((item) => item.id === id);
  toasts.value = exists
    ? toasts.value.map((item) => (item.id === id ? next : item))
    : [...toasts.value, next];
  return id;
}

type Message<T> = string | ((value: T) => string);
const text = <T>(message: Message<T>, value: T): string =>
  typeof message === 'function' ? message(value) : message;

/** Shows a toast and returns its id. */
export const toast = Object.assign(
  (title: string, options?: ToastOptions): string => show('default', title, options),
  {
    success: (title: string, options?: ToastOptions): string => show('success', title, options),
    info: (title: string, options?: ToastOptions): string => show('info', title, options),
    warning: (title: string, options?: ToastOptions): string => show('warning', title, options),
    error: (title: string, options?: ToastOptions): string => show('error', title, options),
    loading: (title: string, options?: ToastOptions): string => show('loading', title, options),
    /** Closes one toast, or all of them without an id. */
    dismiss(id?: string): void {
      toasts.value = id === undefined ? [] : toasts.value.filter((item) => item.id !== id);
    },
    /** Shows a loading toast that turns into a success or error toast when `promise` settles. */
    promise<T>(
      promise: Promise<T>,
      messages: { loading: string; success: Message<T>; error: Message<unknown> },
      options?: ToastOptions,
    ): string {
      const id = show('loading', messages.loading, options);
      promise.then(
        (value) => show('success', text(messages.success, value), { ...options, id }),
        (error: unknown) => show('error', text(messages.error, error), { ...options, id }),
      );
      return id;
    },
  },
);
