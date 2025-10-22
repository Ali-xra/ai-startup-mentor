#!/usr/bin/env node

/**
 * convert-i18n-to-json.js
 *
 * This script converts the existing src/i18n.ts file into organized JSON files
 * for use with i18next. It categorizes translations into namespaces based on
 * their key prefixes.
 *
 * Usage:
 *   node scripts/convert-i18n-to-json.js
 *
 * Output:
 *   public/locales/{lang}/{namespace}.json files
 */

const fs = require('fs');
const path = require('path');

// Import the i18n.ts file and extract translations
// Since it's TypeScript, we'll parse it as text
const i18nPath = path.join(__dirname, '../src/i18n.ts');
const i18nContent = fs.readFileSync(i18nPath, 'utf-8');

// Define namespace mappings based on key prefixes
const namespaceMapping = {
  auth: ['auth_'],
  marketplace: ['marketplace_', 'project_', 'investor_', 'like_', 'comment_'],
  entrepreneur: [
    'welcome_',
    'blueprint_',
    'chat_',
    'stage_indicator_',
    'direct_editor_',
    'delete_project_modal_',
  ],
  admin: ['admin_'],
  consultant: ['consultant_'],
  common: [
    'header_',
    'settings_',
    'export_',
    'system_',
    'subsection_',
    'question_',
    // Any keys that don't match other prefixes will go here
  ],
};

/**
 * Extract translation objects from i18n.ts content
 */
function extractTranslations(content) {
  const translations = { en: {}, fa: {} };

  // Simple regex-based extraction (not perfect but works for our structure)
  // Find the en section
  const enMatch = content.match(/en:\s*{([\s\S]*?)},\s*fa:/);
  if (enMatch) {
    const enContent = enMatch[1];
    extractKeyValues(enContent, translations.en);
  }

  // Find the fa section - it comes after en and before the final closing
  // Pattern: fa: { ...content... },\n};
  const faMatch = content.match(/fa:\s*\{([\s\S]*?)\n\s*\},\s*\n\};/);
  if (faMatch) {
    const faContent = faMatch[1];
    extractKeyValues(faContent, translations.fa);
  }

  return translations;
}

/**
 * Extract key-value pairs from a section
 */
function extractKeyValues(content, target) {
  // Match pattern: key: 'value' or key: "value"
  // Also handle multiline strings
  const keyValueRegex = /(\w+):\s*['"`]([\s\S]*?)['"`]\s*,/g;
  let match;

  while ((match = keyValueRegex.exec(content)) !== null) {
    const key = match[1];
    let value = match[2];

    // Unescape escaped quotes and newlines
    value = value
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\n/g, '\n')
      .replace(/\\\\/g, '\\');

    target[key] = value;
  }
}

/**
 * Categorize translations into namespaces
 */
function categorizeTranslations(translations) {
  const namespaced = {};

  // Initialize all namespaces
  Object.keys(namespaceMapping).forEach((ns) => {
    namespaced[ns] = {};
  });

  // Categorize each translation
  Object.entries(translations).forEach(([key, value]) => {
    let assigned = false;

    // Check each namespace (except 'common')
    for (const [namespace, prefixes] of Object.entries(namespaceMapping)) {
      if (namespace === 'common') continue;

      for (const prefix of prefixes) {
        if (key.startsWith(prefix)) {
          namespaced[namespace][key] = value;
          assigned = true;
          break;
        }
      }

      if (assigned) break;
    }

    // If not assigned to any specific namespace, put in 'common'
    if (!assigned) {
      namespaced.common[key] = value;
    }
  });

  return namespaced;
}

/**
 * Write JSON files
 */
function writeJSONFiles(lang, namespaced) {
  const localesDir = path.join(__dirname, `../public/locales/${lang}`);

  // Create directory if it doesn't exist
  if (!fs.existsSync(localesDir)) {
    fs.mkdirSync(localesDir, { recursive: true });
  }

  // Write each namespace to a file
  Object.entries(namespaced).forEach(([namespace, translations]) => {
    const filePath = path.join(localesDir, `${namespace}.json`);
    const content = JSON.stringify(translations, null, 2);
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Created: ${filePath} (${Object.keys(translations).length} keys)`);
  });
}

/**
 * Main execution
 */
function main() {
  console.log('🔄 Converting src/i18n.ts to JSON files...\n');

  try {
    // Extract translations from i18n.ts
    const translations = extractTranslations(i18nContent);

    console.log(`📊 Extracted translations:`);
    console.log(`   English: ${Object.keys(translations.en).length} keys`);
    console.log(`   Persian: ${Object.keys(translations.fa).length} keys\n`);

    // Process each language
    ['en', 'fa'].forEach((lang) => {
      console.log(`\n📝 Processing ${lang.toUpperCase()}:`);

      // Categorize into namespaces
      const namespaced = categorizeTranslations(translations[lang]);

      // Write JSON files
      writeJSONFiles(lang, namespaced);
    });

    console.log('\n✅ Conversion complete!');
    console.log('\n📋 Summary:');
    console.log('   - English translations: public/locales/en/');
    console.log('   - Persian translations: public/locales/fa/');
    console.log('   - Namespaces: common, auth, marketplace, entrepreneur, admin, consultant');
    console.log('\n💡 Next step: Run "npm run dev" and test translations!');
  } catch (error) {
    console.error('❌ Error during conversion:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
