import { chromium, type Browser, type Page } from 'playwright';
import { preview, type PreviewServer } from 'vite';
import { afterAll, beforeAll, expect, it } from 'vitest';
import { isComponent, registry } from '../src/registry.ts';

let server: PreviewServer;
let browser: Browser;
let page: Page;
let origin: string;
const errors: string[] = [];
let primary = '';

beforeAll(async () => {
  server = await preview({ root: 'site', preview: { host: '127.0.0.1', port: 0 } });
  origin = server.resolvedUrls!.local[0].replace(/\/$/, '');
  browser = await chromium.launch({ headless: true });
  page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
});
afterAll(async () => {
  await browser?.close();
  await new Promise<void>((done) => server?.httpServer.close(() => done()));
});

it('renders the home page with a neutral theme and a copyable install command', async () => {
  await page.goto(origin);
  await page
    .getByRole('heading', { level: 1, name: 'The foundation for your vibe.js interface' })
    .waitFor();
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  expect(await page.evaluate(() => getComputedStyle(document.body).fontFamily)).toContain('Geist');
  // The default theme is neutral: the primary color has no chroma.
  primary = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--primary').trim(),
  );
  const [, a, b] = primary.match(/[\d.e-]+/g)!.map(Number);
  expect(Math.abs(a) + Math.abs(b)).toBeLessThan(0.01);
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copy install command' }).click();
  await page.getByRole('button', { name: 'Copied' }).first().waitFor();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'pnpm dlx @usevibejs/vibecn@latest init',
  );
});

it('switches the homepage showcase screens and previews other themes', async () => {
  await page.goto(origin);
  const showcase = page.getByRole('region', { name: 'Examples' });
  await showcase.getByText('Payment method', { exact: true }).waitFor();
  await showcase.getByRole('tab', { name: 'Dashboard' }).click();
  await showcase.getByRole('textbox', { name: 'Filter emails' }).fill('ken');
  expect(await showcase.getByRole('checkbox', { name: /^Select .+@/ }).count()).toBe(1);
  await showcase.getByRole('tab', { name: 'Chat' }).click();
  await showcase.getByRole('textbox', { name: 'Message' }).fill('A new idea for the homepage');
  await showcase.getByRole('button', { name: 'Send' }).click();
  await showcase.getByText('A new idea for the homepage', { exact: true }).waitFor();
  await showcase.getByRole('tab', { name: 'Sign in' }).click();
  await showcase.getByRole('heading', { name: 'Sign in to Acme' }).waitFor();
  const picker = showcase.getByRole('combobox', { name: 'Preview theme' });
  await picker.click();
  // The first opening is sized to the trigger before it is placed, so it ends with it.
  const list = page
    .getByRole('listbox')
    .filter({ has: page.getByRole('option', { name: 'Green' }) });
  await list.waitFor();
  await list.evaluate((element) =>
    Promise.all(element.getAnimations().map((animation) => animation.finished)),
  );
  const [box, anchor] = await Promise.all([list.boundingBox(), picker.boundingBox()]);
  expect(Math.abs(box!.x + box!.width - (anchor!.x + anchor!.width))).toBeLessThan(1);
  expect(box!.y).toBeGreaterThan(anchor!.y);
  await page.getByRole('option', { name: 'Green' }).click();
  expect(
    await showcase
      .locator('div[data-preview-theme]')
      .last()
      .evaluate((element) => getComputedStyle(element).getPropertyValue('--primary').trim()),
  ).not.toBe(primary);
  await showcase.getByRole('tab', { name: 'Chat' }).click();
  await showcase.getByText('A new idea for the homepage', { exact: true }).waitFor();
});

