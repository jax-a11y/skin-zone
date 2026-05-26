// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Content Verification Tests
 * Tests that verify critical content is present on key pages.
 */

test.describe('Documentation Content Verification', () => {

  test('final architecture document has substantial content', async ({ page }) => {
    await page.goto('/documentation/final_architecture_document.md');
    const content = await page.content();
    
    // Should be a substantial document
    expect(content.length).toBeGreaterThan(5000);
    expect(content.toLowerCase()).toContain('architecture');
  });

  test('technical documentation has substantial content', async ({ page }) => {
    await page.goto('/documentation/technical_documentation.md');
    const content = await page.content();
    
    expect(content.length).toBeGreaterThan(3000);
  });

  test('scalability security document contains required topics', async ({ page }) => {
    await page.goto('/documentation/scalability_security_validation.md');
    const content = await page.content();
    
    expect(content.toLowerCase()).toContain('scalab');
    expect(content.toLowerCase()).toContain('security');
  });

  test('AppDirect integration documentation exists', async ({ page }) => {
    await page.goto('/architecture/appdirect_integration.md');
    const content = await page.content();
    
    expect(content.toLowerCase()).toContain('appdirect');
  });

});

test.describe('Entity Documentation', () => {

  const entities = ['products', 'brands', 'salons', 'treatments', 'therapists', 'ingredients'];

  for (const entity of entities) {
    test(`${entity} entity document exists and has content`, async ({ page }) => {
      const response = await page.goto(`/entities/${entity}.md`);
      expect(response?.status()).toBe(200);
      
      const content = await page.content();
      expect(content.length).toBeGreaterThan(500);
    });
  }

});

test.describe('Mockup Documentation', () => {

  test('homepage wireframe exists', async ({ page }) => {
    const response = await page.goto('/mockups/homepage_wireframe.md');
    expect(response?.status()).toBe(200);
  });

  test('product listing wireframe exists', async ({ page }) => {
    const response = await page.goto('/mockups/product_listing_wireframe.md');
    expect(response?.status()).toBe(200);
  });

  test('booking flow wireframe exists', async ({ page }) => {
    const response = await page.goto('/mockups/booking_flow_wireframe.md');
    expect(response?.status()).toBe(200);
  });

});
