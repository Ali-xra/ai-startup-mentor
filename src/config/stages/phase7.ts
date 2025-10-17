import { PhaseConfig } from '../../types/stage.types';

/**
 * ========================================
 * PHASE 7: Organization, Operations & Financials
 * ========================================
 *
 * In this phase, we address the infrastructure and skeleton of your business.
 * This includes defining the team, the legal structure, day-to-day processes,
 * and most importantly, financial planning. A strong operational and financial
 * roadmap is essential for the long-term sustainability and growth of your startup.
 */
export const PHASE_7: PhaseConfig = {
  id: 'ORGANIZATION_FINANCIALS',
  phaseNumber: 7,

  title_en: 'Organization, Operations & Financials',
  title_fa: 'سازمان، عملیات و امور مالی',

  description_en: 'In this phase, we address the infrastructure and skeleton of your business. This includes defining the team, the legal structure, day-to-day processes, and most importantly, financial planning. A strong operational and financial roadmap is essential for the long-term sustainability and growth of your startup.',
  description_fa: 'در این فاز، ما به زیرساخت‌ها و اسکلت کسب‌وکار شما می‌پردازیم. این بخش شامل تعریف تیم، ساختار قانونی، فرآیندهای روزمره و مهم‌تر از همه، برنامه‌ریزی مالی است. داشتن یک نقشه راه مالی و عملیاتی قوی، برای پایداری و رشد بلندمدت استارت‌آپ شما ضروری است.',

  subsections: [
    // ========================================
    // 7.1. Organization & Team
    // ========================================
    {
      id: 'ORGANIZATION_TEAM',
      order: 1,
      title_en: 'Organization & Team',
      title_fa: 'سازمان و تیم',
      stages: [
        {
          id: 'FOUNDING_TEAM',
          order: 1,
          title_en: 'Founding Team Introduction',
          title_fa: 'معرفی تیم موسس',
          guidance_en: 'Investors often invest in the team, not just the idea. In this section, you should introduce each founding team member, their role, and the relevant experience they bring to the project.',
          guidance_fa: 'سرمایه‌گذاران اغلب بر روی تیم سرمایه‌گذاری می‌کنند، نه فقط ایده. در این بخش باید هر یک از اعضای تیم موسس، نقش آن‌ها و تجربه مرتبطی که به موفقیت این پروژه کمک می‌کند را معرفی کنید.',
          question_en: 'Who are the key members of your team? What is each person\'s primary role and expertise in this startup?',
          question_fa: 'اعضای کلیدی تیم شما چه کسانی هستند؟ نقش و تخصص اصلی هر فرد در این استارت‌آپ چیست؟',
          userInputRequired: true,
          outputType: 'analysis',
          dataKey: 'founding_team', // ✅ Correct
          promptConfig: {
            role: 'You are a startup mentor helping founders present their team effectively to investors.',
            contextKeys: ['unfair_advantage', 'userInput'],
            goal: 'Create a compelling summary of the founding team\'s strengths, roles, and unique qualifications.',
            outputFormat: 'A brief, powerful bio for each founder, highlighting their role, key responsibilities, and experience that directly supports the startup\'s mission and unfair advantage.',
            constraints: { tone: 'professional', complexity: 'simple' },
            prompt: `You are a startup mentor writing the "Team" slide for a pitch deck.\nBased on the user's input about their team members: {userInput}\nAnd keeping in mind the startup's unfair advantage: "{unfair_advantage}"\n\nYour task is to write a concise professional bio (2-3 sentences) for each founding member. For each person, clearly state:\n1. **Name and Role:** (e.g., "Jane Doe, Co-Founder & CEO").\n2. **Key Relevant Experience:** (Focus on past achievements or skills that are directly relevant, e.g., "10+ years in SaaS product management at TechCorp").\n3. **Unique Contribution:** (How their specific expertise contributes to the startup's success or unfair advantage).`,
          },
        },
        {
          id: 'HIRING_PLAN',
          order: 2,
          title_en: 'Hiring Plan',
          title_fa: 'برنامه استخدام',
          guidance_en: 'You can\'t do everything alone. Identifying the key roles you will need to fill in the near future (e.g., the next 6-12 months) to grow your business shows foresight.',
          guidance_fa: 'شما نمی‌توانید همه کارها را به تنهایی انجام دهید. شناسایی نقش‌های کلیدی که در آینده نزدیک (مثلاً ۶ تا ۱۲ ماه آینده) برای رشد کسب‌وکارتان نیاز دارید، نشان‌دهنده آینده‌نگری شماست.',
          question_en: 'What is the first and most important role you will hire for after securing funding or reaching initial revenue, and why?',
          question_fa: 'اولین و مهم‌ترین نقشی که پس از جذب سرمایه یا رسیدن به درآمد اولیه استخدام خواهید کرد چیست و چرا؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'hiring_plan', // ✅ Correct
          promptConfig: {
            role: 'You are a startup advisor helping founders plan their team growth strategically.',
            contextKeys: ['founding_team', 'bmc_key_activities', 'userInput'],
            goal: 'Identify the top 1-3 critical hires for the next 6-12 months by analyzing skill gaps.',
            outputFormat: 'A prioritized list of 1-3 key roles to hire, with a clear justification for why each role is critical for the next stage of growth.',
            constraints: { tone: 'strategic', complexity: 'simple' },
            prompt: `You are a startup advisor analyzing team needs.\nBy analyzing the current team's expertise: {founding_team}\nAnd the business's key activities: {bmc_key_activities}\nAnd user input: {userInput}\n\nYour task is to identify the top 1-3 most critical roles the startup needs to hire in the next 6-12 months. Structure your response as follows:\n1. **Most Critical Hire:** (Identify the single most important role, e.g., "Lead Software Engineer").\n   - **Justification:** (Explain what skill gap this person fills and how they will unlock the next stage of growth, referencing the key activities).\n2. **Next Hires:** (List 1-2 other important roles).`,
          },
        },
      ],
    },
    // ========================================
    // 7.2. Legal & Corporate Affairs
    // ========================================
    {
      id: 'LEGAL_AFFAIRS',
      order: 2,
      title_en: 'Legal & Corporate Affairs',
      title_fa: 'امور حقوقی و قانونی',
      stages: [
        {
          id: 'LEGAL_STRUCTURE',
          order: 1,
          title_en: 'Corporate Legal Structure',
          title_fa: 'ساختار حقوقی شرکت',
          guidance_en: 'Choosing the right legal structure (such as an LLC or C-Corp) affects taxes, personal liability, and your ability to raise capital. Consulting with a lawyer is essential.',
          guidance_fa: 'انتخاب ساختار حقوقی مناسب (مانند سهامی خاص یا مسئولیت محدود) بر مواردی مانند مالیات، مسئولیت شخصی و توانایی جذب سرمایه تاثیر می‌گذارد. مشورت با یک وکیل در این مرحله ضروری است.',
          question_en: 'What type of legal structure have you considered or registered for your company? What is the reason for this choice?',
          question_fa: 'چه نوع ساختار حقوقی برای شرکت خود در نظر گرفته‌اید یا ثبت کرده‌اید؟ دلیل این انتخاب چیست؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'legal_structure', // ✅ Correct
          promptConfig: {
            role: 'You are an AI assistant providing general information on corporate structures for startups. You are not a lawyer.',
            contextKeys: ['business_goals_timeline', 'userInput'],
            goal: 'Suggest a common legal structure for a growth-oriented startup and explain the key reasons.',
            outputFormat: 'A recommendation for a legal structure (LLC or C-Corp) with a clear disclaimer, followed by a brief explanation of the benefits for a startup aiming for growth and investment.',
            constraints: { tone: 'informative', complexity: 'simple' },
            prompt: `You are an informational AI assistant.\nBased on the startup's long-term goals: {business_goals_timeline}\nAnd user input: {userInput}\n\nYour task is to suggest a suitable corporate legal structure for a startup planning for growth and potentially seeking venture capital. Structure the response as follows:\n1. **Disclaimer:** Start with "This is for informational purposes only and does not constitute legal advice. Please consult a qualified lawyer."\n2. **Recommendation:** Suggest the most common choice (e.g., a Delaware C-Corporation).\n3. **Key Reasons:** Briefly explain the main advantages for a high-growth startup, such as "Investor Familiarity," "Stock Options for Employees," and "Standardized Governance."`,
          },
        },
        {
          id: 'IP_STRATEGY',
          order: 2,
          title_en: 'Intellectual Property (IP) Strategy',
          title_fa: 'استراتژی حفاظت از مالکیت معنوی (IP)',
          guidance_en: 'Your intellectual property (like software code, brand name, logo) is one of your most valuable assets. You should have a plan to protect it.',
          guidance_fa: 'مالکیت معنوی شما (مانند کد نرم‌افزار، نام برند، لوگو) یکی از باارزش‌ترین دارایی‌های شماست. باید برنامه‌ای برای حفاظت از آن از طریق کپی‌رایت، علائم تجاری یا پتنت داشته باشید.',
          question_en: 'What is the most important intellectual property of your business? What steps do you plan to take to protect it?',
          question_fa: 'مهم‌ترین دارایی معنوی کسب‌وکار شما چیست؟ چه اقداماتی برای محافظت از آن انجام داده‌اید یا قصد دارید انجام دهید؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'ip_strategy', // ✅ Correct
          promptConfig: {
            role: 'You are an AI assistant providing general information on IP strategy for software startups.',
            contextKeys: ['brand_name', 'product_description', 'unfair_advantage', 'userInput'],
            goal: 'Identify key IP assets and suggest basic, standard protection strategies.',
            outputFormat: 'A list identifying the main IP assets and suggesting the appropriate standard protection mechanism for each.',
            constraints: { tone: 'informative', complexity: 'simple' },
            prompt: `You are an informational AI assistant.\nBased on:\n- Brand Name options: {brand_name}\n- Product: {product_description}\n- Unfair Advantage: "{unfair_advantage}"\nAnd user input: {userInput}\n\nYour task is to identify the key intellectual property assets for this startup and suggest a basic protection strategy for each. Structure your response with these headings:\n- **Brand Name & Logo:** (Recommend filing for a trademark).\n- **Software/Code:** (Explain that this is typically protected by copyright and proprietary information agreements with employees).\n- **Unique Technology/Process:** (If the unfair advantage is a specific technology, suggest considering a patent consultation).\n- **Disclaimer:** Conclude with "This is not legal advice. Consult an IP lawyer."`,
          },
        },
      ],
    },
    // ========================================
    // 7.3. Operational Plan
    // ========================================
    {
      id: 'OPERATIONAL_PLAN',
      order: 3,
      title_en: 'Operational Plan',
      title_fa: 'طرح عملیاتی',
      stages: [
        {
          id: 'KEY_MILESTONES',
          order: 1,
          title_en: 'Key Milestones',
          title_fa: 'نقاط عطف (Milestones) کلیدی',
          guidance_en: 'Milestones are significant, measurable goals on your project\'s timeline. They show you and investors that you are making progress.',
          guidance_fa: 'نقاط عطف، اهداف مهم و قابل اندازه‌گیری در مسیر پروژه شما هستند. این موارد به شما و سرمایه‌گذاران نشان می‌دهد که در حال پیشرفت هستید.',
          question_en: 'What are the 3 to 5 main milestones you plan to achieve in the next 12 months?',
          question_fa: '۳ تا ۵ نقطه عطف اصلی که در ۱۲ ماه آینده قصد دارید به آن‌ها برسید کدامند؟',
          userInputRequired: false,
          outputType: 'list',
          dataKey: 'key_milestones', // ✅ Correct
          promptConfig: {
            role: 'You are a project manager AI that helps set clear, sequential milestones.',
            contextKeys: ['business_goals_timeline', 'marketing_objectives', 'product_roadmap', 'userInput'],
            goal: 'Create a timeline of key product, marketing, and business milestones for the next 12 months.',
            outputFormat: 'A bulleted list of 4-6 key milestones with an estimated timeline (e.g., by Quarter).',
            constraints: { tone: 'structured', complexity: 'simple' },
            prompt: `You are a project manager creating a 12-month milestone plan.\nSynthesize the following into a cohesive timeline:\n- Product goals from the roadmap: {product_roadmap}\n- Marketing goals: {marketing_objectives}\n- Overall business goals: {business_goals_timeline}\nAnd user input: {userInput}\n\nYour task is to create a list of 4-6 key, tangible milestones for the next 12 months. Group them by quarter (Q1, Q2, Q3, Q4) and ensure they cover different aspects of the business. For example:\n- **Q1:** Successfully launch MVP, Onboard first 100 users.\n- **Q2:** Launch [Key Feature from Roadmap], Achieve first $1,000 in MRR.`,
          },
        },
      ],
    },
    // ========================================
    // 7.4. Financial Planning & Projections
    // ========================================
    {
      id: 'FINANCIAL_PLANNING',
      order: 4,
      title_en: 'Financial Planning & Projections',
      title_fa: 'برنامه‌ریزی و پیش‌بینی‌های مالی',
      stages: [
        {
          id: 'STARTUP_COSTS',
          order: 1,
          title_en: 'Startup Costs Estimation',
          title_fa: 'برآورد هزینه‌های راه‌اندازی',
          guidance_en: 'This includes all the one-time expenses you need to start your business, such as legal fees, initial equipment, and initial product development.',
          guidance_fa: 'این بخش شامل تمام هزینه‌های یک‌باره‌ای است که برای شروع کسب‌وکارتان نیاز دارید. این هزینه‌ها می‌توانند شامل ثبت شرکت، هزینه‌های حقوقی، و توسعه اولیه محصول باشند.',
          question_en: 'What are the total costs required to get your product to the MVP launch stage? What are the main categories of these expenses?',
          question_fa: 'مجموع هزینه‌هایی که برای رساندن محصول به مرحله عرضه MVP نیاز دارید چقدر است؟ مهم‌ترین دسته‌بندی‌های این هزینه‌ها چیست؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'startup_costs', // ✅ Correct
          promptConfig: {
            role: 'You are a financial analyst AI specializing in startup budgeting.',
            contextKeys: ['tech_stack', 'launch_campaign', 'legal_structure', 'userInput'],
            goal: 'Estimate the one-time startup costs required to launch the MVP, with clear categories.',
            outputFormat: 'A categorized list of estimated one-time costs (e.g., Legal, Tech, Marketing) with a total estimated amount.',
            constraints: { tone: 'financial', complexity: 'moderate' },
            prompt: `You are a financial analyst estimating pre-launch startup costs.\nBased on:\n- Tech stack: {tech_stack}\n- Launch plan: {launch_campaign}\n- Legal structure choice: {legal_structure}\nAnd user input: {userInput}\n\nYour task is to estimate the one-time startup costs needed to get to launch. Create a breakdown with estimated costs (use reasonable placeholder values if specifics are unavailable):\n1. **Legal & Administrative:** (Incorporation, legal docs, etc.)\n2. **Product Development:** (Initial developer time, essential software/tools until launch)\n3. **Marketing:** (Pre-launch and launch campaign costs)\n4. **Contingency:** (Add a 15-20% buffer)\nFinally, provide a **Total Estimated Startup Cost**.`,
          },
        },
        {
          id: 'BURN_RATE',
          order: 2,
          title_en: 'Monthly Operating Expense Forecast (Burn Rate)',
          title_fa: 'پیش‌بینی هزینه‌های عملیاتی ماهانه (Burn Rate)',
          guidance_en: 'This number shows how much money your company spends (burns) each month to stay operational. These are recurring costs like salaries, rent, server costs, and marketing.',
          guidance_fa: 'این عدد نشان می‌دهد که شرکت شما برای زنده ماندن، ماهانه چقدر پول می‌سوزاند. این هزینه‌ها شامل موارد تکرارشونده مانند حقوق، اجاره، هزینه سرور و بازاریابی است.',
          question_en: 'After launching the product, what do you forecast your fixed monthly operating expenses will be?',
          question_fa: 'پس از عرضه محصول، پیش‌بینی می‌کنید هزینه‌های ثابت ماهانه شما چقدر خواهد بود؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'burn_rate', // ✅ Correct
          promptConfig: {
            role: 'You are a financial analyst AI specializing in startup budgeting.',
            contextKeys: ['founding_team', 'hiring_plan', 'tech_stack', 'userInput'],
            goal: 'Estimate the average monthly operating expenses (burn rate) for the first year post-launch.',
            outputFormat: 'A categorized list of estimated monthly recurring costs with a total estimated monthly burn rate.',
            constraints: { tone: 'financial', complexity: 'moderate' },
            prompt: `You are a financial analyst estimating monthly burn rate.\nBased on:\n- The team: {founding_team}\n- The hiring plan: {hiring_plan}\n- The tech stack: {tech_stack}\nAnd user input: {userInput}\n\nYour task is to estimate the average monthly operating expenses (burn rate) for the first year post-launch. Create a breakdown with estimated monthly costs (use reasonable placeholder salaries/costs):\n1. **Salaries:** (Founders + planned first hires)\n2. **Technology/Infrastructure:** (Servers, software subscriptions, APIs)\n3. **Sales & Marketing:** (Ongoing ad spend, marketing tools)\n4. **General & Administrative:** (Rent, utilities, other overhead)\nFinally, provide a **Total Estimated Monthly Burn Rate**.`,
          },
        },
        {
          id: 'REVENUE_FORECAST',
          order: 3,
          title_en: 'Sales & Revenue Forecast',
          title_fa: 'پیش‌بینی فروش و درآمد',
          guidance_en: 'Based on your pricing strategy and marketing goals, create a realistic revenue forecast for the next 12 to 36 months. This should be based on specific assumptions.',
          guidance_fa: 'بر اساس استراتژی قیمت‌گذاری و اهداف بازاریابی خود، یک پیش‌بینی واقع‌بینانه از درآمد خود برای ۱۲ تا ۳۶ ماه آینده ایجاد کنید. این پیش‌بینی باید بر اساس مفروضات مشخصی باشد.',
          question_en: 'Based on your revenue model and customer acquisition forecast, what revenue do you expect to achieve in the first year? What are your key assumptions?',
          question_fa: 'بر اساس مدل درآمدی و پیش‌بینی جذب مشتری، انتظار دارید در سال اول به چه درآمدی برسید؟ مفروضات اصلی شما برای این عدد چیست؟',
          userInputRequired: false,
          outputType: 'analysis',
          dataKey: 'revenue_forecast', // ✅ Correct
          promptConfig: {
            role: 'You are a financial analyst AI skilled in creating assumption-driven revenue projections.',
            contextKeys: ['pricing_strategy', 'marketing_objectives', 'som_analysis', 'userInput'],
            goal: 'Create a simple, transparent, assumption-driven revenue forecast for the first 12 months.',
            outputFormat: 'A brief paragraph explaining the key assumptions, followed by a simple table showing projected monthly users and revenue for the first 12 months.',
            constraints: { tone: 'analytical', complexity: 'moderate' },
            prompt: `You are a financial analyst creating a revenue forecast.\nUsing:\n- Pricing: {pricing_strategy}\n- Marketing goals: {marketing_objectives}\n- Market size (SOM): {som_analysis}\nAnd user input: {userInput}\n\nYour task is to create a simple 12-month revenue forecast. Structure your response as follows:\n1. **Key Assumptions:** Clearly state the main drivers of the forecast. For example:\n   - "Starting Users: 0"\n   - "Monthly User Growth Rate: 20%"\n   - "Conversion Rate to Paid Plan: 2%"\n   - "Average Revenue Per User (ARPU): [from pricing strategy]"\n2. **12-Month Forecast Table:** Create a simple month-by-month table with columns for "Month," "Total Users," "Paying Customers," and "Monthly Revenue."`,
          },
        },
      ],
    },
  ],
};