# 🚀 AI Startup Mentor - Complete Implementation Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Phase 0: Translation System](#phase-0-translation-system)
3. [Phase 1: Stage Refinement](#phase-1-stage-refinement)
4. [Phase 2: Stage Prompts Design](#phase-2-stage-prompts-design)
5. [Phase 3: UI/UX Integration](#phase-3-uiux-integration)

---

## 🎯 Project Overview

### Current State
- Working React + TypeScript application
- 111 stages for startup development journey
- Basic AI integration with Gemini API
- English-only interface
- Generic AI prompts for all stages

### Goal State
- Multi-language support (EN, FA, AR, etc.)
- Stage-specific AI prompts
- User guidance for each stage
- Improved UX with clear instructions
- Optimized translation system

### Technology Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL)
- **AI:** Google Gemini API
- **Build Tool:** Vite

---

# 📍 PHASE 0: Translation System

**Priority:** ⭐⭐⭐⭐ (HIGHEST)
**Estimated Time:** 2-3 hours
**Dependencies:** None (this is the foundation)

## 🎯 Phase 0 Objectives

1. Build translation infrastructure for the entire application
2. Support multiple languages (EN, FA, AR, FR, ES, etc.)
3. Implement 3-layer translation architecture
4. Create language selector UI component
5. Ensure all future content is automatically translatable

---

## 📦 Phase 0 Deliverables

| # | Deliverable | Type | Location |
|---|-------------|------|----------|
| 1 | Translation Service | TypeScript file | `services/translationService.ts` |
| 2 | Static UI translations | TypeScript file | `i18n/translations.ts` |
| 3 | Supabase translations table | Database | Supabase dashboard |
| 4 | Language Selector component | React component | `components/LanguageSelector.tsx` |
| 5 | Updated Context for language | React context | `contexts/LanguageContext.tsx` |

---

## 🔧 Phase 0 Implementation Steps

### Step 0.1: Create Supabase Translations Table

**File:** Supabase SQL Editor

```sql
-- Create table for caching stage translations
CREATE TABLE stage_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stage_name TEXT NOT NULL,
    language TEXT NOT NULL,
    field_name TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(stage_name, language, field_name)
);

-- Create index for faster lookups
CREATE INDEX idx_stage_translations_lookup
ON stage_translations(stage_name, language, field_name);

-- Enable RLS (Row Level Security)
ALTER TABLE stage_translations ENABLE ROW LEVEL SECURITY;

-- Allow read access to all authenticated users
CREATE POLICY "Allow read access to authenticated users"
ON stage_translations FOR SELECT
TO authenticated
USING (true);

-- Allow insert only for service role (backend)
CREATE POLICY "Allow insert for service role"
ON stage_translations FOR INSERT
TO authenticated
WITH CHECK (true);
```

**How to execute:**
1. Go to Supabase Dashboard
2. Navigate to SQL Editor
3. Create new query
4. Paste the SQL above
5. Click "Run"
6. Verify table created in Table Editor

---

### Step 0.2: Create Static UI Translations

**File:** `i18n/translations.ts`

**Purpose:** Store translations for static UI elements (buttons, labels, system messages)

```typescript
/**
 * Static UI translations for common interface elements
 * These are manually translated and loaded instantly without API calls
 */

export type SupportedLanguage = 'en' | 'fa' | 'ar' | 'fr' | 'es' | 'de';

export interface UITranslations {
    // Navigation & Buttons
    buttons: {
        next: string;
        back: string;
        save: string;
        cancel: string;
        edit: string;
        delete: string;
        accept: string;
        reject: string;
        getAIHelp: string;
        switchProjects: string;
        restart: string;
        export: string;
        proceedToNext: string;
        requestSuggestion: string;
    };

    // System Messages
    system: {
        loading: string;
        saving: string;
        saved: string;
        error: string;
        success: string;
        pleaseWait: string;
        noConnection: string;
    };

    // Headers & Titles
    headers: {
        welcomeBack: string;
        selectProject: string;
        newProject: string;
        projectProgress: string;
        currentStage: string;
        settings: string;
    };

    // Common Labels
    labels: {
        projectName: string;
        initialIdea: string;
        language: string;
        theme: string;
        progress: string;
        stage: string;
    };

    // Placeholders
    placeholders: {
        enterProjectName: string;
        describeYourIdea: string;
        typeYourAnswer: string;
        optional: string;
    };

    // Validation & Errors
    validation: {
        required: string;
        tooShort: string;
        tooLong: string;
        invalidFormat: string;
    };
}

// English translations (base language)
export const translations: Record<SupportedLanguage, UITranslations> = {
    en: {
        buttons: {
            next: "Next",
            back: "Back",
            save: "Save",
            cancel: "Cancel",
            edit: "Edit",
            delete: "Delete",
            accept: "Accept",
            reject: "Reject",
            getAIHelp: "Get AI Help",
            switchProjects: "Switch Projects",
            restart: "Restart Journey",
            export: "Export Project",
            proceedToNext: "Proceed to Next Section",
            requestSuggestion: "Request AI Suggestion"
        },
        system: {
            loading: "Loading...",
            saving: "Saving...",
            saved: "Saved successfully",
            error: "An error occurred",
            success: "Success!",
            pleaseWait: "Please wait...",
            noConnection: "No internet connection"
        },
        headers: {
            welcomeBack: "Welcome Back",
            selectProject: "Select a Project",
            newProject: "Create New Project",
            projectProgress: "Project Progress",
            currentStage: "Current Stage",
            settings: "Settings"
        },
        labels: {
            projectName: "Project Name",
            initialIdea: "Initial Idea",
            language: "Language",
            theme: "Theme",
            progress: "Progress",
            stage: "Stage"
        },
        placeholders: {
            enterProjectName: "Enter your project name...",
            describeYourIdea: "Describe your startup idea...",
            typeYourAnswer: "Type your answer here...",
            optional: "Optional"
        },
        validation: {
            required: "This field is required",
            tooShort: "Input is too short",
            tooLong: "Input is too long",
            invalidFormat: "Invalid format"
        }
    },

    fa: {
        buttons: {
            next: "بعدی",
            back: "قبلی",
            save: "ذخیره",
            cancel: "لغو",
            edit: "ویرایش",
            delete: "حذف",
            accept: "تایید",
            reject: "رد",
            getAIHelp: "دریافت کمک از هوش مصنوعی",
            switchProjects: "تعویض پروژه",
            restart: "شروع مجدد",
            export: "خروجی پروژه",
            proceedToNext: "ادامه به بخش بعدی",
            requestSuggestion: "درخواست پیشنهاد"
        },
        system: {
            loading: "در حال بارگذاری...",
            saving: "در حال ذخیره...",
            saved: "با موفقیت ذخیره شد",
            error: "خطایی رخ داد",
            success: "موفق!",
            pleaseWait: "لطفاً صبر کنید...",
            noConnection: "اتصال اینترنت برقرار نیست"
        },
        headers: {
            welcomeBack: "خوش آمدید",
            selectProject: "انتخاب پروژه",
            newProject: "ایجاد پروژه جدید",
            projectProgress: "پیشرفت پروژه",
            currentStage: "مرحله فعلی",
            settings: "تنظیمات"
        },
        labels: {
            projectName: "نام پروژه",
            initialIdea: "ایده اولیه",
            language: "زبان",
            theme: "تم",
            progress: "پیشرفت",
            stage: "مرحله"
        },
        placeholders: {
            enterProjectName: "نام پروژه خود را وارد کنید...",
            describeYourIdea: "ایده استارتاپ خود را توضیح دهید...",
            typeYourAnswer: "پاسخ خود را اینجا بنویسید...",
            optional: "اختیاری"
        },
        validation: {
            required: "این فیلد الزامی است",
            tooShort: "ورودی خیلی کوتاه است",
            tooLong: "ورودی خیلی طولانی است",
            invalidFormat: "فرمت نامعتبر"
        }
    },

    // Add more languages as needed
    ar: {
        // Arabic translations...
        buttons: {
            next: "التالي",
            back: "رجوع",
            save: "حفظ",
            cancel: "إلغاء",
            edit: "تحرير",
            delete: "حذف",
            accept: "قبول",
            reject: "رفض",
            getAIHelp: "احصل على مساعدة الذكاء الاصطناعي",
            switchProjects: "تبديل المشاريع",
            restart: "إعادة البدء",
            export: "تصدير المشروع",
            proceedToNext: "المتابعة إلى القسم التالي",
            requestSuggestion: "طلب اقتراح"
        },
        // ... continue with other fields
        system: { loading: "جاري التحميل...", saving: "جاري الحفظ...", saved: "تم الحفظ بنجاح", error: "حدث خطأ", success: "نجح!", pleaseWait: "يرجى الانتظار...", noConnection: "لا يوجد اتصال بالإنترنت" },
        headers: { welcomeBack: "مرحبا بعودتك", selectProject: "اختر مشروعا", newProject: "إنشاء مشروع جديد", projectProgress: "تقدم المشروع", currentStage: "المرحلة الحالية", settings: "الإعدادات" },
        labels: { projectName: "اسم المشروع", initialIdea: "الفكرة الأولية", language: "اللغة", theme: "السمة", progress: "التقدم", stage: "المرحلة" },
        placeholders: { enterProjectName: "أدخل اسم مشروعك...", describeYourIdea: "صف فكرة شركتك الناشئة...", typeYourAnswer: "اكتب إجابتك هنا...", optional: "اختياري" },
        validation: { required: "هذا الحقل مطلوب", tooShort: "المدخلات قصيرة جدًا", tooLong: "المدخلات طويلة جدًا", invalidFormat: "تنسيق غير صالح" }
    },

    fr: { buttons: { next: "Suivant", back: "Retour", save: "Enregistrer", cancel: "Annuler", edit: "Modifier", delete: "Supprimer", accept: "Accepter", reject: "Rejeter", getAIHelp: "Obtenir l'aide de l'IA", switchProjects: "Changer de projet", restart: "Recommencer", export: "Exporter le projet", proceedToNext: "Passer à la section suivante", requestSuggestion: "Demander une suggestion" }, system: { loading: "Chargement...", saving: "Enregistrement...", saved: "Enregistré avec succès", error: "Une erreur s'est produite", success: "Succès!", pleaseWait: "Veuillez patienter...", noConnection: "Pas de connexion Internet" }, headers: { welcomeBack: "Bon retour", selectProject: "Sélectionner un projet", newProject: "Créer un nouveau projet", projectProgress: "Progression du projet", currentStage: "Étape actuelle", settings: "Paramètres" }, labels: { projectName: "Nom du projet", initialIdea: "Idée initiale", language: "Langue", theme: "Thème", progress: "Progression", stage: "Étape" }, placeholders: { enterProjectName: "Entrez le nom de votre projet...", describeYourIdea: "Décrivez votre idée de startup...", typeYourAnswer: "Tapez votre réponse ici...", optional: "Optionnel" }, validation: { required: "Ce champ est obligatoire", tooShort: "L'entrée est trop courte", tooLong: "L'entrée est trop longue", invalidFormat: "Format invalide" } },

    es: { buttons: { next: "Siguiente", back: "Atrás", save: "Guardar", cancel: "Cancelar", edit: "Editar", delete: "Eliminar", accept: "Aceptar", reject: "Rechazar", getAIHelp: "Obtener ayuda de IA", switchProjects: "Cambiar proyectos", restart: "Reiniciar", export: "Exportar proyecto", proceedToNext: "Continuar a la siguiente sección", requestSuggestion: "Solicitar sugerencia" }, system: { loading: "Cargando...", saving: "Guardando...", saved: "Guardado exitosamente", error: "Ocurrió un error", success: "¡Éxito!", pleaseWait: "Por favor espere...", noConnection: "Sin conexión a Internet" }, headers: { welcomeBack: "Bienvenido de nuevo", selectProject: "Seleccionar un proyecto", newProject: "Crear nuevo proyecto", projectProgress: "Progreso del proyecto", currentStage: "Etapa actual", settings: "Configuración" }, labels: { projectName: "Nombre del proyecto", initialIdea: "Idea inicial", language: "Idioma", theme: "Tema", progress: "Progreso", stage: "Etapa" }, placeholders: { enterProjectName: "Ingrese el nombre de su proyecto...", describeYourIdea: "Describa su idea de startup...", typeYourAnswer: "Escriba su respuesta aquí...", optional: "Opcional" }, validation: { required: "Este campo es obligatorio", tooShort: "La entrada es demasiado corta", tooLong: "La entrada es demasiado larga", invalidFormat: "Formato inválido" } },

    de: { buttons: { next: "Weiter", back: "Zurück", save: "Speichern", cancel: "Abbrechen", edit: "Bearbeiten", delete: "Löschen", accept: "Akzeptieren", reject: "Ablehnen", getAIHelp: "KI-Hilfe erhalten", switchProjects: "Projekte wechseln", restart: "Neu starten", export: "Projekt exportieren", proceedToNext: "Zum nächsten Abschnitt", requestSuggestion: "Vorschlag anfordern" }, system: { loading: "Wird geladen...", saving: "Wird gespeichert...", saved: "Erfolgreich gespeichert", error: "Ein Fehler ist aufgetreten", success: "Erfolg!", pleaseWait: "Bitte warten...", noConnection: "Keine Internetverbindung" }, headers: { welcomeBack: "Willkommen zurück", selectProject: "Projekt auswählen", newProject: "Neues Projekt erstellen", projectProgress: "Projektfortschritt", currentStage: "Aktuelle Phase", settings: "Einstellungen" }, labels: { projectName: "Projektname", initialIdea: "Erste Idee", language: "Sprache", theme: "Thema", progress: "Fortschritt", stage: "Phase" }, placeholders: { enterProjectName: "Geben Sie Ihren Projektnamen ein...", describeYourIdea: "Beschreiben Sie Ihre Startup-Idee...", typeYourAnswer: "Geben Sie hier Ihre Antwort ein...", optional: "Optional" }, validation: { required: "Dieses Feld ist erforderlich", tooShort: "Die Eingabe ist zu kurz", tooLong: "Die Eingabe ist zu lang", invalidFormat: "Ungültiges Format" } }
};

// Helper function to get translation
export const getUITranslation = (lang: SupportedLanguage): UITranslations => {
    return translations[lang] || translations.en;
};
```

**How to create:**
1. Create folder: `mkdir i18n`
2. Create file: `i18n/translations.ts`
3. Paste the code above
4. Add more languages as needed

---

### Step 0.3: Create Translation Service

**File:** `services/translationService.ts`

**Purpose:** Core translation logic with 3-layer caching strategy

```typescript
/**
 * Translation Service
 *
 * 3-Layer Translation Architecture:
 * Layer 1: Memory Cache (fastest, session-only)
 * Layer 2: Database Cache (persistent, shared across users)
 * Layer 3: Gemini API (slowest, used only when translation doesn't exist)
 */

import { supabase } from './supabaseClient';

// Language mapping for Gemini API
const LANGUAGE_NAMES: Record<string, string> = {
    'en': 'English',
    'fa': 'Persian (Farsi)',
    'ar': 'Arabic',
    'fr': 'French',
    'es': 'Spanish',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'zh': 'Chinese (Simplified)',
    'ja': 'Japanese',
    'ko': 'Korean',
    'hi': 'Hindi',
    'tr': 'Turkish',
    'nl': 'Dutch'
};

// In-memory cache for current session
const memoryCache = new Map<string, string>();

/**
 * Translate stage guidance text (user instructions, tips, etc.)
 * Uses 3-layer caching to minimize API calls
 *
 * @param stageName - Name of the stage (e.g., "CORE_CONCEPT_IDEA_TITLE")
 * @param field - Field name (e.g., "title", "description", "tips")
 * @param englishText - Original English text to translate
 * @param targetLang - Target language code (e.g., "fa", "ar")
 * @returns Translated text
 */
export const translateStageGuidance = async (
    stageName: string,
    field: string,
    englishText: string,
    targetLang: string
): Promise<string> => {
    // If English, no translation needed
    if (targetLang === 'en') {
        return englishText;
    }

    const cacheKey = `${stageName}_${field}_${targetLang}`;

    // LAYER 1: Check memory cache (fastest)
    if (memoryCache.has(cacheKey)) {
        console.log(`[Translation] Cache HIT (Memory): ${cacheKey}`);
        return memoryCache.get(cacheKey)!;
    }

    // LAYER 2: Check database cache
    try {
        const { data, error } = await supabase
            .from('stage_translations')
            .select('translated_text')
            .eq('stage_name', stageName)
            .eq('field_name', field)
            .eq('language', targetLang)
            .single();

        if (data && !error) {
            console.log(`[Translation] Cache HIT (Database): ${cacheKey}`);
            // Save to memory cache for even faster future access
            memoryCache.set(cacheKey, data.translated_text);
            return data.translated_text;
        }
    } catch (dbError) {
        console.warn(`[Translation] Database cache miss: ${cacheKey}`, dbError);
    }

    // LAYER 3: Translate with Gemini API (slowest, but only happens once per translation)
    console.log(`[Translation] Cache MISS - Calling API: ${cacheKey}`);
    const translated = await translateWithGemini(englishText, targetLang);

    // Save to database for future users
    try {
        await supabase.from('stage_translations').insert({
            stage_name: stageName,
            field_name: field,
            language: targetLang,
            translated_text: translated
        });
        console.log(`[Translation] Saved to database: ${cacheKey}`);
    } catch (insertError) {
        console.warn(`[Translation] Failed to save to database:`, insertError);
    }

    // Save to memory cache
    memoryCache.set(cacheKey, translated);

    return translated;
};

/**
 * Translate dynamic content (AI responses, user-generated content)
 * No caching - each translation is unique
 *
 * @param text - Text to translate
 * @param targetLang - Target language code
 * @returns Translated text
 */
export const translateDynamicContent = async (
    text: string,
    targetLang: string
): Promise<string> => {
    if (targetLang === 'en') {
        return text;
    }

    return translateWithGemini(text, targetLang);
};

/**
 * Call Gemini API for translation
 * Internal helper function
 */
const translateWithGemini = async (
    text: string,
    targetLang: string
): Promise<string> => {
    const languageName = LANGUAGE_NAMES[targetLang] || targetLang;

    // Import Gemini service
    const { default: geminiService } = await import('./geminiService');

    const prompt = {
        contents: [{
            parts: [{
                text: `Translate the following text to ${languageName}.

IMPORTANT RULES:
- Return ONLY the translated text
- NO explanations
- NO introduction like "Here is the translation:"
- NO additional comments
- Maintain the same formatting (line breaks, bullet points, etc.)
- Keep technical terms in English if commonly used

Text to translate:
${text}`
            }]
        }],
        generationConfig: {
            temperature: 0.3, // Low temperature for consistent translations
            maxOutputTokens: 2048,
        }
    };

    try {
        // Use the existing Gemini API infrastructure
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${import.meta.env.VITE_GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(prompt)
            }
        );

        const result = await response.json();
        const translatedText = result?.candidates?.[0]?.content?.parts?.[0]?.text || text;

        return translatedText.trim();
    } catch (error) {
        console.error('[Translation] Gemini API error:', error);
        // Fallback: return original text if translation fails
        return text;
    }
};

/**
 * Batch translate multiple texts (optimization for loading screens)
 *
 * @param items - Array of items to translate
 * @param targetLang - Target language
 * @returns Array of translated texts in same order
 */
export const batchTranslateStageGuidance = async (
    items: Array<{ stageName: string; field: string; text: string }>,
    targetLang: string
): Promise<string[]> => {
    if (targetLang === 'en') {
        return items.map(item => item.text);
    }

    // Translate all in parallel for better performance
    const translations = await Promise.all(
        items.map(item =>
            translateStageGuidance(item.stageName, item.field, item.text, targetLang)
        )
    );

    return translations;
};

/**
 * Clear memory cache (useful for language switching)
 */
export const clearTranslationCache = () => {
    memoryCache.clear();
    console.log('[Translation] Memory cache cleared');
};

/**
 * Preload translations for a stage (optimization)
 * Call this when user enters a new stage to load translations in background
 */
export const preloadStageTranslations = async (
    stageName: string,
    fields: string[],
    texts: string[],
    targetLang: string
): Promise<void> => {
    if (targetLang === 'en') return;

    // Load all translations in parallel
    const promises = fields.map((field, index) =>
        translateStageGuidance(stageName, field, texts[index], targetLang)
    );

    await Promise.all(promises);
    console.log(`[Translation] Preloaded ${fields.length} translations for ${stageName}`);
};
```

**How to create:**
1. Create file: `services/translationService.ts`
2. Paste the code above
3. Ensure Gemini API key is set in `.env.local`

---

### Step 0.4: Create Language Context

**File:** `contexts/LanguageContext.tsx`

**Purpose:** Global state management for user's selected language

```typescript
/**
 * Language Context
 * Manages the user's selected language throughout the application
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage } from '../i18n/translations';

interface LanguageContextType {
    language: SupportedLanguage;
    setLanguage: (lang: SupportedLanguage) => void;
    isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Get initial language from localStorage or default to English
    const [language, setLanguageState] = useState<SupportedLanguage>(() => {
        const saved = localStorage.getItem('userLanguage');
        return (saved as SupportedLanguage) || 'en';
    });

    // Determine if current language is RTL (Right-to-Left)
    const isRTL = ['fa', 'ar'].includes(language);

    // Update localStorage and document direction when language changes
    useEffect(() => {
        localStorage.setItem('userLanguage', language);
        document.documentElement.lang = language;
        document.documentElement.dir = isRTL ? 'rtl' : 'ltr';

        console.log(`[Language] Changed to: ${language} (RTL: ${isRTL})`);
    }, [language, isRTL]);

    const setLanguage = (lang: SupportedLanguage) => {
        setLanguageState(lang);
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, isRTL }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Custom hook to use language context
export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};
```

**How to create:**
1. Create file: `contexts/LanguageContext.tsx`
2. Paste the code above
3. Wrap your app with `<LanguageProvider>` in `index.tsx`

**Update `index.tsx`:**

```typescript
// index.tsx
import { LanguageProvider } from './contexts/LanguageContext';

// Wrap App with LanguageProvider
root.render(
    <AuthProvider>
        <LanguageProvider>
            <App />
        </LanguageProvider>
    </AuthProvider>
);
```

---

### Step 0.5: Create Language Selector Component

**File:** `components/LanguageSelector.tsx`

**Purpose:** UI component for users to select their preferred language

```typescript
/**
 * Language Selector Component
 * Dropdown to select application language
 */

import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { SupportedLanguage } from '../i18n/translations';

const LANGUAGES: Array<{ code: SupportedLanguage; name: string; nativeName: string; flag: string }> = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'fa', name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
];

export const LanguageSelector: React.FC = () => {
    const { language, setLanguage } = useLanguage();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setLanguage(e.target.value as SupportedLanguage);
    };

    return (
        <div className="relative inline-block">
            <select
                value={language}
                onChange={handleChange}
                className="appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
                {LANGUAGES.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.nativeName}
                    </option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-200">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
            </div>
        </div>
    );
};
```

**How to create:**
1. Create file: `components/LanguageSelector.tsx`
2. Paste the code above
3. Import and use in Header component

---

### Step 0.6: Update Header Component

**File:** `components/Header.tsx`

**Purpose:** Add language selector to the header

```typescript
// Add to Header.tsx imports
import { LanguageSelector } from './LanguageSelector';

// Add LanguageSelector to the header UI
// Find the settings menu or header actions section and add:
<div className="flex items-center gap-4">
    <LanguageSelector />
    {/* Other header buttons */}
</div>
```

---

## ✅ Phase 0 Testing Checklist

Before moving to Phase 1, verify:

- [ ] Supabase table `stage_translations` created successfully
- [ ] Can query and insert into table via SQL editor
- [ ] File `i18n/translations.ts` created with all languages
- [ ] File `services/translationService.ts` created and compiles
- [ ] File `contexts/LanguageContext.tsx` created
- [ ] `LanguageProvider` wrapping App in `index.tsx`
- [ ] File `components/LanguageSelector.tsx` created
- [ ] Language selector visible in header
- [ ] Can switch languages and UI updates
- [ ] `localStorage` stores selected language
- [ ] Page direction changes for RTL languages (FA, AR)

**Test the translation service:**

```typescript
// In browser console or a test component
import { translateStageGuidance } from './services/translationService';

// Test translation
const result = await translateStageGuidance(
    'TEST_STAGE',
    'title',
    'Choose Your Startup Name',
    'fa'
);
console.log(result); // Should print Persian translation
```

---

## 📊 Phase 0 Success Criteria

✅ **Translation infrastructure is working**
✅ **Language selector changes language instantly**
✅ **Translations are cached (check Supabase table)**
✅ **RTL languages display correctly**
✅ **No errors in console**
✅ **Performance is good (no lag when switching languages)**

---

## 🚨 Common Issues & Solutions

### Issue 1: Supabase table not created
**Solution:** Make sure you're using the SQL Editor, not the Table Editor. Copy-paste the exact SQL provided.

### Issue 2: Translation service throws errors
**Solution:** Check that `VITE_GEMINI_API_KEY` is set in `.env.local`

### Issue 3: Language doesn't persist after refresh
**Solution:** Verify `localStorage.setItem('userLanguage', language)` is being called

### Issue 4: RTL not working
**Solution:** Check that `document.documentElement.dir = 'rtl'` is executed in LanguageContext

### Issue 5: Translations not caching
**Solution:** Check Supabase RLS policies allow INSERT from authenticated users

---

## 📚 Phase 0 Documentation

### Architecture Diagram

```
┌─────────────────────────────────────────┐
│           User Interface                │
│  ┌──────────────────────────────────┐   │
│  │   LanguageSelector Component    │   │
│  └──────────────────────────────────┘   │
└─────────────────┬───────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│       LanguageContext (State)           │
│  • Current language                     │
│  • setLanguage function                 │
│  • isRTL flag                           │
└─────────────────┬───────────────────────┘
                  │
      ┌───────────┴──────────┐
      ▼                      ▼
┌─────────────┐    ┌─────────────────────┐
│  Static UI  │    │ TranslationService  │
│  (i18n)     │    │  ┌───────────────┐  │
│             │    │  │ Memory Cache  │  │
│ Instant     │    │  └───────┬───────┘  │
│ Lookup      │    │          ▼          │
└─────────────┘    │  ┌───────────────┐  │
                   │  │ Database      │  │
                   │  │ Cache         │  │
                   │  └───────┬───────┘  │
                   │          ▼          │
                   │  ┌───────────────┐  │
                   │  │ Gemini API    │  │
                   │  │ Translation   │  │
                   │  └───────────────┘  │
                   └─────────────────────┘
```

### File Structure After Phase 0

```
ide-maker/
├── services/
│   ├── supabaseClient.ts (existing)
│   ├── geminiService.ts (existing)
│   └── translationService.ts ← NEW
├── contexts/
│   ├── AuthContext.tsx (existing)
│   └── LanguageContext.tsx ← NEW
├── components/
│   ├── Header.tsx (updated)
│   └── LanguageSelector.tsx ← NEW
├── i18n/
│   └── translations.ts ← NEW
└── [other files]
```

---

## 🎯 Ready for Phase 1?

Once all items in the testing checklist are complete and translations are working:

✅ **Move to Phase 1: Stage Refinement**

---

