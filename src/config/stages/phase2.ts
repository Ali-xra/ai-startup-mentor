import { PhaseConfig } from '../../types/stage.types';

/**
 * ========================================
 * PHASE 2: Market, Competition & Risk Analysis
 * ========================================
 *
 * In this phase, we move beyond your idea and look at the real world.
 * The goal is to understand if a market exists for your idea, how big
 * that market is, who is already operating in it, and what challenges
 * lie ahead. This analysis will help you make strategic and informed decisions.
 */
export const PHASE_2: PhaseConfig = {
  id: 'MARKET_ANALYSIS',
  phaseNumber: 2,

  title_en: 'Market, Competition & Risk Analysis',
  title_fa: 'تحلیل بازار، رقبا و ریسک',

  description_en:
    'In this phase, we move beyond your idea and look at the real world. The goal is to understand if a market exists for your idea, how big that market is, who is already operating in it, and what challenges lie ahead. This analysis will help you make strategic and informed decisions.',
  description_fa:
    'در این فاز، از ایده خود فراتر رفته و به دنیای واقعی نگاه می‌کنیم. هدف این است که بفهمیم آیا بازاری برای ایده شما وجود دارد، این بازار چقدر بزرگ است، چه کسانی در آن فعالیت می‌کنند و چه چالش‌هایی پیش روی شماست. این تحلیل‌ها به شما کمک می‌کند تا تصمیمات استراتژیک و آگاهانه بگیرید.',

  subsections: [
    // ========================================
    // 2.1. Market Environment & Size
    // ========================================
    {
      id: 'MARKET_ENVIRONMENT_SIZE',
      order: 1,
      title_en: 'Market Environment & Size',
      title_fa: 'محیط و اندازه بازار',
      stages: [
        {
          id: 'PESTEL_ANALYSIS',
          order: 1,
          title_en: 'Macro-environmental Analysis (PESTEL)',
          title_fa: 'تحلیل کلان محیط (PESTEL)',
          guidance_en:
            'Your business does not operate in a vacuum. Political, Economic, Social, Technological, Environmental, and Legal (PESTEL) factors can impact your success. Reviewing these factors helps you identify broader opportunities and threats.',
          guidance_fa:
            'کسب‌وکار شما در خلاء فعالیت نمی‌کند. عوامل سیاسی، اقتصادی، اجتماعی، تکنولوژیک، محیطی و قانونی (PESTEL) می‌توانند بر موفقیت شما تاثیر بگذارند. بررسی این عوامل به شما کمک می‌کند تا فرصت‌ها و تهدیدهای بزرگ‌تری که خارج از کنترل شما هستند را شناسایی کنید.',
          question_en:
            'Which political, economic, social, or technological trends could have the biggest impact (positive or negative) on your business?',
          question_fa:
            'کدام روندهای سیاسی، اقتصادی، اجتماعی یا تکنولویکی می‌توانند بیشترین تاثیر (مثبت یا منفی) را بر کسب‌وکار شما داشته باشند؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'pestel_analysis', // ✅ Correct
          promptConfig: {
            role: 'You are a business strategist AI helping startups understand macro-environmental factors.',
            contextKeys: ['executive_summary', 'problem_description', 'userInput'],
            goal: 'Identify the most relevant PESTEL factors impacting the startup.',
            outputFormat:
              'A structured analysis highlighting 1-2 key trends from the most relevant PESTEL categories.',
            constraints: { tone: 'strategic', complexity: 'moderate' },
            tools: { webSearch: true },
            prompt: `You are a business strategist.\nBased on the startup idea described in: {executive_summary}\nWhich aims to solve: {problem_description}\nAnd user input: {userInput}\n\nPerform a PESTEL analysis. Use web search for current trends. Structure your response with the most relevant headings (choose 3-4 from Political, Economic, Social, Technological, Environmental, Legal) and for each, identify and briefly explain the most critical trend that could significantly impact this startup's success.`,
          },
        },
        {
          id: 'TAM_ANALYSIS',
          order: 2,
          title_en: 'Total Addressable Market (TAM)',
          title_fa: 'اندازه کل بازار در دسترس (TAM)',
          guidance_en:
            'TAM refers to the total possible demand for a product or service worldwide. This number represents the ultimate, dream potential of your market and shows investors how big the idea can become.',
          guidance_fa:
            'TAM به کل تقاضای ممکن برای یک محصول یا خدمت در سراسر جهان اشاره دارد. این عدد نشان‌دهنده پتانسیل نهایی و رویایی بازار شماست و به سرمایه‌گذاران نشان می‌دهد که این ایده چقدر می‌تواند بزرگ شود.',
          question_en:
            'If there were no limitations (geographical, competitive, etc.), what is the total potential market value for your solution?',
          question_fa:
            'اگر هیچ محدودیتی (جغرافیایی، رقابتی و...) وجود نداشت، کل بازار بالقوه برای راه‌حل شما چقدر ارزش دارد؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'tam_analysis', // ✅ Correct
          promptConfig: {
            role: 'You are a market research analyst AI specializing in market sizing.',
            contextKeys: ['problem_description', 'product_description', 'userInput'],
            goal: 'Estimate the Total Addressable Market (TAM) for the startup, with sources.',
            outputFormat:
              'A monetary value ($) with a brief explanation of the calculation methodology (e.g., top-down or bottom-up) and cited sources.',
            constraints: { tone: 'analytical', complexity: 'moderate' },
            tools: { webSearch: true },
            prompt: `You are a market research analyst.\nFor a startup with the product: {product_description}\nSolving the problem: {problem_description}\nAnd user input: {userInput}\n\nEstimate the Total Addressable Market (TAM). Use web search to find relevant industry reports and data from reputable sources (e.g., Gartner, Statista, market research firms).\nYour response must include:\n1. **Estimated TAM Value:** A clear monetary figure.\n2. **Methodology:** State whether you used a top-down or bottom-up approach.\n3. **Sources:** Cite the sources for the data you used.`,
          },
        },
        {
          id: 'SAM_ANALYSIS',
          order: 3,
          title_en: 'Serviceable Available Market (SAM)',
          title_fa: 'اندازه بازار در دسترس قابل خدمت (SAM)',
          guidance_en:
            'SAM is the portion of TAM that you can reach based on your business model, expertise, and geographical limitations. This number represents a more realistic market that you are targeting.',
          guidance_fa:
            'SAM بخشی از TAM است که شما می‌توانید با توجه به مدل کسب‌وکار، تخصص و محدودیت‌های جغرافیایی خود به آن دسترسی پیدا کنید. این عدد، بازار واقعی‌تری را که شما هدف گرفته‌اید، نشان می‌دهد.',
          question_en:
            'Considering your current limitations (like focusing on a specific country or industry), how large is the segment of the market you can realistically target?',
          question_fa:
            'با در نظر گرفتن محدودیت‌های فعلی (مانند تمرکز بر یک کشور یا یک صنعت خاص)، بخشی از بازار که واقعاً می‌توانید هدف قرار دهید چقدر بزرگ است؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'sam_analysis', // ✅ Correct
          promptConfig: {
            role: 'You are a market research analyst AI specializing in market sizing.',
            contextKeys: ['tam_analysis', 'customer_segments', 'userInput'],
            goal: 'Estimate the Serviceable Available Market (SAM) based on the target segments.',
            outputFormat:
              'A monetary value ($) representing a subset of TAM, with a clear rationale for the segmentation.',
            constraints: { tone: 'analytical', complexity: 'moderate' },
            tools: { webSearch: true },
            prompt: `You are a market research analyst.\nGiven a TAM of: {tam_analysis}\nAnd target customer segments: {customer_segments}\nAnd user input: {userInput}\n\nEstimate the Serviceable Available Market (SAM). Your response must:\n1. **Define the Segment:** Clearly state the specific segment of the TAM you are targeting (e.g., based on geography, industry, company size, etc.).\n2. **Calculate SAM:** Provide the estimated monetary value for this segment.\n3. **Justify the Calculation:** Explain the logic or data used to narrow down the TAM to the SAM.`,
          },
        },
        {
          id: 'SOM_ANALYSIS',
          order: 4,
          title_en: 'Serviceable Obtainable Market (SOM)',
          title_fa: 'اندازه بازار در دسترس قابل دستیابی (SOM)',
          guidance_en:
            'SOM is the portion of SAM you can realistically expect to capture in the first few years of operation (considering competitors, budget, and resources). This number defines your short-term, achievable goal.',
          guidance_fa:
            'SOM بخشی از SAM است که شما به طور واقع‌بینانه انتظار دارید در چند سال اول فعالیت خود به دست آورید (با در نظر گرفتن رقبا، بودجه و منابع). این عدد، هدف کوتاه‌مدت و قابل دستیابی شما را مشخص می‌کند.',
          question_en:
            'Given your resources and marketing plan, what share of the Serviceable Available Market (SAM) can you capture in the next 3 to 5 years?',
          question_fa:
            'با توجه به منابع و برنامه بازاریابی خود، چه سهمی از بازار قابل خدمت (SAM) را می‌توانید در ۳ تا ۵ سال آینده به دست آورید؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'som_analysis', // ✅ Correct
          promptConfig: {
            role: 'You are a market research analyst AI specializing in market sizing.',
            contextKeys: ['sam_analysis', 'uvp_statement', 'current_solutions', 'userInput'],
            goal: 'Estimate a realistic Serviceable Obtainable Market (SOM) for the near future.',
            outputFormat:
              'A monetary value ($) with a justified market share percentage (e.g., 1-5% of SAM) based on competitive landscape and realistic growth.',
            constraints: { tone: 'realistic', complexity: 'moderate' },
            prompt: `You are a market research analyst.\nGiven a SAM of: {sam_analysis}\nA unique value proposition: "{uvp_statement}"\nAnd existing solutions: {current_solutions}\nAnd user input: {userInput}\n\nEstimate the Serviceable Obtainable Market (SOM) for the next 3-5 years. Your response must:\n1. **Propose a Market Share:** Suggest a realistic market share percentage (e.g., 1-5%) that can be captured.\n2. **Justify the Share:** Briefly explain why this percentage is achievable, considering the startup's UVP and the weaknesses of current solutions.\n3. **Calculate SOM:** State the final monetary value of the SOM.`,
          },
        },
      ],
    },
    // ========================================
    // 2.2. Competitive Landscape
    // ========================================
    {
      id: 'COMPETITIVE_LANDSCAPE',
      order: 2,
      title_en: 'Competitive Landscape',
      title_fa: 'چشم‌انداز رقابتی',
      stages: [
        {
          id: 'COMPETITOR_IDENTIFICATION',
          order: 1,
          title_en: 'Competitor Identification',
          title_fa: 'شناسایی رقبا',
          guidance_en:
            'Your competitors are not just companies selling a product similar to yours (direct). They also include alternative solutions (indirect) and even the traditional methods people use to solve their problem.',
          guidance_fa:
            'رقبای شما فقط شرکت‌هایی نیستند که محصولی مشابه شما می‌فروشند (مستقیم). آن‌ها شامل راه‌حل‌های جایگزین (غیرمستقیم) و حتی روش‌های سنتی که مردم برای حل مشکلشان استفاده می‌کنند نیز می‌شوند.',
          question_en:
            'Who are your most significant direct competitors (similar product) and indirect competitors (alternative solution)?',
          question_fa:
            'مهم‌ترین رقبای مستقیم (محصول مشابه) و غیرمستقیم (راه‌حل جایگزین) شما چه کسانی هستند؟',
          userInputRequired: false,
          outputType: 'list',
          dataKey: 'competitor_identification', // ✅ CORRECTED
          promptConfig: {
            role: 'You are a market intelligence AI specialized in competitive analysis.',
            contextKeys: ['problem_description', 'product_description', 'userInput'],
            goal: 'Identify the top direct and indirect competitors.',
            outputFormat:
              'Two clearly labeled bulleted lists: one for "Direct Competitors" and one for "Indirect Competitors," with a brief description for each.',
            constraints: { count: 6, tone: 'informative', complexity: 'simple' },
            tools: { webSearch: true },
            prompt: `You are a market intelligence analyst.\nFor a startup solving: "{problem_description}"\nWith a product: {product_description}\nAnd user input: {userInput}\n\nUse web search to identify competitors. Structure your answer into two distinct lists:\n1. **Direct Competitors:** List the top 3 companies with very similar offerings. For each, provide a one-sentence description.\n2. **Indirect Competitors:** List the top 3 companies or methods that provide an alternative solution to the same core problem. For each, provide a one-sentence description.`,
          },
        },
        {
          id: 'COMPETITOR_ANALYSIS',
          order: 2,
          title_en: 'In-depth Competitor Analysis',
          title_fa: 'تحلیل عمیق رقبا',
          guidance_en:
            "Select your top 3 competitors and analyze them carefully. Examine their product's strengths and weaknesses, their pricing strategy, their marketing approach, and their positioning.",
          guidance_fa:
            '۳ رقیب اصلی خود را انتخاب کرده و آن‌ها را به دقت بررسی کنید. نقاط قوت و ضعف محصول، استراتژی قیمت‌گذاری، نحوه بازاریابی و جایگاه آن‌ها در ذهن مشتریان را تحلیل کنید.',
          question_en:
            'What are the primary strengths and weaknesses of your top 3 competitors? What are they better at than you, and where can you be better?',
          question_fa:
            'نقاط قوت و ضعف اصلی ۳ رقیب برتر شما چیست؟ آن‌ها در چه چیزی از شما بهترند و شما در چه چیزی می‌توانید بهتر باشید؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'competitor_analysis', // ✅ Correct
          promptConfig: {
            role: 'You are a market intelligence AI specialized in competitive analysis.',
            contextKeys: ['competitor_identification', 'uvp_statement', 'userInput'],
            goal: 'Provide a detailed strength/weakness analysis of the top competitors, framed as opportunities.',
            outputFormat:
              'A structured analysis for each of the top 3 direct competitors, covering their key strengths, weaknesses, and how those weaknesses create an opportunity.',
            constraints: { tone: 'analytical', complexity: 'moderate' },
            tools: { webSearch: true },
            prompt: `You are a market intelligence analyst.\nFrom the list of competitors: {competitor_identification}\nAnd considering our UVP: "{uvp_statement}"\nAnd user input: {userInput}\n\nConduct an in-depth analysis of the top 3 direct competitors identified. For each competitor, use web search and structure your analysis as follows:\n- **Competitor Name:**\n  - **Key Strengths:** (List 2-3 of their most significant advantages, e.g., brand recognition, large user base).\n  - **Key Weaknesses:** (List 2-3 of their most significant disadvantages, e.g., high price, poor UX, outdated tech).\n  - **Opportunity for Us:** (In one sentence, explain how their weakness creates a specific opportunity for our startup).`,
          },
        },
      ],
    },
    // ========================================
    // 2.3. SWOT Analysis
    // ========================================
    {
      id: 'SWOT_ANALYSIS_SUBSECTION',
      order: 3,
      title_en: 'SWOT Analysis',
      title_fa: 'تحلیل SWOT',
      stages: [
        {
          id: 'SWOT_ANALYSIS',
          order: 1,
          title_en: 'SWOT Analysis',
          title_fa: 'تحلیل SWOT',
          guidance_en:
            'SWOT is a strategic framework for evaluating your business from four perspectives: Strengths, Weaknesses (internal), and Opportunities, Threats (external).',
          guidance_fa:
            'SWOT یک چارچوب استراتژیک برای ارزیابی کسب‌وکار شما از چهار منظر است: نقاط قوت و ضعف (عوامل داخلی) و فرصت‌ها و تهدیدها (عوامل خارجی).',
          question_en:
            'Based on your previous analyses, list the 2-3 most important Strengths, Weaknesses, Opportunities, and Threats facing your startup.',
          question_fa:
            'با توجه به تحلیل‌های قبلی، ۲ تا ۳ مورد از مهم‌ترین نقاط قوت، ضعف، فرصت‌ها و تهدیدهای پیش روی استارت‌آپ خود را لیست کنید.',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'swot_analysis', // ✅ Correct
          promptConfig: {
            role: 'You are a business strategist AI that helps startups with strategic planning.',
            contextKeys: [
              'unfair_advantage',
              'pestel_analysis',
              'competitor_analysis',
              'userInput',
            ],
            goal: 'Generate a concise and relevant SWOT analysis by synthesizing previous findings.',
            outputFormat:
              'Four bulleted lists, one for each quadrant of SWOT (Strengths, Weaknesses, Opportunities, Threats), with 2-3 points each.',
            constraints: { tone: 'strategic', complexity: 'simple' },
            prompt: `You are a business strategist conducting a SWOT analysis.\nSynthesize the following information:\n- Internal Strengths (Primarily from: {unfair_advantage})\n- Internal Weaknesses (Consider what the startup currently lacks, e.g., brand recognition, funding)\n- External Opportunities (Primarily from macro trends in: {pestel_analysis})\n- External Threats (Primarily from: {competitor_analysis})\nAnd user input: {userInput}\n\nGenerate 2-3 bullet points for each of the four SWOT categories. Ensure a clear distinction between internal (S, W) and external (O, T) factors.`,
          },
        },
      ],
    },
    // ========================================
    // 2.4. Risk Analysis & Management
    // ========================================
    {
      id: 'RISK_ANALYSIS_SUBSECTION',
      order: 4,
      title_en: 'Risk Analysis & Management',
      title_fa: 'تحلیل و مدیریت ریسک',
      stages: [
        {
          id: 'RISK_ANALYSIS',
          order: 1,
          title_en: 'Risk Analysis & Management',
          title_fa: 'تحلیل و مدیریت ریسک',
          guidance_en:
            'Identifying potential risks (technical, market, financial, team) allows you to plan for managing or mitigating their effects.',
          guidance_fa:
            'شناسایی ریسک‌های احتمالی (فنی، بازار، مالی یا تیمی) به شما این امکان را می‌دهد که برای مدیریت یا کاهش اثرات آن‌ها برنامه‌ریزی کنید.',
          question_en:
            "What are the top 3 risks that could seriously jeopardize your startup's success? For each, what is your plan to mitigate or manage it?",
          question_fa:
            '۳ ریسک اصلی که می‌توانند موفقیت استارت‌آپ شما را به طور جدی به خطر بیندازند کدامند؟ برای هر کدام، چه برنامه‌ای برای کاهش یا مدیریت آن دارید؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'risk_analysis', // ✅ Correct
          promptConfig: {
            role: 'You are a risk management expert AI for startups.',
            contextKeys: ['swot_analysis', 'competitor_analysis', 'userInput'],
            goal: 'Identify the top 3 business risks and propose actionable mitigation strategies.',
            outputFormat:
              'A list of the top 3 risks, each with a clear name, a brief description, and a practical mitigation strategy.',
            constraints: { count: 3, tone: 'precautionary', complexity: 'moderate' },
            prompt: `You are a risk management expert.\nBased on the SWOT analysis (especially Weaknesses and Threats): {swot_analysis}\nAnd the competitive analysis: {competitor_analysis}\nAnd user input: {userInput}\n\nIdentify the top 3 most critical risks for this startup from different categories (e.g., Market, Execution, Financial). For each risk, structure your response as follows:\n- **Risk Name:** (e.g., Market Adoption Risk)\n- **Description:** (Briefly explain why this is a risk for the startup.)\n- **Mitigation Strategy:** (Suggest a concrete, actionable step the founder can take to reduce this risk.)`,
          },
        },
      ],
    },
  ],
};
