import { PhaseConfig } from '../../types/stage.types';

/**
 * ========================================
 * PHASE 3: Business Modeling
 * ========================================
 *
 * In this phase, we map out the blueprint of your business. The Business
 * Model Canvas (BMC) is a powerful tool that helps you visualize all the
 * core components of your startup—from customers and value propositions to
 * revenues and costs—in a single image. This map helps ensure that all the
 * pieces of your business puzzle fit together correctly.
 */
export const PHASE_3: PhaseConfig = {
  id: 'BUSINESS_MODELING',
  phaseNumber: 3,

  title_en: 'Business Modeling',
  title_fa: 'مدل‌سازی کسب‌وکار',

  description_en:
    'In this phase, we map out the blueprint of your business. The Business Model Canvas (BMC) is a powerful tool that helps you visualize all the core components of your startup—from customers and value propositions to revenues and costs—in a single image. This map helps ensure that all the pieces of your business puzzle fit together correctly.',
  description_fa:
    'در این فاز، نقشه و طرح کلی کسب‌وکار خود را روی کاغذ می‌آوریم. بوم مدل کسب‌وکار (Business Model Canvas) ابزاری قدرتمند است که به شما کمک می‌کند تمام اجزای اصلی استارت‌آپ خود را، از مشتریان و ارزش پیشنهادی گرفته تا درآمدها و هزینه‌ها، در یک تصویر واحد ببینید. این نقشه به شما کمک می‌کند تا مطمئن شوید که تمام قطعات پازل کسب‌وکارتان به درستی در کنار هم قرار گرفته‌اند.',

  subsections: [
    // ========================================
    // 3.1. Business Model Canvas (BMC)
    // ========================================
    {
      id: 'BUSINESS_MODEL_CANVAS',
      order: 1,
      title_en: 'Business Model Canvas (BMC)',
      title_fa: 'بوم مدل کسب‌وکار (BMC)',
      stages: [
        {
          id: 'BMC_CUSTOMER_SEGMENTS',
          order: 1,
          title_en: 'Customer Segments',
          title_fa: 'بخش‌های مشتریان',
          guidance_en:
            'This block answers the question: "Who are we creating value for?" You need to identify the different groups of people or organizations you aim to serve. This is a summarized version of your target audience analysis.',
          guidance_fa:
            'این بخش به این سوال پاسخ می‌دهد: "ما برای چه کسانی ارزش خلق می‌کنیم؟" شما باید گروه‌های مختلفی از افراد یا سازمان‌ها را که هدف قرار داده‌اید، مشخص کنید. این بخش، نسخه خلاصه‌شده تحلیل مخاطب هدف شما از فازهای قبل است.',
          question_en:
            'Who are the most important customer groups you are targeting? List them separately.',
          question_fa:
            'مهم‌ترین گروه‌های مشتریانی که هدف قرار می‌دهید چه کسانی هستند؟ آن‌ها را به تفکیک لیست کنید.',
          userInputRequired: false,
          outputType: 'list',
          dataKey: 'bmc_customer_segments', // ✅ Correct
          promptConfig: {
            role: 'You are a startup mentor helping entrepreneurs summarize their key customer segments for the Business Model Canvas.',
            contextKeys: ['customer_segments', 'early_adopter_persona', 'userInput'],
            goal: 'Summarize the primary customer segments for the BMC, focusing on the initial target.',
            outputFormat:
              'A bulleted list of the 2-3 most important customer segments, highlighting the primary "beachhead" segment.',
            constraints: { tone: 'concise', complexity: 'simple', count: 3 },
            prompt: `You are a startup mentor summarizing customer segments for a BMC.\nBased on the detailed customer segments: {customer_segments}\nAnd the early adopter persona: {early_adopter_persona}\nAnd user input: {userInput}\n\nYour task is to summarize the 2-3 most critical customer segments for the Business Model Canvas. Structure your response as follows:\n1. **Primary Segment (Beachhead):** Start with the segment represented by the early adopter persona.\n2. **Secondary Segments:** List 1-2 other high-potential segments.\nKeep the descriptions concise and focused.`,
          },
        },
        {
          id: 'BMC_VALUE_PROPOSITIONS',
          order: 2,
          title_en: 'Value Propositions',
          title_fa: 'ارزش‌های پیشنهادی',
          guidance_en:
            'This is the core of your business, answering: "What problems are we solving for customers, and what value are we delivering?" Each value proposition should be linked to a specific customer segment.',
          guidance_fa:
            'این بخش هسته اصلی کسب‌وکار شماست و به سوال "ما چه مشکلاتی از مشتریان را حل می‌کنیم و چه ارزشی به آن‌ها ارائه می‌دهیم؟" پاسخ می‌دهد. هر ارزش پیشنهادی باید به یک بخش خاص از مشتریان شما مرتبط باشد.',
          question_en:
            'What promise or value do you deliver to each of your customer segments? Why should they choose you?',
          question_fa:
            'به هر بخش از مشتریان خود چه قول یا ارزشی می‌دهید؟ چرا آن‌ها باید شما را انتخاب کنند؟',
          userInputRequired: false,
          outputType: 'list',
          dataKey: 'bmc_value_propositions', // ✅ Correct
          promptConfig: {
            role: 'You are a startup mentor helping to articulate clear value propositions for the BMC.',
            contextKeys: ['uvp_statement', 'how_it_works', 'bmc_customer_segments', 'userInput'],
            goal: 'Define a clear value proposition for each customer segment, based on the core UVP.',
            outputFormat:
              'A bulleted list, where each item explicitly links a value proposition to a specific customer segment.',
            constraints: { tone: 'customer-centric', complexity: 'simple' },
            prompt: `You are a startup mentor crafting value propositions for a BMC.\nBased on the main UVP: "{uvp_statement}"\nThe product's core features: {how_it_works}\nAnd the customer segments: {bmc_customer_segments}\nAnd user input: {userInput}\n\nYour task is to create a specific value proposition for each customer segment. For each segment in the list, write a concise statement that clearly communicates the primary benefit they will receive from the product, derived from the core UVP.`,
          },
        },
        {
          id: 'BMC_CHANNELS',
          order: 3,
          title_en: 'Channels',
          title_fa: 'کانال‌ها',
          guidance_en:
            'Channels are the pathways through which you reach your customers and deliver your value proposition. These include channels for awareness, sales, and post-purchase support.',
          guidance_fa:
            'کانال‌ها مسیرهایی هستند که از طریق آن‌ها به مشتریان خود دسترسی پیدا کرده و ارزش پیشنهادی‌تان را به آن‌ها ارائه می‌دهید. این کانال‌ها شامل اطلاع‌رسانی, فروش و پشتیبانی پس از فروش می‌شوند.',
          question_en:
            'Through which channels (e.g., website, app, direct sales, partners) will you reach your customers and deliver your product?',
          question_fa:
            'از چه راهی (وب‌سایت، اپلیکیشن، فروش مستقیم، شرکا و...) می‌خواهید به مشتریان خود دسترسی پیدا کنید و محصولتان را به دستشان برسانید؟',
          userInputRequired: false,
          outputType: 'list',
          dataKey: 'bmc_channels', // ✅ Correct
          promptConfig: {
            role: 'You are a startup mentor helping define effective customer channels for the BMC.',
            contextKeys: ['bmc_customer_segments', 'product_description', 'userInput'],
            goal: 'Identify the most effective channels to reach, sell to, and support the target customers.',
            outputFormat:
              'A bulleted list categorizing key channels by their function (e.g., Awareness, Sales, Support).',
            constraints: { tone: 'practical', complexity: 'simple' },
            prompt: `You are a startup mentor defining channels for a BMC.\nFor a startup with product: {product_description}\nTargeting customers: {bmc_customer_segments}\nAnd user input: {userInput}\n\nSuggest the most logical and effective channels for the initial launch. Structure your response under these three headings:\n1. **Awareness Channels:** (How will customers first learn about you? e.g., Social Media, Content Marketing)\n2. **Sales & Delivery Channels:** (Where and how will customers buy and receive the product? e.g., Website, App Store)\n3. **Support Channels:** (How will customers get help? e.g., Email Support, FAQ page)`,
          },
        },
        {
          id: 'BMC_CUSTOMER_RELATIONSHIPS',
          order: 4,
          title_en: 'Customer Relationships',
          title_fa: 'ارتباط با مشتریان',
          guidance_en:
            'This block defines the type of relationship you establish with each customer segment. The relationship can range from fully automated to highly personal.',
          guidance_fa:
            'این بخش نوع رابطه‌ای را که با هر بخش از مشتریان خود برقرار می‌کنید، مشخص می‌کند. این رابطه می‌تواند کاملاً خودکار (مانند یک سرویس آنلاین) یا بسیار شخصی (مانند یک مشاور اختصاصی) باشد.',
          question_en:
            'What kind of relationship will you have with your customers? (e.g., online support, personal account management, user communities).',
          question_fa:
            'چه نوع رابطه‌ای با مشتریان خود خواهید داشت? (مثلاً پشتیبانی آنلاین، مدیریت حساب شخصی، انجمن‌های کاربری و...).',
          userInputRequired: false,
          outputType: 'list',
          dataKey: 'bmc_customer_relationships', // ✅ Correct
          promptConfig: {
            role: 'You are a startup mentor helping define appropriate customer relationships for the BMC.',
            contextKeys: ['bmc_customer_segments', 'bmc_value_propositions', 'userInput'],
            goal: 'Define the type of relationship required to acquire, retain, and grow customers.',
            outputFormat:
              'A bulleted list describing the key types of customer relationships (e.g., Self-Service, Community Support), with a brief justification.',
            constraints: { tone: 'strategic', complexity: 'simple' },
            prompt: `You are a startup mentor defining customer relationships for a BMC.\nConsidering the customer segments: {bmc_customer_segments}\nAnd the value offered: {bmc_value_propositions}\nAnd user input: {userInput}\n\nWhat type of relationship is most appropriate for this startup to build with its customers? Suggest 2-3 relationship types (e.g., Self-Service, Automated Support, Community Forum, Dedicated Personal Assistance) and briefly justify why each is suitable for the initial phase of the business.`,
          },
        },
        {
          id: 'BMC_REVENUE_STREAMS',
          order: 5,
          title_en: 'Revenue Streams',
          title_fa: 'جریان‌های درآمدی',
          guidance_en:
            'This block shows how your business earns money from each customer segment. There are various revenue models, such as direct sales, subscriptions, commissions, etc.',
          guidance_fa:
            'این بخش نشان می‌دهد که کسب‌وکار شما چگونه از هر بخش از مشتریان خود کسب درآمد می‌کند. مدل‌های درآمدی مختلفی مانند فروش مستقیم، حق اشتراک، کارمزد، تبلیغات و... وجود دارد.',
          question_en:
            'How and how much will customers pay for your value proposition? What is your primary revenue model?',
          question_fa:
            'مشتریان برای ارزش پیشنهادی شما چگونه و چقدر پول پرداخت خواهند کرد؟ مدل اصلی درآمدزایی شما چیست؟',
          userInputRequired: false,
          outputType: 'list',
          dataKey: 'bmc_revenue_streams', // ✅ Correct
          promptConfig: {
            role: 'You are a startup mentor helping to identify viable revenue streams for the BMC.',
            contextKeys: [
              'bmc_value_propositions',
              'bmc_customer_segments',
              'competitor_analysis',
              'userInput',
            ],
            goal: 'Identify the primary revenue stream and potential secondary streams, with justification.',
            outputFormat:
              'A bulleted list detailing the recommended primary revenue model (e.g., Subscription - SaaS) and any potential secondary streams.',
            constraints: { tone: 'business-oriented', complexity: 'simple' },
            tools: { webSearch: true },
            prompt: `You are a startup mentor identifying revenue streams for a BMC.\nFor a startup offering: {bmc_value_propositions}\nTo customers: {bmc_customer_segments}\nWith competitors: {competitor_analysis}\nAnd user input: {userInput}\n\nWhat are the most suitable revenue streams? Your response should include:\n1. **Primary Revenue Stream:** Recommend the single best model to start with (e.g., Tiered Subscription, Freemium, One-Time Purchase) and justify your choice.\n2. **Potential Secondary Streams:** Suggest at least one other potential stream to consider in the future (e.g., Add-on services, Data monetization).`,
          },
        },
        {
          id: 'BMC_KEY_RESOURCES',
          order: 6,
          title_en: 'Key Resources',
          title_fa: 'منابع کلیدی',
          guidance_en:
            'Key resources are the most important assets required to make your business model work. These can be physical, financial, intellectual, or human.',
          guidance_fa:
            'منابع کلیدی، مهم‌ترین دارایی‌های مورد نیاز برای به کار انداختن مدل کسب‌وکار شما هستند. این منابع می‌توانند فیزیکی (تجهیزات)، مالی (سرمایه)، معنوی (دانش فنی، برند) یا انسانی (تیم متخصص) باشند.',
          question_en:
            'What are the most critical resources you need to deliver your value proposition and operate your business? (e.g., software platform, development team, initial capital).',
          question_fa:
            'مهم‌ترین منابعی که برای ارائه ارزش پیشنهادی و کارکرد کسب‌وکارتان نیاز دارید چیست؟ (مثلاً پلتفرم نرم‌افزاری، تیم توسعه‌دهنده، سرمایه اولیه).',
          userInputRequired: false,
          outputType: 'list',
          dataKey: 'bmc_key_resources', // ✅ Correct
          promptConfig: {
            role: 'You are a startup mentor helping identify key resources for the BMC.',
            contextKeys: [
              'bmc_value_propositions',
              'bmc_channels',
              'unfair_advantage',
              'userInput',
            ],
            goal: 'Identify the most critical assets needed for the business to succeed.',
            outputFormat:
              'A bulleted list categorized by resource type (Intellectual, Human, Financial, Physical).',
            constraints: { tone: 'practical', complexity: 'simple' },
            prompt: `You are a startup mentor identifying key resources for a BMC.\nTo deliver the value: {bmc_value_propositions}\nThrough channels: {bmc_channels}\nAnd leveraging the advantage: "{unfair_advantage}"\nAnd user input: {userInput}\n\nWhat are the most critical Key Resources needed for this business to function? List them under these categories:\n- **Intellectual:** (e.g., Proprietary Code, Brand, Domain Name)\n- **Human:** (e.g., Expert AI Engineers, UX/UI Designer)\n- **Financial:** (e.g., Seed Funding)\n- **Physical:** (e.g., Cloud Servers, Office Space - if applicable)`,
          },
        },
        {
          id: 'BMC_KEY_ACTIVITIES',
          order: 7,
          title_en: 'Key Activities',
          title_fa: 'فعالیت‌های کلیدی',
          guidance_en:
            'This block includes the most important things your company must continuously do for its business model to succeed, like software development, marketing, or customer support.',
          guidance_fa:
            'این بخش شامل مهم‌ترین کارهایی است که شرکت شما باید به طور مداوم انجام دهد تا مدل کسب‌وکارش موفق شود. این فعالیت‌ها می‌توانند شامل توسعه نرم‌افزار، بازاریابی، یا حل مشکلات مشتریان باشند.',
          question_en:
            'What are the most essential activities you must perform daily for your business to succeed? (e.g., product development, customer acquisition, technical support).',
          question_fa:
            'ضروری‌ترین فعالیت‌هایی که باید هر روز انجام دهید تا کسب‌وکارتان موفق شود کدامند؟ (مثلاً توسعه محصول، جذب مشتری، پشتیبانی فنی).',
          userInputRequired: false,
          outputType: 'list',
          dataKey: 'bmc_key_activities', // ✅ Correct
          promptConfig: {
            role: 'You are a startup mentor helping define key activities for the BMC.',
            contextKeys: ['bmc_value_propositions', 'product_description', 'userInput'],
            goal: 'Identify the 3-5 most critical activities for creating and delivering value.',
            outputFormat:
              'A bulleted list of the 3-5 most important activities, prioritized by importance.',
            constraints: { tone: 'action-oriented', complexity: 'simple', count: 5 },
            prompt: `You are a startup mentor defining key activities for a BMC.\nTo deliver the value: {bmc_value_propositions}\nFor the product: {product_description}\nAnd user input: {userInput}\n\nWhat are the 3-5 most critical Key Activities this startup must excel at to succeed? Prioritize the list, starting with the single most important activity. Examples include: "Continuous Product Development & Iteration," "Content Creation & Community Management," "Direct Sales & Onboarding."`,
          },
        },
        {
          id: 'BMC_KEY_PARTNERSHIPS',
          order: 8,
          title_en: 'Key Partnerships',
          title_fa: 'مشارکت‌های کلیدی',
          guidance_en:
            'No business succeeds alone. This block includes the network of suppliers and partners that help your business model succeed. These partnerships can reduce risks and improve your access to resources.',
          guidance_fa:
            'هیچ کسب‌وکاری به تنهایی موفق نمی‌شود. این بخش شامل شبکه تامین‌کنندگان و شرکایی است که به موفقیت مدل کسب‌وکار شما کمک می‌کنند. این مشارکت‌ها می‌توانند ریسک‌ها را کاهش داده و دسترسی شما به منابع را بهبود بخشند.',
          question_en:
            "Which companies, suppliers, or partners are critical to your business's success?",
          question_fa: 'چه شرکت‌ها، تامین‌کنندگان یا شرکایی برای موفقیت کسب‌وکار شما حیاتی هستند؟',
          userInputRequired: false,
          outputType: 'list',
          dataKey: 'bmc_key_partnerships', // ✅ Correct
          promptConfig: {
            role: 'You are a startup mentor helping identify strategic partnerships for the BMC.',
            contextKeys: ['bmc_key_resources', 'bmc_key_activities', 'userInput'],
            goal: 'Identify potential key partners that can optimize or enable the business model.',
            outputFormat:
              'A bulleted list of potential partner types with a brief rationale for why each partnership is valuable.',
            constraints: { tone: 'strategic', complexity: 'simple' },
            prompt: `You are a startup mentor identifying key partners for a BMC.\nConsidering the key resources needed: {bmc_key_resources}\nAnd the key activities to perform: {bmc_key_activities}\nAnd user input: {userInput}\n\nWho could be Key Partners for this startup? Suggest 2-3 types of partners and explain the value they would bring. Structure your response like this:\n- **Partner Type:** (e.g., Technology Providers, Marketing Affiliates, Strategic Alliances)\n  - **Rationale:** (e.g., "To handle server infrastructure," "To accelerate customer acquisition").`,
          },
        },
        {
          id: 'BMC_COST_STRUCTURE',
          order: 9,
          title_en: 'Cost Structure',
          title_fa: 'ساختار هزینه‌ها',
          guidance_en:
            'This block describes all the costs you will incur to operate your business model. Identifying the most significant and largest costs will help you with financial management.',
          guidance_fa:
            'این بخش تمام هزینه‌هایی را که برای اجرای مدل کسب‌وکار خود متحمل می‌شوید، توصیف می‌کند. شناسایی مهم‌ترین و بزرگ‌ترین هزینه‌ها به شما در مدیریت مالی کمک می‌کند.',
          question_en:
            'What will be the largest and most important costs in your business? (e.g., team salaries, server costs, marketing budget).',
          question_fa:
            'بزرگ‌ترین و مهم‌ترین هزینه‌های کسب‌وکار شما چه خواهد بود؟ (مثلاً حقوق تیم، هزینه سرورها، بودجه بازاریابی).',
          userInputRequired: false,
          outputType: 'list',
          dataKey: 'bmc_cost_structure', // ✅ Correct
          promptConfig: {
            role: 'You are a startup mentor helping to outline the cost structure for the BMC.',
            contextKeys: ['bmc_key_resources', 'bmc_key_activities', 'userInput'],
            goal: 'Identify the most significant costs inherent in the business model, separating fixed and variable costs.',
            outputFormat:
              'A bulleted list of the main cost drivers, categorized under "Fixed Costs" and "Variable Costs."',
            constraints: { tone: 'financial', complexity: 'simple' },
            prompt: `You are a startup mentor outlining a cost structure for a BMC.\nBased on the key resources: {bmc_key_resources}\nAnd key activities: {bmc_key_activities}\nAnd user input: {userInput}\n\nWhat are the most important costs this business will incur? List them under the following two categories:\n- **Fixed Costs:** (Costs that do not change with the number of customers, e.g., Salaries, Rent, Software Subscriptions).\n- **Variable Costs:** (Costs that scale with the number of customers, e.g., Server Hosting based on usage, Transaction Fees, Customer Acquisition Costs).`,
          },
        },
      ],
    },
  ],
};
