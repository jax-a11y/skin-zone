const { execSync } = require('child_process');

try {
  console.log('Linting all Markdown files...');
  execSync('npx markdownlint-cli "**/*.md"', { stdio: 'inherit' });
  console.log('Markdown linting passed.');
} catch (error) {
  console.error('Markdown linting failed:');
  process.exit(1);
}

