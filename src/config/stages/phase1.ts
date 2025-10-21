import { PhaseConfig } from '../../types/stage.types';

/**
 * ========================================
 * PHASE 1: Core Concept & Validation
 * ========================================
 *
 * This phase is the foundation of your startup. Answering these questions
 * accurately and honestly will define your future path and prevent wasting
 * resources down the line.
 */
export const PHASE_1: PhaseConfig = {
  id: 'CORE_CONCEPT_VALIDATION',
  phaseNumber: 1,

  title_en: 'Core Concept & Validation',
  title_fa: 'مفهوم اصلی و اعتبارسنجی ایده',

  description_en:
    'This phase is the foundation of your startup. Answering these questions accurately and honestly will define your future path and prevent wasting resources down the line.',
  description_fa:
    'این فاز، شالوده و سنگ بنای استارت‌آپ شماست. پاسخ‌های دقیق و صادقانه به این سوالات، مسیر آینده شما را مشخص کرده و از هدر رفتن منابع در آینده جلوگیری می‌کند.',

  subsections: [
    // ========================================
    // 1.1. Idea Definition
    // ========================================
    {
      id: 'IDEA_DEFINITION',
      order: 1,
      title_en: 'Idea Definition',
      title_fa: 'تعریف ایده',
      stages: [
        {
          id: 'IDEA_TITLE',
          order: 1,
          title_en: 'Idea Title',
          title_fa: 'عنوان ایده',
          guidance_en:
            "The idea title is a short, temporary name for your project that helps you and your team refer to it easily. It doesn't have to be your final brand name; it's just a placeholder for the early stages.",
          guidance_fa:
            'عنوان ایده، نامی کوتاه و موقت برای پروژه شماست که به شما و تیمتان کمک می‌کند تا به راحتی به آن ارجاع دهید. این نام لزوماً نام نهایی برند شما نخواهد بود و صرفاً برای شناسایی پروژه در مراحل اولیه است.',
          question_en: "What is your idea's title?",
          question_fa: 'عنوان ایده شما چیست؟',
          userInputRequired: true,
          outputType: 'text',
          dataKey: 'idea_title',
          promptConfig: {
            role: 'You are an expert startup branding and naming consultant. Your goal is to help founders find a powerful and memorable working title for their project.',
            contextKeys: ['initialIdea', 'userInput'],
            goal: 'Generate or refine a project title, providing rationale and options.',
            outputFormat:
              'A structured response containing the best option first, followed by alternatives and a brief explanation.',
            constraints: { tone: 'creative_and_professional', complexity: 'simple_and_clear' },
            prompt: `You are an expert startup naming consultant. Your task is to help the user with a project title based on their initial idea: {initialIdea} and their own input: {userInput}.\nFollow these steps:\n1. **Analyze the user's input for the title: \`{userInput}\`.**\n2. **Scenario A: If the user's input is strong and clear:** Start by affirming their choice. For example: '"{userInput}" is a great working title because it's clear and direct.' Then, offer 2-3 alternative variations that explore a slightly different angle (e.g., a more evocative version, a more descriptive version) to give them options.\n3. **Scenario B: If the user's input is weak, generic, or empty:** Take the lead. Generate a list of 3-5 diverse and creative project title suggestions based on the core concept of \`{initialIdea}\`.\n4. **Provide Rationale:** For the suggestions you generate, briefly explain the strategy behind them (e.g., 'This title is descriptive and clearly states what the project does,' or 'This one is more abstract and aims to be memorable').\n5. **Final Output:** Present the best option first, followed by the alternatives. Keep the titles short (2-4 words).`,
          },
        },
        {
          id: 'ELEVATOR_PITCH',
          order: 2,
          title_en: 'Elevator Pitch',
          title_fa: 'خلاصه اجرایی (Elevator Pitch)',
          guidance_en:
            'An elevator pitch is a compelling, 30-second explanation of your startup. You should be able to clearly describe the problem, your solution, the target audience, and your key differentiator to a stranger.',
          guidance_fa:
            'خلاصه اجرایی یا «ارائه آسانسوری»، توضیحی ۳۰ ثانیه‌ای و جذاب از استارت‌آپ شماست. باید بتوانید در این زمان کوتاه، مشکل، راه‌حل، مخاطب و وجه تمایز خود را برای یک فرد غریبه به طور کامل توضیح دهید.',
          question_en: "Write your startup's elevator pitch in one or two sentences.",
          question_fa: 'خلاصه اجرایی استارت‌آپ خود را در یک یا دو جمله بنویسید.',
          userInputRequired: false,
          outputType: 'text',
          dataKey: 'elevator_pitch',
          promptConfig: {
            role: 'You are an expert startup mentor specialized in crafting compelling 30-second elevator pitches.',
            contextKeys: ['initialIdea', 'idea_title', 'userInput'],
            goal: 'Generate or refine a compelling 30-second elevator pitch.',
            outputFormat: 'A single, powerful paragraph (50-75 words).',
            constraints: {
              length: '50-75 words',
              tone: 'persuasive_and_concise',
              complexity: 'simple',
            },
            prompt: `You are an expert in crafting compelling 30-second elevator pitches.\nYour task is to either generate an elevator pitch or refine the user's input, based on the following context:\n- Initial Idea: {initialIdea}\n- Project Title: {idea_title}\n- User's Draft Pitch: {userInput}\n\nFollow these steps:\n1. **Synthesize Core Elements:** Extract the most critical points from the initial idea.\n2. **Craft the Pitch:** Construct a single, powerful paragraph (50-75 words) that flows naturally and includes:\n    a. **The Problem/Audience:** Who is it for and what pain do they have?\n    b. **The Solution:** What is your startup and what does it do?\n    c. **The Differentiator:** Why is it unique or better?\n3. **Refinement:** If \`{userInput}\` was provided, use it as a base and make targeted improvements. If not, generate a pitch from scratch.\n4. **Final Output:** Present only the refined or newly generated elevator pitch paragraph. Adhere strictly to the word count.`,
          },
        },
        {
          id: 'EXECUTIVE_SUMMARY',
          order: 3,
          title_en: 'Executive Summary',
          title_fa: 'چکیده ایده (Executive Summary)',
          guidance_en:
            'This is a more detailed paragraph than the elevator pitch, providing a clearer picture of your business. It must be compelling enough to make the reader want to learn more.',
          guidance_fa:
            'این بخش یک پاراگراف کامل‌تر از خلاصه اجرایی است که تصویر واضح‌تری از کسب‌وکار شما ارائه می‌دهد. این چکیده باید به قدری قانع‌کننده باشد که خواننده را ترغیب به خواندن ادامه متن کند.',
          question_en: "Write your idea's executive summary in one paragraph.",
          question_fa: 'چکیده ایده خود را در یک پاراگراف بنویسید.',
          userInputRequired: false,
          outputType: 'text',
          dataKey: 'executive_summary',
          promptConfig: {
            role: 'You are a startup mentor helping entrepreneurs write compelling executive summaries.',
            contextKeys: ['idea_title', 'elevator_pitch', 'userInput'],
            goal: 'Create a comprehensive one-paragraph executive summary.',
            outputFormat: 'One detailed paragraph (100-150 words).',
            constraints: { length: '100-150 words', tone: 'professional', complexity: 'moderate' },
            prompt: `You are an expert mentor writing an executive summary.\nYour task is to create a compelling summary based on the following context:\n- Project Title: {idea_title}\n- Elevator Pitch: {elevator_pitch}\n- User's Draft: {userInput}\n\nFollow these steps:\n1. **Structure the Narrative:** Begin with the core mission from the elevator pitch, then expand on the problem, solution, target market, and the core business model idea.\n2. **Add a Forward-Looking Statement:** Conclude with a brief, inspiring sentence about the company's vision or potential.\n3. **Refine:** If \`{userInput}\` exists, improve it. Otherwise, write from scratch.\n4. **Final Output:** Present a single, polished paragraph (100-150 words) that serves as a powerful introduction to the business.`,
          },
        },
      ],
    },
    // ========================================
    // 1.2. Problem Statement
    // ========================================
    {
      id: 'PROBLEM_STATEMENT',
      order: 2,
      title_en: 'Problem Statement',
      title_fa: 'بیان مسئله',
      stages: [
        {
          id: 'PROBLEM_DESCRIPTION',
          order: 1,
          title_en: 'The Problem You Are Solving',
          title_fa: 'مشکلی که حل می‌کنید',
          guidance_en:
            'Every successful startup is built on solving a real and significant problem. Instead of focusing on your solution first, you must clearly and precisely define the problem itself.',
          guidance_fa:
            'هر استارت‌آپ موفقی بر پایه حل یک مشکل واقعی و مهم بنا شده است. به جای تمرکز بر روی راه‌حل، ابتدا باید خودِ مشکل را به شکلی واضح، دقیق و قابل درک برای همه تعریف کنید.',
          question_en: 'Clearly describe the problem your startup aims to solve.',
          question_fa: 'مشکلی که استارت‌آپ شما قصد حل آن را دارد به وضوح شرح دهید.',
          userInputRequired: true,
          outputType: 'text',
          dataKey: 'problem_description',
          promptConfig: {
            role: 'You are a startup mentor helping entrepreneurs articulate clear problem statements.',
            contextKeys: ['initialIdea', 'userInput'],
            goal: 'Help clarify and articulate the core problem being solved.',
            outputFormat:
              "A clear, concise problem statement (75-100 words) focused on the customer's pain point.",
            constraints: { length: '75-100 words', tone: 'empathetic', complexity: 'simple' },
            prompt: `You are a mentor helping a founder define their core problem.\nContext:\n- Initial Idea: {initialIdea}\n- User's Description: {userInput}\n\nFollow these steps:\n1. **Identify the Core Pain:** From the context, pinpoint the primary pain point, frustration, or inefficiency the customer faces.\n2. **Frame from the Customer's Perspective:** Write the problem statement from the customer's point of view. Use empathetic language.\n3. **Quantify if Possible:** Briefly mention the scale or impact of the problem (e.g., "millions of people struggle with...", "...costing them time and money.").\n4. **Final Output:** Produce a clear, concise paragraph that makes the problem feel real and significant.`,
          },
        },
        {
          id: 'PROBLEM_MAGNITUDE',
          order: 2,
          title_en: 'How Big and Painful Is This Problem?',
          title_fa: 'این مشکل چقدر بزرگ و دردناک است؟',
          guidance_en:
            "The significance of the problem determines the market's need for your solution. You need to show that this problem is either widespread or extremely costly for a smaller group.",
          guidance_fa:
            'اهمیت مشکل، میزان نیاز بازار به راه‌حل شما را تعیین می‌کند. باید نشان دهید که این مشکل برای عده زیادی از افراد وجود دارد و یا برای عده‌ای کم، بسیار دردناک و پرهزینه است.',
          question_en:
            'How many people are affected by this problem? How severe is its impact (in terms of cost, time, or frustration)?',
          question_fa:
            'این مشکل چه تعداد از افراد را تحت تاثیر قرار می‌دهد؟ این تاثیر (از نظر هزینه، زمان یا نارضایتی) چقدر در زندگی آن‌ها جدی است؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'problem_magnitude',
          promptConfig: {
            role: 'You are a market research analyst AI helping entrepreneurs quantify market problems.',
            contextKeys: ['problem_description', 'userInput'],
            goal: 'Analyze and quantify the scope and severity of the problem.',
            outputFormat:
              'Structured analysis with market size implications and impact assessment.',
            constraints: { tone: 'analytical', complexity: 'moderate' },
            tools: { webSearch: true },
            prompt: `You are a market research analyst.\nBased on the problem: "{problem_description}"\nAnd user input: {userInput}\n\nProvide an analysis of the problem's magnitude. Use web search to find supporting data. Structure your response with these headings:\n1. **Affected Population:** Estimate how many people or businesses experience this problem.\n2. **Impact & Cost:** Describe the consequences in terms of wasted time, financial cost, or frustration.\n3. **Market Signal:** Briefly explain why this level of pain suggests a strong market opportunity.`,
          },
        },
        {
          id: 'CURRENT_SOLUTIONS',
          order: 3,
          title_en: 'Current Solutions and Why They Are Inadequate',
          title_fa: 'راه‌حل‌های فعلی و چرایی ناکافی بودن آن‌ها',
          guidance_en:
            'It is rare for a problem to have no existing solution. People are currently dealing with this issue in some way, even if it\'s inefficient. Identify these "alternative" solutions and explain why yours is superior.',
          guidance_fa:
            'به ندرت پیش می‌آید که برای یک مشکل هیچ راه‌حلی وجود نداشته باشد. مردم در حال حاضر به روشی (هرچند ناکارآمد) با این مشکل کنار می‌آیند. این روش‌ها را شناسایی کرده و توضیح دهید چرا راه‌حل شما برتر است.',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'current_solutions',
          promptConfig: {
            role: 'You are a competitive analyst AI helping entrepreneurs identify gaps in the market.',
            contextKeys: ['problem_description', 'userInput'],
            goal: 'Identify current solutions and analyze their shortcomings to highlight the market gap.',
            outputFormat: 'A list of current solutions with a clear gap analysis.',
            constraints: { tone: 'critical', complexity: 'moderate' },
            tools: { webSearch: true },
            prompt: `You are a competitive analyst.\nBased on the problem: "{problem_description}"\nAnd user input: {userInput}\n\nIdentify how people are currently solving this problem. Use web search for market research. Structure your response:\n1. **Identify Alternatives:** List 2-3 common ways customers currently address the problem (these are your indirect competitors).\n2. **Analyze Weaknesses:** For each alternative, describe its key shortcomings or frustrations.\n3. **Define the Gap:** Conclude with a clear statement that summarizes the market gap your new solution can fill.`,
          },
        },
      ],
    },
    // ========================================
    // 1.3. Target Audience
    // ========================================
    {
      id: 'TARGET_AUDIENCE',
      order: 3,
      title_en: 'Target Audience',
      title_fa: 'مخاطب هدف',
      stages: [
        {
          id: 'CUSTOMER_SEGMENTS',
          order: 1,
          title_en: 'Definition of Customer Segments',
          title_fa: 'تعریف بخش‌های مشتریان',
          guidance_en:
            'You cannot sell your product to "everyone." Segment your target market into smaller groups with shared characteristics so you can tailor your message more effectively.',
          guidance_fa:
            'شما نمی‌توانید محصول خود را به "همه" بفروشید. بازار هدف خود را به گروه‌های کوچکتر با ویژگی‌های مشترک تقسیم کنید تا بتوانید پیام خود را دقیق‌تر به آن‌ها برسانید.',
          userInputRequired: false,
          outputType: 'list',
          dataKey: 'customer_segments',
          promptConfig: {
            role: 'You are a marketing strategist AI helping entrepreneurs identify their ideal customer segments.',
            contextKeys: ['problem_description', 'initialIdea', 'userInput'],
            goal: 'Identify 3-5 distinct customer segments and recommend a primary target.',
            outputFormat:
              'A bulleted list of potential customer segments, with a concluding recommendation for the best initial target.',
            constraints: { tone: 'strategic', complexity: 'simple' },
            prompt: `You are a marketing strategist.\nBased on:\n- Problem: "{problem_description}"\n- Idea: {initialIdea}\n- User input: {userInput}\n\nFollow these steps:\n1. **Brainstorm Segments:** Identify 3-5 potential customer segments that experience this problem most acutely.\n2. **Describe Each:** For each segment, provide a brief description (e.g., "Small business owners who lack IT resources").\n3. **Recommend a Beachhead:** Conclude with a recommendation for the best "beachhead" segment to target first, explaining why they are the ideal early adopters.`,
          },
        },
        {
          id: 'EARLY_ADOPTER_PERSONA',
          order: 2,
          title_en: 'Creation of a Detailed Early Adopter Persona',
          title_fa: 'ساخت پرسونای دقیق مشتریان اولیه',
          guidance_en:
            'Focus on one specific group as your very first customers. Create a fictional character for this group with a name, age, job, goals, and specific challenges. This persona will guide your decisions.',
          guidance_fa:
            'روی یک گروه خاص به عنوان اولین مشتریان خود تمرکز کنید. برای این گروه یک شخصیت خیالی با اسم، سن، شغل، اهداف و دغدغه‌های مشخص بسازید. این پرسونا در تمام تصمیم‌گیری‌های آینده راهنمای شما خواهد بود.',
          userInputRequired: false,
          outputType: 'text',
          dataKey: 'early_adopter_persona',
          promptConfig: {
            role: 'You are a UX researcher and marketer AI skilled at creating detailed customer personas.',
            contextKeys: ['customer_segments', 'problem_description', 'userInput'],
            goal: 'Create a detailed, realistic early adopter persona that brings the target customer to life.',
            outputFormat:
              'A detailed persona profile with sections for Demographics, Goals, Frustrations, and Motivations.',
            constraints: { tone: 'empathetic', complexity: 'moderate' },
            prompt: `You are a UX researcher creating a customer persona.\nBased on the recommended customer segment from: {customer_segments}\nAnd the problem they face: "{problem_description}"\nAnd user input: {userInput}\n\nCreate a detailed early adopter persona. Use the following structure:\n- **Name:** (Give them a name)\n- **Demographics:** (Job Title, Age, Location)\n- **Goals:** (What are they trying to achieve in their work/life related to your solution?)\n- **Frustrations:** (How does the current problem specifically affect them? What are their biggest pain points?)\n- **Motivations:** (What would drive them to seek out and try a new solution like yours?)`,
          },
        },
      ],
    },
    // ========================================
    // 1.4. Proposed Solution
    // ========================================
    {
      id: 'PROPOSED_SOLUTION',
      order: 4,
      title_en: 'Proposed Solution',
      title_fa: 'راه‌حل پیشنهادی',
      stages: [
        {
          id: 'PRODUCT_DESCRIPTION',
          order: 1,
          title_en: 'Full Description of Your Product or Service',
          title_fa: 'شرح کامل محصول یا خدمت',
          guidance_en:
            'In simple terms, explain what your product or service is and what it does. Avoid using overly technical jargon.',
          guidance_fa:
            'به زبان ساده توضیح دهید که محصول یا خدمت شما چیست و دقیقاً چه کاری انجام می‌دهد. از به کار بردن اصطلاحات فنی و پیچیده خودداری کنید.',
          userInputRequired: true,
          outputType: 'text',
          dataKey: 'product_description',
          promptConfig: {
            role: 'You are a product manager AI helping entrepreneurs articulate their solutions clearly.',
            contextKeys: ['problem_description', 'early_adopter_persona', 'userInput'],
            goal: 'Clearly describe the product/service in simple, benefit-oriented language.',
            outputFormat:
              'Clear, jargon-free description (100-150 words) that connects features to customer benefits.',
            constraints: {
              length: '100-150 words',
              tone: 'benefit-oriented',
              complexity: 'simple',
            },
            prompt: `You are a product manager writing a clear product description.\nContext:\n- Problem it solves: "{problem_description}"\n- Who it's for: {early_adopter_persona}\n- User's description: {userInput}\n\nRefine the user's input into a clear, compelling product description. Follow these steps:\n1. **Start with the "What":** Clearly state what the product is (e.g., "a mobile app," "a SaaS platform").\n2. **Explain the "How":** Briefly describe how it solves the core problem for the target persona.\n3. **Focus on Benefits, Not Just Features:** Instead of listing features, explain the positive outcomes for the user (e.g., "saving them time," "reducing their costs," "giving them peace of mind").\n4. **Keep it Simple:** Avoid technical jargon. Write it so anyone can understand.`,
          },
        },
        {
          id: 'HOW_IT_WORKS',
          order: 2,
          title_en: 'How It Works and Its Core Functionality',
          title_fa: 'نحوه عملکرد و ویژگی‌های اصلی',
          guidance_en:
            'Describe the primary features of your solution. For each, explain what goal the user achieves and what actions they can take. This detail is crucial for development.',
          guidance_fa:
            'ویژگی‌های اصلی راه‌حل خود را شرح دهید. برای هر کدام، توضیح دهید که کاربر به چه هدفی می‌رسد و چه اقداماتی می‌تواند انجام دهد. این جزئیات برای توسعه محصول حیاتی است.',
          question_en:
            "For your 3-5 main features, what is the user's goal and what are their key actions?",
          question_fa: 'برای ۳ تا ۵ ویژگی اصلی خود، هدف کاربر چیست و اقدامات کلیدی او کدامند؟',
          userInputRequired: true,
          outputType: 'list',
          dataKey: 'how_it_works',
          promptConfig: {
            role: 'You are a Product Manager helping a founder detail their core product features for a development team.',
            contextKeys: ['product_description', 'problem_description', 'userInput'],
            goal: "Structure the user's ideas about features into a clear, actionable format for developers.",
            outputFormat:
              'A bulleted list of 3-5 core features, each with a clear "User Goal" and "Key Actions" section.',
            constraints: { tone: 'functional', complexity: 'moderate' },
            prompt: `You are a Product Manager translating a founder's vision into developer-friendly feature descriptions.\nBased on:\n- Product: {product_description}\n- Problem: "{problem_description}"\n- User input: {userInput}\n\nYour task is to structure the user's input into a clear list of core features. For each of the 3-5 main features mentioned, use the following format:\n- **Feature:** [Name of the Feature]\n  - **User Goal:** (What is the user trying to accomplish with this feature?)\n  - **Key Actions:** (List the 2-4 most important things a user can DO within this feature, e.g., "Create a new X," "Assign Y to Z," "Filter the list by A").`,
          },
        },
      ],
    },
    // ========================================
    // 1.5. Unique Value Proposition (UVP)
    // ========================================
    {
      id: 'UNIQUE_VALUE_PROPOSITION',
      order: 5,
      title_en: 'Unique Value Proposition (UVP)',
      title_fa: 'ارزش پیشنهادی منحصر به فرد (UVP)',
      stages: [
        {
          id: 'UVP_STATEMENT',
          order: 1,
          title_en: 'Unique Value Proposition',
          title_fa: 'ارزش پیشنهادی منحصر به فرد',
          guidance_en:
            'A UVP clearly states why a customer should choose you over your competitors. It should be the primary promise your brand makes to the customer.',
          guidance_fa:
            'ارزش پیشنهادی به طور شفاف بیان می‌کند که چرا مشتری باید شما را به جای رقبا انتخاب کند. این جمله باید قول اصلی برند شما به مشتری باشد.',
          question_en:
            'Why should a customer choose you over any other competitor? Write your Unique Value Proposition in one clear sentence.',
          question_fa:
            'چرا یک مشتری باید شما را به جای هر رقیب دیگری انتخاب کند؟ ارزش پیشنهادی منحصر به فرد خود را در یک جمله واضح بنویسید.',
          userInputRequired: false,
          outputType: 'text',
          dataKey: 'uvp_statement',
          promptConfig: {
            role: 'You are a marketing strategist AI specialized in crafting powerful UVPs.',
            contextKeys: [
              'product_description',
              'early_adopter_persona',
              'current_solutions',
              'userInput',
            ],
            goal: 'Create a clear, compelling, and defensible UVP statement.',
            outputFormat:
              'A single, powerful sentence that communicates unique value, often following a standard template.',
            constraints: { tone: 'confident', complexity: 'simple', maxWords: 25 },
            prompt: `You are a marketing strategist creating a UVP.\nBased on:\n- Product: {product_description}\n- Target User: {early_adopter_persona}\n- Current Solutions & Gaps: {current_solutions}\n- User input: {userInput}\n\nCraft a single, powerful Unique Value Proposition sentence. A great template to follow is: **"For [target customer] who [has a specific problem], our [product] is a [product category] that [provides a key benefit], unlike [the competition/current solution]."**\nFill in the brackets with the most potent information from the context. Make it concise and impactful.`,
          },
        },
        {
          id: 'UNFAIR_ADVANTAGE',
          order: 2,
          title_en: 'Unfair Advantage',
          title_fa: 'مزیت رقابتی ناعادلانه',
          guidance_en:
            'This is your "secret weapon"—something that cannot be easily copied or bought by your competitors. It could be an expert team, proprietary technology, or exclusive data access.',
          guidance_fa:
            'این "سلاح مخفی" شماست؛ چیزی که رقبا نمی‌توانند به سادگی آن را کپی کرده یا بخرند. این مزیت می‌تواند یک تیم متخصص، یک تکنولوژی انحصاری یا دسترسی به داده‌های خاص باشد.',
          userInputRequired: false,
          outputType: 'text',
          dataKey: 'unfair_advantage',
          promptConfig: {
            role: 'You are a startup strategist AI helping founders identify their core defensible advantage.',
            contextKeys: ['uvp_statement', 'how_it_works', 'founding_team', 'userInput'],
            goal: 'Identify and articulate the most significant unfair advantage.',
            outputFormat:
              "A clear statement identifying the single strongest unfair advantage and explaining why it's hard to replicate.",
            constraints: { length: '50-100 words', tone: 'strategic', complexity: 'simple' },
            prompt: `You are a startup strategist identifying an unfair advantage.\nBased on:\n- UVP: {uvp_statement}\n- Core Features: {how_it_works}\n- Team info: {founding_team} (look for unique expertise)\n- User input: {userInput}\n\nIdentify the single most powerful "unfair advantage" for this startup. It must be something that competitors cannot easily buy or copy. Consider these common types: Proprietary Technology, Unique Team Expertise, Exclusive Partnerships, Community/Network Effects. State the advantage clearly and briefly explain WHY it is defensible.`,
          },
        },
      ],
    },
    // ========================================
    // 1.6. Practical Validation
    // ========================================
    {
      id: 'PRACTICAL_VALIDATION',
      order: 6,
      title_en: 'Practical Validation',
      title_fa: 'اعتبارسنجی عملی',
      stages: [
        {
          id: 'VALIDATION_SUMMARY',
          order: 1,
          title_en: 'Practical Validation',
          title_fa: 'اعتبارسنجی عملی',
          guidance_en:
            "This section is where you prove your claims. You need to show that you've tested your ideas in the real world with actual customers.",
          guidance_fa:
            'این بخش برای اثبات ادعاهای شماست. باید نشان دهید که ایده‌هایتان را در دنیای واقعی با مشتریان واقعی سنجیده‌اید.',
          question_en:
            "Summarize the key findings from your conversations with potential customers, the results of your landing page test, or any other validation experiments you've conducted. What changes did you make to your idea based on this feedback?",
          question_fa:
            'خلاصه‌ای از یافته‌های کلیدی گفتگوهای خود با مشتریان بالقوه، نتایج تست صفحه فرود یا هر آزمون دیگری که انجام داده‌اید را بیان کنید. بر اساس این بازخوردها چه تغییراتی در ایده خود ایجاد کردید؟',
          userInputRequired: true,
          outputType: 'text',
          dataKey: 'validation_summary',
          promptConfig: {
            role: 'You are a Lean Startup coach helping entrepreneurs summarize their validation learnings.',
            contextKeys: ['problem_description', 'uvp_statement', 'userInput'],
            goal: "Structure the user's validation feedback into a clear summary of learnings and pivots.",
            outputFormat:
              'A structured summary with headings for "Method," "Key Learnings," and "Pivots/Changes Made."',
            constraints: { tone: 'analytical', complexity: 'moderate' },
            prompt: `You are a Lean Startup coach.\nThe founder has provided their validation notes here: {userInput}\nThey were testing the problem: "{problem_description}"\nAnd the value proposition: "{uvp_statement}"\n\nYour task is to structure their notes into a clear, concise summary. Use the following format:\n- **Validation Method:** (e.g., Customer Interviews, Landing Page Test)\n- **Key Learnings:** (Summarize the 2-3 most important insights gained. What was confirmed? What was invalidated?)\n- **Pivots or Changes Made:** (Based on the learnings, what specific changes were made to the idea, target audience, or product?)`,
          },
        },
      ],
    },
    // ========================================
    // 1.7. Business Goals
    // ========================================
    {
      id: 'BUSINESS_GOALS',
      order: 7,
      title_en: 'Business Goals',
      title_fa: 'اهداف کسب‌وکار',
      stages: [
        {
          id: 'BUSINESS_GOALS_TIMELINE',
          order: 1,
          title_en: 'Business Goals',
          title_fa: 'اهداف کسب‌وکار',
          guidance_en:
            'Having clear goals gives you direction and helps you measure your progress.',
          guidance_fa:
            'داشتن اهداف مشخص به شما جهت می‌دهد و کمک می‌کند تا پیشرفت خود را اندازه‌گیری کنید.',
          question_en:
            'What is the most important goal you want to achieve in the next 3 months, 1 year, and 3 years?',
          question_fa:
            'مهم‌ترین هدفی که می‌خواهید در ۳ ماه آینده، ۱ سال آینده و ۳ سال آینده به آن برسید چیست؟',
          userInputRequired: false,
          outputType: 'list',
          dataKey: 'business_goals_timeline',
          promptConfig: {
            role: 'You are a business strategist AI helping entrepreneurs set clear, actionable goals.',
            contextKeys: ['validation_summary', 'initialIdea', 'userInput'],
            goal: 'Define clear, sequential goals for the short, mid, and long term.',
            outputFormat:
              'Three distinct goals, one for each timeframe, following the SMART methodology.',
            constraints: { tone: 'strategic', complexity: 'simple' },
            prompt: `You are a business strategist setting company goals.\nBased on the idea: {initialIdea}\nAnd validation learnings: {validation_summary}\nAnd user input: {userInput}\n\nDefine one primary, high-level goal for each of the following timeframes. Ensure the goals are ambitious but realistic, building upon each other.\n- **Next 3 Months (Launch Goal):** (This should focus on successfully launching the MVP and getting initial traction, e.g., "Successfully launch the MVP and acquire the first 100 beta users.")\n- **Next 1 Year (Growth Goal):** (This should focus on achieving product-market fit, e.g., "Achieve Product-Market Fit by reaching 1,000 active users and a 40% user retention rate.")\n- **Next 3 Years (Vision Goal):** (This should align with the long-term vision, e.g., "Become the leading platform for X in our target market.")`,
          },
        },
      ],
    },
  ],
};
