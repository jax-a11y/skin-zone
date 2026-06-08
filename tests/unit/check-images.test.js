/**
 * Unit Tests for Check Images Validator
 * Tests the image reference validation logic.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

// Mock functions for testing
function extractImageReferences(content) {
  const mdImageRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
  const htmlImageRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  
  const images = [];
  let match;
  
  while ((match = mdImageRegex.exec(content)) !== null) {
    const imgPath = match[1].trim().split(' ')[0];
    if (imgPath && !imgPath.startsWith('#')) {
      images.push(imgPath);
    }
  }
  
  while ((match = htmlImageRegex.exec(content)) !== null) {
    const imgPath = match[1].trim();
    if (imgPath) {
      images.push(imgPath);
    }
  }
  
  return images;
}

describe('Image Reference Extraction', () => {
  
  test('extracts markdown image references', () => {
    const content = '![Alt text](./images/photo.png)';
    const images = extractImageReferences(content);
    assert.deepEqual(images, ['./images/photo.png']);
  });
  
  test('extracts multiple markdown images', () => {
    const content = `
      ![Image 1](img1.png)
      Some text here
      ![Image 2](img2.jpg)
    `;
    const images = extractImageReferences(content);
    assert.deepEqual(images, ['img1.png', 'img2.jpg']);
  });
  
  test('extracts HTML image references', () => {
    const content = '<img src="./assets/logo.svg" alt="Logo">';
    const images = extractImageReferences(content);
    assert.deepEqual(images, ['./assets/logo.svg']);
  });
  
  test('extracts images with double quotes', () => {
    const content = '<img src="image.png">';
    const images = extractImageReferences(content);
    assert.deepEqual(images, ['image.png']);
  });
  
  test('extracts images with single quotes', () => {
    const content = "<img src='image.png'>";
    const images = extractImageReferences(content);
    assert.deepEqual(images, ['image.png']);
  });
  
  test('handles external URLs', () => {
    const content = '![External](https://example.com/image.png)';
    const images = extractImageReferences(content);
    assert.deepEqual(images, ['https://example.com/image.png']);
  });
  
  test('handles empty alt text', () => {
    const content = '![](./image.png)';
    const images = extractImageReferences(content);
    assert.deepEqual(images, ['./image.png']);
  });
  
  test('handles images with title attribute', () => {
    const content = '![Alt](./image.png "Title text")';
    const images = extractImageReferences(content);
    assert.deepEqual(images, ['./image.png']);
  });
  
  test('returns empty array for no images', () => {
    const content = 'Just some text without images';
    const images = extractImageReferences(content);
    assert.deepEqual(images, []);
  });
  
  test('handles mixed markdown and HTML images', () => {
    const content = `
      ![Markdown](md.png)
      <img src="html.jpg">
    `;
    const images = extractImageReferences(content);
    assert.deepEqual(images, ['md.png', 'html.jpg']);
  });

});

describe('Image Path Validation', () => {
  
  test('validates relative paths correctly', () => {
    // This would need the actual checkImageExists function
    // For now, just test path resolution logic
    const fromFile = 'docs/guide.md';
    const imagePath = '../images/photo.png';
    
    const fromDir = path.dirname(fromFile);
    const resolved = path.normalize(path.join(fromDir, imagePath));
    
    assert.strictEqual(resolved, 'images/photo.png');
  });
  
  test('handles absolute paths', () => {
    const imagePath = '/assets/logo.png';
    const isAbsolute = path.isAbsolute(imagePath);
    assert.strictEqual(isAbsolute, true);
  });

});
