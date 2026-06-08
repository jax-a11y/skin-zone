/**
 * Markdown Linter
 * Lints all markdown files using markdownlint-cli2.
 */

const { execSync } = require('child_process');

try {
  console.log('🔍 Linting all Markdown files...\n');
  
  execSync('npx markdownlint-cli2', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  
  console.log('\n✅ Markdown linting passed.\n');
} catch (error) {
  console.error('\n❌ Markdown linting failed.\n');
  process.exit(1);
}

