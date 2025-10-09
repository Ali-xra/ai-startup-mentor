# 📍 PHASE 3: UI/UX Integration

**Priority:** ⭐⭐ (MEDIUM)
**Estimated Time:** 4-6 hours
**Dependencies:** Phase 0, 1, and 2 complete

---

## 🎯 Phase 3 Objectives

1. Display user guidance for each stage
2. Show helpful tips and examples
3. Implement "Get AI Help" button functionality
4. Handle user input (optional) before AI generation
5. Display AI responses in appropriate format
6. Implement accept/reject/edit workflow
7. Integrate translation system
8. Polish UI/UX for smooth user experience

---

## 📦 Phase 3 Deliverables

| # | Deliverable | Type | Location |
|---|-------------|------|----------|
| 1 | Stage Guidance Component | React component | `components/StageGuidance.tsx` |
| 2 | AI Response Display | React component | `components/AIResponseDisplay.tsx` |
| 3 | Updated Chat Interface | React component | `components/ChatInterface.tsx` (updated) |
| 4 | Updated Startup Journey Hook | React hook | `hooks/useStartupJourney.ts` (updated) |
| 5 | Gemini Service Integration | TypeScript service | `services/geminiService.ts` (updated) |

---

## 🔧 Phase 3 Implementation Steps

### Step 3.1: Create Stage Guidance Component

**File:** `components/StageGuidance.tsx`

**Purpose:** Display user instructions, tips, and examples for current stage

```typescript
/**
 * Stage Guidance Component
 * Shows user what to do at each stage
 */

import React, { useState, useEffect } from 'react';
import { Stage } from '../types';
import { STAGE_PROMPTS } from '../config/stagePrompts';
import { useLanguage } from '../contexts/LanguageContext';
import { translateStageGuidance } from '../services/translationService';
import { getUITranslation } from '../i18n/translations';

interface StageGuidanceProps {
    stage: Stage;
}

export const StageGuidance: React.FC<StageGuidanceProps> = ({ stage }) => {
    const { language } = useLanguage();
    const ui = getUITranslation(language);

    const [guidance, setGuidance] = useState({
        title: '',
        description: '',
        goal: '',
        question: '',
        tips: [] as string[],
        examples: [] as string[]
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadGuidance();
    }, [stage, language]);

    const loadGuidance = async () => {
        setIsLoading(true);

        const config = STAGE_PROMPTS[stage];
        if (!config) {
            setIsLoading(false);
            return;
        }

        const originalGuidance = config.userGuidance;

        // Translate all fields in parallel
        const [title, description, goal, question, ...translatedTips] = await Promise.all([
            translateStageGuidance(stage, 'title', originalGuidance.title, language),
            translateStageGuidance(stage, 'description', originalGuidance.description, language),
            translateStageGuidance(stage, 'goal', originalGuidance.goal, language),
            translateStageGuidance(stage, 'question', originalGuidance.question, language),
            ...originalGuidance.tips.map((tip, i) =>
                translateStageGuidance(stage, `tip_${i}`, tip, language)
            )
        ]);

        setGuidance({
            title,
            description,
            goal,
            question,
            tips: translatedTips,
            examples: originalGuidance.examples || []
        });

        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                <div className="animate-pulse">
                    <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-lg p-6 shadow-md border border-blue-100 dark:border-slate-700">
            {/* Title */}
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                {guidance.title}
            </h2>

            {/* Description */}
            <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">
                {guidance.description}
            </p>

            {/* Goal */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Goal</h3>
                        <p className="text-slate-700 dark:text-slate-300">{guidance.goal}</p>
                    </div>
                </div>
            </div>

            {/* Question */}
            <div className="bg-blue-500 text-white rounded-lg p-4 mb-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Question
                </h3>
                <p className="text-lg">{guidance.question}</p>
            </div>

            {/* Tips */}
            {guidance.tips.length > 0 && (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Key Considerations
                    </h3>
                    <ul className="space-y-2">
                        {guidance.tips.map((tip, index) => (
                            <li key={index} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                                <span className="text-blue-500 font-bold mt-0.5">•</span>
                                <span>{tip}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Examples */}
            {guidance.examples && guidance.examples.length > 0 && (
                <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Examples
                    </h3>
                    <ul className="space-y-2">
                        {guidance.examples.map((example, index) => (
                            <li key={index} className="text-sm text-slate-600 dark:text-slate-400 italic">
                                "{example}"
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};
```

---

### Step 3.2: Create AI Response Display Component

**File:** `components/AIResponseDisplay.tsx`

**Purpose:** Display AI-generated content with accept/reject options

