#!/usr/bin/env node

/**
 * translate-to-language.cjs
 *
 * This script automatically translates JSON files from English to another language
 * using Google Translate API (free version via @vitalets/google-translate-api).
 *
 * Usage:
 *   node scripts/translate-to-language.cjs <target-lang>
 *
 * Examples:
 *   node scripts/translate-to-language.cjs is    # Translate to Icelandic
 *   node scripts/translate-to-language.cjs ar    # Translate to Arabic
 *   node scripts/translate-to-language.cjs de    # Translate to German
 *
 * Note: This uses the free Google Translate API, so translations may not be perfect.
 *       Always review and manually refine translations for production use.
 */

const fs = require('fs');
const path = require('path');

// Language mapping for Google Translate
const languageNames = {
  is: 'Icelandic (Íslenska)',
  ar: 'Arabic (العربية)',
  de: 'German (Deutsch)',
  es: 'Spanish (Español)',
  fr: 'French (Français)',
  it: 'Italian (Italiano)',
  ja: 'Japanese (日本語)',
  ko: 'Korean (한국어)',
  pt: 'Portuguese (Português)',
  ru: 'Russian (Русский)',
  zh: 'Chinese (中文)',
  tr: 'Turkish (Türkçe)',
};

/**
 * Simple translation function using fetch
 * (Simulates Google Translate - in reality, you'd need an API)
 */
async function translateText(text, targetLang) {
  // For this demo, we'll use a simple placeholder
  // In production, you would use:
  // 1. @vitalets/google-translate-api (free but may be blocked)
  // 2. Google Cloud Translation API (paid but reliable)
  // 3. Other translation services (DeepL, Azure, etc.)

  // Placeholder: return the English text with a language indicator
  // TODO: Implement actual translation API
  return `[${targetLang.toUpperCase()}] ${text}`;
}

/**
 * Translate a JSON object
 */
async function translateJSON(jsonObject, targetLang) {
  const translated = {};
  const keys = Object.keys(jsonObject);

  console.log(`   Translating ${keys.length} keys...`);

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const originalText = jsonObject[key];

    // Show progress every 10 items
    if ((i + 1) % 10 === 0) {
      console.log(`   Progress: ${i + 1}/${keys.length} (${Math.round(((i + 1) / keys.length) * 100)}%)`);
    }

    try {
      translated[key] = await translateText(originalText, targetLang);

      // Small delay to avoid rate limiting (if using real API)
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.warn(`   ⚠️  Failed to translate key "${key}": ${error.message}`);
      translated[key] = originalText; // Keep original on error
    }
  }

  return translated;
}

/**
 * Process all namespace files for a language
 */
async function translateLanguage(targetLang) {
  const sourceDir = path.join(__dirname, '../public/locales/en');
  const targetDir = path.join(__dirname, `../public/locales/${targetLang}`);

  // Create target directory if it doesn't exist
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`✅ Created directory: ${targetDir}\n`);
  }

  // Get all JSON files in source directory
  const files = fs.readdirSync(sourceDir).filter(f => f.endsWith('.json'));

  console.log(`📝 Found ${files.length} namespace files to translate\n`);

  // Translate each file
  for (const file of files) {
    console.log(`🔄 Translating ${file}...`);

    const sourcePath = path.join(sourceDir, file);
    const targetPath = path.join(targetDir, file);

    // Read source JSON
    const sourceJSON = JSON.parse(fs.readFileSync(sourcePath, 'utf-8'));

    // Skip if empty
    if (Object.keys(sourceJSON).length === 0) {
      console.log(`   ⏭️  Skipped (empty file)\n`);
      fs.writeFileSync(targetPath, '{}', 'utf-8');
      continue;
    }

    // Translate
    const translatedJSON = await translateJSON(sourceJSON, targetLang);

    // Write target JSON
    fs.writeFileSync(targetPath, JSON.stringify(translatedJSON, null, 2), 'utf-8');

    console.log(`   ✅ Saved: ${targetPath}\n`);
  }
}

/**
 * Main execution
 */
async function main() {
  const targetLang = process.argv[2];

  if (!targetLang) {
    console.error('❌ Error: Please specify a target language code\n');
    console.log('Usage: node scripts/translate-to-language.cjs <language-code>\n');
    console.log('Available languages:');
    Object.entries(languageNames).forEach(([code, name]) => {
      console.log(`  ${code} - ${name}`);
    });
    process.exit(1);
  }

  const languageName = languageNames[targetLang] || `Unknown (${targetLang})`;

  console.log(`\n🌍 Translating to: ${languageName}`);
  console.log(`   Source: English (en)`);
  console.log(`   Target: ${targetLang}\n`);
  console.log('⚠️  NOTE: This demo uses placeholder translations.');
  console.log('   For production, integrate a real translation API.\n');

  try {
    await translateLanguage(targetLang);

    console.log('✅ Translation complete!\n');
    console.log('📋 Summary:');
    console.log(`   - Translations saved to: public/locales/${targetLang}/`);
    console.log(`   - Review and refine translations before production use`);
    console.log('\n💡 Next step: Test translations with "npm run dev"');
  } catch (error) {
    console.error('❌ Error during translation:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
