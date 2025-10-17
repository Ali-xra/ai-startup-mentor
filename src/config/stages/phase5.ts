import { PhaseConfig } from '../../types/stage.types';

/**
 * ========================================
 * PHASE 5: Product Development
 * ========================================
 *
 * In this phase, we transform your idea and solution into a real, tangible
 * product. We will focus on defining the core features, planning the
 * "Minimum Viable Product" (MVP), and considering the technical aspects.
 * The goal is to build a version of the product that can solve a core
 * problem for early adopters and allow us to gather real-world feedback.
 */
export const PHASE_5: PhaseConfig = {
  id: 'PRODUCT_DEVELOPMENT',
  phaseNumber: 5,

  title_en: 'Product Development',
  title_fa: 'توسعه محصول',

  description_en: 'In this phase, we transform your idea and solution into a real, tangible product. We will focus on defining the core features, planning the "Minimum Viable Product" (MVP), and considering the technical aspects. The goal is to build a version of the product that can solve a core problem for early adopters and allow us to gather real-world feedback.',
  description_fa: 'در این فاز، ایده و راه‌حل خود را به یک محصول واقعی و قابل ارائه تبدیل می‌کنیم. ما بر روی تعریف دقیق ویژگی‌های اصلی، برنامه‌ریزی برای ساخت "حداقل محصول قابل ارائه" (MVP) و در نظر گرفتن جنبه‌های فنی تمرکز خواهیم کرد. هدف، ساختن نسخه‌ای از محصول است که بتواند مشکل اصلی کاربران اولیه را حل کند و به ما امکان جمع‌آوری بازخورد واقعی را بدهد.',

  subsections: [
    // ========================================
    // 5.1. Product Specifications & Features
    // ========================================
    {
      id: 'PRODUCT_SPECS_FEATURES',
      order: 1,
      title_en: 'Product Specifications & Features',
      title_fa: 'مشخصات و ویژگی‌های محصول',
      stages: [
        {
          id: 'FULL_PRODUCT_DESCRIPTION',
          order: 1,
          title_en: 'Full Product Functionality Description',
          title_fa: 'شرح کامل عملکرد محصول',
          guidance_en: 'This is a much more detailed version of your "Proposed Solution" from Phase 1. You should describe in full detail what your product does, how it works, and what the user experience will be like.',
          guidance_fa: 'این بخش، نسخه‌ی بسیار دقیق‌تری از "راه‌حل پیشنهادی" شما در فاز اول است. شما باید به طور کامل و با جزئیات توضیح دهید که محصول شما چه کاری انجام می‌دهد، چگونه کار می‌کند و تجربه کاربری آن چگونه خواهد بود.',
          question_en: 'Describe your product in as much detail as possible. Imagine you are writing a complete user manual for the end-user.',
          question_fa: 'محصول خود را با تمام جزئیات ممکن توصیف کنید. تصور کنید در حال نوشتن یک راهنمای کامل برای کاربر نهایی هستید.',
          userInputRequired: false,
          outputType: 'text',
          dataKey: 'full_product_description', // ✅ Correct
          promptConfig: {
            role: 'You are a Product Manager AI helping to create detailed product specifications.',
            contextKeys: ['product_description', 'how_it_works', 'early_adopter_persona', 'userInput'],
            goal: 'Create a detailed functional description of the product from a user\'s perspective, like a user guide.',
            outputFormat: 'A comprehensive description, structured with clear headings for major features or user journey stages.',
            constraints: { tone: 'detailed', complexity: 'moderate' },
            prompt: `You are a Product Manager writing a detailed product specification.\nBased on the initial description: {product_description}\nThe core features: {how_it_works}\nAnd the target persona: {early_adopter_persona}\nAnd user input: {userInput}\n\nYour task is to write a detailed functional description of the product. Structure the document like a mini user guide. Explain the end-to-end user journey, starting from onboarding. For each core feature, describe:\n1. **What it is:** A clear explanation of the feature.\n2. **How it works:** The steps the user takes to use it.\n3. **The benefit:** The value it provides to the user persona.`,
          },
        },
        {
          id: 'FEATURE_PRIORITIZATION',
          order: 2,
          title_en: 'Feature Listing & Prioritization',
          title_fa: 'لیست و اولویت‌بندی ویژگی‌ها',
          guidance_en: 'List all the features and capabilities you envision for your product. Then, prioritize them using a method like MoSCoW (Must have, Should have, Could have, Won\'t have). This is crucial for defining the MVP.',
          guidance_fa: 'تمام ویژگی‌ها و قابلیت‌هایی که تصور می‌کنید محصول شما باید داشته باشد را لیست کنید. سپس، با استفاده از روشی مانند MoSCoW (باید داشته باشد، خوب است داشته باشد، می‌تواند داشته باشد، نخواهد داشت)، آن‌ها را اولویت‌بندی کنید. این کار برای تعریف MVP حیاتی است.',
          question_en: 'List all possible features for your product. Then, identify which ones are absolutely essential for the first version (MVP).',
          question_fa: 'تمام ویژگی‌های ممکن برای محصول خود را لیست کنید. سپس مشخص کنید کدام‌ها برای نسخه اول محصول (MVP) کاملاً ضروری هستند؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'feature_prioritization', // ✅ Correct
          promptConfig: {
            role: 'You are a Product Manager AI skilled in feature prioritization using the MoSCoW method.',
            contextKeys: ['full_product_description', 'bmc_value_propositions', 'userInput'],
            goal: 'Brainstorm a comprehensive feature list and prioritize it for an MVP using MoSCoW.',
            outputFormat: 'A comprehensive list of all potential features, clearly categorized under the four MoSCoW headings (Must-have, Should-have, Could-have, Won\'t-have).',
            constraints: { tone: 'structured', complexity: 'moderate' },
            prompt: `You are a Product Manager prioritizing features for a new product.\nBased on the detailed product description: {full_product_description}\nAnd the value propositions: {bmc_value_propositions}\nAnd user input: {userInput}\n\nYour task is to perform a feature prioritization using the MoSCoW method.\n1. **Brainstorm:** First, brainstorm a comprehensive list of all features this product could potentially have.\n2. **Categorize:** Place each feature into one of the following four categories:\n   - **Must-have:** Absolutely critical for the initial launch. Without these, the product is not viable.\n   - **Should-have:** Important, but not vital. Can be postponed to the next release.\n   - **Could-have:** Desirable but not necessary. Nice-to-have improvements.\n   - **Won't-have (this time):** Explicitly out of scope for the foreseeable future.`,
          },
        },
        {
          id: 'PRODUCT_ROADMAP',
          order: 3,
          title_en: 'Product Roadmap',
          title_fa: 'نقشه راه محصول',
          guidance_en: 'A product roadmap is a strategic, visual plan that shows how your product will evolve over time (e.g., in the next 3, 6, and 12 months). It gives your team direction and sets expectations.',
          guidance_fa: 'نقشه راه محصول، یک برنامه استراتژیک و بصری است که نشان می‌دهد محصول شما در طول زمان (مثلاً در ۳، ۶ و ۱۲ ماه آینده) چگونه تکامل خواهد یافت. این نقشه به تیم شما جهت می‌دهد و انتظارات را برای ذی‌نفعان مشخص می‌کند.',
          question_en: 'After launching the initial version (MVP), what major features or improvements do you plan to add to the product in the next 6 to 12 months?',
          question_fa: 'پس از عرضه نسخه اولیه (MVP)، قصد دارید در ۶ تا ۱۲ ماه آینده چه ویژگی‌ها یا بهبودهای عمده‌ای را به محصول اضافه کنید؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'product_roadmap', // ✅ Correct
          promptConfig: {
            role: 'You are a Product Manager AI who creates strategic, theme-based product roadmaps.',
            contextKeys: ['feature_prioritization', 'business_goals_timeline', 'userInput'],
            goal: 'Create a high-level, theme-based product roadmap for the 12 months post-MVP launch.',
            outputFormat: 'A timeline-based roadmap (broken down by quarters), grouping features from the prioritization exercise into strategic themes.',
            constraints: { tone: 'strategic', complexity: 'simple' },
            prompt: `You are a Product Manager creating a strategic roadmap.\nUsing the prioritized feature list (specifically the "Should-have" and "Could-have" items): {feature_prioritization}\nAnd aligned with the business goals: {business_goals_timeline}\nAnd user input: {userInput}\n\nYour task is to create a high-level product roadmap for the first 12 months after the MVP launch.\n1. **Define Themes:** Group the "Should-have" and "Could-have" features into 2-4 strategic themes (e.g., "User Engagement & Retention," "Monetization," "Advanced Analytics").\n2. **Create a Timeline:** Structure the roadmap by quarters (e.g., Q1 Post-Launch, Q2 Post-Launch, etc.).\n3. **Assign Themes to Quarters:** Assign each theme to a specific quarter, explaining briefly why it's prioritized for that time.`,
          },
        },
      ],
    },
    // ========================================
    // 5.2. Minimum Viable Product (MVP)
    // ========================================
    {
      id: 'MVP_DEFINITION',
      order: 2,
      title_en: 'Minimum Viable Product (MVP)',
      title_fa: 'حداقل محصول قابل ارائه (MVP)',
      stages: [
        {
          id: 'MVP_SCOPE',
          order: 1,
          title_en: 'Precise MVP Scope Definition',
          title_fa: 'تعریف دقیق محدوده MVP',
          guidance_en: 'An MVP is a version of your product with the minimum features needed to solve a core problem for early adopters. The goal is to learn with the least possible effort.',
          guidance_fa: 'MVP نسخه‌ای از محصول شما با حداقل ویژگی‌های لازم برای حل یک مشکل اصلی برای گروهی از کاربران اولیه است. هدف از MVP، یادگیری و جمع‌آوری بازخورد با کمترین هزینه و تلاش ممکن است.',
          question_en: 'Write your MVP statement: "Our MVP helps [early adopters] solve [the core problem] by using [essential features]."',
          question_fa: 'بیانیه MVP خود را بنویسید: "MVP ما به [مشتریان اولیه] کمک می‌کند تا [مشکل اصلی] را با استفاده از [ویژگی‌های ضروری] حل کنند."',
          userInputRequired: false,
          outputType: 'text',
          dataKey: 'mvp_scope', // ✅ Correct
          promptConfig: {
            role: 'You are a Product Manager AI that excels at defining clear MVP scopes.',
            contextKeys: ['early_adopter_persona', 'problem_description', 'feature_prioritization', 'userInput'],
            goal: 'Create a concise and powerful MVP statement that defines the core value proposition.',
            outputFormat: 'A clear, single-sentence statement following the specified format.',
            constraints: { tone: 'focused', complexity: 'simple' },
            prompt: `You are a Product Manager defining an MVP scope.\nUsing the following information:\n- Target user: {early_adopter_persona}\n- Core problem: "{problem_description}"\n- "Must-have" features from: {feature_prioritization}\nAnd user input: {userInput}\n\nYour task is to synthesize this into a clear MVP scope statement. Use the following format:\n**"Our MVP enables [target persona] to solve the core problem of [problem] by providing [list of 2-3 most critical 'Must-have' features]."**`,
          },
        },
        {
          id: 'MVP_USER_FLOW',
          order: 2,
          title_en: 'User Flow for the MVP',
          title_fa: 'جریان کاربری (User Flow) برای MVP',
          guidance_en: 'A user flow is the step-by-step path a user takes through your product to achieve their goal. Mapping this flow helps you design a simple and logical user experience.',
          guidance_fa: 'جریان کاربری، مسیر گام‌به‌گامی است که یک کاربر در محصول شما طی می‌کند تا به هدف خود برسد. ترسیم این جریان به شما کمک می‌کند تا تجربه کاربری را ساده و منطقی طراحی کنید.',
          question_en: 'List the main steps, in order, that a user will take in your MVP to solve their problem.',
          question_fa: 'مراحل اصلی که یک کاربر در MVP شما برای حل مشکلش طی می‌کند را به ترتیب لیست کنید.',
          userInputRequired: false,
          outputType: 'list',
          dataKey: 'mvp_user_flow', // ✅ Correct
          promptConfig: {
            role: 'You are a UX Designer AI that maps out simple user flows.',
            contextKeys: ['mvp_scope', 'feature_prioritization', 'userInput'],
            goal: 'Define a high-level user flow (happy path) for the core task of the MVP.',
            outputFormat: 'A numbered list of 5-7 key steps a user would take to get from start to finish.',
            constraints: { tone: 'logical', complexity: 'simple' },
            prompt: `You are a UX Designer mapping the primary user flow for an MVP.\nBased on the MVP scope: "{mvp_scope}"\nAnd its "Must-have" features: {feature_prioritization}\nAnd user input: {userInput}\n\nYour task is to outline the primary user flow (the "happy path"). List the 5-7 key steps a user takes from opening the app/website for the first time to successfully solving their core problem. Be specific and action-oriented (e.g., "1. User signs up with email," "2. User creates their first project," etc.).`,
          },
        },
      ],
    },
    // ========================================
    // 5.3. Technical Aspects
    // ========================================
    {
      id: 'TECHNICAL_ASPECTS',
      order: 3,
      title_en: 'Technical Aspects',
      title_fa: 'جنبه‌های فنی',
      stages: [
        {
          id: 'TECH_STACK',
          order: 1,
          title_en: 'Technology Stack Selection',
          title_fa: 'انتخاب پشته فناوری (Technology Stack)',
          guidance_en: 'The technology stack is the set of tools and frameworks you use to build your product. Choosing the right stack depends on factors like development speed, scalability, and your team\'s expertise.',
          guidance_fa: 'پشته فناوری، مجموعه‌ای از ابزارها، زبان‌های برنامه‌نویسی و فریم‌ورک‌هایی است که برای ساخت محصول خود استفاده می‌کنید. انتخاب پشته مناسب به عواملی مانند سرعت توسعه، مقیاس‌پذیری و تخصص تیم شما بستگی دارد.',
          question_en: 'What technologies (programming language, database, framework, etc.) do you plan to use to build your product? What is the reason for this choice?',
          question_fa: 'برای ساخت محصول خود از چه فناوری‌هایی (زبان برنامه‌نویسی، پایگاه داده، فریم‌ورک و...) قصد دارید استفاده کنید؟ دلیل این انتخاب چیست؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'tech_stack', // ✅ Correct
          promptConfig: {
            role: 'You are a CTO AI providing recommendations on technology stacks for new projects.',
            contextKeys: ['full_product_description', 'feature_prioritization', 'userInput'],
            goal: 'Recommend a suitable and modern technology stack for the MVP, with clear justifications.',
            outputFormat: 'A recommended stack broken down by Frontend, Backend, and Database, with a brief justification for each choice based on MVP requirements.',
            constraints: { tone: 'technical', complexity: 'moderate' },
            tools: { webSearch: true },
            prompt: `You are a CTO recommending a technology stack for an MVP.\nFor a product described as: {full_product_description}\nWith MVP features: {feature_prioritization}\nAnd user input: {userInput}\n\nYour task is to recommend a suitable technology stack for building the MVP. Structure your response as follows:\n1. **Frontend:** Suggest a modern framework (e.g., React, Vue, Svelte). Justify based on development speed and ecosystem.\n2. **Backend:** Suggest a language/framework (e.g., Node.js/Express, Python/Django, Go). Justify based on performance, scalability, and talent availability.\n3. **Database:** Suggest a type of database (e.g., PostgreSQL for relational, MongoDB for NoSQL). Justify based on the likely data structure of the app.`,
          },
        },
        {
          id: 'QA_PLAN',
          order: 2,
          title_en: 'Quality Assurance (QA) & Testing Plan',
          title_fa: 'برنامه کنترل کیفیت و تست (QA Plan)',
          guidance_en: 'How will you ensure your product works correctly before it goes to market? A testing plan specifies what needs to be tested, how, and by whom, to ensure product quality and stability.',
          guidance_fa: 'چگونه مطمئن می‌شوید که محصول شما قبل از عرضه به بازار به درستی کار می‌کند؟ یک برنامه تست مشخص می‌کند که چه چیزهایی، چگونه و توسط چه کسی باید آزمایش شوند تا از کیفیت و پایداری محصول اطمینان حاصل شود.',
          question_en: 'What is your strategy for testing the product and ensuring there are no critical bugs before launching the MVP?',
          question_fa: 'استراتژی شما برای تست محصول و اطمینان از نبودن باگ‌های اساسی قبل از عرضه MVP چیست؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'qa_plan', // ✅ Correct
          promptConfig: {
            role: 'You are a QA Lead AI outlining a practical testing strategy for an MVP.',
            contextKeys: ['mvp_user_flow', 'feature_prioritization', 'userInput'],
            goal: 'Create a high-level yet practical QA and testing plan for the MVP.',
            outputFormat: 'A brief, structured plan outlining the testing strategy, including key testing types and focus areas.',
            constraints: { tone: 'methodical', complexity: 'simple' },
            prompt: `You are a QA Lead outlining a testing strategy for an MVP.\nFor an MVP with the core user flow: {mvp_user_flow}\nAnd features: {feature_prioritization}\nAnd user input: {userInput}\n\nYour task is to outline a high-level QA plan for the MVP. Structure your response as follows:\n1. **Overall Strategy:** Briefly state the primary goal (e.g., "Ensure the 'happy path' user flow is bug-free and the core value is delivered reliably.").\n2. **Key Testing Types:** List the essential testing that will be conducted:\n   - **Unit & Integration Testing:** (Developer responsibility)\n   - **End-to-End Testing:** (Focusing on the main user flow)\n   - **User Acceptance Testing (UAT):** (To be performed by a small group of beta testers).`,
          },
        },
      ],
    },
  ],
};