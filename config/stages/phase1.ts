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

  description_en: 'This phase is the foundation of your startup. Answering these questions accurately and honestly will define your future path and prevent wasting resources down the line.',
  description_fa: 'این فاز، شالوده و سنگ بنای استارت‌آپ شماست. پاسخ‌های دقیق و صادقانه به این سوالات، مسیر آینده شما را مشخص کرده و از هدر رفتن منابع در آینده جلوگیری می‌کند.',

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
        // --------------------------------
        // 1.1.1. Idea Title
        // --------------------------------
        {
          id: 'IDEA_TITLE',
          order: 1,

          title_en: 'Idea Title',
          title_fa: 'عنوان ایده',

          guidance_en: 'The idea title is a short, temporary name for your project that helps you and your team refer to it easily. It doesn\'t have to be your final brand name; it\'s just a placeholder for the early stages.',
          guidance_fa: 'عنوان ایده، نامی کوتاه و موقت برای پروژه شماست که به شما و تیمتان کمک می‌کند تا به راحتی به آن ارجاع دهید. این نام لزوماً نام نهایی برند شما نخواهد بود و صرفاً برای شناسایی پروژه در مراحل اولیه است.',

          question_en: 'What is your idea\'s title?',
          question_fa: 'عنوان ایده شما چیست؟',

          userInputRequired: true,
          outputType: 'text',
          dataKey: 'idea_title',

          // Prompt config (will be refined later)
          promptConfig: {
            role: 'You are a startup mentor helping entrepreneurs refine their ideas.',
            contextKeys: ['initialIdea'],
            goal: 'Help the user create a clear, memorable project title',
            outputFormat: 'A short, clear title (2-5 words)',
            constraints: {
              length: '2-5 words',
              tone: 'professional',
              complexity: 'simple',
            },
            // Full prompt (using legacy format for now)
            prompt: 'Based on the startup idea: {initialIdea}\n\nIf the user provided input: {userInput}\n\nHelp refine or suggest a clear, memorable project title.',
          },

          examples: [],
        },

        // --------------------------------
        // 1.1.2. Elevator Pitch
        // --------------------------------
        {
          id: 'ELEVATOR_PITCH',
          order: 2,

          title_en: 'Elevator Pitch',
          title_fa: 'خلاصه اجرایی (Elevator Pitch)',

          guidance_en: 'An elevator pitch is a compelling, 30-second explanation of your startup. In this short time, you should be able to clearly describe the problem, your solution, the target audience, and your key differentiator to a stranger (like an investor).',
          guidance_fa: 'خلاصه اجرایی یا «ارائه آسانسوری»، توضیحی ۳۰ ثانیه‌ای و جذاب از استارت‌آپ شماست. باید بتوانید در این زمان کوتاه، مشکل، راه‌حل، مخاطب و وجه تمایز خود را برای یک فرد غریبه (مثلاً یک سرمایه‌گذار) به طور کامل توضیح دهید.',

          question_en: 'Write your startup\'s elevator pitch in one or two sentences.',
          question_fa: 'خلاصه اجرایی استارت‌آپ خود را در یک یا دو جمله بنویسید.',

          userInputRequired: false,
          outputType: 'text',
          dataKey: 'elevator_pitch',

          promptConfig: {
            role: 'You are a startup mentor specialized in crafting compelling elevator pitches.',
            contextKeys: ['initialIdea', 'idea_title'],
            goal: 'Create a compelling 30-second elevator pitch',
            outputFormat: 'One or two clear, compelling sentences (50-75 words)',
            constraints: {
              length: '50-75 words',
              tone: 'professional',
              complexity: 'simple',
              minWords: 40,
              maxWords: 80,
            },
            prompt: 'Based on:\n- Startup idea: {initialIdea}\n- Project title: {idea_title}\n- User input: {userInput}\n\nCreate a compelling elevator pitch that includes: the problem, target audience, solution, and key differentiator.',
          },

          examples: [],
        },

        // --------------------------------
        // 1.1.3. Executive Summary
        // --------------------------------
        {
          id: 'EXECUTIVE_SUMMARY',
          order: 3,

          title_en: 'Executive Summary',
          title_fa: 'چکیده ایده (Executive Summary)',

          guidance_en: 'This is a more detailed paragraph than the elevator pitch, providing a clearer picture of your business. It\'s typically placed at the beginning of a business plan and must be compelling enough to make the reader want to learn more.',
          guidance_fa: 'این بخش یک پاراگراف کامل‌تر از خلاصه اجرایی است که تصویر واضح‌تری از کسب‌وکار شما ارائه می‌دهد. این چکیده معمولاً در ابتدای طرح کسب‌وکار قرار می‌گیرد و باید به قدری قانع‌کننده باشد که خواننده را ترغیب به خواندن ادامه متن کند.',

          question_en: 'Write your idea\'s executive summary in one paragraph.',
          question_fa: 'چکیده ایده خود را در یک پاراگراف بنویسید.',

          userInputRequired: false,
          outputType: 'text',
          dataKey: 'executive_summary',

          promptConfig: {
            role: 'You are a startup mentor helping entrepreneurs write compelling executive summaries.',
            contextKeys: ['initialIdea', 'idea_title', 'elevator_pitch'],
            goal: 'Create a comprehensive one-paragraph executive summary',
            outputFormat: 'One detailed paragraph (100-150 words)',
            constraints: {
              length: '100-150 words',
              tone: 'professional',
              complexity: 'moderate',
              minWords: 90,
              maxWords: 160,
            },
            prompt: 'Based on:\n- Idea: {initialIdea}\n- Title: {idea_title}\n- Elevator pitch: {elevator_pitch}\n- User input: {userInput}\n\nWrite a comprehensive executive summary covering: problem, solution, target customers, business model, and growth vision.',
          },

          examples: [],
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
        // --------------------------------
        // 1.2.1. The Problem You Are Solving
        // --------------------------------
        {
          id: 'PROBLEM_DESCRIPTION',
          order: 1,

          title_en: 'The Problem You Are Solving',
          title_fa: 'مشکلی که حل می‌کنید',

          guidance_en: 'Every successful startup is built on solving a real and significant problem. Instead of focusing on your solution first, you must clearly and precisely define the problem itself in a way that anyone can understand.',
          guidance_fa: 'هر استارت‌آپ موفقی بر پایه حل یک مشکل واقعی و مهم بنا شده است. به جای تمرکز بر روی راه‌حل، ابتدا باید خودِ مشکل را به شکلی واضح، دقیق و قابل درک برای همه تعریف کنید.',

          question_en: 'Clearly describe the problem your startup aims to solve.',
          question_fa: 'مشکلی که استارت‌آپ شما قصد حل آن را دارد به وضوح شرح دهید.',

          userInputRequired: true,
          outputType: 'text',
          dataKey: 'problem_description',

          promptConfig: {
            role: 'You are a startup mentor helping entrepreneurs articulate clear problem statements.',
            contextKeys: ['initialIdea', 'elevator_pitch', 'executive_summary'],
            goal: 'Help clarify and articulate the core problem being solved',
            outputFormat: 'A clear, concise problem statement (75-100 words)',
            constraints: {
              length: '75-100 words',
              tone: 'professional',
              complexity: 'simple',
            },
            prompt: 'Based on:\n- Idea: {initialIdea}\n- User input: {userInput}\n\nHelp articulate a clear problem statement that anyone can understand. Focus on the pain points customers experience.',
          },

          examples: [],
        },

        // --------------------------------
        // 1.2.2. How Big and Painful Is This Problem?
        // --------------------------------
        {
          id: 'PROBLEM_MAGNITUDE',
          order: 2,

          title_en: 'How Big and Painful Is This Problem?',
          title_fa: 'این مشکل چقدر بزرگ و دردناک است؟',

          guidance_en: 'The significance of the problem determines the market\'s need for your solution. You need to show that this problem either affects a large number of people or is extremely painful and costly (in terms of money, time, or frustration) for a smaller group.',
          guidance_fa: 'اهمیت مشکل، میزان نیاز بازار به راه‌حل شما را تعیین می‌کند. باید نشان دهید که این مشکل برای عده زیادی از افراد وجود دارد و یا برای عده‌ای کم، بسیار دردناک و پرهزینه (از نظر مالی، زمانی یا روانی) است.',

          question_en: 'How many people are affected by this problem? How severe is its impact (in terms of cost, time, or frustration) on their lives?',
          question_fa: 'این مشکل چه تعداد از افراد را تحت تاثیر قرار می‌دهد؟ این تاثیر (از نظر هزینه، زمان یا نارضایتی) چقدر در زندگی آن‌ها جدی است؟',

          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'problem_magnitude',

          promptConfig: {
            role: 'You are a startup mentor helping entrepreneurs quantify market problems.',
            contextKeys: ['problem_description', 'initialIdea'],
            goal: 'Analyze and quantify the scope and severity of the problem',
            outputFormat: 'Structured analysis with market size estimates and impact assessment',
            constraints: {
              tone: 'professional',
              complexity: 'moderate',
            },
            tools: {
              webSearch: true,
            },
            prompt: 'Based on the problem: {problem_description}\nUser input: {userInput}\n\nProvide an analysis of:\n1. How many people are affected\n2. Cost impact (money, time, frustration)\n3. Market size implications\n\nUse web search if helpful for data.',
          },

          examples: [],
        },

        // --------------------------------
        // 1.2.3. Current Solutions and Why They Are Inadequate
        // --------------------------------
        {
          id: 'CURRENT_SOLUTIONS',
          order: 3,

          title_en: 'Current Solutions and Why They Are Inadequate',
          title_fa: 'راه‌حل‌های فعلی و چرایی ناکافی بودن آن‌ها',

          guidance_en: 'It is rare for a problem to have no existing solution. People are currently dealing with this issue in some way, even if it\'s inefficient. Identify these "alternative" solutions and explain why yours is superior.',
          guidance_fa: 'به ندرت پیش می‌آید که برای یک مشکل هیچ راه‌حلی وجود نداشته باشد. مردم در حال حاضر به روشی (هرچند ناکارآمد) با این مشکل کنار می‌آیند. این روش‌ها را شناسایی کرده و توضیح دهید چرا راه‌حل شما برتر است.',

          question_en: 'How are people solving this problem right now? What are the weaknesses and shortcomings of these existing solutions?',
          question_fa: 'در حال حاضر مردم چگونه این مشکل را حل می‌کنند؟ نقاط ضعف و کاستی‌های این راه‌حل‌های موجود چیست؟',

          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'current_solutions',

          promptConfig: {
            role: 'You are a startup mentor helping entrepreneurs analyze competitive solutions.',
            contextKeys: ['problem_description', 'initialIdea'],
            goal: 'Identify current solutions and their shortcomings',
            outputFormat: 'List of current solutions with gap analysis',
            constraints: {
              tone: 'professional',
              complexity: 'moderate',
            },
            tools: {
              webSearch: true,
            },
            prompt: 'Based on problem: {problem_description}\nUser input: {userInput}\n\nIdentify:\n1. Current solutions people use\n2. Weaknesses of each solution\n3. Gaps your solution can fill\n\nUse web search for market research.',
          },

          examples: [],
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
        // --------------------------------
        // 1.3.1. Definition of Customer Segments
        // --------------------------------
        {
          id: 'CUSTOMER_SEGMENTS',
          order: 1,

          title_en: 'Definition of Customer Segments',
          title_fa: 'تعریف بخش‌های مشتریان',

          guidance_en: 'You cannot sell your product to "everyone." Segment your target market into smaller groups with shared characteristics (like age, profession, interests, or needs) so you can tailor your message more effectively.',
          guidance_fa: 'شما نمی‌توانید محصول خود را به "همه" بفروشید. بازار هدف خود را به گروه‌های کوچکتر با ویژگی‌های مشترک (مانند سن، شغل، علاقه یا نیاز) تقسیم کنید تا بتوانید پیام خود را دقیق‌تر به آن‌ها برسانید.',

          question_en: 'What groups of people or businesses can benefit from your solution? List your primary customer segments.',
          question_fa: 'چه گروه‌هایی از افراد یا کسب‌وکارها می‌توانند از راه‌حل شما بهره‌مند شوند؟ بخش‌های اصلی مشتریان خود را لیست کنید.',

          userInputRequired: false,
          outputType: 'list',
          dataKey: 'customer_segments',

          promptConfig: {
            role: 'You are a startup mentor helping entrepreneurs identify customer segments.',
            contextKeys: ['problem_description', 'initialIdea'],
            goal: 'Identify 3-5 distinct customer segments',
            outputFormat: 'Bulleted list of customer segments with brief descriptions',
            constraints: {
              count: 5,
              tone: 'professional',
              complexity: 'simple',
            },
            prompt: 'Based on:\n- Problem: {problem_description}\n- Idea: {initialIdea}\n- User input: {userInput}\n\nIdentify 3-5 customer segments that would benefit from this solution. For each, provide: segment name and key characteristics.',
          },

          examples: [],
        },

        // --------------------------------
        // 1.3.2. Creation of a Detailed Early Adopter Persona
        // --------------------------------
        {
          id: 'EARLY_ADOPTER_PERSONA',
          order: 2,

          title_en: 'Creation of a Detailed Early Adopter Persona',
          title_fa: 'ساخت پرسونای دقیق مشتریان اولیه',

          guidance_en: 'Among your various segments, focus on one specific group as your very first customers. Create a fictional character for this group with a name, age, job, goals, and specific challenges. This persona will guide all your future decisions.',
          guidance_fa: 'از میان بخش‌های مختلف، روی یک گروه خاص به عنوان اولین مشتریان خود تمرکز کنید. برای این گروه یک شخصیت خیالی با اسم، سن، شغل، اهداف و دغدغه‌های مشخص بسازید. این پرسونا در تمام تصمیم‌گیری‌های آینده راهنمای شما خواهد بود.',

          question_en: 'Describe your ideal first customer (Early Adopter) in detail. What is their name, age, job, daily challenges, and motivations?',
          question_fa: 'مشتری ایده‌آل و اولیه خود (Early Adopter) را با جزئیات توصیف کنید. نام، سن، شغل، چالش‌های روزمره و انگیزه‌های او چیست؟',

          userInputRequired: false,
          outputType: 'text',
          dataKey: 'early_adopter_persona',

          promptConfig: {
            role: 'You are a startup mentor helping entrepreneurs create detailed customer personas.',
            contextKeys: ['customer_segments', 'problem_description'],
            goal: 'Create a detailed, realistic early adopter persona',
            outputFormat: 'Detailed persona profile with name, demographics, goals, challenges, and motivations',
            constraints: {
              tone: 'professional',
              complexity: 'moderate',
            },
            prompt: 'Based on:\n- Customer segments: {customer_segments}\n- Problem: {problem_description}\n- User input: {userInput}\n\nCreate a detailed persona including: name, age, job, daily routine, challenges, goals, and motivations.',
          },

          examples: [],
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
        // --------------------------------
        // 1.4.1. Full Description of Your Product or Service
        // --------------------------------
        {
          id: 'PRODUCT_DESCRIPTION',
          order: 1,

          title_en: 'Full Description of Your Product or Service',
          title_fa: 'شرح کامل محصول یا خدمت',

          guidance_en: 'Now it\'s time to introduce your solution. In simple terms, explain what your product or service is and what it does. Avoid using overly technical jargon.',
          guidance_fa: 'اکنون زمان آن است که راه‌حل خود را معرفی کنید. به زبان ساده توضیح دهید که محصول یا خدمت شما چیست و دقیقاً چه کاری انجام می‌دهد. از به کار بردن اصطلاحات فنی و پیچیده خودداری کنید.',

          question_en: 'In simple language, what is your product or service? Describe exactly what you are building.',
          question_fa: 'به زبان ساده، محصول یا خدمت شما چیست؟ دقیقاً شرح دهید چه چیزی می‌سازید.',

          userInputRequired: true,
          outputType: 'text',
          dataKey: 'product_description',

          promptConfig: {
            role: 'You are a startup mentor helping entrepreneurs articulate their solutions clearly.',
            contextKeys: ['problem_description', 'initialIdea'],
            goal: 'Clearly describe the product/service in simple language',
            outputFormat: 'Clear, jargon-free description (100-150 words)',
            constraints: {
              length: '100-150 words',
              tone: 'professional',
              complexity: 'simple',
            },
            prompt: 'Based on:\n- Problem: {problem_description}\n- Idea: {initialIdea}\n- User input: {userInput}\n\nDescribe the product/service in simple, clear language that anyone can understand.',
          },

          examples: [],
        },

        // --------------------------------
        // 1.4.2. How It Works and Its Core Functionality
        // --------------------------------
        {
          id: 'HOW_IT_WORKS',
          order: 2,

          title_en: 'How It Works and Its Core Functionality',
          title_fa: 'نحوه عملکرد و کارکرد اصلی آن',

          guidance_en: 'Go a little deeper and explain the process of using your product. What steps does a user take to get their problem solved? What are the main features and capabilities of your solution?',
          guidance_fa: 'کمی عمیق‌تر شوید و فرآیند کار با محصولتان را توضیح دهید. کاربر چه مراحلی را طی می‌کند تا مشکلش حل شود؟ اصلی‌ترین ویژگی‌ها و قابلیت‌های راه‌حل شما کدامند؟',

          question_en: 'What are the core features and functionalities of your solution? How does it directly solve the problem you\'ve stated?',
          question_fa: 'ویژگی‌ها و کارکردهای اصلی راه‌حل شما چیست؟ این راه‌حل چگونه به طور مستقیم مشکل بیان‌شده را حل می‌کند؟',

          userInputRequired: false,
          outputType: 'list',
          dataKey: 'core_features',

          promptConfig: {
            role: 'You are a startup mentor helping entrepreneurs define core features.',
            contextKeys: ['product_description', 'problem_description'],
            goal: 'List core features and explain how they solve the problem',
            outputFormat: 'Bulleted list of features with brief explanations',
            constraints: {
              count: 5,
              tone: 'professional',
              complexity: 'simple',
            },
            prompt: 'Based on:\n- Product: {product_description}\n- Problem: {problem_description}\n- User input: {userInput}\n\nList 3-5 core features and explain how each directly addresses the problem.',
          },

          examples: [],
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
        // --------------------------------
        // 1.5.1. UVP Statement
        // --------------------------------
        {
          id: 'UVP_STATEMENT',
          order: 1,

          title_en: 'Unique Value Proposition',
          title_fa: 'ارزش پیشنهادی منحصر به فرد',

          guidance_en: 'This is the most important statement about your business. A UVP clearly states why a customer should choose you over your competitors. It should be the primary promise your brand makes to the customer.',
          guidance_fa: 'این مهم‌ترین جمله در مورد کسب‌وکار شماست. ارزش پیشنهادی به طور شفاف بیان می‌کند که چرا مشتری باید شما را به جای رقبا انتخاب کند. این جمله باید قول اصلی برند شما به مشتری باشد.',

          question_en: 'Why should a customer choose you over any other competitor? Write your Unique Value Proposition in one clear sentence.',
          question_fa: 'چرا یک مشتری باید شما را به جای هر رقیب دیگری انتخاب کند؟ ارزش پیشنهادی منحصر به فرد خود را در یک جمله واضح بنویسید.',

          userInputRequired: false,
          outputType: 'text',
          dataKey: 'uvp_statement',

          promptConfig: {
            role: 'You are a startup mentor helping entrepreneurs craft compelling UVPs.',
            contextKeys: ['product_description', 'problem_description', 'current_solutions'],
            goal: 'Create a clear, compelling UVP',
            outputFormat: 'One powerful sentence that communicates unique value',
            constraints: {
              length: '1 sentence',
              tone: 'professional',
              complexity: 'simple',
              maxWords: 25,
            },
            prompt: 'Based on:\n- Product: {product_description}\n- Problem: {problem_description}\n- Current solutions: {current_solutions}\n- User input: {userInput}\n\nCreate a UVP that clearly states why customers should choose this solution over competitors.',
          },

          examples: [],
        },

        // --------------------------------
        // 1.5.2. Unfair Advantage
        // --------------------------------
        {
          id: 'UNFAIR_ADVANTAGE',
          order: 2,

          title_en: 'Unfair Advantage',
          title_fa: 'مزیت رقابتی ناعادلانه',

          guidance_en: 'This is your "secret weapon"—something that cannot be easily copied or bought by your competitors. It could be an expert team, proprietary technology, exclusive data access, or a strategic partnership.',
          guidance_fa: 'این "سلاح مخفی" شماست؛ چیزی که رقبا نمی‌توانند به سادگی آن را کپی کرده یا بخرند. این مزیت می‌تواند یک تیم متخصص، یک تکنولوژی انحصاری، دسترسی به داده‌های خاص یا یک شراکت استراتژیک باشد.',

          question_en: 'What is the one thing you have that your competitors cannot easily buy or copy? What is your unfair advantage?',
          question_fa: 'آن یک چیزی که شما دارید و رقبایتان نمی‌توانند به راحتی آن را بخرند یا کپی کنند چیست؟ مزیت رقابتی ناعادلانه شما چیست؟',

          userInputRequired: false,
          outputType: 'text',
          dataKey: 'unfair_advantage',

          promptConfig: {
            role: 'You are a startup mentor helping entrepreneurs identify their unfair advantages.',
            contextKeys: ['product_description', 'uvp_statement'],
            goal: 'Identify the unfair advantage that cannot be easily copied',
            outputFormat: 'Brief description of the unfair advantage',
            constraints: {
              length: '50-100 words',
              tone: 'professional',
              complexity: 'simple',
            },
            prompt: 'Based on:\n- Product: {product_description}\n- UVP: {uvp_statement}\n- User input: {userInput}\n\nIdentify what unique advantage this startup has that competitors cannot easily copy (team expertise, proprietary tech, exclusive partnerships, etc.)',
          },

          examples: [],
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
        // --------------------------------
        // 1.6.1. Validation Summary
        // --------------------------------
        {
          id: 'VALIDATION_SUMMARY',
          order: 1,

          title_en: 'Practical Validation',
          title_fa: 'اعتبارسنجی عملی',

          guidance_en: 'This section is where you prove your claims. You need to show that you\'ve tested your ideas in the real world with actual customers.',
          guidance_fa: 'این بخش برای اثبات ادعاهای شماست. باید نشان دهید که ایده‌هایتان را در دنیای واقعی با مشتریان واقعی سنجیده‌اید.',

          question_en: 'Summarize the key findings from your conversations with potential customers, the results of your landing page test, or any other validation experiments you\'ve conducted. What changes did you make to your idea based on this feedback?',
          question_fa: 'خلاصه‌ای از یافته‌های کلیدی گفتگوهای خود با مشتریان بالقوه، نتایج تست صفحه فرود یا هر آزمون دیگری که انجام داده‌اید را بیان کنید. بر اساس این بازخوردها چه تغییراتی در ایده خود ایجاد کردید؟',

          userInputRequired: false,
          outputType: 'text',
          dataKey: 'validation_summary',

          promptConfig: {
            role: 'You are a startup mentor helping entrepreneurs document their validation efforts.',
            contextKeys: ['problem_description', 'product_description', 'early_adopter_persona'],
            goal: 'Document validation experiments and learnings',
            outputFormat: 'Summary of validation activities and key learnings',
            constraints: {
              tone: 'professional',
              complexity: 'moderate',
            },
            prompt: 'Based on:\n- Problem: {problem_description}\n- Product: {product_description}\n- User input: {userInput}\n\nHelp document validation efforts: customer interviews, landing page tests, MVP feedback, and key learnings.',
          },

          examples: [],
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
        // --------------------------------
        // 1.7.1. Short/Mid/Long-term Goals
        // --------------------------------
        {
          id: 'BUSINESS_GOALS_TIMELINE',
          order: 1,

          title_en: 'Business Goals',
          title_fa: 'اهداف کسب‌وکار',

          guidance_en: 'Having clear goals gives you direction and helps you measure your progress.',
          guidance_fa: 'داشتن اهداف مشخص به شما جهت می‌دهد و کمک می‌کند تا پیشرفت خود را اندازه‌گیری کنید.',

          question_en: 'What is the most important goal you want to achieve in the next 3 months, 1 year, and 3 years? (e.g., reach 100 paying customers, achieve profitability, enter a new market).',
          question_fa: 'مهم‌ترین هدفی که می‌خواهید در ۳ ماه آینده، ۱ سال آینده و ۳ سال آینده به آن برسید چیست؟ (مثلاً: رسیدن به ۱۰۰ مشتری اولیه، کسب درآمد پایدار، ورود به بازار جدید).',

          userInputRequired: false,
          outputType: 'list',
          dataKey: 'business_goals',

          promptConfig: {
            role: 'You are a startup mentor helping entrepreneurs set SMART goals.',
            contextKeys: ['product_description', 'customer_segments', 'uvp_statement'],
            goal: 'Define clear short, mid, and long-term goals',
            outputFormat: 'Three sets of goals (3 months, 1 year, 3 years) with specific metrics',
            constraints: {
              tone: 'professional',
              complexity: 'simple',
            },
            prompt: 'Based on:\n- Product: {product_description}\n- Target: {customer_segments}\n- User input: {userInput}\n\nDefine SMART goals for:\n- 3 months\n- 1 year\n- 3 years\n\nEach should be specific and measurable.',
          },

          examples: [],
        },
      ],
    },
  ],
};
