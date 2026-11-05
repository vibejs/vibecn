import { nextTick } from '@usevibejs/ui';
import { componentRenderer } from '@usevibejs/table';
import { flushPromises, mount } from '@usevibejs/ui/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AmountCell from './AmountCell.vibe';
import LanguageHost from './LanguageHost.vibe';
import DataTable from '../site/src/components/ui/DataTable.vibe';
import Dropzone from '../site/src/components/ui/Dropzone.vibe';
import LoginForm from '../site/src/components/ui/LoginForm.vibe';

const mounted: ReturnType<typeof mount>[] = [];
function render(component: Parameters<typeof mount>[0], props = {}): ReturnType<typeof mount> {
  const wrapper = mount(component, { props });
  mounted.push(wrapper);
  return wrapper;
}
afterEach(() => {
  mounted.splice(0).forEach((wrapper) => wrapper.unmount());
});

const rows = [
  { id: 'c', email: 'casey@example.com', amount: 30 },
  { id: 'a', email: 'ada@example.com', amount: 10 },
  { id: 'b', email: 'blair@example.com', amount: 20 },
  { id: 'd', email: 'drew@example.com', amount: 40 },
];
const columns = [
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'amount', header: 'Amount', enableSorting: false },
];
const emails = (wrapper: ReturnType<typeof mount>): string[] =>
  wrapper
    .findAll('tbody tr')
    .map((row) => row.text().match(/[a-z]+@[a-z.]+/i)?.[0])
    .filter((email): email is string => !!email);

describe('Data Table', () => {
  it('pages the rows, sorts a column and replaces the data', async () => {
    const wrapper = render(DataTable, {
      caption: 'Invoices',
      pageSize: 2,
      data: rows,
      columns,
      class: 'max-w-lg',
    });
    expect(wrapper.html()).toContain('max-w-lg');
    expect(wrapper.text()).toContain('Invoices');
    expect(wrapper.text()).toContain('Page 1 of 2');
    expect(emails(wrapper)).toEqual(['casey@example.com', 'ada@example.com']);
    const amount = wrapper.findAll('th').find((cell) => cell.text().includes('Amount'))!;
    expect(amount.find('button').exists()).toBe(false);
    expect(amount.attributes('aria-sort')).toBeUndefined();
    expect(wrapper.get('[aria-label="Previous page"]').element.disabled).toBe(true);
    await wrapper.get('[aria-label="Next page"]').trigger('click');
    await flushPromises();
    expect(emails(wrapper)).toEqual(['blair@example.com', 'drew@example.com']);
    expect(wrapper.text()).toContain('Page 2 of 2');
    expect(wrapper.get('[aria-label="Next page"]').element.disabled).toBe(true);
    await wrapper.get('[aria-label="Previous page"]').trigger('click');
    await flushPromises();
    const email = () => wrapper.findAll('th').find((cell) => cell.text().includes('Email'))!;
    expect(email().attributes('aria-sort')).toBe('none');
    await email().get('button').trigger('click');
    await flushPromises();
    const direction = email().attributes('aria-sort');
    expect(direction === 'ascending' || direction === 'descending').toBe(true);
    expect(emails(wrapper)).toEqual(
      direction === 'ascending'
        ? ['ada@example.com', 'blair@example.com']
        : ['drew@example.com', 'casey@example.com'],
    );
    expect(wrapper.text()).toContain('Page 1 of 2');
    await email().get('button').trigger('click');
    await flushPromises();
    expect(email().attributes('aria-sort')).not.toBe(direction);
    await wrapper.setProps({ data: [{ id: 'z', email: 'zoe@example.com', amount: 1 }] });
    await flushPromises();
    expect(emails(wrapper)).toEqual(['zoe@example.com']);
    await wrapper.setProps({ data: [] });
    await flushPromises();
    expect(wrapper.text()).toContain('No results.');
  });
  it('renders a component cell from componentRenderer', () => {
    const wrapper = render(DataTable, {
      data: [{ id: 'a', amount: 12 }],
      columns: [
        {
          accessorKey: 'amount',
          header: 'Amount',
          cell: componentRenderer(AmountCell),
          enableSorting: false,
        },
      ],
      pageSize: 10,
    });
    expect(wrapper.get('[data-amount]').text()).toBe('12');
  });
});

