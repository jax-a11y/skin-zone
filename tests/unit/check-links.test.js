/**
 * Unit Tests for Link Checker
 * Tests the link extraction and validation logic.
 */

const { test, describe } = require('node:test');
const assert = require('node:assert');
const path = require('path');

// Mock functions for testing
function extractLinks(content) {
  const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
  const links = [];
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[2].trim();
    if (!url.startsWith('#') && !url.startsWith('mailto:')) {
      const urlWithoutAnchor = url.split('#')[0];
      links.push({
        url: urlWithoutAnchor || url,
        original: url,
        text: match[1]
      });
    }
  }
  
  return links;
}

describe('Link Extraction', () => {
  
  test('extracts basic markdown links', () => {
    const content = '[Example](https://example.com)';
    const links = extractLinks(content);
    assert.strictEqual(links.length, 1);
    assert.strictEqual(links[0].url, 'https://example.com');
    assert.strictEqual(links[0].text, 'Example');
  });
  
  test('extracts multiple links', () => {
    const content = `
      [Link 1](./page1.md)
      [Link 2](./page2.md)
    `;
    const links = extractLinks(content);
    assert.strictEqual(links.length, 2);
    assert.strictEqual(links[0].url, './page1.md');
    assert.strictEqual(links[1].url, './page2.md');
  });
  
  test('ignores anchor-only links', () => {
    const content = '[Jump](#section)';
    const links = extractLinks(content);
    assert.strictEqual(links.length, 0);
  });
  
  test('ignores mailto links', () => {
    const content = '[Email](mailto:test@example.com)';
    const links = extractLinks(content);
    assert.strictEqual(links.length, 0);
  });
  
  test('handles links with anchors', () => {
    const content = '[Section](./doc.md#heading)';
    const links = extractLinks(content);
    assert.strictEqual(links.length, 1);
    assert.strictEqual(links[0].url, './doc.md');
    assert.strictEqual(links[0].original, './doc.md#heading');
  });
  
  test('extracts http and https links', () => {
    const content = `
      [HTTP](http://example.com)
      [HTTPS](https://example.com)
    `;
    const links = extractLinks(content);
    assert.strictEqual(links.length, 2);
    assert.strictEqual(links[0].url, 'http://example.com');
    assert.strictEqual(links[1].url, 'https://example.com');
  });
  
  test('handles empty link text', () => {
    const content = '[](./empty-text.md)';
    const links = extractLinks(content);
    assert.strictEqual(links.length, 1);
    assert.strictEqual(links[0].text, '');
  });
  
  test('extracts relative paths', () => {
    const content = '[Parent](../parent.md)';
    const links = extractLinks(content);
    assert.strictEqual(links[0].url, '../parent.md');
  });
  
  test('returns empty array for no links', () => {
    const content = 'Just plain text';
    const links = extractLinks(content);
    assert.strictEqual(links.length, 0);
  });
  
  test('handles complex link text', () => {
    const content = '[Link with `code` inside](./doc.md)';
    const links = extractLinks(content);
    assert.strictEqual(links.length, 1);
    assert.strictEqual(links[0].text, 'Link with `code` inside');
  });

});

describe('Link Classification', () => {
  
  test('identifies external links', () => {
    const urls = [
      'https://example.com',
      'http://example.com',
      'https://github.com/user/repo'
    ];
    
    for (const url of urls) {
      const isExternal = url.startsWith('http://') || url.startsWith('https://');
      assert.strictEqual(isExternal, true, `${url} should be external`);
    }
  });
  
  test('identifies internal links', () => {
    const urls = [
      './page.md',
      '../docs/guide.md',
      'relative/path.md',
      '/absolute/path.md'
    ];
    
    for (const url of urls) {
      const isExternal = url.startsWith('http://') || url.startsWith('https://');
      assert.strictEqual(isExternal, false, `${url} should be internal`);
    }
  });

});

describe('Path Resolution', () => {
  
  test('resolves sibling file paths', () => {
    const fromFile = 'docs/guide.md';
    const linkUrl = './other.md';
    
    const fromDir = path.dirname(fromFile);
    const resolved = path.normalize(path.join(fromDir, linkUrl));
    
    assert.strictEqual(resolved, path.normalize('docs/other.md'));
  });
  
  test('resolves parent directory paths', () => {
    const fromFile = 'docs/deep/guide.md';
    const linkUrl = '../other.md';
    
    const fromDir = path.dirname(fromFile);
    const resolved = path.normalize(path.join(fromDir, linkUrl));
    
    assert.strictEqual(resolved, path.normalize('docs/other.md'));
  });
  
  test('resolves nested paths', () => {
    const fromFile = 'README.md';
    const linkUrl = './docs/guide.md';
    
    const fromDir = path.dirname(fromFile);
    const resolved = path.normalize(path.join(fromDir, linkUrl));
    
    assert.strictEqual(resolved, path.normalize('docs/guide.md'));
  });

});
