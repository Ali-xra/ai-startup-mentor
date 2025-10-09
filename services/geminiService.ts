import { StartupData, Stage, Locale } from '../types';

// Check if we should use direct API or PHP proxy
const USE_DIRECT_API = import.meta.env.VITE_USE_DIRECT_API === 'true';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Helper function to call Gemini API directly (for local testing)
const callGeminiDirect = async (payload: any): Promise<any> => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API Error:', errorText);
        throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const result = await response.json();

    // Extract text from Gemini response
    const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const sources = result?.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
        uri: chunk.web?.uri || '',
        title: chunk.web?.title || ''
    })) || [];

    return { text, sources };
};

// Helper function to call Gemini Image API directly (Reserved for future use)
// const callGeminiImageDirect = async (payload: any): Promise<any> => {
//     const url = `https://generativelanguage.googleapis.com/v1/models/imagen-4.0-generate-001:generateImages?key=${GEMINI_API_KEY}`;
//
//     const response = await fetch(url, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//     });
//
//     if (!response.ok) {
//         const errorText = await response.text();
//         console.error('Gemini Image API Error:', errorText);
//         throw new Error(`Gemini Image API error: ${response.statusText}`);
//     }
//
//     return response.json();
// };

// Helper function to handle API calls to the PHP proxy
const callProxy = async (endpoint: 'gemini_proxy.php' | 'gemini_image_proxy.php', body: object) => {
    const proxyUrl = `/${endpoint}`;

    const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        throw new Error(`Proxy error: ${response.statusText} - ${errorData.error || 'Unknown error'}`);
    }

    return response.json();
};

// Build prompt based on action
const buildPrompt = (action: string, data: any, locale: Locale): any => {
    const isRTL = locale === 'fa';
    const lang = isRTL ? 'Persian (Farsi)' : 'English';

    let systemInstruction = `You are an AI startup mentor helping entrepreneurs develop their business ideas. Always respond in ${lang}.`;
    let userPrompt = '';

    switch (action) {
        case 'generateSuggestion':
            userPrompt = `Based on the startup idea "${data.startupData.initialIdea || ''}" and current stage "${data.stage}", provide a helpful suggestion for the entrepreneur. Be specific and actionable.`;
            break;

        case 'refineText':
            userPrompt = `Original text: "${data.originalText}"\n\nUser instruction: "${data.instruction}"\n\nPlease refine the text according to the instruction while maintaining its core meaning.`;
            break;

        case 'generateSectionSummary':
            userPrompt = `Generate a comprehensive summary for the "${data.summaryStage}" section based on all the information provided so far: ${JSON.stringify(data.startupData)}`;
            break;

        case 'generateResponseForStage':
            userPrompt = `For the startup "${data.startupData.projectName || data.startupData.initialIdea}" at stage "${data.stage}", provide detailed analysis and insights. Use web search if needed to provide current market data.`;
            systemInstruction += ' Use Google Search grounding when appropriate.';
            break;

        case 'generateImageIdeas':
            userPrompt = `For the startup "${data.startupData.projectName}" at stage "${data.stage}", the user input is: "${data.userInput}". Provide creative visual ideas and return them in JSON format with image descriptions.`;
            break;
    }

    return {
        contents: [{
            parts: [{
                text: userPrompt
            }]
        }],
        systemInstruction: {
            parts: [{
                text: systemInstruction
            }]
        },
        generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
        }
    };
};

export const generateSuggestion = async (stage: Stage, startupData: Partial<StartupData>, locale: Locale): Promise<string> => {
    const payload = buildPrompt('generateSuggestion', { stage, startupData, locale }, locale);

    if (USE_DIRECT_API) {
        const result = await callGeminiDirect(payload);
        return result.text || '';
    } else {
        const result = await callProxy('gemini_proxy.php', payload);
        return result.text ?? '';
    }
};

export const refineText = async (originalText: string, instruction: string, startupData: Partial<StartupData>, locale: Locale): Promise<string> => {
    const payload = buildPrompt('refineText', { originalText, instruction, startupData, locale }, locale);

    if (USE_DIRECT_API) {
        const result = await callGeminiDirect(payload);
        return result.text || '';
    } else {
        const result = await callProxy('gemini_proxy.php', payload);
        return result.text ?? '';
    }
};

export const generateSectionSummary = async (summaryStage: Stage, startupData: Partial<StartupData>, locale: Locale): Promise<string> => {
    const payload = buildPrompt('generateSectionSummary', { summaryStage, startupData, locale }, locale);

    if (USE_DIRECT_API) {
        const result = await callGeminiDirect(payload);
        return result.text || '';
    } else {
        const result = await callProxy('gemini_proxy.php', payload);
        return result.text ?? '';
    }
};

export const generateResponseForStage = async (stage: Stage, startupData: Partial<StartupData>, locale: Locale): Promise<{ text: string, sources?: { uri: string, title: string }[] }> => {
    const payload = buildPrompt('generateResponseForStage', { stage, startupData, locale }, locale);

    if (USE_DIRECT_API) {
        const result = await callGeminiDirect(payload);
        return {
            text: result.text || '',
            sources: result.sources || []
        };
    } else {
        const result = await callProxy('gemini_proxy.php', payload);
        return {
            text: result.text ?? '',
            sources: result.sources || []
        };
    }
};

export const generateImageIdeas = async (stage: Stage, userInput: string, startupData: Partial<StartupData>, locale: Locale): Promise<{ text: string, jsonData: string, images: string[] }> => {
    const payload = buildPrompt('generateImageIdeas', { stage, userInput, startupData, locale }, locale);

    if (USE_DIRECT_API) {
        // For direct API, we'll use text generation for now (image generation requires different approach)
        const result = await callGeminiDirect(payload);
        return {
            text: result.text || 'Here are some ideas based on your input.',
            jsonData: result.text || '{}',
            images: [] // Image generation would require separate implementation
        };
    } else {
        const result = await callProxy('gemini_image_proxy.php', payload);
        return {
            text: result.text ?? 'Here are some ideas based on your input.',
            jsonData: result.jsonData ?? '{}',
            images: result.images || []
        };
    }
};