describe('Login form', () => {
  async function fill(wrapper: ReturnType<typeof mount>, email: string, password: string) {
    await wrapper.get('input[type="email"]').setValue(email);
    await wrapper.get('input[type="password"]').setValue(password);
  }
  it('shows field errors, then submits and reports a pending request', async () => {
    let release: () => void = () => {};
    const submit = vi.fn<(value: { email: string; password: string }) => Promise<void>>(
      () =>
        new Promise<void>((resolve) => {
          release = resolve;
        }),
    );
    const wrapper = render(LoginForm, { submit, class: 'max-w-sm' });
    expect(wrapper.html()).toContain('max-w-sm');
    await wrapper.get('button').trigger('click');
    await flushPromises();
    expect(wrapper.text()).toContain('Enter an email address.');
    expect(wrapper.text()).toContain('Enter a password.');
    expect(submit).not.toHaveBeenCalled();
    await wrapper.get('input[type="email"]').setValue('ada');
    await wrapper.get('input[type="email"]').trigger('blur');
    await flushPromises();
    expect(wrapper.get('input[type="email"]').attributes('aria-invalid')).toBe('true');
    await fill(wrapper, 'ada@example.com', 'secret');
    wrapper.get('button').element.click();
    await vi.waitUntil(() => submit.mock.calls.length === 1);
    expect(wrapper.get('button').text()).toBe('Signing in…');
    expect(wrapper.get('button').element.disabled).toBe(true);
    expect(wrapper.get('form').attributes('aria-busy')).toBe('true');
    release();
    await vi.waitUntil(() => wrapper.get('button').text() === 'Sign in');
    expect(submit).toHaveBeenCalledWith({ email: 'ada@example.com', password: 'secret' });
    expect(wrapper.get('button').element.disabled).toBe(false);
  });
  it('shows the auth callback error and uses a later submit prop', async () => {
    const first = vi.fn<(value: { email: string; password: string }) => Promise<void>>(() =>
      Promise.reject(new Error('Those credentials were not accepted.')),
    );
    const wrapper = render(LoginForm, { submit: first });
    await fill(wrapper, 'ada@example.com', 'secret');
    await wrapper.get('button').trigger('click');
    await flushPromises();
    expect(wrapper.get('[role="alert"]').text()).toBe('Those credentials were not accepted.');
    const second = vi.fn<(value: { email: string; password: string }) => Promise<void>>(
      async () => {
        throw 'offline';
      },
    );
    await wrapper.setProps({ submit: second });
    await wrapper.get('button').trigger('click');
    await flushPromises();
    expect(wrapper.text()).toContain('Sign in failed.');
    expect(second).toHaveBeenCalledOnce();
    await wrapper.get('input[type="password"]').setValue('next');
    await flushPromises();
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });
});

