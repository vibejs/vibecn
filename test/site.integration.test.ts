import { chromium, type Browser, type Page } from 'playwright';
import { preview, type PreviewServer } from 'vite';
import { afterAll, beforeAll, expect, it } from 'vitest';
import { isComponent, registry } from '../src/registry.ts';

let server: PreviewServer;
let browser: Browser;
let page: Page;
let origin: string;
const errors: string[] = [];

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

it('renders the home page with live components and a copyable install command', async () => {
  await page.goto(origin);
  await page.getByRole('heading', { level: 1, name: /made for vibe\.js/ }).waitFor();
  await page.getByLabel('Your message').fill('Hello');
  expect(await page.getByLabel('Your message').inputValue()).toBe('Hello');
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copy install command' }).click();
  await page.getByRole('button', { name: 'Copied' }).first().waitFor();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'pnpm dlx @usevibejs/vibecn@latest init',
  );
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
