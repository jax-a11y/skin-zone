// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Accessibility Tests
 * Basic accessibility checks for documentation site.
 */

test.describe('Accessibility Basics', () => {

  test('page has a valid title', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    expect(title).not.toBe('Untitled');
  });

  test('document language is set', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
    expect(lang?.length).toBeGreaterThan(0);
  });

  test('viewport meta tag is present', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const viewport = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewport).toBeTruthy();
  });

  test('page has description meta tag', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description?.length).toBeGreaterThan(10);
  });

});

test.describe('Responsive Design', () => {

  test('site loads at mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const response = await page.goto('/');
    
    expect(response?.status()).toBe(200);
    
    const app = page.locator('#app');
    await expect(app).toBeVisible();
  });

  test('site loads at tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const response = await page.goto('/');
    
    expect(response?.status()).toBe(200);
  });

  test('site loads at desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    const response = await page.goto('/');
    
    expect(response?.status()).toBe(200);
  });

});

test.describe('Static Assets', () => {

  test('CSS stylesheet is loaded', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check that docsify styles are loaded
    const hasStyles = await page.evaluate(() => {
      const stylesheets = document.styleSheets;
      return stylesheets.length > 0;
    });
    
    expect(hasStyles).toBeTruthy();
  });

  test('JavaScript is loaded and executed', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check that docsify config exists (set by our script)
    const hasDocsify = await page.evaluate(() => {
      return typeof window.$docsify !== 'undefined';
    });
    
    expect(hasDocsify).toBeTruthy();
  });

});