describe('Dropzone', () => {
  const file = (name: string, type: string, contents: string): File =>
    new File([contents], name, { type });
  async function choose(wrapper: ReturnType<typeof mount>, files: File[]): Promise<void> {
    const input = wrapper.get('input[type="file"]').element as HTMLInputElement;
    Object.defineProperty(input, 'files', { configurable: true, value: files });
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await flushPromises();
  }
  it('rejects count, size and type, then builds FormData and calls upload', async () => {
    let release: () => void = () => {};
    const upload = vi.fn<(files: File[]) => Promise<void>>(
      () =>
        new Promise<void>((resolve) => {
          release = resolve;
        }),
    );
    const wrapper = render(Dropzone, {
      class: 'max-w-md',
      maxBytes: 4,
      maxFiles: 2,
      types: ['text/plain', '.txt'],
      upload,
      name: 'files',
      label: 'Upload notes',
    });
    expect(wrapper.html()).toContain('max-w-md');
    expect(wrapper.text()).toContain('Up to 2 files.');
    expect(wrapper.text()).toContain('Accepted: text/plain, .txt.');
    const input = wrapper.get('input[type="file"]');
    expect(input.attributes('multiple')).toBe('');
    expect(input.attributes('accept')).toBe('text/plain,.txt');
    await choose(wrapper, [
      file('a.txt', 'text/plain', 'a'),
      file('b.txt', 'text/plain', 'b'),
      file('c.txt', 'text/plain', 'c'),
    ]);
    expect(wrapper.text()).toContain('Choose at most 2 files.');
    expect(upload).not.toHaveBeenCalled();
    await choose(wrapper, [file('big.txt', 'text/plain', 'hello')]);
    expect(wrapper.text()).toContain('big.txt is larger than 4 bytes.');
    await choose(wrapper, [file('photo.gif', 'image/gif', 'x')]);
    expect(wrapper.text()).toContain('photo.gif is not an accepted type.');
    expect(wrapper.emitted('update:formData')).toBeUndefined();
    const note = file('Note.TXT', 'text/plain', 'hey');
    const image = file('also.txt', 'text/plain', 'yo');
    Object.defineProperty(input.element, 'files', { configurable: true, value: [note, image] });
    input.element.dispatchEvent(new Event('change', { bubbles: true }));
    await nextTick();
    expect(wrapper.text()).toContain('Uploading…');
    expect(wrapper.get('[data-slot="dropzone"]').attributes('aria-disabled')).toBe('true');
    release();
    await flushPromises();
    expect(upload).toHaveBeenCalledWith([note, image]);
    const body = wrapper.emitted('update:formData')?.at(-1)?.[0] as FormData;
    expect(body.getAll('files')).toEqual([note, image]);
    expect(wrapper.text()).toContain('2 files ready.');
    expect((input.element as HTMLInputElement).value).toBe('');
    await choose(wrapper, [file('equal.txt', 'text/plain', 'four')]);
    expect(upload).toHaveBeenCalledTimes(2);
  });
  it('builds FormData without upload, accepts a drop, and ignores a disabled control', async () => {
    const wrapper = render(Dropzone, { maxFiles: 1, types: ['.txt'] });
    expect(wrapper.get('input').attributes('multiple')).toBeUndefined();
    const note = file('note.txt', '', 'hi');
    const zone = wrapper.get('[data-slot="dropzone"]').element;
    zone.dispatchEvent(new Event('dragenter', { bubbles: true, cancelable: true }));
    await nextTick();
    expect(zone.getAttribute('data-drag')).toBe('true');
    const dropped = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(dropped, 'dataTransfer', { value: { files: [note] } });
    zone.dispatchEvent(dropped);
    await flushPromises();
    expect(zone.getAttribute('data-drag')).toBeNull();
    expect(wrapper.text()).toContain('1 file ready.');
    const body = wrapper.emitted('update:formData')?.at(-1)?.[0] as FormData;
    expect((body.get('files') as File).name).toBe('note.txt');
    await wrapper.setProps({ disabled: true });
    const again = new Event('drop', { bubbles: true, cancelable: true });
    Object.defineProperty(again, 'dataTransfer', {
      value: { files: [file('other.txt', 'text/plain', 'x')] },
    });
    zone.dispatchEvent(again);
    await flushPromises();
    expect(wrapper.emitted('update:formData')?.at(-1)?.[0]).toBe(body);
    await wrapper.setProps({ disabled: false, types: ['image/*'], maxFiles: 2 });
    await choose(wrapper, [file('icon.png', 'image/png', 'x')]);
    expect(wrapper.text()).toContain('1 file ready.');
    await choose(wrapper, [file('plain.txt', 'text/plain', 'x')]);
    expect(wrapper.text()).toContain('plain.txt is not an accepted type.');
  });
  it('reports an upload failure and ignores a second selection while one is pending', async () => {
    let release: (error?: Error) => void = () => {};
    const upload = vi.fn<(files: File[]) => Promise<void>>(
      () =>
        new Promise<void>((_resolve, reject) => {
          release = reject;
        }),
    );
    const wrapper = render(Dropzone, { upload, maxBytes: 10 });
    const input = wrapper.get('input[type="file"]').element as HTMLInputElement;
    const first = file('a.txt', 'text/plain', 'a');
    Object.defineProperty(input, 'files', { configurable: true, value: [first] });
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await nextTick();
    Object.defineProperty(input, 'files', {
      configurable: true,
      value: [file('b.txt', 'text/plain', 'b')],
    });
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await flushPromises();
    expect(upload).toHaveBeenCalledTimes(1);
    release(new Error('Storage unavailable.'));
    await flushPromises();
    expect(wrapper.text()).toContain('Storage unavailable.');
    expect(wrapper.text()).not.toContain('Uploading…');
  });
});

