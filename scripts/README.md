# Translation Scripts

This directory contains scripts for managing i18n translations in the project.

## Available Scripts

### 1. `convert-i18n-to-json.cjs`

Converts the existing `src/i18n.ts` file into organized JSON files for i18next.

**Usage:**

```bash
npm run i18n:convert
```

**What it does:**

- Reads `src/i18n.ts`
- Extracts English (en) and Persian (fa) translations
- Organizes translations into namespaces:
  - `common.json` - General UI, settings, system messages
  - `auth.json` - Authentication screens
  - `entrepreneur.json` - Entrepreneur dashboard, welcome screen, chat interface
  - `marketplace.json` - Marketplace-related translations
  - `admin.json` - Admin panel translations
  - `consultant.json` - Consultant-related translations
- Writes JSON files to `public/locales/{lang}/{namespace}.json`

**Output:**

```
public/locales/
├── en/
│   ├── common.json
│   ├── auth.json
│   ├── entrepreneur.json
│   └── ...
└── fa/
    ├── common.json
    ├── auth.json
    ├── entrepreneur.json
    └── ...
```

---

### 2. `translate-to-language.cjs`

Automatically translates English JSON files to another language.

**Usage:**

```bash
npm run i18n:translate <language-code>
```

**Examples:**

```bash
npm run i18n:translate is    # Icelandic
npm run i18n:translate ar    # Arabic
npm run i18n:translate de    # German
npm run i18n:translate es    # Spanish
npm run i18n:translate fr    # French
```

**What it does:**

- Reads all JSON files from `public/locales/en/`
- Translates each key to the target language
- Writes translated files to `public/locales/{target-lang}/`

**Note:** ⚠️ The current implementation uses placeholder translations. For production use, you should:

1. Install a translation API package (e.g., `@vitalets/google-translate-api`)
2. Get API credentials (Google Cloud Translation API, DeepL, etc.)
3. Update the `translateText()` function in the script
4. **Always review and manually refine AI translations before production!**

---

## Supported Languages

| Code | Language               |
| ---- | ---------------------- |
| `en` | English                |
| `fa` | فارسی (Persian)        |
| `is` | Íslenska (Icelandic)   |
| `ar` | العربية (Arabic)       |
| `de` | Deutsch (German)       |
| `es` | Español (Spanish)      |
| `fr` | Français (French)      |
| `it` | Italiano (Italian)     |
| `ja` | 日本語 (Japanese)      |
| `ko` | 한국어 (Korean)        |
| `pt` | Português (Portuguese) |
| `ru` | Русский (Russian)      |
| `zh` | 中文 (Chinese)         |
| `tr` | Türkçe (Turkish)       |

To add a new language:

1. Run the translation script for that language
2. Add the language to `src/i18n/config.ts` in the `supportedLngs` array
3. Manually review and refine the translations
4. Test the language in the application

---

## Adding a New Namespace

If you need to add translations for a new feature area:

1. **Define the namespace in `convert-i18n-to-json.cjs`:**

   ```javascript
   const namespaceMapping = {
     // ... existing namespaces
     myNewNamespace: ['my_prefix_', 'another_prefix_'],
   };
   ```

2. **Add it to i18next config (`src/i18n/config.ts`):**

   ```typescript
   ns: ['common', 'auth', ..., 'myNewNamespace'],
   ```

3. **Run the conversion script:**

   ```bash
   npm run i18n:convert
   ```

4. **Use in components:**
   ```tsx
   const { t } = useTranslation('myNewNamespace');
   ```

---

## Best Practices

1. **Always use the conversion script** after updating `src/i18n.ts`
2. **Review AI translations** before using in production
3. **Keep namespace files focused** - don't create too many small namespaces
4. **Use descriptive key names** - e.g., `auth_sign_in_button` not just `button`
5. **Test translations** in context before committing
6. **Commit JSON files** along with code changes

---

## Troubleshooting

### Script doesn't extract Persian translations

- Check that `src/i18n.ts` has the correct structure with `en: { }` and `fa: { }` objects
- Ensure all strings use single quotes `'...'` or double quotes `"..."`
- Run with `node scripts/convert-i18n-to-json.cjs` to see detailed output

### Translation script is slow

- The script adds a 100ms delay between API calls to avoid rate limiting
- For large files (100+ keys), expect 10-20 seconds
- Consider translating only specific namespaces if needed

### Translations look wrong

- Remember: AI translations are not perfect
- Always manually review generated translations
- Consider using professional translation services for critical content
- Test with native speakers when possible
