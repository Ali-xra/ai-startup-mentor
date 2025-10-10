import { supabase } from './supabaseClient';
import { Stage } from '../types';

// Language codes we support (currently only EN and FA are fully translated)
export type LanguageCode = 'en' | 'fa'; // TODO: Add 'fr' | 'es' | 'de' when ready

// Translation result interface
interface StageTranslation {
  title: string;
  description: string;
}

// In-memory cache (Layer 1 - fastest)
const translationCache = new Map<string, StageTranslation>();

// Generate cache key
const getCacheKey = (stageId: string, languageCode: LanguageCode): string => {
  return `${stageId}:${languageCode}`;
};

/**
 * Layer 1: Check in-memory cache
 */
const getFromMemory = (stageId: string, languageCode: LanguageCode): StageTranslation | null => {
  const key = getCacheKey(stageId, languageCode);
  return translationCache.get(key) || null;
};

/**
 * Layer 2: Check database cache
 */
const getFromDatabase = async (stageId: string, languageCode: LanguageCode): Promise<StageTranslation | null> => {
  try {
    const { data, error } = await supabase
      .from('stage_translations')
      .select('title, description')
      .eq('stage_id', stageId)
      .eq('language_code', languageCode)
      .single();

    if (error || !data) {
      return null;
    }

    // Store in memory cache for next time
    const key = getCacheKey(stageId, languageCode);
    translationCache.set(key, {
      title: data.title,
      description: data.description || ''
    });

    return {
      title: data.title,
      description: data.description || ''
    };
  } catch (err) {
    console.error('Database translation error:', err);
    return null;
  }
};

/**
 * Layer 3: Request translation from Gemini API
 */
const getFromAPI = async (stageId: string, languageCode: LanguageCode, originalTitle: string, originalDescription: string): Promise<StageTranslation | null> => {
  try {
    const languageNames: Record<LanguageCode, string> = {
      en: 'English',
      fa: 'Persian (Farsi)'
    };

    const targetLanguage = languageNames[languageCode];

    const prompt = `Translate the following startup mentoring stage information to ${targetLanguage}.
This is for a startup mentoring application that guides entrepreneurs through business development.

Original Title: "${originalTitle}"
Original Description: "${originalDescription}"

Provide ONLY the translation in this EXACT format (no extra text):
TITLE: [translated title]
DESCRIPTION: [translated description]

Important:
- Keep the same tone and meaning
- Use business/startup terminology
- Be clear and concise
- NO extra explanation or commentary`;

    // Use environment variable to determine which endpoint to use
    const USE_DIRECT_API = import.meta.env.VITE_USE_DIRECT_API === 'true';

    let responseText = '';

    if (USE_DIRECT_API) {
      // Direct API call
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await response.json();
      responseText = data.candidates[0].content.parts[0].text;
    } else {
      // PHP proxy
      const response = await fetch('/gemini_proxy.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      responseText = data.text;
    }

    // Parse the response
    const titleMatch = responseText.match(/TITLE:\s*(.+)/i);
    const descriptionMatch = responseText.match(/DESCRIPTION:\s*(.+)/i);

    if (!titleMatch || !descriptionMatch) {
      console.error('Failed to parse translation response');
      return null;
    }

    const translation: StageTranslation = {
      title: titleMatch[1].trim(),
      description: descriptionMatch[1].trim()
    };

    // Save to database (Layer 2)
    await saveToDatabase(stageId, languageCode, translation);

    // Save to memory (Layer 1)
    const key = getCacheKey(stageId, languageCode);
    translationCache.set(key, translation);

    return translation;
  } catch (err) {
    console.error('API translation error:', err);
    return null;
  }
};

/**
 * Save translation to database
 */
const saveToDatabase = async (stageId: string, languageCode: LanguageCode, translation: StageTranslation): Promise<void> => {
  try {
    const { error } = await supabase
      .from('stage_translations')
      .upsert({
        stage_id: stageId,
        language_code: languageCode,
        title: translation.title,
        description: translation.description,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'stage_id,language_code'
      });

    if (error) {
      console.error('Failed to save translation:', error);
    }
  } catch (err) {
    console.error('Database save error:', err);
  }
};

/**
 * Main function: Get stage translation with 3-layer caching
 */
export const translateStage = async (
  stageId: Stage | string,
  languageCode: LanguageCode,
  originalTitle: string,
  originalDescription: string = ''
): Promise<StageTranslation> => {
  // If already in English, return as-is
  if (languageCode === 'en') {
    return { title: originalTitle, description: originalDescription };
  }

  const stageIdStr = typeof stageId === 'string' ? stageId : stageId.toString();

  // Layer 1: Memory cache
  const fromMemory = getFromMemory(stageIdStr, languageCode);
  if (fromMemory) {
    return fromMemory;
  }

  // Layer 2: Database cache
  const fromDatabase = await getFromDatabase(stageIdStr, languageCode);
  if (fromDatabase) {
    return fromDatabase;
  }

  // Layer 3: API translation
  const fromAPI = await getFromAPI(stageIdStr, languageCode, originalTitle, originalDescription);
  if (fromAPI) {
    return fromAPI;
  }

  // Fallback: return original
  console.warn(`Translation failed for ${stageIdStr} in ${languageCode}, using original`);
  return { title: originalTitle, description: originalDescription };
};

/**
 * Clear all caches (useful for development/testing)
 */
export const clearTranslationCache = (): void => {
  translationCache.clear();
};

/**
 * Preload translations for multiple stages
 */
export const preloadTranslations = async (
  stages: Array<{ id: Stage | string; title: string; description: string }>,
  languageCode: LanguageCode
): Promise<void> => {
  const promises = stages.map(stage =>
    translateStage(stage.id, languageCode, stage.title, stage.description)
  );
  await Promise.all(promises);
};
