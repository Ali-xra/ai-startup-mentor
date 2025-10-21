import { PhaseConfig } from '../../types/stage.types';

/**
 * ========================================
 * PHASE 5: Requirements Engineering & MVP Construction
 * ========================================
 *
 * This phase transforms your business plan into a technical blueprint.
 * First, we'll ask key product questions. Then, based on your answers
 * and best practices, we will generate a series of step-by-step,
 * prioritized prompts for a developer AI to build your MVP.
 */
export const PHASE_5: PhaseConfig = {
  id: 'MVP_ENGINEERING',
  phaseNumber: 5,

  title_en: 'Requirements Engineering & MVP Construction',
  title_fa: 'مهندسی نیازمندی‌ها و ساخت MVP',

  description_en:
    "This phase transforms your business plan into a technical blueprint. First, we'll ask key product questions. Then, based on your answers and best practices, we will generate a series of step-by-step, prioritized prompts for a developer AI to build your MVP.",
  description_fa:
    'این فاز، طرح کسب‌وکار شما را به یک نقشه فنی تبدیل می‌کند. ابتدا، سوالات کلیدی محصول را از شما می‌پرسیم. سپس، بر اساس پاسخ‌های شما و بهترین رویکردهای صنعتی، مجموعه‌ای از دستورالعمل‌های اولویت‌بندی شده و گام‌به‌گام را برای یک هوش مصنوعی برنامه‌نویس جهت ساخت MVP شما تولید خواهیم کرد.',

  subsections: [
    // ========================================
    // 5.1. Product Foundations & Requirements
    // ========================================
    {
      id: 'PRODUCT_REQUIREMENTS',
      order: 1,
      title_en: 'Product Foundations & Requirements',
      title_fa: 'مبانی و نیازمندی‌های محصول',
      stages: [
        {
          id: 'PLATFORM_VISION',
          order: 1,
          title_en: 'Platform & Future Vision',
          title_fa: 'پلتفرم و چشم‌انداز آینده',
          guidance_en:
            "First, let's decide on the initial platform for your users. Your answer here will influence key technical decisions about the software architecture to ensure it can grow with your vision.",
          guidance_fa:
            'ابتدا، پلتفرم اولیه برای کاربران شما را مشخص می‌کنیم. پاسخ شما در اینجا بر تصمیمات فنی کلیدی در مورد معماری نرم‌افزار تأثیر می‌گذارد تا اطمینان حاصل شود که می‌تواند همراه با چشم‌انداز شما رشد کند.',
          question_en:
            'Which platform will your users primarily use for the initial launch? Do you plan to expand to other platforms (e.g., a mobile app if you start with a website) in the next 1-2 years?',
          question_fa:
            'کاربران شما برای عرضه اولیه عمدتاً از کدام پلتفرم استفاده خواهند کرد؟ آیا قصد دارید در ۱-۲ سال آینده به پلتفرم‌های دیگر (مثلاً اپلیکیشن موبایل اگر با وب‌سایت شروع می‌کنید) گسترش پیدا کنید؟',
          userInputRequired: true,
          outputType: 'analysis',
          dataKey: 'platform_vision',
          promptConfig: {
            role: 'You are a technical product manager clarifying platform requirements.',
            contextKeys: ['userInput'],
            goal: "Structure the user's platform choice and future vision into a clear statement.",
            outputFormat:
              'A clear statement defining the initial platform and future expansion plans.',
            constraints: { tone: 'technical', complexity: 'simple' },
            prompt: `You are a technical product manager documenting platform strategy.\nBased on the user's input: {userInput}\n\nSummarize the platform strategy. Structure the response with these two points:\n- **Initial Platform:** (Clearly state "Web Application (Desktop/Mobile Browser)" or "Mobile App (iOS/Android)").\n- **Future Vision:** (State whether future expansion to other platforms is planned, e.g., "Expansion to a native mobile app is planned within 2 years."). This will inform the decision to use an API-first architecture.`,
          },
        },
        {
          id: 'USER_ROLES',
          order: 2,
          title_en: 'Special User Roles',
          title_fa: 'نقش‌های کاربری خاص',
          guidance_en:
            'Besides a standard "User" and a system "Admin," some applications need different types of users with different permissions. Think about whether you need roles like "Moderator," "Teacher," or "Manager."',
          guidance_fa:
            'علاوه بر "کاربر" استاندارد و "ادمین" سیستم، برخی اپلیکیشن‌ها به انواع مختلفی از کاربران با دسترسی‌های متفاوت نیاز دارند. فکر کنید که آیا به نقش‌هایی مانند "ناظر"، "معلم" یا "مدیر" نیاز دارید.',
          question_en:
            'Besides a regular User and an overall Admin, are there any other user roles with special permissions in your system?',
          question_fa:
            'علاوه بر یک کاربر عادی و یک ادمین کلی، آیا نقش‌های کاربری دیگری با دسترسی‌های خاص در سیستم شما وجود دارد؟',
          userInputRequired: true,
          outputType: 'list',
          dataKey: 'user_roles',
          promptConfig: {
            role: 'You are a system architect defining user roles.',
            contextKeys: ['userInput'],
            goal: "Structure the user's input into a clear list of user roles.",
            outputFormat: 'A bulleted list of all user roles in the system.',
            constraints: { tone: 'structured', complexity: 'simple' },
            prompt: `You are a system architect.\nBased on the user's input about special roles: {userInput}\n\nList all user roles for the application. The list must include the default roles and any special roles the user mentioned. For example:\n- Admin (Overall system manager)\n- User (Standard registered user)\n- [User-defined role 1, e.g., "Content Creator"]\n- [User-defined role 2, e.g., "Team Manager"]`,
          },
        },
        {
          id: 'USER_PROFILE_NEEDS',
          order: 3,
          title_en: 'User Profile Requirements',
          title_fa: 'نیازمندی‌های پروفایل کاربری',
          guidance_en:
            "Besides standard information like name and profile picture, what specific information relevant to your idea should be in a user's profile?",
          guidance_fa:
            'علاوه بر اطلاعات استاندارد مانند نام و عکس پروفایل، چه اطلاعات خاص و مرتبط با ایده شما باید در پروفایل هر کاربر وجود داشته باشد؟',
          question_en: "What custom fields, if any, should be included in a user's profile page?",
          question_fa:
            'چه فیلدهای سفارشی‌ای، در صورت وجود، باید در صفحه پروفایل کاربر گنجانده شود؟',
          userInputRequired: true,
          outputType: 'list',
          dataKey: 'user_profile_needs',
          promptConfig: {
            role: 'You are a UX designer defining user profile specifications.',
            contextKeys: ['userInput'],
            goal: 'List the required fields for the user profile.',
            outputFormat: 'A bulleted list of all fields for the user profile.',
            constraints: { tone: 'structured', complexity: 'simple' },
            prompt: `You are a UX designer.\nBased on the user's input on custom fields: {userInput}\n\nList all fields required for the user profile. Include standard fields plus any custom ones mentioned. For example:\n- Name\n- Profile Picture\n- Email (non-editable)\n- [User-defined field 1, e.g., "Job Title"]\n- [User-defined field 2, e.g., "Biography"]`,
          },
        },
        {
          id: 'MULTI_TENANCY',
          order: 4,
          title_en: 'Team / Workspace System (Multi-Tenancy)',
          title_fa: 'سیستم تیم/فضای کاری (Multi-Tenancy)',
          guidance_en:
            'This is a critical architectural question. Do users work alone, or can they be part of a "Team," "Company," or "Workspace" where they share data with other members? (like Slack or Trello).',
          guidance_fa:
            'این یک سوال معماری حیاتی است. آیا کاربران به تنهایی کار می‌کنند، یا می‌توانند عضو یک "تیم"، "شرکت" یا "فضای کاری" باشند که در آن داده‌ها را با اعضای دیگر به اشتراک می‌گذارند؟ (مانند Slack یا Trello).',
          question_en:
            'Will a user need to be part of a team or workspace to share content with others?',
          question_fa:
            'آیا یک کاربر برای به اشتراک گذاشتن محتوا با دیگران، نیاز به عضویت در یک تیم یا فضای کاری خواهد داشت؟',
          userInputRequired: true,
          outputType: 'analysis',
          dataKey: 'multi_tenancy',
          promptConfig: {
            role: 'You are a system architect determining the tenancy model.',
            contextKeys: ['userInput'],
            goal: 'Determine if a multi-tenant architecture is required.',
            outputFormat: 'A clear "Yes" or "No" answer with a brief explanation.',
            constraints: { tone: 'technical', complexity: 'simple' },
            prompt: `You are a system architect.\nBased on the user's answer to the team/workspace question: {userInput}\n\nAnalyze the input to determine if multi-tenancy is required. Respond with a clear "Yes" or "No" and a one-sentence explanation. For example: "Yes, a multi-tenant architecture is required to support shared workspaces." or "No, users operate independently."`,
          },
        },
        {
          id: 'FILE_UPLOADS',
          order: 5,
          title_en: 'File Upload Requirements',
          title_fa: 'نیازمندی‌های آپلود فایل',
          guidance_en:
            'Do your users need to upload files? If so, what kind of files will they be uploading (e.g., just images, videos, PDFs, any type)?',
          guidance_fa:
            'آیا کاربران شما نیاز به آپلود فایل دارند؟ اگر بله، چه نوع فایل‌هایی را آپلود خواهند کرد (مثلاً: فقط عکس، ویدیو، فایل PDF، هر نوعی)؟',
          question_en: 'Do users need to upload files, and if so, what types?',
          question_fa: 'آیا کاربران نیاز به آپلود فایل دارند، و اگر بله، چه انواعی؟',
          userInputRequired: true,
          outputType: 'analysis',
          dataKey: 'file_uploads',
          promptConfig: {
            role: 'You are a system architect defining file handling requirements.',
            contextKeys: ['userInput'],
            goal: 'Specify the file upload requirements for the application.',
            outputFormat: 'A clear statement about file upload needs and supported types.',
            constraints: { tone: 'technical', complexity: 'simple' },
            prompt: `You are a system architect.\nBased on the user's input on file uploads: {userInput}\n\nSummarize the file upload requirements. If uploads are needed, specify the types of files that should be supported (e.g., "File uploads are required, supporting images (JPEG, PNG) and PDFs."). If not, state "File uploads are not required for the MVP."`,
          },
        },
      ],
    },
    // ========================================
    // 5.2. MVP Construction (Prioritized Steps)
    // ========================================
    {
      id: 'MVP_CONSTRUCTION',
      order: 2,
      title_en: 'MVP Construction (Prioritized Steps)',
      title_fa: 'ساخت MVP (مراحل اولویت‌بندی شده)',
      stages: [
        {
          id: 'DATABASE_AND_AUTH',
          order: 1,
          title_en: 'Step 1: Database & Authentication',
          title_fa: 'قدم ۱: پایگاه داده و احراز هویت',
          guidance_en:
            'This is the foundation. The following prompt will instruct a developer AI to set up the project, choose a database solution (like Supabase for speed), and create the database schema based on your previous answers.',
          guidance_fa:
            'این فونداسیون پروژه است. دستورالعمل زیر به یک هوش مصنوعی برنامه‌نویس آموزش می‌دهد که پروژه را راه‌اندازی کند، یک راه‌حل پایگاه داده (مانند Supabase برای سرعت) انتخاب کند، و ساختار دیتابیس را بر اساس پاسخ‌های قبلی شما ایجاد کند.',
          question_en:
            'Copy the prompt below and provide it to a developer AI to build the project foundation.',
          question_fa:
            'دستورالعمل زیر را کپی کرده و به یک هوش مصنوعی برنامه‌نویس بدهید تا فونداسیون پروژه را بسازد.',
          userInputRequired: false,
          outputType: 'prompt',
          dataKey: 'database_and_auth',
          promptConfig: {
            role: 'You are a System Architect AI that writes detailed prompts for developer AIs.',
            contextKeys: [
              'tech_stack',
              'user_roles',
              'user_profile_needs',
              'multi_tenancy',
              'how_it_works',
            ],
            goal: "Generate a detailed, step-by-step prompt for a developer AI to set up the project's database and authentication.",
            outputFormat:
              'A complete, ready-to-use prompt for a developer AI, formatted with Markdown.',
            constraints: { tone: 'technical', complexity: 'expert' },
            prompt: `You are a System Architect writing a prompt for a developer AI.\nYour task is to generate that prompt based on the following context:\n- Tech Stack: {tech_stack}\n- User Roles: {user_roles}\n- Profile Needs: {user_profile_needs}\n- Multi-Tenancy: {multi_tenancy}\n- Core Features: {how_it_works}\n\n**PROMPT TO GENERATE:**\n\n"You are an expert full-stack developer AI. Your task is to set up the foundation for a new web application.\n\n**Technical Decision:** For rapid MVP development, we will use **Supabase** for our database (PostgreSQL) and authentication. Use JavaScript/TypeScript for any backend functions.\n\n**Step 1: Project Setup**\n- Initialize a new project using the recommended frontend from the tech stack: {tech_stack}.\n\n**Step 2: Database Schema**\nBased on the project requirements, create the following tables in Supabase:\n\n1.  **'users' Table:** This should integrate with Supabase Auth. Add custom columns based on these profile needs: {user_profile_needs}.\n2.  **'roles' Table:** Create a table to manage user roles: {user_roles}. Add a join table to link users to roles.\n3.  **[IF multi_tenancy is 'Yes'] 'workspaces' Table:** Create a table for workspaces/teams. Add a join table to manage user membership in workspaces.\n4.  **Core Feature Tables:** For each core feature in {how_it_works}, design a basic table to store its data. For example, a 'projects' table or a 'documents' table. Define the necessary columns and relationships between them and the 'users' table.\n\n**Step 3: Output**\n- Provide the SQL schema for all created tables."`,
          },
        },
        {
          id: 'PUBLIC_PAGES',
          order: 2,
          title_en: 'Step 2: Public & Marketing Pages',
          title_fa: 'قدم ۲: صفحات عمومی و بازاریابی',
          guidance_en:
            'Now, let\'s build the "storefront." This prompt will instruct the AI to create the main landing page and other public-facing pages for your application.',
          guidance_fa:
            'حالا، "ویترین" فروشگاه را می‌سازیم. این دستورالعمل به هوش مصنوعی آموزش می‌دهد که صفحه اصلی (لندینگ) و سایر صفحات عمومی اپلیکیشن شما را ایجاد کند.',
          question_en:
            'After the previous step is complete, copy this prompt and provide it to the developer AI.',
          question_fa:
            'پس از تکمیل مرحله قبل، این دستورالعمل را کپی کرده و به هوش مصنوعی برنامه‌نویس بدهید.',
          userInputRequired: false,
          outputType: 'prompt',
          dataKey: 'public_pages',
          promptConfig: {
            role: 'You are a System Architect AI that writes detailed prompts for developer AIs.',
            contextKeys: [
              'brand_name',
              'tagline',
              'uvp_statement',
              'color_palette',
              'typography',
              'bmc_revenue_streams',
            ],
            goal: 'Generate a detailed prompt for a developer AI to build the public-facing pages.',
            outputFormat: 'A complete, ready-to-use prompt for a developer AI.',
            constraints: { tone: 'technical', complexity: 'expert' },
            prompt: `You are a System Architect writing a prompt for a developer AI.\nYour task is to generate that prompt based on the following context:\n- Brand Name: {brand_name}\n- Tagline: {tagline}\n- UVP: "{uvp_statement}"\n- Colors: {color_palette}\n- Fonts: {typography}\n- Pricing Tiers: {bmc_revenue_streams}\n\n**PROMPT TO GENERATE:**\n\n"You are an expert frontend developer AI. Your task is to build the public-facing pages for our web application.\n\n**Design System:**\n- **Colors:** Use the primary and secondary colors from {color_palette} for the theme.\n- **Typography:** Use the recommended fonts from {typography} for headlines and body text.\n\n**Pages to Build:**\n\n1.  **Landing Page:** Create a modern, clean landing page with the following sections:\n    - **Hero Section:** Prominently display the brand name ({brand_name}), tagline ({tagline}), and the UVP ("{uvp_statement}"). Include clear "Sign Up" and "Login" buttons.\n    - **Features Section:** Briefly introduce 2-3 core features of the product.\n    - **Pricing Section:** Display the pricing tiers from {bmc_revenue_streams}.\n    - **Footer:** Include links to 'About Us' and 'Contact Us'.\n\n2.  **About Us Page:** A simple page with a placeholder for the company's mission.\n3.  **Contact Us Page:** A simple page with placeholder contact information.\n\n**Action:** Generate the code for these pages using the specified frontend framework."`,
          },
        },
        {
          id: 'USER_PANEL_STRUCTURE',
          order: 3,
          title_en: 'Step 3: Core User Panel Structure',
          title_fa: 'قدم ۳: ساختار اصلی پنل کاربری',
          guidance_en:
            'Once a user logs in, they need a "home." This prompt creates the main application layout, including the navigation menu and the user profile page.',
          guidance_fa:
            'هنگامی که کاربر وارد می‌شود، به یک "خانه" نیاز دارد. این دستورالعمل، طرح‌بندی اصلی اپلیکیشن، شامل منوی ناوبری و صفحه پروفایل کاربری را ایجاد می‌کند.',
          question_en:
            'After the previous step is complete, copy this prompt and provide it to the developer AI.',
          question_fa:
            'پس از تکمیل مرحله قبل، این دستورالعمل را کپی کرده و به هوش مصنوعی برنامه‌نویس بدهید.',
          userInputRequired: false,
          outputType: 'prompt',
          dataKey: 'user_panel_structure',
          promptConfig: {
            role: 'You are a System Architect AI that writes detailed prompts for developer AIs.',
            contextKeys: ['user_profile_needs', 'how_it_works'],
            goal: 'Generate a prompt for a developer AI to build the main authenticated layout and user profile page.',
            outputFormat: 'A complete, ready-to-use prompt for a developer AI.',
            constraints: { tone: 'technical', complexity: 'expert' },
            prompt: `You are a System Architect writing a prompt for a developer AI.\nYour task is to generate that prompt based on:\n- Profile Needs: {user_profile_needs}\n- Core Features: {how_it_works}\n\n**PROMPT TO GENERATE:**\n\n"You are an expert frontend developer AI. Your task is to build the core authenticated layout for our web app.\n\n**Step 1: Main App Layout**\n- Create a main layout for logged-in users. This should include:\n  - A persistent sidebar or top navigation bar.\n  - A main content area where different pages will be rendered.\n\n**Step 2: Navigation**\n- In the navigation bar, add links for:\n  - A "Dashboard" page.\n  - A link for each core feature defined in {how_it_works}.\n  - A link to the "Profile" page.\n  - A "Logout" button.\n\n**Step 3: User Profile Page**\n- Build the user profile page. It should display the user's information and allow them to edit the fields defined in {user_profile_needs}.\n- Implement the functionality to update the profile information in the Supabase database.\n\n**Action:** Generate the code for the main layout and the profile page."`,
          },
        },
        {
          id: 'CORE_FEATURES_IMPLEMENTATION',
          order: 4,
          title_en: 'Step 4: Core Features Implementation',
          title_fa: 'قدم ۴: پیاده‌سازی ویژگی‌های اصلی',
          guidance_en:
            'This is where we build the heart of your product. The following prompt is a template that should be used for EACH of your main features to instruct the AI on building them one by one.',
          guidance_fa:
            'اینجا جایی است که قلب محصول شما را می‌سازیم. دستورالعمل زیر یک الگو است که باید برای هر یک از ویژگی‌های اصلی شما استفاده شود تا به هوش مصنوعی آموزش دهد آن‌ها را یکی یکی بسازد.',
          question_en:
            'For each core feature you defined, use the prompt below to have the developer AI build it.',
          question_fa:
            'برای هر ویژگی اصلی که تعریف کردید، از دستورالعمل زیر استفاده کنید تا هوش مصنوعی برنامه‌نویس آن را بسازد.',
          userInputRequired: false,
          outputType: 'prompt',
          dataKey: 'core_features_implementation',
          promptConfig: {
            role: 'You are a System Architect AI that writes detailed prompts for developer AIs.',
            contextKeys: ['how_it_works'],
            goal: 'Generate a reusable prompt template for a developer AI to build a single core feature.',
            outputFormat:
              'A clear, reusable prompt template that the user can fill in for each feature.',
            constraints: { tone: 'technical', complexity: 'expert' },
            prompt: `You are a System Architect writing a prompt for a developer AI.\nYour task is to generate a TEMPLATE prompt that the user can reuse for each core feature. The template needs placeholders.\n\n**PROMPT TO GENERATE (TEMPLATE):**\n\n"You are an expert full-stack developer AI. Your task is to implement a core feature of our application.\n\n**Feature to Build:** [User: Copy and paste the Feature Name here from your 'How It Works' section]\n\n**Requirements:**\nBased on the feature description below, build the necessary UI components and backend logic.\n\n- **User Goal:** [User: Copy and paste the User Goal here]\n- **Key Actions:** [User: Copy and paste the Key Actions here]\n\n**Implementation Steps:**\n\n1.  **Frontend (UI):**\n    - Create the main page/component for this feature.\n    - Build the UI elements needed to perform the 'Key Actions' (e.g., forms, buttons, lists).\n\n2.  **Backend (Supabase):**\n    - Create the necessary API endpoints or serverless functions to handle the logic for the 'Key Actions'.\n    - Ensure all actions read from and write to the correct database tables you created in Step 1.\n\n**Action:** Generate the code for the frontend components and backend functions for this feature."`,
          },
        },
      ],
    },
  ],
};