```typescript
/**
 * AI Response Display Component
 * Shows AI suggestions with action buttons
 */

import React from 'react';
import { getUITranslation } from '../i18n/translations';
import { useLanguage } from '../contexts/LanguageContext';

interface AIResponseDisplayProps {
    response: string;
    messageId: string;
    outputType: 'selection_list' | 'full_text' | 'structured_list' | 'analysis';
    onAccept: (messageId: string, selectedText: string) => void;
    onReject: (messageId: string) => void;
    onRefine: (messageId: string, instruction: string) => void;
}

export const AIResponseDisplay: React.FC<AIResponseDisplayProps> = ({
    response,
    messageId,
    outputType,
    onAccept,
    onReject,
    onRefine
}) => {
    const { language } = useLanguage();
    const ui = getUITranslation(language);

    const [selectedOption, setSelectedOption] = React.useState<string>('');
    const [isRefining, setIsRefining] = React.useState(false);
    const [refineInstruction, setRefineInstruction] = React.useState('');

    // Parse response based on output type
    const parseResponse = () => {
        if (outputType === 'selection_list') {
            // Extract numbered list items
            const lines = response.split('\n');
            const options = lines
                .filter(line => /^\d+\./.test(line.trim()))
                .map(line => line.trim());
            return options;
        }
        return null;
    };

    const options = parseResponse();

    const handleAccept = () => {
        if (outputType === 'selection_list' && selectedOption) {
            onAccept(messageId, selectedOption);
        } else {
            onAccept(messageId, response);
        }
    };

    const handleRefine = () => {
        if (refineInstruction.trim()) {
            onRefine(messageId, refineInstruction);
            setIsRefining(false);
            setRefineInstruction('');
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            {/* AI Response Header */}
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                </div>
                <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">AI Suggestion</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Review and choose an option</p>
                </div>
            </div>

            {/* Response Content */}
            {outputType === 'selection_list' && options ? (
                <div className="space-y-2 mb-4">
                    {options.map((option, index) => (
                        <label
                            key={index}
                            className={`block p-3 rounded-lg border-2 cursor-pointer transition-all ${
                                selectedOption === option
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-300'
                            }`}
                        >
                            <input
                                type="radio"
                                name="ai-option"
                                value={option}
                                checked={selectedOption === option}
                                onChange={(e) => setSelectedOption(e.target.value)}
                                className="mr-3"
                            />
                            <span className="text-slate-700 dark:text-slate-300">{option}</span>
                        </label>
                    ))}
                </div>
            ) : (
                <div className="prose dark:prose-invert max-w-none mb-4">
                    <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                        {response}
                    </div>
                </div>
            )}

            {/* Refine Section */}
            {isRefining && (
                <div className="mb-4 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        How would you like to refine this?
                    </label>
                    <textarea
                        value={refineInstruction}
                        onChange={(e) => setRefineInstruction(e.target.value)}
                        placeholder="E.g., Make it shorter, add more details, change tone..."
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        rows={3}
                    />
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={handleRefine}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                            Apply
                        </button>
                        <button
                            onClick={() => {
                                setIsRefining(false);
                                setRefineInstruction('');
                            }}
                            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={handleAccept}
                    disabled={outputType === 'selection_list' && !selectedOption}
                    className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {ui.buttons.accept}
                </button>

                <button
                    onClick={() => setIsRefining(!isRefining)}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Refine
                </button>

                <button
                    onClick={() => onReject(messageId)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {ui.buttons.reject}
                </button>
            </div>
        </div>
    );
};
```

---

### Step 3.3: Update Chat Interface

**File:** `components/ChatInterface.tsx` (updates)

**Add Stage Guidance display:**

```typescript
import { StageGuidance } from './StageGuidance';
import { AIResponseDisplay } from './AIResponseDisplay';
import { STAGE_METADATA } from '../config/stageMetadata';

// In the render:
return (
    <div className="flex flex-col h-full">
        {/* Stage Guidance at top */}
        <div className="mb-4">
            <StageGuidance stage={currentStage} />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4">
            {messages.map((message) => {
                if (message.sender === 'ai' && message.isSuggestion) {
                    const metadata = STAGE_METADATA[currentStage];
                    return (
                        <AIResponseDisplay
                            key={message.id}
                            response={message.text}
                            messageId={message.id}
                            outputType={metadata?.outputType || 'full_text'}
                            onAccept={handleAcceptSuggestion}
                            onReject={handleRejectSuggestion}
                            onRefine={handleRefineSuggestion}
                        />
                    );
                }
                return <ChatBubble key={message.id} message={message} />;
            })}
        </div>

        {/* Input area */}
        <div className="border-t pt-4">
            {/* User input textarea */}
            <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={ui.placeholders.typeYourAnswer}
                className="w-full p-3 border rounded-lg"
                rows={3}
            />

            {/* Buttons */}
            <div className="flex gap-2 mt-2">
                <button
                    onClick={() => handleSendMessage(userInput)}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg"
                >
                    {ui.buttons.next}
                </button>

                <button
                    onClick={() => handleGetAIHelp(userInput)}
                    className="px-6 py-2 bg-purple-500 text-white rounded-lg"
                >
                    {ui.buttons.getAIHelp}
                </button>
            </div>
        </div>
    </div>
);
```