it('serves optimized WebP brand assets and fits every viewport', async () => {
  await page.goto(origin);
  await page.getByRole('tab', { name: 'Sign in' }).click();
  for (const image of await page.locator('img').all()) {
    const asset = await image.evaluate(async (element: HTMLImageElement) => {
      const response = await fetch(element.src);
      await element.decode();
      return {
        type: response.headers.get('content-type'),
        size: (await response.arrayBuffer()).byteLength,
      };
    });
    expect(asset.type).toContain('image/webp');
    expect(asset.size).toBeLessThan(25_000);
    expect(
      await image.evaluate(
        (element: HTMLImageElement) => element.complete && element.naturalWidth > 0,
      ),
    ).toBe(true);
  }
  for (const width of [375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      width,
    );
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
});

it('links the header to the component index and the examples page', async () => {
  await page.goto(origin);
  const header = page.getByRole('navigation', { name: 'Main' });
  await header.getByRole('link', { name: 'Components' }).click();
  await page.getByRole('heading', { level: 1, name: 'Components', exact: true }).waitFor();
  expect(
    await page
      .getByRole('main')
      .getByRole('link', { name: /^Accordion/ })
      .count(),
  ).toBeGreaterThan(0);
  await header.getByRole('link', { name: 'Examples' }).click();
  await page.getByRole('heading', { level: 1, name: 'Examples' }).waitFor();
  await page
    .getByRole('navigation', { name: 'Examples' })
    .getByRole('link', { name: 'Chat' })
    .click();
  expect(new URL(page.url()).pathname).toBe('/examples/chat');
  await page.getByRole('textbox', { name: 'Message' }).waitFor();
});

it('documents every registry component on its own page', async () => {
  const components = registry.filter(isComponent);
  await page.goto(`${origin}/docs`);
  const nav = page.getByRole('navigation', { name: 'Documentation' }).first();
  for (const item of components)
    await nav.getByRole('link', { name: item.title, exact: true }).waitFor();
  expect(await nav.getByRole('link').count()).toBeGreaterThanOrEqual(components.length);
  for (const item of components) {
    await page.goto(`${origin}/docs/components/${item.name}`);
    await page.getByRole('heading', { level: 1, name: item.title, exact: true }).waitFor();
    await page.locator('[data-example] [data-slot]').first().waitFor();
    await page.getByRole('heading', { level: 2, name: 'API Reference' }).waitFor();
  }
});

it('switches between preview, code, CLI and manual installation', async () => {
  await page.goto(`${origin}/docs/components/button`);
  const example = page.locator('[data-example="button-demo"]');
  await example.getByRole('button', { name: 'Code', exact: true }).click();
  expect(await example.locator('pre').textContent()).toContain(
    "import Button from '@/components/ui/Button.vibe'",
  );
  await page.getByRole('button', { name: 'npm', exact: true }).click();
  await page.getByText('npx @usevibejs/vibecn@latest add button').waitFor();
  await page.getByRole('button', { name: 'Manual', exact: true }).click();
  await page.getByText('components/ui/Button.vibe', { exact: true }).waitFor();
  await page.getByRole('button', { name: 'Copy lib/utils.ts' }).waitFor();
  await page.getByText('npm install clsx tailwind-merge').waitFor();
});

it('navigates between pages with client routing and shows a not-found page', async () => {
  await page.goto(`${origin}/docs`);
  await page.getByRole('link', { name: 'installation guide' }).click();
  await page.getByRole('heading', { level: 1, name: 'Installation' }).waitFor();
  expect(page.url()).toBe(`${origin}/docs/installation`);
  await page.getByRole('navigation', { name: 'Pagination' }).getByRole('link').last().click();
  await page.getByRole('heading', { level: 1, name: 'Theming' }).waitFor();
  await page.goto(`${origin}/docs/components/missing`);
  await page.getByRole('heading', { level: 1, name: 'Page not found' }).waitFor();
});

it('searches pages and components from the keyboard', async () => {
  await page.goto(`${origin}/docs`);
  await page.keyboard.press('Control+k');
  const search = page.getByRole('dialog', { name: 'Search documentation' });
  await search.getByRole('combobox').fill('popup');
  await page.keyboard.press('Enter');
  await page.getByRole('heading', { level: 1, name: 'Tooltip' }).waitFor();
  // The dialog fades out before it is hidden.
  await search.waitFor({ state: 'hidden' });
  expect(page.url()).toBe(`${origin}/docs/components/tooltip`);
});

it('toggles the dark theme and remembers it', async () => {
  await page.goto(`${origin}/docs`);
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)).toBe(
    'dark',
  );
  await page.reload();
  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  expect(await page.evaluate(() => document.documentElement.classList.contains('dark'))).toBe(
    false,
  );
});

