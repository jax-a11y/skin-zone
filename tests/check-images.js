/**
 * Image Checker
 * Validates that all referenced images in markdown files exist.
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const repoRoot = path.resolve(__dirname, '..');

async function getAllMarkdownFiles() {
  return glob('**/*.md', { 
    cwd: repoRoot, 
    ignore: ['node_modules/**', 'docs/**'] 
  });
}

function extractImageReferences(content) {
  // Match markdown images: ![alt](path) and HTML images: <img src="path">
  const mdImageRegex = /!\[[^\]]*\]\(([^)]+)\)/g;
  const htmlImageRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  
  const images = [];
  let match;
  
  while ((match = mdImageRegex.exec(content)) !== null) {
    const imgPath = match[1].trim().split(' ')[0]; // Handle ![](path "title")
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

function checkImageExists(imagePath, fromFile) {
  // Skip external images
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return { valid: true, external: true };
  }
  
  // Skip data URIs
  if (imagePath.startsWith('data:')) {
    return { valid: true, dataUri: true };
  }
  
  // Get the directory of the file containing the image reference
  const fromDir = path.dirname(path.join(repoRoot, fromFile));
  
  // Resolve the image path relative to the file's directory
  const absolutePath = path.resolve(fromDir, imagePath);
  
  if (fs.existsSync(absolutePath)) {
    return { valid: true };
  }
  
  return { valid: false };
}

async function checkImages() {
  console.log('🖼️  Checking image references in markdown files...\n');
  
  const files = await getAllMarkdownFiles();
  const results = {
    checked: 0,
    external: 0,
    missing: []
  };
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(repoRoot, file), 'utf8');
    const images = extractImageReferences(content);
    
    for (const imagePath of images) {
      const result = checkImageExists(imagePath, file);
      
      if (result.external) {
        results.external++;
        continue;
      }
      
      if (result.dataUri) {
        continue;
      }
      
      results.checked++;
      
      if (!result.valid) {
        results.missing.push({
          file,
          image: imagePath
        });
      }
    }
  }
  
  // Report results
  console.log('📊 Image Check Results:\n');
  console.log(`   Local images checked: ${results.checked}`);
  console.log(`   External images (skipped): ${results.external}`);
  
  if (results.missing.length > 0) {
    console.log(`\n❌ Missing images found (${results.missing.length}):\n`);
    
    for (const missing of results.missing) {
      console.log(`   File: ${missing.file}`);
      console.log(`   Image: ${missing.image}`);
      console.log('');
    }
    
    process.exit(1);
  } else {
    console.log('\n✅ All image references are valid!\n');
  }
}

checkImages().catch(error => {
  console.error('Image check failed:', error);
  process.exit(1);
});