---

### Step 3.4: Update useStartupJourney Hook

**File:** `hooks/useStartupJourney.ts` (updates)

**Add AI help handler with user input:**

```typescript
const handleGetAIHelp = async (userInput?: string) => {
    setIsLoading(true);

    try {
        const { stage: currentStage, startupData: currentData } = journeyStateRef.current;

        // Call Gemini with stage-specific prompt + optional user input
        const result = await geminiService.generateResponseForStage(
            currentStage,
            currentData,
            locale,
            userInput // Pass user input if provided
        );

        // Add AI response as a suggestion message
        addMessage({
            text: result.text,
            sender: 'ai',
            isSuggestion: true,
            sources: result.sources
        });
    } catch (error) {
        console.error("Error getting AI help:", error);
        addMessage({
            text: "Sorry, I couldn't generate a suggestion right now.",
            sender: 'system'
        });
    } finally {
        setIsLoading(false);
    }
};

// Update generateResponseForStage signature
export const generateResponseForStage = async (
    stage: Stage,
    startupData: Partial<StartupData>,
    locale: Locale,
    userInput?: string // New parameter
): Promise<{ text: string, sources?: { uri: string, title: string }[] }> => {
    const payload = buildPrompt('generateResponseForStage', {
        stage,
        startupData,
        locale,
        userInput // Pass to buildPrompt
    });

    // ... rest of function
};
```

---

## ✅ Phase 3 Testing Checklist

- [ ] Stage guidance displays correctly
- [ ] Guidance translates to selected language
- [ ] Tips and examples show properly
- [ ] "Get AI Help" button works
- [ ] AI responses display in correct format
- [ ] Selection list allows choosing one option
- [ ] Full text displays as prose
- [ ] Accept button saves response
- [ ] Reject button removes response
- [ ] Refine button allows editing instructions
- [ ] User input (optional) is sent to AI
- [ ] Flow works for all output types
- [ ] No console errors
- [ ] Responsive on mobile

---

## 📊 Phase 3 Success Criteria

✅ **User sees clear guidance at each stage**
✅ **AI help button generates stage-appropriate responses**
✅ **Users can accept/reject/refine AI suggestions**
✅ **User input is incorporated into AI prompts**
✅ **Everything works in multiple languages**
✅ **UI is polished and intuitive**

---

## 🎉 Project Complete!

Once Phase 3 is done:

✅ **All 4 phases complete**
✅ **Full multi-language support**
✅ **Stage-specific AI prompts**
✅ **Polished user experience**
✅ **Ready for production!**

---

## 📚 Final Testing

### End-to-End Test

1. **Start new project**
2. **Select language (e.g., Persian)**
3. **Go through first 5 stages:**
   - Verify guidance translates
   - Try with user input
   - Try without user input
   - Test accept/reject
   - Test refine
4. **Switch language mid-journey**
5. **Verify all data saves correctly**

### Performance Test

- [ ] Guidance loads within 1-2 seconds
- [ ] Translation caching works (check Supabase)
- [ ] AI responses generate within 5-10 seconds
- [ ] No memory leaks
- [ ] Smooth navigation

---

## 🚀 Deployment

### Before deploying:

1. Set `.env` for production:
   ```
   VITE_USE_DIRECT_API=false
   VITE_GEMINI_API_KEY=
   ```

2. Run production build:
   ```bash
   npm run build
   ```

3. Upload to server:
   - `dist/` folder contents
   - `root file/` PHP files

4. Test on production:
   - All languages
   - All stages
   - Translation caching

---

## 🎯 Congratulations!

You've successfully implemented a complete multi-language AI-powered startup mentoring application!

**What you built:**
- ✅ 3-layer translation system
- ✅ 114+ stage-specific AI prompts
- ✅ Intelligent user guidance
- ✅ Polished UI/UX
- ✅ Multi-language support

**Next steps (optional enhancements):**
- Add more languages
- Improve AI prompts based on user feedback
- Add analytics
- Create admin dashboard
- Mobile app version

---
