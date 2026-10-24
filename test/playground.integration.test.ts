import { chromium, type Browser, type Page } from 'playwright';
import { preview, type PreviewServer } from 'vite';
import { afterAll, beforeAll, expect, it } from 'vitest';

let server: PreviewServer;
let browser: Browser;
let page: Page;
const errors: string[] = [];

beforeAll(async () => {
  server = await preview({ root: 'playground', preview: { host: '127.0.0.1', port: 0 } });
  browser = await chromium.launch({ headless: true });
  page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(server.resolvedUrls!.local[0]);
});
afterAll(async () => {
  await browser?.close();
  await new Promise<void>((done) => server?.httpServer.close(() => done()));
});

it('renders native components, updates models, and submits a local form', async () => {
  await page.getByLabel('Full name').fill('Taylor');
  await page.getByLabel('A few words').fill('Made with vibe.js');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await page.getByText('Saved locally for Taylor.').waitFor();
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  expect(await page.getByLabel('Full name').inputValue()).toBe('Alex Morgan');
  await page.getByRole('button', { name: 'Default', exact: true }).click();
  await page.getByText('1 button clicks. Same native behavior.').waitFor();
  expect(await page.getByRole('button', { name: 'Disabled button' }).isDisabled()).toBe(true);
});

it('switches theme and accent colors and generates actual Tailwind CSS', async () => {
  const before = await page
    .getByRole('button', { name: 'Save changes' })
    .evaluate((element) => getComputedStyle(element).backgroundColor);
  await page.getByRole('button', { name: 'Use blue accent' }).click();
  expect(before).not.toBe('rgba(0, 0, 0, 0)');
  await expect
    .poll(() =>
      page
        .getByRole('button', { name: 'Save changes' })
        .evaluate((element) => getComputedStyle(element).backgroundColor),
    )
    .toBe('rgb(37, 99, 235)');
  await page.getByRole('button', { name: 'Use dark theme' }).click();
  expect(
    await page.locator('.catalog').evaluate((element) => getComputedStyle(element).colorScheme),
  ).toBe('dark');
  await page.getByRole('button', { name: 'Use light theme' }).click();
  await page.getByRole('button', { name: 'Use a component' }).click();
  expect(await page.locator('.code-panel pre').textContent()).toContain('import Button');
});

it('shows visible keyboard focus and respects reduced motion', async () => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(
    await page
      .locator('[data-slot="skeleton"]')
      .first()
      .evaluate((element) => getComputedStyle(element).animationName),
  ).toBe('none');
  await page.getByLabel('Full name').focus();
  await page.keyboard.press('Tab');
  expect(
    await page
      .getByLabel('Email address')
      .evaluate((element) => element === document.activeElement),
  ).toBe(true);
  const ring = await page
    .getByLabel('Email address')
    .evaluate((element) => getComputedStyle(element).boxShadow);
  expect(ring).not.toBe('none');
});

it('fits a mobile viewport without horizontal scrolling or runtime errors', async () => {
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390);
  expect(await page.getByRole('heading', { level: 1 }).isVisible()).toBe(true);
  expect(await page.getByRole('button', { name: 'Save changes' }).isVisible()).toBe(true);
  expect(errors).toEqual([]);
});

it('serves the built registry and copies the displayed install command', async () => {
  const response = await page.request.get(new URL('/r/button.json', page.url()).href);
  expect(response.status()).toBe(200);
  const item = await response.json();
  expect(item.name).toBe('button');
  expect(item.files.at(-1).content).toContain('Copyright (c) 2023 shadcn');
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.getByRole('button', { name: 'Copy install command' }).click();
  await page.getByRole('button', { name: 'Command copied' }).waitFor();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'vibecn add button card input',
  );
});
