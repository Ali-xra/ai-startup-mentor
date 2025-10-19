import { PhaseConfig } from '../../types/stage.types';

/**
 * ========================================
 * PHASE 4: Branding & Identity
 * ========================================
 *
 * Your brand is more than just a logo or a name; it's the feeling and
 * perception people have about your company. In this phase, we will
 * define the personality and identity of your business. A strong brand
 * helps you remain memorable in the minds of customers, build trust,
 * and differentiate yourself from the competition.
 */
export const PHASE_4: PhaseConfig = {
  id: 'BRANDING_IDENTITY',
  phaseNumber: 4,

  title_en: 'Branding & Identity',
  title_fa: 'برندینگ و هویت‌سازی',

  description_en:
    "Your brand is more than just a logo or a name; it's the feeling and perception people have about your company. In this phase, we will define the personality and identity of your business. A strong brand helps you remain memorable in the minds of customers, build trust, and differentiate yourself from the competition.",
  description_fa:
    'برند شما چیزی فراتر از یک لوگو یا نام است؛ برند، احساس و برداشتی است که مردم در مورد شرکت شما دارند. در این فاز، ما شخصیت و هویت کسب‌وکار شما را تعریف می‌کنیم. یک برند قوی به شما کمک می‌کند تا در ذهن مشتریان ماندگار شوید، اعتماد ایجاد کنید و خود را از رقبا متمایز سازید.',

  subsections: [
    // ========================================
    // 4.1. Brand Strategy
    // ========================================
    {
      id: 'BRAND_STRATEGY',
      order: 1,
      title_en: 'Brand Strategy',
      title_fa: 'استراتژی برند',
      stages: [
        {
          id: 'BRAND_VISION',
          order: 1,
          title_en: 'Brand Vision',
          title_fa: 'چشم‌انداز برند',
          guidance_en:
            "The vision is the future you want to create with your business. It's a big, inspiring, long-term goal that shows what you ultimately want to achieve and what impact you want to have on the world.",
          guidance_fa:
            'چشم‌انداز، تصویر آینده‌ای است که می‌خواهید با کسب‌وکارتان بسازید. این یک هدف بزرگ، الهام‌بخش و بلندمدت است که نشان می‌دهد در نهایت می‌خواهید به چه چیزی برسید و چه تاثیری در دنیا داشته باشید.',
          question_en:
            'What does a world where your startup has succeeded look like? What is your ultimate, aspirational vision?',
          question_fa:
            'دنیایی که استارت‌آپ شما در آن موفق شده است، چه شکلی خواهد بود؟ چشم‌انداز نهایی و آرمانی شما چیست؟',
          userInputRequired: false,
          outputType: 'text',
          dataKey: 'brand_vision', // ✅ Correct
          promptConfig: {
            role: 'You are a brand strategist AI helping founders define an inspiring vision.',
            contextKeys: ['executive_summary', 'business_goals_timeline', 'userInput'],
            goal: 'Create a powerful, aspirational vision statement that aligns with long-term goals.',
            outputFormat:
              'A short, inspiring statement (1-2 sentences) describing the long-term impact.',
            constraints: { tone: 'inspirational', complexity: 'simple' },
            prompt: `You are a brand strategist crafting a vision statement.\nBased on the startup summary: {executive_summary}\nAnd its long-term (3-year) goal: {business_goals_timeline}\nAnd user input: {userInput}\n\nYour task is to craft a compelling and aspirational brand vision statement. It should be a short, powerful sentence that describes the ultimate positive change the startup aims to bring to the world, reflecting its long-term ambition.`,
          },
        },
        {
          id: 'BRAND_MISSION',
          order: 2,
          title_en: 'Brand Mission',
          title_fa: 'ماموریت برند',
          guidance_en:
            'The mission is a practical, present-day statement that defines your company\'s core purpose. It answers the questions: "What do we do? Who do we do it for? And how do we do it?"',
          guidance_fa:
            'ماموریت، بیانیه‌ای عملی و امروزی است که هدف اصلی شرکت شما را تعریف می‌کند. ماموریت به این سوال پاسخ می‌دهد: "ما چه کار می‌کنیم؟ برای چه کسی این کار را انجام می‌دهیم؟ و چگونه آن را انجام می‌دهیم؟"',
          question_en:
            'What is the core, day-to-day purpose of your business? Write your mission statement in one clear sentence.',
          question_fa:
            'هدف اصلی و روزمره کسب‌وکار شما چیست؟ بیانیه ماموریت خود را در یک جمله واضح بنویسید.',
          userInputRequired: false,
          outputType: 'text',
          dataKey: 'brand_mission', // ✅ Correct
          promptConfig: {
            role: 'You are a brand strategist AI helping founders write a clear mission statement.',
            contextKeys: ['brand_vision', 'uvp_statement', 'bmc_customer_segments', 'userInput'],
            goal: 'Create a clear, concise, and actionable mission statement.',
            outputFormat:
              'A single, clear sentence defining what the company does, for whom, and how, in an actionable way.',
            constraints: { tone: 'action-oriented', complexity: 'simple', maxWords: 30 },
            prompt: `You are a brand strategist writing a mission statement.\nInspired by the vision: "{brand_vision}"\nAnd the value proposition: "{uvp_statement}"\nFor the customers: {bmc_customer_segments}\nAnd user input: {userInput}\n\nYour task is to write a clear and concise mission statement. It must be a single sentence that answers: What do we do? For whom? And what is our unique approach? The statement should be grounded and reflect the company's day-to-day focus.`,
          },
        },
        {
          id: 'CORE_VALUES',
          order: 3,
          title_en: 'Core Values',
          title_fa: 'ارزش‌های اصلی برند',
          guidance_en:
            "Values are the guiding principles and beliefs of your company that govern all your decisions and behavior. These values shape your brand's character and define what you stand for.",
          guidance_fa:
            'ارزش‌ها، اصول و باورهای راهنمای شرکت شما هستند که بر تمام تصمیمات و رفتار شما حاکم‌اند. این ارزش‌ها شخصیت برند شما را شکل می‌ده دهند و مشخص می‌کنند که شما پایبند به چه چیزهایی هستید.',
          question_en:
            "What are the 3 to 5 key principles that guide your company's culture and decisions? (e.g., Innovation, Customer-Centricity, Simplicity, Transparency).",
          question_fa:
            '۳ تا ۵ اصل کلیدی که فرهنگ و تصمیمات شرکت شما را هدایت می‌کنند کدامند؟ (مثلاً: نوآوری، مشتری‌مداری، سادگی، شفافیت).',
          userInputRequired: false,
          outputType: 'list',
          dataKey: 'core_values', // ✅ Correct
          promptConfig: {
            role: 'You are a brand strategist AI helping founders define their core company values.',
            contextKeys: ['brand_mission', 'executive_summary', 'userInput'],
            goal: "Identify 3-5 core values that are authentic and align with the brand's mission.",
            outputFormat:
              'A bulleted list of 3-5 core values, each with a one-sentence explanation of its practical meaning.',
            constraints: { tone: 'principled', complexity: 'simple', count: 5 },
            prompt: `You are a brand strategist defining company values.\nBased on the mission: "{brand_mission}"\nAnd the startup idea: {executive_summary}\nAnd user input: {userInput}\n\nYour task is to suggest 3-5 core values that should guide the company's culture and actions. For each value, provide a brief explanation of what it means in practice for this specific startup. For example: **"Simplicity:** We build intuitive products and provide clear communication."`,
          },
        },
        {
          id: 'BRAND_PERSONALITY',
          order: 4,
          title_en: 'Brand Personality',
          title_fa: 'شخصیت برند',
          guidance_en:
            'If your brand were a person, what personality traits would it have? Would it be serious and expert-like, or witty and friendly? Defining a brand personality helps you maintain a consistent tone.',
          guidance_fa:
            'اگر برند شما یک انسان بود، چه ویژگی‌های شخصیتی داشت؟ آیا جدی و متخصص بود یا شوخ‌طبع و دوستانه؟ تعریف شخصیت برند به شما کمک می‌کند تا در تمام ارتباطات خود لحنی یکپارچه داشته باشید.',
          question_en:
            'If your brand were a person, describe it with 3 to 5 adjectives. (e.g., Innovative, Trustworthy, Energetic).',
          question_fa:
            'اگر برند شما یک شخص بود، آن را با ۳ تا ۵ صفت توصیف کنید. (مثلاً: نوآور، قابل اعتماد، پرانرژی).',
          userInputRequired: false,
          outputType: 'list',
          dataKey: 'brand_personality', // ✅ Correct
          promptConfig: {
            role: 'You are a brand strategist AI expert in brand archetypes and personality.',
            contextKeys: ['core_values', 'early_adopter_persona', 'userInput'],
            goal: 'Define a distinct and appropriate brand personality that will resonate with the target audience.',
            outputFormat:
              'A list of 3-5 key personality traits (adjectives), with a brief justification for why each is appropriate.',
            constraints: { tone: 'creative', complexity: 'simple', count: 5 },
            prompt: `You are a brand strategist defining a brand personality.\nBased on the core values: {core_values}\nAnd the target customer: {early_adopter_persona}\nAnd user input: {userInput}\n\nYour task is to define a brand personality. Suggest 3-5 adjectives that describe the brand as if it were a person. For each trait, briefly explain why it is appropriate for connecting with the target audience and reflecting the core values.`,
          },
        },
      ],
    },
    // ========================================
    // 4.2. Verbal Identity
    // ========================================
    {
      id: 'VERBAL_IDENTITY',
      order: 2,
      title_en: 'Verbal Identity',
      title_fa: 'هویت کلامی',
      stages: [
        {
          id: 'BRAND_NAME',
          order: 1,
          title_en: 'Brand Name',
          title_fa: 'نام برند',
          guidance_en:
            'A good name should be memorable, easy to pronounce, unique, and relevant. You should also ensure its website domain and social media handles are available.',
          guidance_fa:
            'یک نام خوب باید به یاد ماندنی، قابل تلفظ، منحصر به فرد و مرتبط با کسب‌وکار شما باشد. همچنین باید مطمئن شوید که دامنه وب‌سایت و شناسه‌های شبکه‌های اجتماعی آن در دسترس است.',
          question_en:
            'Brainstorm several options for your brand name. Which one best meets the criteria for a good name?',
          question_fa:
            'چندین گزینه برای نام برند خود پیشنهاد دهید. کدام یک از آن‌ها معیارهای یک نام خوب را بهتر برآورده می‌کند؟',
          userInputRequired: true,
          outputType: 'list',
          dataKey: 'brand_name', // ✅ Correct
          promptConfig: {
            role: 'You are a creative AI specializing in brand naming.',
            contextKeys: ['idea_title', 'uvp_statement', 'brand_personality', 'userInput'],
            goal: 'Generate a list of creative and strategic brand names.',
            outputFormat:
              'A list of 5-10 brand name suggestions, categorized by naming strategy (e.g., Descriptive, Evocative, Invented).',
            constraints: { tone: 'creative', complexity: 'moderate' },
            prompt: `You are a creative AI specializing in brand naming.\nBased on the project title: {idea_title}\nThe UVP: "{uvp_statement}"\nAnd brand personality: {brand_personality}\nAnd user input: {userInput}\n\nYour task is to brainstorm 5-10 potential brand names. The names should be memorable, easy to spell, and reflect the brand's personality. Structure your response by categorizing the names by their strategic approach:\n- **Descriptive Names:** (Clearly state what the company does).\n- **Evocative Names:** (Suggest a benefit or feeling).\n- **Invented Names:** (Unique and memorable).`,
          },
        },
        {
          id: 'TAGLINE',
          order: 2,
          title_en: 'Tagline/Slogan',
          title_fa: 'شعار اصلی (Tagline/Slogan)',
          guidance_en:
            "A tagline is a short, memorable phrase that summarizes your brand's core value or mission. It often appears alongside your logo and helps customers quickly understand what you do.",
          guidance_fa:
            'شعار، یک عبارت کوتاه و به یاد ماندنی است که ارزش اصلی یا ماموریت برند شما را خلاصه می‌کند. این شعار معمولاً در کنار لوگوی شما قرار می‌گیرد و به مشتریان کمک می‌کند تا به سرعت بفهمند شما چه کار می‌کنید.',
          question_en:
            "Write a short, catchy tagline that communicates your brand's core promise to the customer.",
          question_fa: 'یک شعار کوتاه و جذاب که قول اصلی برند شما را به مشتری بیان کند، بنویسید.',
          userInputRequired: false,
          outputType: 'list',
          dataKey: 'tagline', // ✅ Correct
          promptConfig: {
            role: 'You are a creative copywriter AI specializing in taglines.',
            contextKeys: ['brand_name', 'uvp_statement', 'brand_personality', 'userInput'],
            goal: 'Create several short, memorable, and impactful tagline options.',
            outputFormat: 'A list of 3-5 diverse tagline options.',
            constraints: { tone: 'creative', complexity: 'simple', maxWords: 10 },
            prompt: `You are a creative copywriter specializing in taglines.\nFor a brand with the name options: {brand_name}\nWith the UVP: "{uvp_statement}"\nAnd personality: {brand_personality}\nAnd user input: {userInput}\n\nYour task is to generate 3-5 short and catchy taglines. Each should encapsulate the core benefit for the customer in a memorable way. Provide a variety of options (e.g., a benefit-driven one, a clever one, a direct one).`,
          },
        },
        {
          id: 'TONE_OF_VOICE',
          order: 3,
          title_en: 'Tone of Voice',
          title_fa: 'لحن صدا',
          guidance_en:
            "Tone of voice is the implementation of your brand's personality in words. It defines how you speak to your audience: formal or informal, technical or simple, serious or humorous.",
          guidance_fa:
            'لحن صدا، نحوه پیاده‌سازی شخصیت برند شما در کلمات است. این لحن مشخص می‌کند که شما چگونه با مخاطبان خود صحبت می‌کنید؛ رسمی یا غیررسمی، فنی یا ساده، جدی یا طنزآمیز.',
          question_en:
            "Based on the brand personality you've defined, what should be the tone of your communication with customers? (e.g., Friendly and Supportive, Professional and Inspiring).",
          question_fa:
            'بر اساس شخصیت برندی که تعریف کردید، لحن ارتباط شما با مشتریان چگونه باید باشد؟ (مثلاً: دوستانه و حمایتگر، حرفه‌ای و الهام‌بخش).',
          userInputRequired: false,
          outputType: 'text',
          dataKey: 'tone_of_voice', // ✅ Correct
          promptConfig: {
            role: 'You are a brand voice expert AI.',
            contextKeys: ['brand_personality', 'core_values', 'userInput'],
            goal: 'Define a clear and consistent tone of voice with practical, actionable guidelines.',
            outputFormat:
              'A description of the tone of voice, structured with a general description, a "We are... / We are not..." format, and examples.',
            constraints: { tone: 'descriptive', complexity: 'moderate' },
            prompt: `You are a brand voice expert.\nBased on the brand personality traits: {brand_personality}\nAnd core values: {core_values}\nAnd user input: {userInput}\n\nYour task is to define the brand's Tone of Voice. Structure your output as follows:\n1. **General Description:** A brief paragraph summarizing the overall tone.\n2. **Guidelines:** Use a "We are... / We are not..." format to provide clear do's and don'ts. For example:\n   - We are: **Helpful, Empowering, Clear**.\n   - We are not: **Technical, Patronizing, Vague**.\n3. **Example:** Provide a short "before/after" example of a sentence rewritten to fit the brand voice.`,
          },
        },
      ],
    },
    // ========================================
    // 4.3. Visual Identity
    // ========================================
    {
      id: 'VISUAL_IDENTITY',
      order: 3,
      title_en: 'Visual Identity',
      title_fa: 'هویت بصری',
      stages: [
        {
          id: 'LOGO_DESIGN_CONCEPTS',
          order: 1,
          title_en: 'Logo Design Concepts',
          title_fa: 'ایده‌های طراحی لوگو',
          guidance_en:
            'The logo is the visual symbol of your brand. A good logo is simple, memorable, and appropriate. At this stage, just think about the core ideas and concepts.',
          guidance_fa:
            'لوگو نماد بصری برند شماست. یک لوگوی خوب، ساده، به یاد ماندنی و متناسب با شخصیت برند شماست. در این مرحله، فقط به ایده‌ها و مفاهیم اصلی فکر کنید.',
          question_en:
            'What symbols, concepts, or visual styles could represent your brand well? Describe your initial ideas for the logo.',
          question_fa:
            'چه نمادها، مفاهیم یا سبک‌های بصری می‌توانند به خوبی معرف برند شما باشند؟ ایده‌های اولیه خود برای لوگو را توصیف کنید.',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'logo_design_concepts', // ✅ CORRECTED
          promptConfig: {
            role: 'You are a creative director AI specializing in logo concepts.',
            contextKeys: ['brand_name', 'brand_personality', 'core_values', 'userInput'],
            goal: 'Generate 3 distinct conceptual directions for a logo design to guide a designer.',
            outputFormat:
              'A description of 3 different logo concepts, explaining the symbolism, style, and mood for each.',
            constraints: { tone: 'creative', complexity: 'moderate' },
            prompt: `You are a creative director briefing a designer on logo concepts.\nFor a brand with name options: {brand_name}\nWith personality: {brand_personality}\nAnd values: {core_values}\nAnd user input: {userInput}\n\nYour task is to propose three distinct concepts for a logo design. For each concept, describe:\n1. **Concept Name:** (e.g., "The Pathfinder," "Simple Connection")\n2. **Core Idea/Symbolism:** (What is the story or metaphor behind it?)\n3. **Suggested Style:** (e.g., Minimalist wordmark, Abstract icon, Modern emblem).\n4. **Mood:** (e.g., Trustworthy and professional, Innovative and dynamic).`,
          },
        },
        {
          id: 'COLOR_PALETTE',
          order: 2,
          title_en: 'Color Palette',
          title_fa: 'پالت رنگی',
          guidance_en:
            'Colors evoke strong emotions and play a crucial role in brand recognition. A defined color palette helps create a consistent visual identity.',
          guidance_fa:
            'رنگ‌ها احساسات قوی را برمی‌انگیزند و نقش مهمی در شناخت برند دارند. یک پالت رنگی مشخص به ایجاد یک هویت بصری یکپارچه کمک می‌کند.',
          question_en:
            "What colors best convey your brand's personality and values? (e.g., blue for trust, green for growth, red for energy).",
          question_fa:
            'چه رنگ‌هایی به بهترین شکل شخصیت و ارزش‌های برند شما را منتقل می‌کنند؟ (مثلاً آبی برای اعتماد، سبز برای رشد، قرمز برای انرژی).',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'color_palette', // ✅ Correct
          promptConfig: {
            role: 'You are a brand designer AI with expertise in color psychology.',
            contextKeys: ['brand_personality', 'core_values', 'userInput'],
            goal: 'Propose a primary and secondary color palette with psychological justifications and HEX codes.',
            outputFormat:
              'A proposed color palette with HEX codes for primary, secondary, and accent colors, including a brief explanation for each color choice.',
            constraints: { tone: 'design-oriented', complexity: 'moderate' },
            prompt: `You are a brand designer with expertise in color psychology.\nBased on the brand personality: {brand_personality}\nAnd values: {core_values}\nAnd user input: {userInput}\n\nYour task is to propose a color palette. Structure your response as follows:\n1. **Primary Color(s):** Suggest 1-2 main colors (with HEX codes). Explain the psychological reasoning and how they align with the brand personality.\n2. **Secondary Color(s):** Suggest 1-2 complementary colors (with HEX codes) for backgrounds or secondary elements.\n3. **Accent Color:** Suggest one vibrant accent color (with HEX code) for calls-to-action and highlights.`,
          },
        },
        {
          id: 'TYPOGRAPHY',
          order: 3,
          title_en: 'Typography',
          title_fa: 'تایپوگرافی',
          guidance_en:
            "The fonts you use also influence your brand's personality. Typography should be legible, consistent with the brand's tone, and unified.",
          guidance_fa:
            'فونت‌هایی که استفاده می‌کنید نیز بر شخصیت برند شما تأثیر می‌گذارند. تایپوگرافی باید خوانا، متناسب با لحن برند و یکپارچه باشد.',
          question_en:
            "What type of fonts (e.g., modern, classic, friendly) align with your brand's personality?",
          question_fa:
            'چه نوع فونت‌هایی (مثلاً مدرن، کلاسیک، دوستانه) با شخصیت برند شما هماهنگ هستند؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'typography', // ✅ Correct
          promptConfig: {
            role: 'You are a brand designer AI with expertise in typography.',
            contextKeys: ['brand_personality', 'tone_of_voice', 'userInput'],
            goal: 'Recommend a font pairing (headline and body) that matches the brand personality, with links.',
            outputFormat:
              'A recommendation for a headline font and a body font (preferably from Google Fonts), with a justification and links to the fonts.',
            constraints: { tone: 'design-oriented', complexity: 'moderate' },
            tools: { webSearch: true },
            prompt: `You are a brand designer specializing in typography.\nBased on the brand personality: {brand_personality}\nAnd tone of voice: {tone_of_voice}\nAnd user input: {userInput}\n\nYour task is to recommend a typography pairing from a free-to-use library like Google Fonts. Structure your response as follows:\n1. **Headline Font:** Suggest a specific font (e.g., "Poppins"). Explain why its style (e.g., modern, geometric, friendly) aligns with the brand's personality.\n2. **Body Font:** Suggest a highly legible font for paragraphs (e.g., "Inter"). Explain why it pairs well with the headline font.\n3. **Links:** Provide links to the suggested fonts on Google Fonts.`,
          },
        },
      ],
    },
  ],
};
