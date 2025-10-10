#!/usr/bin/env python3
"""
Extract translations from i18n.ts and translate to FR, ES, DE using Gemini API
"""
import json
import re
import os
import time
from typing import Dict

# Read API key from root file/config.php
def get_api_key():
    try:
        with open('root file/config.php', 'r', encoding='utf-8') as f:
            content = f.read()
            match = re.search(r"GEMINI_API_KEY',\s*'([^']+)", content)
            if match:
                return match.group(1)
    except:
        pass

    # Fallback to .env.local
    try:
        with open('.env.local', 'r', encoding='utf-8') as f:
            for line in f:
                if line.startswith('VITE_GEMINI_API_KEY='):
                    key = line.split('=')[1].strip()
                    if key:
                        return key
    except:
        pass

    raise Exception("API key not found in config.php or .env.local")

# Extract translations from i18n.ts
def extract_translations(filepath: str, lang: str) -> Dict[str, str]:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the language block
    pattern = rf'{lang}: ' + r'\{([^\}]+(?:\}(?!\};)[^\}]+)*)\}'
    match = re.search(pattern, content, re.DOTALL)

    if not match:
        raise Exception(f"Could not find {lang} translations")

    block = match.group(1)

    # Extract key-value pairs
    translations = {}
    # Match: 'key': 'value' or "key": "value"
    pattern = r"['\"]([^'\"]+)['\"]:\s*['\"]([^'\"]*(?:['\"]['\"][^'\"]*)*)['\"]"

    for match in re.finditer(pattern, block):
        key = match.group(1)
        value = match.group(2).replace("\\'", "'").replace('\\"', '"')
        translations[key] = value

    return translations

# Translate using Gemini API
def translate_with_gemini(api_key: str, translations: Dict[str, str], target_lang: str) -> Dict[str, str]:
    import requests

    lang_names = {
        'fr': 'French',
        'es': 'Spanish',
        'de': 'German'
    }

    target_language = lang_names[target_lang]

    # Prepare JSON for translation
    json_str = json.dumps(translations, ensure_ascii=False, indent=2)

    prompt = f"""Translate this JSON object of UI text from English to {target_language}.
Keep the same keys, only translate the values.
Maintain any special characters, placeholders like {{variable}}, and formatting.
Return ONLY the translated JSON, nothing else.

Input JSON:
{json_str}

Output the complete translated JSON:"""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={api_key}"

    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }

    print(f"Translating to {target_language}...")
    response = requests.post(url, json=payload)

    if response.status_code != 200:
        raise Exception(f"API error: {response.text}")

    data = response.json()
    response_text = data['candidates'][0]['content']['parts'][0]['text']

    # Extract JSON from response (might have markdown code blocks)
    json_match = re.search(r'```json\s*(\{.*\})\s*```', response_text, re.DOTALL)
    if json_match:
        response_text = json_match.group(1)
    elif response_text.strip().startswith('{'):
        # Already clean JSON
        pass
    else:
        # Try to find JSON in the text
        json_match = re.search(r'(\{.*\})', response_text, re.DOTALL)
        if json_match:
            response_text = json_match.group(1)

    translated = json.loads(response_text)
    print(f"[OK] Translated {len(translated)} keys to {target_language}")

    return translated

# Main
def main():
    print("Translation Script for i18n.ts")
    print("=" * 50)

    # Get API key
    api_key = get_api_key()
    print("[OK] API key loaded")

    # Extract EN translations
    print("\nExtracting English translations...")
    en_translations = extract_translations('i18n.ts', 'en')
    print(f"[OK] Found {len(en_translations)} English translations")

    # Extract FA translations
    print("\nExtracting Persian translations...")
    fa_translations = extract_translations('i18n.ts', 'fa')
    print(f"[OK] Found {len(fa_translations)} Persian translations")

    # Translate to FR, ES, DE
    all_translations = {
        'en': en_translations,
        'fa': fa_translations
    }

    for lang in ['fr', 'es', 'de']:
        try:
            all_translations[lang] = translate_with_gemini(api_key, en_translations, lang)
            time.sleep(2)  # Rate limiting
        except Exception as e:
            print(f"[ERROR] translating to {lang}: {e}")
            all_translations[lang] = {}

    # Save to JSON file
    output_file = 'translations_output.json'
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_translations, f, ensure_ascii=False, indent=2)

    print(f"\n[OK] Saved all translations to {output_file}")
    print("\nSummary:")
    for lang, trans in all_translations.items():
        print(f"  {lang.upper()}: {len(trans)} keys")

    print("\n[DONE] Now I'll generate the TypeScript file...")

if __name__ == '__main__':
    main()
