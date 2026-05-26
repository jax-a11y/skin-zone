/**
 * Architecture Content Validator
 * Validates required content and structure across architecture documents.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ARCHITECTURE_DIR = path.join(ROOT, 'architecture');
const DOCUMENTATION_DIR = path.join(ROOT, 'documentation');

// Required documents that must exist
const REQUIRED_DOCS = [
  { path: 'architecture/marketplace_architecture.md', name: 'Marketplace Architecture' },
  { path: 'architecture/hgnn_database_schema.md', name: 'HGNN Database Schema' },
  { path: 'architecture/appdirect_integration.md', name: 'AppDirect Integration' },
  { path: 'architecture/supply_chain_data_flow.md', name: 'Supply Chain Data Flow' },
  { path: 'architecture/user_roles_and_permissions.md', name: 'User Roles and Permissions' },
  { path: 'documentation/final_architecture_document.md', name: 'Final Architecture Document' },
  { path: 'documentation/technical_documentation.md', name: 'Technical Documentation' },
  { path: 'documentation/scalability_security_validation.md', name: 'Scalability & Security Validation' }
];

// Required phrases that must appear across the architecture docs
const CROSS_DOCUMENT_REQUIREMENTS = {
  'Multi-tenancy': {
    phrase: 'multi-tenant',
    locations: ['architecture/marketplace_architecture.md', 'documentation/final_architecture_document.md']
  },
  'HGNN Database': {
    phrase: 'hyper-graph neural network',
    locations: ['architecture/hgnn_database_schema.md', 'documentation/final_architecture_document.md'],
    caseInsensitive: true
  },
  'AppDirect Integration': {
    phrase: 'appdirect',
    locations: ['architecture/appdirect_integration.md', 'documentation/final_architecture_document.md'],
    caseInsensitive: true
  },
  'Security': {
    phrase: 'security',
    locations: ['documentation/scalability_security_validation.md'],
    caseInsensitive: true
  },
  'Scalability': {
    phrase: 'scalab',
    locations: ['documentation/scalability_security_validation.md'],
    caseInsensitive: true
  }
};

// Document structure requirements (headings that must exist)
const STRUCTURE_REQUIREMENTS = {
  'documentation/final_architecture_document.md': [
    { level: 1, pattern: /architecture/i },
    { level: 2, pattern: /system|overview/i }
  ],
  'documentation/technical_documentation.md': [
    { level: 1, pattern: /technical|documentation/i }
  ]
};

let errors = [];
let warnings = [];

function checkRequiredDocs() {
  console.log('Checking required architecture documents...');
  
  for (const doc of REQUIRED_DOCS) {
    const filePath = path.join(ROOT, doc.path);
    if (!fs.existsSync(filePath)) {
      errors.push(`Missing required document: ${doc.name} (${doc.path})`);
    }
  }
}

function checkCrossDocumentRequirements() {
  console.log('Checking cross-document content requirements...');
  
  for (const [concept, req] of Object.entries(CROSS_DOCUMENT_REQUIREMENTS)) {
    for (const location of req.locations) {
      const filePath = path.join(ROOT, location);
      
      if (!fs.existsSync(filePath)) {
        continue; // Already reported as missing
      }
      
      const content = fs.readFileSync(filePath, 'utf8');
      const searchContent = req.caseInsensitive ? content.toLowerCase() : content;
      const searchPhrase = req.caseInsensitive ? req.phrase.toLowerCase() : req.phrase;
      
      if (!searchContent.includes(searchPhrase)) {
        errors.push(`Missing concept "${concept}" (phrase: "${req.phrase}") in ${location}`);
      }
    }
  }
}

function checkDocumentStructure() {
  console.log('Checking document structure requirements...');
  
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  
  for (const [docPath, requirements] of Object.entries(STRUCTURE_REQUIREMENTS)) {
    const filePath = path.join(ROOT, docPath);
    
    if (!fs.existsSync(filePath)) {
      continue; // Already reported as missing
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    for (const req of requirements) {
      const headings = [];
      let match;
      
      while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length;
        const text = match[2];
        headings.push({ level, text });
      }
      
      const hasRequiredHeading = headings.some(
        h => h.level === req.level && req.pattern.test(h.text)
      );
      
      if (!hasRequiredHeading) {
        warnings.push(
          `Document ${docPath} should have a level-${req.level} heading matching ${req.pattern}`
        );
      }
    }
  }
}

function checkMinimumContent() {
  console.log('Checking minimum content requirements...');
  
  for (const doc of REQUIRED_DOCS) {
    const filePath = path.join(ROOT, doc.path);
    
    if (!fs.existsSync(filePath)) {
      continue;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const wordCount = content.split(/\s+/).length;
    
    if (wordCount < 100) {
      warnings.push(`Document ${doc.path} has very little content (${wordCount} words)`);
    }
  }
}

function run() {
  console.log('\n🔍 Validating architecture content...\n');
  
  checkRequiredDocs();
  checkCrossDocumentRequirements();
  checkDocumentStructure();
  checkMinimumContent();
  
  // Report warnings
  if (warnings.length > 0) {
    console.log('\n⚠️  Warnings:');
    warnings.forEach(w => console.log(`   - ${w}`));
  }
  
  // Report errors
  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach(e => console.log(`   - ${e}`));
    console.log(`\n${errors.length} error(s) found.\n`);
    process.exit(1);
  }
  
  console.log('\n✅ Architecture content validation passed!\n');
}

run();