it('stops the skeleton animation when reduced motion is preferred', async () => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${origin}/docs/components/skeleton`);
  const skeleton = page.locator('[data-slot="skeleton"]').first();
  expect(await skeleton.evaluate((element) => getComputedStyle(element).animationName)).toBe(
    'none',
  );
  await page.emulateMedia({ reducedMotion: 'no-preference' });
});

it('navigates the calendar grid and selects single dates, multiple dates and ranges', async () => {
  await page.goto(`${origin}/docs/components/calendar`);
  const example = page.locator('[data-example="calendar-demo"]');
  const day = example.locator('[data-date="2026-10-24"]');
  await day.focus();
  await day.press('PageDown');
  await page.waitForFunction(
    () => (document.activeElement as HTMLElement)?.dataset.date === '2026-11-24',
  );
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  expect(
    await example.locator('[data-date="2026-11-25"]').getAttribute('data-selected-single'),
  ).toBe('true');
  await example.getByRole('button', { name: 'Previous month' }).click();
  expect(await example.locator('[aria-live="polite"]').textContent()).toBe('October 2026');
  const multiple = page.locator('[data-example="calendar-multiple"]');
  await multiple.locator('[data-date="2026-10-20"]').click();
  expect(await multiple.locator('[aria-selected="true"]').count()).toBe(3);
  const range = page.locator('[data-example="calendar-range"]');
  await range.locator('[data-date="2026-10-21"]').click();
  await range.locator('[data-date="2026-10-24"]').click();
  expect(await range.locator('[data-range-middle="true"]').count()).toBe(2);
  const restricted = page.locator('[data-example="calendar-locale"]');
  await restricted.locator('[data-date="2026-10-24"]').focus();
  await page.keyboard.press('Enter');
  expect(await restricted.locator('[aria-selected="true"]').count()).toBe(0);
});

it('opens date pickers with day focus and restores the trigger on selection and Escape', async () => {
  await page.goto(`${origin}/docs/components/date-picker`);
  const example = page.locator('[data-example="date-picker-demo"]');
  const trigger = example.getByRole('button', { name: 'Pick a date' });
  await trigger.click();
  await page.waitForFunction(() => document.activeElement?.hasAttribute('data-date'));
  await page.keyboard.press('Enter');
  expect(await example.locator('[data-slot="popover-trigger"]').getAttribute('aria-expanded')).toBe(
    'false',
  );
  expect(
    await example
      .locator('[data-slot="popover-trigger"]')
      .evaluate((element) => element === document.activeElement),
  ).toBe(true);
  await example.locator('[data-slot="popover-trigger"]').click();
  await page.waitForFunction(() => document.activeElement?.hasAttribute('data-date'));
  await page.keyboard.press('Escape');
  expect(await example.locator('[data-slot="popover-trigger"]').getAttribute('aria-expanded')).toBe(
    'false',
  );
  const input = page.getByRole('textbox', { name: 'Appointment date' });
  await input.fill('2024-02-30');
  expect(await input.getAttribute('aria-invalid')).toBe('true');
  await input.fill('2024-02-29');
  await page.getByRole('button', { name: 'Choose appointment date' }).click();
  await page.waitForFunction(
    () => (document.activeElement as HTMLElement)?.dataset.date === '2024-02-29',
  );
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('Enter');
  expect(await input.inputValue()).toBe('2024-03-01');
});

it('scrolls horizontal and vertical carousels without moving the surrounding page', async () => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${origin}/docs/components/carousel`);
  const example = page.locator('[data-example="carousel-demo"]');
  await example.scrollIntoViewIfNeeded();
  const scrollY = await page.evaluate(() => window.scrollY);
  await example.getByRole('button', { name: 'Next slide' }).click();
  await page.waitForFunction(() => {
    const content = document.querySelector(
      '[data-example="carousel-demo"] [data-slot="carousel-content"]',
    )!;
    return content.scrollLeft > 100;
  });
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollY);
  expect(await example.locator('[aria-live="polite"]').textContent()).toBe('Slide 2 of 5');
  const content = example.locator('[data-slot="carousel-content"]');
  await content.focus();
  await content.press('ArrowLeft');
  await page.waitForFunction(
    () =>
      document.querySelector('[data-example="carousel-demo"] [data-slot="carousel-content"]')!
        .scrollLeft < 1,
  );
  await example.locator('[data-slot="carousel-item"]').evaluateAll((items) =>
    items.forEach((item) => {
      (item as HTMLElement).style.flexBasis = '50%';
    }),
  );
  for (let slide = 0; slide < 3; slide++) {
    await example.getByRole('button', { name: 'Next slide' }).click();
    await page.waitForFunction(
      (index) =>
        document.querySelector('[data-example="carousel-demo"] [aria-live="polite"]')!
          .textContent === `Slide ${index + 1} of 5`,
      slide + 1,
    );
  }
  expect(await example.getByRole('button', { name: 'Next slide' }).isDisabled()).toBe(true);
  const vertical = page.locator('[data-example="carousel-vertical"]');
  await vertical.getByRole('button', { name: 'Next slide' }).click();
  await page.waitForFunction(
    () =>
      document.querySelector('[data-example="carousel-vertical"] [data-slot="carousel-content"]')!
        .scrollTop > 100,
  );
  await page.emulateMedia({ reducedMotion: 'no-preference' });
});

