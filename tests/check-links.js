/**
 * Link Checker
 * Validates internal and external links in markdown files.
 * Use --internal-only flag to skip external link checks (faster, no network)
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');
const axios = require('axios');

const repoRoot = path.resolve(__dirname, '..');
const internalOnly = process.argv.includes('--internal-only');

async function getAllMarkdownFiles() {
  return glob('**/*.md', { 
    cwd: repoRoot, 
    ignore: ['node_modules/**', 'docs/**'] 
  });
}

function extractLinks(content) {
  // Match markdown links: [text](url)
  const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
  const links = [];
  let match;
  
  while ((match = linkRegex.exec(content)) !== null) {
    const url = match[2].trim();
    // Skip anchors-only links and mailto
    if (!url.startsWith('#') && !url.startsWith('mailto:')) {
      // Remove anchor from URL for file existence check
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

async function checkExternalLink(url, timeout = 10000, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      await axios.head(url, { 
        timeout,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; skin-zone-docs-link-checker)'
        },
        maxRedirects: 5,
        validateStatus: status => status < 400
      });
      return { valid: true };
    } catch (error) {
      if (attempt === retries) {
        // Try GET as fallback (some servers don't support HEAD)
        try {
          await axios.get(url, { 
            timeout,
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; skin-zone-docs-link-checker)'
            },
            maxRedirects: 5,
            validateStatus: status => status < 400
          });
          return { valid: true };
        } catch {
          return { 
            valid: false, 
            error: error.code || error.response?.status || error.message 
          };
        }
      }
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  return { valid: false, error: 'Max retries exceeded' };
}

function checkInternalLink(url, fromFile) {
  // Get the directory of the file containing the link
  const fromDir = path.dirname(path.join(repoRoot, fromFile));
  
  // Resolve the link relative to the file's directory
  const absolutePath = path.resolve(fromDir, url);
  
  // Check if file/directory exists
  if (fs.existsSync(absolutePath)) {
    return { valid: true };
  }
  
  // Also check with common extensions if no extension
  if (!path.extname(url)) {
    if (fs.existsSync(absolutePath + '.md')) {
      return { valid: true };
    }
    if (fs.existsSync(path.join(absolutePath, 'README.md'))) {
      return { valid: true };
    }
  }
  
  return { valid: false, error: 'File not found' };
}

async function checkLinks() {
  console.log('🔍 Checking links in markdown files...\n');
  
  if (internalOnly) {
    console.log('   Mode: Internal links only (skipping external)\n');
  }
  
  const files = await getAllMarkdownFiles();
  const results = {
    internal: { checked: 0, broken: [] },
    external: { checked: 0, broken: [], skipped: 0 }
  };
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(repoRoot, file), 'utf8');
    const links = extractLinks(content);
    
    for (const link of links) {
      const isExternal = link.url.startsWith('http://') || link.url.startsWith('https://');
      
      if (isExternal) {
        if (internalOnly) {
          results.external.skipped++;
          continue;
        }
        
        results.external.checked++;
        process.stdout.write(`   Checking: ${link.url.substring(0, 60)}...`);
        
        const result = await checkExternalLink(link.url);
        
        if (!result.valid) {
          console.log(' ❌');
          results.external.broken.push({
            file,
            url: link.original,
            text: link.text,
            error: result.error
          });
        } else {
          console.log(' ✓');
        }
      } else {
        results.internal.checked++;
        const result = checkInternalLink(link.url, file);
        
        if (!result.valid) {
          results.internal.broken.push({
            file,
            url: link.original,
            text: link.text,
            error: result.error
          });
        }
      }
    }
  }
  
  // Report results
  console.log('\n📊 Link Check Results:\n');
  console.log(`   Internal links checked: ${results.internal.checked}`);
  console.log(`   External links checked: ${results.external.checked}`);
  
  if (results.external.skipped > 0) {
    console.log(`   External links skipped: ${results.external.skipped}`);
  }
  
  const allBroken = [...results.internal.broken, ...results.external.broken];
  
  if (allBroken.length > 0) {
    console.log(`\n❌ Broken links found (${allBroken.length}):\n`);
    
    for (const broken of allBroken) {
      console.log(`   File: ${broken.file}`);
      console.log(`   Link: ${broken.url}`);
      console.log(`   Text: "${broken.text}"`);
      console.log(`   Error: ${broken.error}`);
      console.log('');
    }
    
    // Exit with error for internal broken links always
    // For external, only fail if not in internal-only mode
    if (results.internal.broken.length > 0) {
      console.error('Internal link errors must be fixed.\n');
      process.exit(1);
    }
    
    if (!internalOnly && results.external.broken.length > 0) {
      console.error('External link errors found. Review and fix if permanent.\n');
      process.exit(1);
    }
  } else {
    console.log('\n✅ All links are valid!\n');
  }
}

checkLinks().catch(error => {
  console.error('Link check failed:', error);
  process.exit(1);
});


