import { PhaseConfig } from '../../types/stage.types';

/**
 * ========================================
 * PHASE 8: Final Outputs & Fundraising
 * ========================================
 *
 * In this phase, we consolidate all the work from the previous stages into
 * professional and persuasive documents. The goal is to tell a compelling,
 * data-driven story about your business to attract investors and secure
 * the resources needed for growth. This phase is the culmination of all
 * your planning.
 */
export const PHASE_8: PhaseConfig = {
  id: 'FINAL_OUTPUTS_FUNDRAISING',
  phaseNumber: 8,

  title_en: 'Final Outputs & Fundraising',
  title_fa: 'خروجی‌های نهایی و جذب سرمایه',

  description_en:
    'In this phase, we consolidate all the work from the previous stages into professional and persuasive documents. The goal is to tell a compelling, data-driven story about your business to attract investors and secure the resources needed for growth. This phase is the culmination of all your planning.',
  description_fa:
    'در این فاز، تمام کارهایی که در مراحل قبل انجام دادیم را در قالب اسنادی حرفه‌ای و قانع‌کننده جمع‌آوری می‌کنیم. هدف این است که داستانی جذاب و مبتنی بر داده در مورد کسب‌وکارتان تعریف کنید تا بتوانید نظر سرمایه‌گذاران را جلب کرده و منابع لازم برای رشد را تامین نمایید. این فاز، نقطه اوج تمام برنامه‌ریزی‌های شماست.',

  subsections: [
    // ========================================
    // 8.1. Financial Needs
    // ========================================
    {
      id: 'FINANCIAL_NEEDS',
      order: 1,
      title_en: 'Financial Needs',
      title_fa: 'نیازهای مالی',
      stages: [
        {
          id: 'FUNDRAISING_ASK',
          order: 1,
          title_en: 'The Fundraising Ask',
          title_fa: 'مبلغ دقیق سرمایه مورد نیاز (The Ask)',
          guidance_en:
            'This is one of the most critical questions any investor will ask. You need to be clear and specific about how much capital you need to reach your next set of milestones (typically for the next 12-18 months).',
          guidance_fa:
            'شما باید به طور دقیق و شفاف مشخص کنید که برای رسیدن به نقاط عطف بعدی خود (معمولاً برای ۱۲ تا ۱۸ ماه آینده) به چه مقدار سرمایه نیاز دارید. این عدد باید بر اساس پیش‌بینی‌های مالی شما باشد.',
          question_en:
            'Exactly how much capital do you need to execute your plans and achieve your goals for the next 12 to 18 months?',
          question_fa:
            'برای اجرای برنامه‌های خود و رسیدن به اهداف ۱۲ تا ۱۸ ماه آینده، دقیقاً به چه مبلغی سرمایه نیاز دارید؟',
          userInputRequired: true,
          outputType: 'analysis',
          dataKey: 'fundraising_ask', // ✅ Correct
          promptConfig: {
            role: 'You are a startup finance AI helping founders determine their fundraising ask based on projected runway.',
            contextKeys: ['burn_rate', 'key_milestones', 'userInput'],
            goal: 'Calculate a justified fundraising ask to cover 12-18 months of runway, including key growth investments.',
            outputFormat:
              'A specific monetary amount ($) with a clear, simple calculation showing how it was derived from the burn rate and key project costs.',
            constraints: { tone: 'analytical', complexity: 'simple' },
            prompt: `You are a startup finance advisor calculating a fundraising ask.\nBased on:\n- Estimated monthly burn rate: {burn_rate}\n- Key milestones which may have one-time costs: {key_milestones}\n- User input on desired runway (e.g., "18 months"): {userInput}\n\nYour task is to calculate a justified fundraising ask. Structure the response as follows:\n1. **Base Runway Calculation:** (Monthly Burn Rate * 18 months). Show the result.\n2. **Growth Investments:** (Add an estimated budget for major milestone-related costs, if any).\n3. **Contingency Buffer:** (Add a 20% buffer to the total).\n4. **Final Fundraising Ask:** Present the final, rounded number clearly.`,
          },
        },
        {
          id: 'USE_OF_FUNDS',
          order: 2,
          title_en: 'Use of Funds',
          title_fa: 'نحوه استفاده از سرمایه',
          guidance_en:
            'Investors want to know exactly where their money will be spent. You need to provide a clear breakdown of how the capital will be allocated across key areas like product development, marketing, and hiring.',
          guidance_fa:
            'سرمایه‌گذاران می‌خواهند بدانند که پولشان دقیقاً در کجا خرج خواهد شد. شما باید یک تقسیم‌بندی واضح از نحوه تخصیص سرمایه به بخش‌های کلیدی مانند توسعه محصول، بازاریابی و فروش، و استخدام تیم ارائه دهید.',
          question_en:
            'How will you allocate the raised capital among the main departments (e.g., 40% for Team, 30% for Marketing, 20% for Operations)?',
          question_fa:
            'سرمایه جذب شده را چگونه بین بخش‌های اصلی (مثلاً: ۴۰٪ برای تیم، ۳۰٪ برای بازاریابی، ۲۰٪ برای عملیات) تقسیم خواهید کرد؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'use_of_funds', // ✅ Correct
          promptConfig: {
            role: 'You are a startup finance AI helping founders allocate their fundraising capital strategically.',
            contextKeys: [
              'fundraising_ask',
              'hiring_plan',
              'product_roadmap',
              'marketing_objectives',
              'userInput',
            ],
            goal: 'Create a clear, percentage-based breakdown of how the funds will be used to achieve key goals.',
            outputFormat:
              'A percentage-based breakdown (e.g., as a list) for key categories like Product/R&D, Sales & Marketing, and G&A/Hiring, linking each to a goal.',
            constraints: { tone: 'strategic', complexity: 'simple' },
            prompt: `You are a startup finance advisor allocating funds.\nFor a total fundraising ask of: {fundraising_ask}\nConsidering the plans for:\n- Hiring: {hiring_plan}\n- Product Development: {product_roadmap}\n- Marketing: {marketing_objectives}\nAnd user input: {userInput}\n\nYour task is to create a percentage-based breakdown for the Use of Funds. Allocate the total ask into these three core areas and link them to the company's goals:\n- **Product & R&D (e.g., 45%):** To fund the current team and execute the product roadmap.\n- **Sales & Marketing (e.g., 35%):** To fund new marketing hires and execute campaigns to achieve user growth objectives.\n- **General & Administrative (e.g., 20%):** To cover operational overhead and future non-technical hires.`,
          },
        },
      ],
    },
    // ========================================
    // 8.2. Documents & Materials
    // ========================================
    {
      id: 'DOCUMENTS_MATERIALS',
      order: 2,
      title_en: 'Documents & Materials',
      title_fa: 'اسناد و مدارک',
      stages: [
        {
          id: 'PITCH_DECK_OUTLINE',
          order: 1,
          title_en: 'Investor Pitch Deck Outline',
          title_fa: 'طراحی ساختار ارائه سرمایه‌گذار (Pitch Deck)',
          guidance_en:
            "A pitch deck is a brief (usually 10-15 slides) and visual presentation that summarizes the story of your business. It's your primary tool for introducing your startup to investors.",
          guidance_fa:
            'پیچ دک یک ارائه کوتاه (معمولاً ۱۰ تا ۱۵ اسلاید) و بصری است که داستان کسب‌وکار شما را به طور خلاصه روایت می‌کند. این سند، ابزار اصلی شما برای معرفی استارت‌آپ به سرمایه‌گذاران است.',
          question_en:
            'What is the single most important message you want an investor to remember after seeing your presentation? What will be the general structure of your slides?',
          question_fa:
            'مهم‌ترین پیامی که می‌خواهید پس از دیدن ارائه شما در ذهن سرمایه‌گذار باقی بماند چیست؟ ساختار کلی اسلایدهای شما چگونه خواهد بود؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'pitch_deck_outline', // ✅ Correct
          promptConfig: {
            role: 'You are a startup mentor AI that creates compelling, story-driven investor pitch deck outlines.',
            contextKeys: [
              'idea_title',
              'tagline',
              'problem_description',
              'product_description',
              'som_analysis',
              'bmc_revenue_streams',
              'social_media_marketing',
              'competitor_analysis',
              'founding_team',
              'revenue_forecast',
              'fundraising_ask',
              'use_of_funds',
              'userInput',
            ],
            goal: 'Generate a standard 10-12 slide pitch deck outline by synthesizing all the information gathered.',
            outputFormat:
              'A list of 10-12 slide titles, with 2-3 key bullet points under each, summarizing the essential content for that slide.',
            constraints: { tone: 'persuasive', complexity: 'moderate' },
            prompt: `You are a startup mentor building a pitch deck outline.\nYour task is to synthesize all the information gathered so far into a standard 10-slide investor pitch deck outline. For each slide, create a title and 2-3 key bullet points summarizing the most critical information.\n\n1.  **Title Slide:** (Use {idea_title} and {tagline})\n2.  **The Problem:** (Summarize {problem_description})\n3.  **The Solution:** (Summarize {product_description})\n4.  **Market Size:** (Use {som_analysis} as the most tangible number)\n5.  **Business Model:** (Explain the core model from {bmc_revenue_streams})\n6.  **Go-to-Market:** (Summarize the initial channels from {social_media_marketing})\n7.  **Competition:** (Showcase your advantage over competitors from {competitor_analysis})\n8.  **Team:** (Highlight the key strengths of the {founding_team})\n9.  **Financials:** (Show a high-level summary of the {revenue_forecast})\n10. **The Ask:** (State the {fundraising_ask} and show the {use_of_funds} breakdown)`,
          },
        },
        {
          id: 'ONE_PAGER',
          order: 2,
          title_en: 'One-Pager Summary',
          title_fa: 'خلاصه یک صفحه‌ای',
          guidance_en:
            'This document is a condensed, one-page summary of your entire business, often sent as a follow-up. It should include key information like the problem, solution, market, team, and contact details.',
          guidance_fa:
            'این سند، خلاصه‌ای فشرده از کل کسب‌وکار شما در یک صفحه است که معمولاً پس از جلسه اول برای سرمایه‌گذار ارسال می‌شود. این خلاصه باید شامل اطلاعات کلیدی مانند مشکل، راه‌حل، بازار، تیم و اطلاعات تماس باشد.',
          question_en:
            'What are the most critical pieces of information that should be included in a one-page summary for investors?',
          question_fa:
            'مهم‌ترین بخش‌های اطلاعاتی که باید در خلاصه یک صفحه‌ای برای سرمایه‌گذاران گنجانده شود کدامند؟',
          userInputRequired: false,
          outputType: 'text',
          dataKey: 'one_pager', // ✅ Correct
          promptConfig: {
            role: 'You are a startup mentor AI that writes concise one-page summaries for investors.',
            contextKeys: [
              'idea_title',
              'elevator_pitch',
              'problem_description',
              'product_description',
              'som_analysis',
              'pricing_strategy',
              'founding_team',
              'fundraising_ask',
              'userInput',
            ],
            goal: 'Generate a well-structured and highly condensed one-page business summary.',
            outputFormat:
              'A well-formatted text document with clear headings for each key section of the one-pager, designed to be scannable.',
            constraints: { tone: 'professional', complexity: 'simple', maxWords: 400 },
            prompt: `You are a startup mentor creating a one-pager.\nYour task is to synthesize the most critical information into a concise one-page summary for a busy investor. Use clear headings and bullet points. The final output must be under 400 words.\n\n- **{idea_title}**: (Start with the {elevator_pitch})\n- **The Problem:** (1-2 sentences from {problem_description})\n- **The Solution:** (1-2 sentences from {product_description})\n- **Market Opportunity:** (State the {som_analysis} clearly)\n- **Business Model:** (Briefly state the core {pricing_strategy})\n- **Team:** (List the founders and their single most relevant credential, from {founding_team})\n- **The Ask:** (State the {fundraising_ask} for your 18-month runway)\n- **Contact:** (Add placeholder for contact info)`,
          },
        },
      ],
    },
    // ========================================
    // 8.3. Exit Strategy
    // ========================================
    {
      id: 'EXIT_STRATEGY_SUBSECTION',
      order: 3,
      title_en: 'Exit Strategy',
      title_fa: 'استراتژی خروج',
      stages: [
        {
          id: 'EXIT_STRATEGY',
          order: 1,
          title_en: 'Potential Exit Options',
          title_fa: 'گزینه‌های بالقوه خروج',
          guidance_en:
            'Venture capital investors need an "exit event" to realize a return. This typically happens through the sale of your company to a larger corporation (Acquisition) or an IPO. Thinking about this shows you have a long-term vision.',
          guidance_fa:
            'سرمایه‌گذاران خطرپذیر برای کسب سود، نیاز به یک "رویداد خروج" دارند. این رویداد معمولاً از طریق فروش شرکت شما به یک شرکت بزرگتر (Acquisition) یا عرضه اولیه سهام در بورس (IPO) اتفاق می‌افتد.',
          question_en:
            'In the distant future, what is the most likely exit scenario for your business? What kinds of companies might be interested in acquiring your startup?',
          question_fa:
            'در آینده‌ای دور، محتمل‌ترین سناریوی خروج برای کسب‌وکار شما چیست؟ چه شرکت‌هایی ممکن است علاقه‌مند به خرید استارت‌آپ شما باشند؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'exit_strategy', // ✅ Correct
          promptConfig: {
            role: 'You are a market analyst AI that identifies potential strategic acquirers for startups.',
            contextKeys: [
              'competitor_identification',
              'som_analysis',
              'executive_summary',
              'userInput',
            ],
            goal: 'Identify the most likely exit path and list potential strategic acquirers with rationale.',
            outputFormat:
              'A brief analysis outlining the most likely exit path (e.g., Acquisition) and a list of 3-5 potential acquiring companies with a short rationale for each.',
            constraints: { tone: 'strategic', complexity: 'moderate' },
            tools: { webSearch: true },
            prompt: `You are a market analyst identifying potential acquirers.\nBased on the startup summary: {executive_summary}\nThe market size: {som_analysis}\nAnd the list of competitors: {competitor_identification}\nAnd user input: {userInput}\n\nYour task is to outline a potential exit strategy. Structure your response as follows:\n1. **Most Likely Exit Path:** State the most probable exit scenario (e.g., "Strategic acquisition by a larger tech company is the most likely exit path given the niche market.").\n2. **Potential Acquirers:** Use web search to identify 3-5 large, public companies in the same or adjacent markets that have a history of acquisitions.\n3. **Rationale for Each:** For each potential acquirer, provide a one-sentence rationale explaining the strategic value of the acquisition (e.g., "[Company X] would be interested to integrate our technology into their existing enterprise suite.").`,
          },
        },
      ],
    },
  ],
};
