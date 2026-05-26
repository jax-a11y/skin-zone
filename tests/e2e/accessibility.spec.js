// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Accessibility Tests
 * Basic accessibility checks for documentation site.
 */

test.describe('Accessibility Basics', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.content', { timeout: 10000 });
  });

  test('page has a valid title', async ({ page }) => {
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    expect(title).not.toBe('Untitled');
  });

  test('main heading (h1) is present', async ({ page }) => {
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('heading hierarchy is logical', async ({ page }) => {
    // Get all headings
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    
    if (headings.length === 0) {
      return; // No headings to check
    }
    
    // Check that first heading is h1 or h2 (docsify may not have h1 in some views)
    const firstHeading = headings[0];
    const tagName = await firstHeading.evaluate(el => el.tagName.toLowerCase());
    expect(['h1', 'h2']).toContain(tagName);
  });

  test('links have discernible text', async ({ page }) => {
    const links = await page.locator('a').all();
    
    for (const link of links.slice(0, 20)) { // Check first 20 links
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');
      
      // Link should have some accessible text
      const hasAccessibleText = 
        (text && text.trim().length > 0) || 
        (ariaLabel && ariaLabel.length > 0) ||
        (title && title.length > 0);
      
      expect(hasAccessibleText).toBeTruthy();
    }
  });

  test('images have alt text (if any)', async ({ page }) => {
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const role = await img.getAttribute('role');
      
      // Image should have alt text or be marked as decorative
      const hasAltOrDecorative = 
        alt !== null || 
        role === 'presentation' || 
        role === 'none';
      
      expect(hasAltOrDecorative).toBeTruthy();
    }
  });

  test('focus is visible on interactive elements', async ({ page }) => {
    // Find a link and focus it
    const link = page.locator('a').first();
    
    if (await link.isVisible()) {
      await link.focus();
      
      // Check that the element has some focus indication
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
    }
  });

  test('document language is set', async ({ page }) => {
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toBeTruthy();
    expect(lang?.length).toBeGreaterThan(0);
  });

});

test.describe('Responsive Design', () => {

  test('site is readable at mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('.content', { timeout: 10000 });
    
    // Content should still be visible
    const content = page.locator('.content');
    await expect(content).toBeVisible();
    
    // Main heading should be visible
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
  });

  test('site is readable at tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForSelector('.content', { timeout: 10000 });
    
    const content = page.locator('.content');
    await expect(content).toBeVisible();
  });

  test('site is readable at desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForSelector('.content', { timeout: 10000 });
    
    const content = page.locator('.content');
    await expect(content).toBeVisible();
    
    // Sidebar should be visible on desktop
    const sidebar = page.locator('.sidebar');
    await expect(sidebar).toBeVisible();
  });

  test('text does not overflow horizontally', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForSelector('.content', { timeout: 10000 });
    
    // Check for horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    
    // Small amount of overflow is acceptable, but large overflow is not
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
    
    // Allow up to 10px overflow for borders etc.
    expect(scrollWidth - clientWidth).toBeLessThan(10);
  });

});

test.describe('Keyboard Navigation', () => {

  test('can navigate sidebar with keyboard', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.sidebar-nav', { timeout: 10000 });
    
    // Tab to first sidebar link
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Should be able to focus on links
    const focusedElement = page.locator(':focus');
    const tagName = await focusedElement.evaluate(el => el.tagName.toLowerCase());
    
    // Should focus on an interactive element
    expect(['a', 'button', 'input']).toContain(tagName);
  });

  test('can activate links with Enter key', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.sidebar-nav', { timeout: 10000 });
    
    // Find and focus a sidebar link
    const link = page.locator('.sidebar-nav a').first();
    await link.focus();
    
    // Press Enter to activate
    await page.keyboard.press('Enter');
    
    // Page should still be functional
    await expect(page.locator('.content')).toBeVisible();
  });

});
