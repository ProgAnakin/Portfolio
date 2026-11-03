import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const cases = [
  ['caderninho', 'Caderninho Digital'],
  ['suaipe', 'Suaipe'],
  ['ai-call-trainer', 'AI Call Trainer'],
  ['kouci', 'Kouci'],
];

test('sales totals, individual item prices and contract progression are published consistently', async ({ page }) => {
  await page.goto('/');
  const record = page.locator('#record');
  for (const value of ['€112,483.67', '2,186', '3,056', '€5', '€1,600']) {
    await expect(record.getByText(value, { exact: true })).toBeVisible();
  }
  for (const title of ['20 hours a week', '30 hours a week', 'Permanent contract']) {
    await expect(record.getByText(title, { exact: true })).toBeVisible();
  }
  await expect(page.getByText(/average receipt|average item value|items per receipt/i)).toHaveCount(0);
  await expect(record.getByRole('heading', { name: 'From €5 to €1,600 per item.', exact: true })).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /€112,483.67.*2,186.*3,056/);
});

for (const [id, name] of cases) {
  test(`${name}: shared case link, Escape and focus return`, async ({ page }) => {
    await page.goto('/#work');
    const opener = page.locator(`[data-case-id="${id}"]`);
    await opener.click();
    await expect(page).toHaveURL(new RegExp(`#case/${id}$`));
    await expect(page.getByRole('dialog', { name })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Close', exact: true })).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page).toHaveURL(/#work$/);
    await expect(opener).toBeFocused();
  });
}

test('case URLs survive reload and follow browser Back and Forward', async ({ page }) => {
  await page.goto('/#work');
  await page.locator('[data-case-id="suaipe"]').click();
  await page.reload();
  await expect(page.getByRole('dialog', { name: 'Suaipe' })).toBeVisible();
  await page.goBack();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.goForward();
  await expect(page.getByRole('dialog', { name: 'Suaipe' })).toBeVisible();
  await page.goto('/#case/kouci');
  await expect(page.getByRole('dialog', { name: 'Kouci' })).toBeVisible();
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator('[data-case-id="kouci"]')).toBeFocused();
});

test('gallery images load and video chapter seeks and plays', async ({ page }) => {
  await page.goto('/#case/caderninho');
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'At the counter', exact: true }).click();
  const image = dialog.getByRole('img', { name: 'Caderninho Digital: At the counter', exact: true });
  await expect(image).toBeVisible();
  await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0);
  await dialog.getByRole('button', { name: 'The tour, video', exact: true }).click();
  await dialog.getByRole('button', { name: '0:12 A new case', exact: true }).click();
  const video = dialog.locator('video');
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.currentTime)).toBeGreaterThanOrEqual(12);
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.paused)).toBe(false);
});

test('preview pause survives scrolling and reduced-motion changes apply immediately', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#work');
  const preview = page.locator('#work video').first();
  await preview.scrollIntoViewIfNeeded();
  await expect.poll(() => preview.evaluate((v: HTMLVideoElement) => v.paused)).toBe(false);
  await page.getByRole('button', { name: 'Pause previews' }).click();
  await expect.poll(() => preview.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await page.locator('#contact').scrollIntoViewIfNeeded();
  await preview.scrollIntoViewIfNeeded();
  await expect.poll(() => preview.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await page.getByRole('button', { name: 'Play previews' }).click();
  await preview.scrollIntoViewIfNeeded();
  await expect.poll(() => preview.evaluate((v: HTMLVideoElement) => v.paused)).toBe(false);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => page.locator('#work video').evaluateAll((vs: HTMLVideoElement[]) => vs.every((v) => v.paused))).toBe(true);
  await page.reload();
  await preview.scrollIntoViewIfNeeded();
  await expect.poll(() => preview.evaluate((v: HTMLVideoElement) => v.paused)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect.poll(() => preview.evaluate((v: HTMLVideoElement) => v.paused)).toBe(false);
});

test('mobile navigation reaches sections and layouts fit narrow screens', async ({ page }) => {
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.setViewportSize({ width: 375, height: 812 });
  await page.getByRole('navigation', { name: 'Sections on mobile' }).getByRole('link', { name: 'Contact', exact: true }).click();
  await expect(page).toHaveURL(/#contact$/);
  await page.goto('/#case/caderninho');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect.poll(() => dialog.evaluate((d) => d.scrollWidth <= d.clientWidth)).toBe(true);
});

test('home and each case pass automated accessibility checks', async ({ page }) => {
  await page.goto('/');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  for (const [id] of cases) {
    await page.locator(`[data-case-id="${id}"]`).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.getByRole('button', { name: 'Close', exact: true }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
  }
});

for (const width of [375, 1440]) {
  test(`closing a directly shared case returns to a visible card at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/#case/caderninho');
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Close', exact: true }).click();
    const card = page.locator('[data-case-id="caderninho"]');
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(card).toBeFocused();
    await expect(card).toBeInViewport();
    await expect.poll(() => card.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      const header = document.querySelector('header')!.getBoundingClientRect();
      return bounds.top >= header.bottom && bounds.top < innerHeight;
    })).toBe(true);
  });
}

test('switching from a video to an image resets the highlighted chapter on return', async ({ page }) => {
  await page.goto('/#case/caderninho');
  const dialog = page.getByRole('dialog');
  const chapter = dialog.getByRole('button', { name: '0:45 Under the hood', exact: true });
  await chapter.click();
  await expect(chapter).toHaveAttribute('aria-current', 'step');
  await dialog.getByRole('button', { name: 'At the counter', exact: true }).click();
  await dialog.getByRole('button', { name: 'The tour, video', exact: true }).click();
  await expect.poll(() => dialog.locator('video').evaluate((v: HTMLVideoElement) => v.currentTime)).toBe(0);
  await expect(dialog.locator('[aria-current="step"]')).toHaveCount(0);
  await dialog.getByRole('button', { name: '0:12 A new case', exact: true }).click();
  await expect(dialog.getByRole('button', { name: '0:12 A new case', exact: true })).toHaveAttribute('aria-current', 'step');
});

test('case dialogs pause previews and closing preserves the manual playback preference', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/#work');
  const preview = page.locator('#work video').first();
  const card = page.locator('[data-case-id="caderninho"]');
  const allPaused = () => page.locator('#work video').evaluateAll((videos: HTMLVideoElement[]) => videos.every((video) => video.paused));
  await preview.scrollIntoViewIfNeeded();
  await expect.poll(() => preview.evaluate((v: HTMLVideoElement) => v.paused)).toBe(false);
  await card.click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect.poll(allPaused).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await preview.scrollIntoViewIfNeeded();
  await expect.poll(() => preview.evaluate((v: HTMLVideoElement) => v.paused)).toBe(false);
  await page.getByRole('button', { name: 'Pause previews', exact: true }).click();
  await card.click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await preview.scrollIntoViewIfNeeded();
  await expect.poll(allPaused).toBe(true);
});
