// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Navigation and Structure Tests
 * Tests for site navigation and document structure.
 */

test.describe('Documentation Site Navigation', () => {

  test('homepage loads and has correct title', async ({ page }) => {
    await page.goto('/');
    // Just wait for page to load
    await page.waitForLoadState('domcontentloaded');
    
    // Check title
    await expect(page).toHaveTitle(/Skin Zone/i);
  });

  test('homepage has app container', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // The #app div should exist
    const app = page.locator('#app');
    await expect(app).toBeVisible();
  });

  test('page includes docsify configuration', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    
    // Check that docsify config exists
    const hasDocsify = await page.evaluate(() => {
      return typeof window.$docsify !== 'undefined';
    });
    expect(hasDocsify).toBeTruthy();
  });

  test('sidebar markdown file exists', async ({ page }) => {
    // Check that _sidebar.md is accessible
    const response = await page.goto('/_sidebar.md');
    expect(response?.status()).toBe(200);
    
    const content = await page.content();
    expect(content).toContain('Home');
  });

  test('navbar markdown file exists', async ({ page }) => {
    // Check that _navbar.md is accessible
    const response = await page.goto('/_navbar.md');
    expect(response?.status()).toBe(200);
  });

  test('README content is accessible', async ({ page }) => {
    const response = await page.goto('/README.md');
    expect(response?.status()).toBe(200);
    
    const content = await page.content();
    expect(content.toLowerCase()).toContain('skin zone');
  });

});

test.describe('Documentation Content Accessibility', () => {

  test('documentation files are accessible', async ({ page }) => {
    const response = await page.goto('/documentation/final_architecture_document.md');
    expect(response?.status()).toBe(200);
  });

  test('architecture files are accessible', async ({ page }) => {
    const response = await page.goto('/architecture/marketplace_architecture.md');
    expect(response?.status()).toBe(200);
  });

  test('entities files are accessible', async ({ page }) => {
    const response = await page.goto('/entities/products.md');
    expect(response?.status()).toBe(200);
  });

  test('mockups files are accessible', async ({ page }) => {
    const response = await page.goto('/mockups/homepage_wireframe.md');
    expect(response?.status()).toBe(200);
  });

});

test.describe('Content Verification', () => {

  test('architecture document contains required content', async ({ page }) => {
    await page.goto('/architecture/marketplace_architecture.md');
    const content = await page.content();
    
    expect(content.toLowerCase()).toContain('architecture');
  });

  test('HGNN document contains graph concepts', async ({ page }) => {
    await page.goto('/architecture/hgnn_database_schema.md');
    const content = await page.content();
    
    expect(content.toLowerCase()).toMatch(/graph|hgnn|neural/);
  });

  test('Shopify document contains marketplace concepts', async ({ page }) => {
    await page.goto('/architecture/shopify_app_marketplace.md');
    const content = await page.content();
    
    expect(content.toLowerCase()).toContain('shopify');
  });

});
