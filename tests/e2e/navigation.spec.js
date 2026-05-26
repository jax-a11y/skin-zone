// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * Navigation and Structure Tests
 * Tests for site navigation, sidebar, and document structure.
 */

test.describe('Documentation Site Navigation', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for docsify to fully load
    await page.waitForSelector('.sidebar-nav', { timeout: 10000 });
  });

  test('homepage loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Skin Zone/i);
  });

  test('homepage displays main heading', async ({ page }) => {
    const heading = page.locator('h1').first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText(/skin zone|beauty marketplace/i);
  });

  test('sidebar navigation is visible', async ({ page }) => {
    const sidebar = page.locator('.sidebar-nav');
    await expect(sidebar).toBeVisible();
  });

  test('sidebar contains all main sections', async ({ page }) => {
    const sidebar = page.locator('.sidebar-nav');
    
    // Check for main documentation sections
    await expect(sidebar).toContainText('Documentation');
    await expect(sidebar).toContainText('Architecture');
    await expect(sidebar).toContainText('Entities');
    await expect(sidebar).toContainText('Mockups');
  });

  test('sidebar links are clickable', async ({ page }) => {
    // Click on a documentation link
    const docLink = page.locator('.sidebar-nav a:has-text("Documentation")').first();
    
    if (await docLink.isVisible()) {
      await docLink.click();
      // Should navigate without error
      await expect(page.locator('.content')).toBeVisible();
    }
  });

  test('home link in sidebar works', async ({ page }) => {
    const homeLink = page.locator('.sidebar-nav a:has-text("Home")');
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    
    // Should return to homepage
    await expect(page.locator('h1').first()).toContainText(/skin zone|beauty marketplace/i);
  });

});

test.describe('Documentation Sections Reachability', () => {
  
  test('documentation section pages load', async ({ page }) => {
    await page.goto('/#/documentation/final_architecture_document');
    await page.waitForSelector('.content', { timeout: 10000 });
    
    const content = page.locator('.content');
    await expect(content).toBeVisible();
    
    // Should contain architecture-related content
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('architecture section pages load', async ({ page }) => {
    await page.goto('/#/architecture/marketplace_architecture');
    await page.waitForSelector('.content', { timeout: 10000 });
    
    const content = page.locator('.content');
    await expect(content).toBeVisible();
    
    // Verify content loaded
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  });

  test('entities section pages load', async ({ page }) => {
    await page.goto('/#/entities/products');
    await page.waitForSelector('.content', { timeout: 10000 });
    
    const content = page.locator('.content');
    await expect(content).toBeVisible();
  });

  test('mockups section pages load', async ({ page }) => {
    await page.goto('/#/mockups/homepage_wireframe');
    await page.waitForSelector('.content', { timeout: 10000 });
    
    const content = page.locator('.content');
    await expect(content).toBeVisible();
  });

});

test.describe('Table of Contents and Anchors', () => {

  test('heading anchors are generated', async ({ page }) => {
    await page.goto('/#/documentation/final_architecture_document');
    await page.waitForSelector('.content', { timeout: 10000 });
    
    // Check that headings have anchor links
    const headingWithId = page.locator('h1[id], h2[id], h3[id]');
    const count = await headingWithId.count();
    
    // Should have at least some anchored headings
    expect(count).toBeGreaterThan(0);
  });

  test('anchor links navigate correctly', async ({ page }) => {
    await page.goto('/#/documentation/final_architecture_document');
    await page.waitForSelector('.content', { timeout: 10000 });
    
    // Find an anchor link in the content
    const internalLink = page.locator('a[href^="#"]').first();
    
    if (await internalLink.isVisible()) {
      await internalLink.click();
      // Page should still be loaded
      await expect(page.locator('.content')).toBeVisible();
    }
  });

});