describe('Language switcher', () => {
  async function key(element: Element, name: string): Promise<void> {
    element.dispatchEvent(
      new KeyboardEvent('keydown', { key: name, bubbles: true, cancelable: true }),
    );
    await flushPromises();
  }
  function option(wrapper: ReturnType<typeof mount>, label: string) {
    const item = wrapper
      .findAll('[data-slot="combobox-item"]')
      .find((node) => node.text().includes(label));
    expect(item).toBeDefined();
    return item!;
  }
  async function open(wrapper: ReturnType<typeof mount>): Promise<void> {
    await key(wrapper.get('input[role="combobox"]').element, 'ArrowDown');
  }
  it('switches locale, ignores the current one, and merges classes', async () => {
    const change = vi.fn<(locale: string) => Promise<void>>(async () => {});
    const wrapper = render(LanguageHost, { change });
    expect(wrapper.html()).toContain('max-w-full');
    expect(wrapper.get('output').text()).toBe('en');
    await open(wrapper);
    option(wrapper, 'English').element.click();
    await flushPromises();
    expect(change).not.toHaveBeenCalled();
    await open(wrapper);
    option(wrapper, 'Türkçe').element.click();
    await flushPromises();
    expect(change).toHaveBeenCalledWith('tr');
    expect(wrapper.get('output').text()).toBe('tr');
  });
  it('shows a pending change, keeps the newer request, and retries a failure', async () => {
    let first: () => void = () => {};
    let second: () => void = () => {};
    let calls = 0;
    const change = vi.fn<(locale: string) => Promise<void>>(
      () =>
        new Promise<void>((resolve) => {
          calls += 1;
          if (calls === 1) first = resolve;
          else second = resolve;
        }),
    );
    const wrapper = render(LanguageHost, { change });
    await open(wrapper);
    option(wrapper, 'Türkçe').element.click();
    await nextTick();
    expect(wrapper.text()).toContain('Switching language');
    expect(wrapper.get('[data-slot="language-switcher"]').attributes('aria-busy')).toBe('true');
    await open(wrapper);
    option(wrapper, 'Deutsch').element.click();
    await nextTick();
    first();
    await flushPromises();
    expect(wrapper.get('output').text()).toBe('tr');
    expect(wrapper.text()).toContain('Switching language');
    second();
    await flushPromises();
    expect(wrapper.get('output').text()).toBe('de');
    expect(wrapper.text()).not.toContain('Switching language');
    const failing = vi.fn<(locale: string) => Promise<void>>(() =>
      Promise.reject(new Error('offline')),
    );
    await wrapper.setProps({ change: failing });
    await open(wrapper);
    option(wrapper, 'Türkçe').element.click();
    await flushPromises();
    expect(wrapper.get('output').text()).toBe('de');
    expect(wrapper.get('[role="alert"]').text()).toContain('Try again');
    failing.mockImplementation(async () => {});
    await wrapper.get('[role="alert"] button').trigger('click');
    await flushPromises();
    expect(wrapper.get('output').text()).toBe('tr');
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
  });
  it('ignores a response that settles after unmount and uses setLocale by default', async () => {
    let release: () => void = () => {};
    const wrapper = render(LanguageHost, {
      change: () =>
        new Promise<void>((resolve) => {
          release = resolve;
        }),
    });
    await open(wrapper);
    option(wrapper, 'Türkçe').element.click();
    await nextTick();
    wrapper.unmount();
    release();
    await flushPromises();
    const local = render(LanguageHost);
    await open(local);
    option(local, 'Türkçe').element.click();
    await flushPromises();
    expect(local.get('output').text()).toBe('tr');
  });
});