it('shows all chart types and uses themed colors', async () => {
  await page.goto(`${origin}/docs/components/chart`);
  const chart = page.locator('[data-example="chart-types"] [data-slot="chart"]');
  for (const type of ['bar', 'line', 'area', 'pie']) {
    await page.getByRole('combobox', { name: 'Chart type' }).selectOption(type);
    expect(await chart.locator('svg').getAttribute('role')).toBe('img');
    expect(await chart.getByRole('table').locator('tbody tr').count()).toBe(5);
  }
  expect(
    await chart
      .locator('svg path')
      .first()
      .evaluate((element) => getComputedStyle(element).fill),
  ).not.toBe('rgb(0, 0, 0)');
});

it('sorts, filters, selects and paginates the data table pattern', async () => {
  await page.goto(`${origin}/docs/components/data-table`);
  const example = page.locator('[data-example="data-table-demo"]');
  await example.getByRole('checkbox', { name: 'Select alex@example.com' }).check();
  expect(
    await example
      .getByRole('checkbox', { name: 'Select all rows on this page' })
      .evaluate((element: HTMLInputElement) => element.indeterminate),
  ).toBe(true);
  await example.getByRole('button', { name: 'Next', exact: true }).click();
  await example.getByText('drew@example.com', { exact: true }).waitFor();
  await example.getByRole('button', { name: /Email/ }).click();
  await example.getByText('gray@example.com', { exact: true }).waitFor();
  await example.getByRole('textbox', { name: 'Filter emails' }).fill('alex');
  await example.getByText('1 of 1 row(s) selected.', { exact: true }).waitFor();
  await example.getByRole('button', { name: 'Columns' }).click();
  await example.getByRole('menuitemcheckbox', { name: 'Amount' }).click();
  expect(await example.getByRole('columnheader', { name: 'Amount' }).count()).toBe(0);
  await page.keyboard.press('Escape');
});

it('collapses the desktop sidebar and opens a modal Sheet on mobile', async () => {
  await page.goto(`${origin}/docs/components/sidebar`);
  const example = page.locator('[data-example="sidebar-demo"]');
  const trigger = example.locator('[data-slot="sidebar-trigger"]');
  await trigger.click();
  expect(await trigger.getAttribute('aria-expanded')).toBe('false');
  await trigger.press('Control+b');
  expect(await trigger.getAttribute('aria-expanded')).toBe('true');
  await page.setViewportSize({ width: 375, height: 812 });
  for (const name of ['calendar', 'date-picker', 'carousel', 'chart', 'data-table', 'sidebar']) {
    await page.goto(`${origin}/docs/components/${name}`);
    await page.locator('[data-example] [data-slot]').first().waitFor();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      375,
    );
  }
  const mobileTrigger = page
    .locator('[data-example="sidebar-demo"]')
    .getByRole('button', { name: 'Toggle Sidebar' });
  await mobileTrigger.click();
  const sheet = page.getByRole('dialog', { name: 'Sidebar', exact: true });
  await sheet.waitFor();
  await sheet.getByRole('button', { name: 'Inbox', exact: true }).focus();
  await page.keyboard.press('Escape');
  await page.waitForFunction(
    () => !document.querySelector('[data-example="sidebar-demo"] dialog')?.hasAttribute('open'),
  );
  expect(await mobileTrigger.evaluate((element) => document.activeElement === element)).toBe(true);
  await mobileTrigger.click();
  await sheet.waitFor();
  await sheet.getByRole('button', { name: 'Close', exact: true }).click();
  expect(await mobileTrigger.getAttribute('aria-expanded')).toBe('false');
  await page.setViewportSize({ width: 1440, height: 1000 });
});

it('fits a phone screen and opens the navigation in a modal dialog', async () => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const path of ['/', '/docs/components/card', '/docs/installation']) {
    await page.goto(`${origin}${path}`);
    await page.getByRole('heading', { level: 1 }).waitFor();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      375,
    );
  }
  await page.getByRole('button', { name: 'Open menu' }).click();
  const menu = page.getByRole('dialog', { name: 'Menu' });
  await menu.getByRole('link', { name: 'Textarea' }).click();
  await page.getByRole('heading', { level: 1, name: 'Textarea' }).waitFor();
  expect(await menu.isVisible()).toBe(false);
  expect(errors).toEqual([]);
});

it('serves the built registry with license notices', async () => {
  const response = await page.request.get(`${origin}/r/button.json`);
  expect(response.status()).toBe(200);
  const item = await response.json();
  expect(item.name).toBe('button');
  expect(item.files.at(-1).content).toContain('Copyright (c) 2023 shadcn');
});
