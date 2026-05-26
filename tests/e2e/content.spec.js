// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Content Verification Tests
 * Tests that verify critical content is present on key pages.
 */

test.describe('Critical Content Verification', () => {

  test('homepage contains key project information', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('.content', { timeout: 10000 });
    
    const content = page.locator('.content');
    
    // Should contain key concepts from README
    await expect(content).toContainText(/multi-tenant/i);
    await expect(content).toContainText(/beauty marketplace/i);
  });

  test('architecture overview contains required concepts', async ({ page }) => {
    await page.goto('/#/architecture/marketplace_architecture');
    await page.waitForSelector('.content', { timeout: 10000 });
    
    const content = page.locator('.content');
    
    // Architecture should mention key components
    await expect(content).toContainText(/architecture/i);
  });

  test('HGNN documentation exists and contains graph concepts', async ({ page }) => {
    await page.goto('/#/architecture/hgnn_database_schema');
    await page.waitForSelector('.content', { timeout: 10000 });
    
    const content = page.locator('.content');
    
    // Should contain graph/HGNN related content
    await expect(content).toContainText(/graph|HGNN|neural/i);
  });

  test('Shopify architecture contains required concepts', async ({ page }) => {
    await page.goto('/#/architecture/shopify_app_marketplace');
    await page.waitForSelector('.content', { timeout: 10000 });
    
    const content = page.locator('.content');
    
    // Required Shopify-related phrases
    await expect(content).toContainText(/Shopify/i);
    await expect(content).toContainText(/marketplace/i);
  });

  test('AppDirect integration documentation exists', async ({ page }) => {
    await page.goto('/#/architecture/appdirect_integration');
    await page.waitForSelector('.content', { timeout: 10000 });
    
    const content = page.locator('.content');
    
    await expect(content).toContainText(/AppDirect/i);
  });

  test('entities documentation contains all entity types', async ({ page }) => {
    // Check that entity pages exist and have content
    const entities = ['products', 'brands', 'salons', 'treatments', 'therapists', 'ingredients'];
    
    for (const entity of entities) {
      await page.goto(`/#/entities/${entity}`);
      await page.waitForSelector('.content', { timeout: 10000 });
      
      const content = page.locator('.content');
      await expect(content).toBeVisible();
      
      // Should have at least some content
      const text = await content.textContent();
      expect(text?.length).toBeGreaterThan(100);
    }
  });

});

test.describe('Documentation Completeness', () => {

  test('final architecture document has substantial content', async ({ page }) => {
    await page.goto('/#/documentation/final_architecture_document');
    await page.waitForSelector('.content', { timeout: 10000 });
    
    const content = page.locator('.content');
    const text = await content.textContent();
    
    // Should be a substantial document
    expect(text?.length).toBeGreaterThan(1000);
  });

  test('technical documentation has substantial content', async ({ page }) => {
    await page.goto('/#/documentation/technical_documentation');
    await page.waitForSelector('.content', { timeout: 10000 });
    
    const content = page.locator('.content');
    const text = await content.textContent();
    
    // Should be a substantial document
    expect(text?.length).toBeGreaterThan(1000);
  });

  test('scalability security document has substantial content', async ({ page }) => {
    await page.goto('/#/documentation/scalability_security_validation');
    await page.waitForSelector('.content', { timeout: 10000 });
    
    const content = page.locator('.content');
    
    // Should mention both scalability and security
    await expect(content).toContainText(/scalab/i);
    await expect(content).toContainText(/security/i);
  });

});

test.describe('Wireframes and Mockups', () => {

  test('homepage wireframe contains layout information', async ({ page }) => {
    await page.goto('/#/mockups/homepage_wireframe');
    await page.waitForSelector('.content', { timeout: 10000 });
    
    const content = page.locator('.content');
    await expect(content).toBeVisible();
  });

  test('product listing wireframe exists', async ({ page }) => {
    await page.goto('/#/mockups/product_listing_wireframe');
    await page.waitForSelector('.content', { timeout: 10000 });
    
    const content = page.locator('.content');
    await expect(content).toBeVisible();
  });

  test('booking flow wireframe exists', async ({ page }) => {
    await page.goto('/#/mockups/booking_flow_wireframe');
    await page.waitForSelector('.content', { timeout: 10000 });
    
    const content = page.locator('.content');
    await expect(content).toBeVisible();
  });

});
