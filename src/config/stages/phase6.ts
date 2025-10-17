import { PhaseConfig } from '../../types/stage.types';

/**
 * ========================================
 * PHASE 6: Marketing & Sales Strategy
 * ========================================
 *
 * Having a great product isn't enough; you need to get it into the hands
 * of the right customers. In this phase, we'll design a roadmap to attract,
 * engage, and convert your target audience into loyal customers. A solid
 * marketing and sales strategy will be the growth engine for your startup.
 */
export const PHASE_6: PhaseConfig = {
  id: 'MARKETING_SALES_STRATEGY',
  phaseNumber: 6,

  title_en: 'Marketing & Sales Strategy',
  title_fa: 'استراتژی بازاریابی و فروش',

  description_en: 'Having a great product isn\'t enough; you need to get it into the hands of the right customers. In this phase, we\'ll design a roadmap to attract, engage, and convert your target audience into loyal customers. A solid marketing and sales strategy will be the growth engine for your startup.',
  description_fa: 'داشتن یک محصول عالی نیست؛ شما باید بتوانید آن را به دست مشتریان مناسب برسانید. در این فاز، ما یک نقشه راه برای جذب، درگیر کردن و تبدیل مخاطبان به مشتریان وفادار طراحی می‌کنیم. یک استراتژی بازاریابی و فروش خوب، موتور رشد استارت‌آپ شما خواهد بود.',

  subsections: [
    // ========================================
    // 6.1. Goals & Metrics
    // ========================================
    {
      id: 'GOALS_METRICS',
      order: 1,
      title_en: 'Goals & Metrics',
      title_fa: 'اهداف و شاخص‌ها',
      stages: [
        {
          id: 'MARKETING_OBJECTIVES',
          order: 1,
          title_en: 'Marketing Objectives',
          title_fa: 'اهداف بازاریابی',
          guidance_en: 'Your marketing objectives should be specific, measurable, and aligned with your overall business goals. These could include increasing brand awareness, acquiring users for the MVP, or generating sales leads.',
          guidance_fa: 'اهداف بازاریابی شما باید مشخص، قابل اندازه‌گیری و در راستای اهداف کلی کسب‌وکارتان باشند. این اهداف می‌توانند شامل افزایش آگاهی از برند، جذب کاربر برای MVP یا تولید سرنخ‌های فروش باشند.',
          question_en: 'What is the most important objective you want to achieve in the first 3 to 6 months after launching your product? (e.g., sign up 1,000 early users, get 20 demo requests).',
          question_fa: 'مهم‌ترین هدفی که می‌خواهید در ۳ تا ۶ ماه اول پس از عرضه محصول به آن برسید چیست؟ (مثلاً: ثبت‌نام ۱۰۰۰ کاربر اولیه، دریافت ۲۰ درخواست دمو).',
          userInputRequired: false,
          outputType: 'text',
          dataKey: 'marketing_objectives', // ✅ Correct
          promptConfig: {
            role: 'You are a marketing strategist AI helping startups set clear launch objectives.',
            contextKeys: ['business_goals_timeline', 'mvp_scope', 'userInput'],
            goal: 'Define a primary, measurable marketing objective for the product launch phase that aligns with the business goals.',
            outputFormat: 'A single, clear objective statement that is specific, measurable, achievable, relevant, and time-bound (SMART).',
            constraints: { tone: 'focused', complexity: 'simple' },
            prompt: `You are a marketing strategist setting a launch objective.\nBased on the overall 3-month business goal from: {business_goals_timeline}\nAnd the MVP scope: "{mvp_scope}"\nAnd user input: {userInput}\n\nYour task is to define one primary, SMART marketing objective for the first 3-6 months post-launch. This objective must be a direct contributor to the main business goal. For example, if the business goal is "acquire first 100 beta users," the marketing objective could be: "Generate 500 qualified sign-ups for the MVP beta waitlist within the first 3 months through targeted online campaigns."`,
          },
        },
        {
          id: 'KPIS',
          order: 2,
          title_en: 'Key Performance Indicators (KPIs)',
          title_fa: 'شاخص‌های کلیدی عملکرد (KPIs)',
          guidance_en: 'KPIs are specific metrics that help you measure your progress toward your objectives. For each objective, you should define one or more KPIs.',
          guidance_fa: 'KPIها معیارهای مشخصی هستند که به شما کمک می‌کنند تا میزان پیشرفت خود در رسیدن به اهدافتان را اندازه‌گیری کنید. برای هر هدف، باید یک یا چند KPI تعریف کنید.',
          question_en: 'What numbers and metrics will you track to measure the success of your marketing objective? (e.g., landing page conversion rate, customer acquisition cost (CAC)).',
          question_fa: 'چه اعداد و معیارهایی را برای سنجش موفقیت هدف بازاریابی خود دنبال خواهید کرد؟ (مثلاً: نرخ تبدیل صفحه فرود، هزینه جذب هر کاربر (CAC)).',
          userInputRequired: false,
          outputType: 'list',
          dataKey: 'kpis', // ✅ Correct
          promptConfig: {
            role: 'You are a marketing analytics AI that defines relevant KPIs.',
            contextKeys: ['marketing_objectives', 'userInput'],
            goal: 'Identify the most critical KPIs to track for the stated marketing objective, distinguishing between leading and lagging indicators.',
            outputFormat: 'A bulleted list of 3-5 key performance indicators with a brief explanation of what each measures.',
            constraints: { tone: 'analytical', complexity: 'simple', count: 5 },
            prompt: `You are a marketing analyst defining KPIs.\nFor the marketing objective: "{marketing_objectives}"\nAnd user input: {userInput}\n\nYour task is to identify the 3-5 most important KPIs to track. For each KPI, briefly explain what it measures and why it is important. Include a mix of:\n- **Leading Indicators (Activity Metrics):** e.g., Website Traffic, Ad Clicks, Content Downloads.\n- **Lagging Indicators (Outcome Metrics):** e.g., Sign-up Conversion Rate, Customer Acquisition Cost (CAC), User Activation Rate.`,
          },
        },
      ],
    },
    // ========================================
    // 6.2. Marketing Strategies
    // ========================================
    {
      id: 'MARKETING_STRATEGIES',
      order: 2,
      title_en: 'Marketing Strategies',
      title_fa: 'استراتژی‌های بازاریابی',
      stages: [
        {
          id: 'CONTENT_MARKETING',
          order: 1,
          title_en: 'Content Marketing',
          title_fa: 'بازاریابی محتوایی',
          guidance_en: 'This strategy focuses on creating and distributing valuable content (like blog posts, videos, podcasts) to attract and engage your target audience. The goal is to build trust and demonstrate your expertise.',
          guidance_fa: 'این استراتژی بر روی تولید و توزیع محتوای ارزشمند (مانند مقالات وبلاگ، ویدیو، پادکست) برای جذب و درگیر کردن مخاطبان هدف تمرکز دارد. هدف، ایجاد اعتماد و نشان دادن تخصص شما در حوزه کاری‌تان است.',
          question_en: 'What type of content can you create that would be useful and engaging for your target audience and help them better understand their problem?',
          question_fa: 'چه نوع محتوایی می‌توانید تولید کنید که برای مخاطب هدف شما مفید و جذاب باشد و مشکل آن‌ها را بهتر برایشان روشن کند؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'content_marketing', // ✅ Correct
          promptConfig: {
            role: 'You are a content strategist AI creating an initial content plan.',
            contextKeys: ['early_adopter_persona', 'problem_description', 'userInput'],
            goal: 'Suggest 2-3 specific and practical content ideas tailored to the target audience\'s problems.',
            outputFormat: 'A list of 2-3 specific content ideas (e.g., "A blog post series on X," "A short video explaining Y") with a brief description of the format and the value it provides.',
            constraints: { tone: 'creative', complexity: 'simple' },
            prompt: `You are a content strategist.\nFor the target persona: {early_adopter_persona}\nWho has the problem: "{problem_description}"\nAnd user input: {userInput}\n\nYour task is to propose a simple content marketing strategy for the launch phase. Suggest 2-3 specific content ideas that would directly address the persona's frustrations and goals. For each idea, specify:\n- **Content Title/Topic:** (e.g., "The Ultimate Guide to Solving [Problem]")\n- **Format:** (e.g., Blog Post, Video Tutorial, Checklist PDF)\n- **Value Proposition:** (Why would the persona want to consume this content?).`,
          },
        },
        {
          id: 'SOCIAL_MEDIA_MARKETING',
          order: 2,
          title_en: 'Social Media Marketing',
          title_fa: 'بازاریابی در شبکه‌های اجتماعی',
          guidance_en: 'Identify which social media platforms your target audience uses most actively and how you can connect with them there. Each social network has its own culture and language.',
          guidance_fa: 'مشخص کنید که مخاطبان هدف شما در کدام شبکه‌های اجتماعی بیشترین فعالیت را دارند و چگونه می‌توانید در آن پلتفرم‌ها با آن‌ها ارتباط برقرار کنید. هر شبکه اجتماعی، فرهنگ و زبان خاص خود را دارد.',
          question_en: 'Which one or two social media platforms will you focus on? What kind of content (e.g., educational, behind-the-scenes, customer testimonials) will you share there?',
          question_fa: 'روی کدام یک یا دو شبکه اجتماعی تمرکز خواهید کرد؟ چه نوع محتوایی (مثلاً آموزشی، پشت صحنه، نظرات مشتریان) در آنجا به اشتراک خواهید گذاشت؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'social_media_marketing', // ✅ Correct
          promptConfig: {
            role: 'You are a social media strategist AI.',
            contextKeys: ['early_adopter_persona', 'brand_personality', 'tone_of_voice', 'userInput'],
            goal: 'Recommend a focused social media strategy with platform choice and content pillars.',
            outputFormat: 'A recommendation for 1-2 primary social media platforms and a list of 3 content pillars (themes) with post examples.',
            constraints: { tone: 'strategic', complexity: 'simple' },
            tools: { webSearch: true },
            prompt: `You are a social media strategist.\nBased on the target persona: {early_adopter_persona}\nAnd the brand personality: {brand_personality} and tone: {tone_of_voice}\nAnd user input: {userInput}\n\nYour task is to recommend a focused social media strategy for the launch. Use web search if needed to confirm where the persona is most active. Your response should include:\n1. **Primary Platform(s):** Recommend the top 1-2 platforms.\n2. **Content Pillars:** Suggest 3 content themes (e.g., "Educational Tips," "User Success Stories," "Behind the Scenes").\n3. **Sample Post:** Write one example social media post that reflects the brand's tone of voice.`,
          },
        },
        {
          id: 'PAID_ADVERTISING',
          order: 3,
          title_en: 'Paid Advertising',
          title_fa: 'تبلیغات پولی',
          guidance_en: 'Paid advertising (like Google or Instagram ads) is a quick way to reach a broad audience. It\'s very useful for testing marketing messages and acquiring users quickly.',
          guidance_fa: 'تبلیغات پولی (مانند تبلیغات گوگل یا اینستاگرام) راهی سریع برای رسیدن به مخاطبان گسترده است. این روش برای تست پیام‌های بازاریابی، افزایش ترافیک اولیه و جذب سریع کاربران بسیار مفید است.',
          question_en: 'If you had a limited advertising budget, on which platform and with what message would you spend it to acquire your first users?',
          question_fa: 'اگر بودجه محدودی برای تبلیغات داشتید، آن را در کدام پلتفرم و با چه پیامی خرج می‌کردید تا اولین کاربران خود را جذب کنید؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'paid_advertising', // ✅ Correct
          promptConfig: {
            role: 'You are a digital advertising specialist AI.',
            contextKeys: ['early_adopter_persona', 'uvp_statement', 'userInput'],
            goal: 'Propose a single, targeted, budget-conscious paid ad campaign idea with sample copy.',
            outputFormat: 'A complete ad campaign recommendation including platform, targeting, and ad copy.',
            constraints: { tone: 'practical', complexity: 'moderate' },
            prompt: `You are a digital advertising specialist.\nFor the target persona: {early_adopter_persona}\nWith the value proposition: "{uvp_statement}"\nAnd user input: {userInput}\n\nYour task is to propose a single, focused paid advertising campaign to acquire the first users on a limited budget. Structure your response as follows:\n1. **Recommended Platform:** (Choose the single best platform, e.g., Google Search, LinkedIn, Instagram, and justify why).\n2. **Targeting Strategy:** (Describe the specific audience to target, e.g., Keywords, Job Titles, Interests).\n3. **Sample Ad Copy:**\n   - **Headline:** (A short, attention-grabbing headline).\n   - **Body Text:** (A brief text that explains the benefit and includes a call-to-action).`,
          },
        },
      ],
    },
    // ========================================
    // 6.3. Sales Strategy
    // ========================================
    {
      id: 'SALES_STRATEGY',
      order: 3,
      title_en: 'Sales Strategy',
      title_fa: 'استراتژی فروش',
      stages: [
        {
          id: 'SALES_PROCESS',
          order: 1,
          title_en: 'Sales Process',
          title_fa: 'فرآیند فروش',
          guidance_en: '(This section is more applicable to B2B businesses). A sales process is the step-by-step journey to convert a potential lead into a paying customer.',
          guidance_fa: '(این بخش بیشتر برای کسب‌وکارهای B2B کاربرد دارد). فرآیند فروش، مراحل گام‌به‌گامی است که شما طی می‌کنید تا یک مشتری بالقوه را به یک مشتری بالفعل تبدیل کنید.',
          question_en: 'What are the main stages a potential customer goes through from the moment they learn about you until they purchase your product?',
          question_fa: 'مراحل اصلی که یک مشتری بالقوه از لحظه آشنایی با شما تا خرید محصول طی می‌کند، چیست؟',
          userInputRequired: false,
          outputType: 'list',
          dataKey: 'sales_process', // ✅ Correct
          promptConfig: {
            role: 'You are a sales process consultant AI.',
            contextKeys: ['bmc_customer_segments', 'bmc_channels', 'userInput'],
            goal: 'Outline a simple sales process or customer journey appropriate for the business model.',
            outputFormat: 'A numbered list of 3-5 key stages in the sales process or customer journey.',
            constraints: { tone: 'methodical', complexity: 'simple' },
            prompt: `You are a sales process consultant.\nConsidering the customer segments: {bmc_customer_segments}\nAnd the channels: {bmc_channels}\nAnd user input: {userInput}\n\nYour task is to outline a simple, high-level sales process (for B2B) or customer journey (for B2C). Identify if the model is primarily B2B or B2C, then list 3-5 key stages. For example:\n- **B2C Customer Journey:** 1. Awareness -> 2. Consideration (Website Visit) -> 3. Conversion (Sign-up) -> 4. Retention (Usage).\n- **B2B Sales Process:** 1. Lead Generation -> 2. Qualification -> 3. Demo/Presentation -> 4. Proposal -> 5. Closing.`,
          },
        },
        {
          id: 'PRICING_STRATEGY',
          order: 2,
          title_en: 'Pricing Strategy',
          title_fa: 'استراتژی قیمت‌گذاری',
          guidance_en: 'Pricing is not just about setting a number; it\'s a reflection of your product\'s value, brand positioning, and business model. There are various models, such as flat-rate, tiered, or freemium.',
          guidance_fa: 'قیمت‌گذاری فقط تعیین یک عدد نیست؛ بلکه بازتابی از ارزش محصول، جایگاه برند و مدل کسب‌وکار شماست. مدل‌های مختلفی مانند قیمت‌گذاری ثابت، پلکانی (Tiered)، بر اساس مصرف (Usage-based) یا فریمیوم (Freemium) وجود دارد.',
          question_en: 'Which pricing model is most suitable for your product and why? On what basis will your initial price be determined (value, competitors, cost)?',
          question_fa: 'چه مدل قیمت‌گذاری برای محصول شما مناسب‌تر است و چرا؟ قیمت اولیه شما بر چه اساسی تعیین خواهد شد (ارزش، رقبا، هزینه)؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'pricing_strategy', // ✅ Correct
          promptConfig: {
            role: 'You are a pricing strategist AI.',
            contextKeys: ['bmc_revenue_streams', 'competitor_analysis', 'bmc_value_propositions', 'userInput'],
            goal: 'Recommend a specific pricing model and a rationale for setting the initial price.',
            outputFormat: 'A recommendation for a specific pricing model, a suggested price point or range, and a clear justification based on value, competition, and psychology.',
            constraints: { tone: 'analytical', complexity: 'moderate' },
            tools: { webSearch: true },
            prompt: `You are a pricing strategist.\nBased on:\n- Revenue model: {bmc_revenue_streams}\n- Competitor analysis: {competitor_analysis}\n- Value propositions: {bmc_value_propositions}\nAnd user input: {userInput}\n\nYour task is to recommend a detailed pricing strategy. Your response should include:\n1. **Recommended Model:** (Choose the most suitable model: Freemium, Tiered Subscription, Per-Seat, etc., and explain why).\n2. **Suggested Price Point(s):** (Propose a specific price or prices for the tiers, e.g., "Free Tier, Pro Tier at $29/month").\n3. **Justification:** (Explain the logic behind the price based on Value-Based, Competition-Based, and Cost-Plus considerations).`,
          },
        },
      ],
    },
    // ========================================
    // 6.4. Execution Plan
    // ========================================
    {
      id: 'EXECUTION_PLAN',
      order: 4,
      title_en: 'Execution Plan',
      title_fa: 'برنامه اجرایی',
      stages: [
        {
          id: 'LAUNCH_CAMPAIGN',
          order: 1,
          title_en: 'Product Launch Campaign Plan',
          title_fa: 'برنامه‌ریزی کمپین عرضه محصول',
          guidance_en: 'Your product launch is a major event. A launch campaign involves a set of coordinated activities over a specific period to build excitement and attract initial users.',
          guidance_fa: 'عرضه محصول شما یک رویداد مهم است و نیاز به برنامه‌ریزی دارد. این کمپین شامل مجموعه‌ای از فعالیت‌های هماهنگ در یک بازه زمانی مشخص برای ایجاد هیجان و جذب کاربران اولیه است.',
          question_en: 'What are the top three activities you will do right before, on the day of, and immediately after your MVP launch to generate buzz?',
          question_fa: 'سه فعالیت اصلی که درست قبل، در روز و بلافاصله بعد از عرضه MVP خود انجام خواهید داد تا توجهات را جلب کنید، چیست؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'launch_campaign', // ✅ Correct
          promptConfig: {
            role: 'You are a product launch specialist AI.',
            contextKeys: ['social_media_marketing', 'content_marketing', 'mvp_scope', 'userInput'],
            goal: 'Create a simple, actionable timeline of activities for the product launch.',
            outputFormat: 'A simple timeline with 3 phases (Pre-Launch, Launch Day, Post-Launch) and 2-3 key, concrete activities listed for each phase.',
            constraints: { tone: 'action-oriented', complexity: 'simple' },
            prompt: `You are a product launch specialist.\nBased on:\n- Social media plan: {social_media_marketing}\n- Content plan: {content_marketing}\n- MVP scope: "{mvp_scope}"\nAnd user input: {userInput}\n\nYour task is to create a simple but effective launch campaign plan. Outline 2-3 key marketing activities for each of these three phases:\n- **Pre-Launch (1-2 weeks before):** (e.g., "Announce launch date on social media," "Publish a teaser blog post," "Email waitlist with early access offer").\n- **Launch Day:** (e.g., "Official announcement on all channels," "Launch on Product Hunt," "Engage with comments and feedback in real-time").\n- **Post-Launch (1 week after):** (e.g., "Share early user testimonials," "Publish a 'how-to' video tutorial," "Send a thank-you email to all initial sign-ups").`,
          },
        },
      ],
    },
  ],
};