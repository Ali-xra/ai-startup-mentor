// FIX: Moved all type definitions here to resolve circular dependencies and module resolution errors.
export type Locale = 'en' | 'fa';

export enum Stage {
    INITIAL = 'INITIAL',

    // Phase 1: Core Concept & Validation
    // 1.1. Idea Definition
    IDEA_TITLE = 'IDEA_TITLE',
    ELEVATOR_PITCH = 'ELEVATOR_PITCH',
    EXECUTIVE_SUMMARY = 'EXECUTIVE_SUMMARY',

    // 1.2. Problem Statement
    PROBLEM_DESCRIPTION = 'PROBLEM_DESCRIPTION',
    PROBLEM_MAGNITUDE = 'PROBLEM_MAGNITUDE',
    CURRENT_SOLUTIONS = 'CURRENT_SOLUTIONS',

    // 1.3. Target Audience
    CUSTOMER_SEGMENTS = 'CUSTOMER_SEGMENTS',
    EARLY_ADOPTER_PERSONA = 'EARLY_ADOPTER_PERSONA',

    // 1.4. Proposed Solution
    PRODUCT_DESCRIPTION = 'PRODUCT_DESCRIPTION',
    HOW_IT_WORKS = 'HOW_IT_WORKS',

    // 1.5. Unique Value Proposition
    UVP_STATEMENT = 'UVP_STATEMENT',
    UNFAIR_ADVANTAGE = 'UNFAIR_ADVANTAGE',

    // 1.6. Practical Validation
    VALIDATION_SUMMARY = 'VALIDATION_SUMMARY',

    // 1.7. Business Goals
    BUSINESS_GOALS_TIMELINE = 'BUSINESS_GOALS_TIMELINE',

    // Phase 2: Market, Competition & Risk Analysis
    // 2.1. Market Environment & Size
    PESTEL_ANALYSIS = 'PESTEL_ANALYSIS',
    TAM_ANALYSIS = 'TAM_ANALYSIS',
    SAM_ANALYSIS = 'SAM_ANALYSIS',
    SOM_ANALYSIS = 'SOM_ANALYSIS',

    // 2.2. Competitive Landscape
    COMPETITOR_IDENTIFICATION = 'COMPETITOR_IDENTIFICATION',
    COMPETITOR_ANALYSIS = 'COMPETITOR_ANALYSIS',

    // 2.3. SWOT Analysis
    SWOT_ANALYSIS = 'SWOT_ANALYSIS',

    // 2.4. Risk Analysis & Management
    RISK_ANALYSIS = 'RISK_ANALYSIS',

    // Phase 3: Business Modeling
    // 3.1. Business Model Canvas (BMC)
    BMC_CUSTOMER_SEGMENTS = 'BMC_CUSTOMER_SEGMENTS',
    BMC_VALUE_PROPOSITIONS = 'BMC_VALUE_PROPOSITIONS',
    BMC_CHANNELS = 'BMC_CHANNELS',
    BMC_CUSTOMER_RELATIONSHIPS = 'BMC_CUSTOMER_RELATIONSHIPS',
    BMC_REVENUE_STREAMS = 'BMC_REVENUE_STREAMS',
    BMC_KEY_RESOURCES = 'BMC_KEY_RESOURCES',
    BMC_KEY_ACTIVITIES = 'BMC_KEY_ACTIVITIES',
    BMC_KEY_PARTNERSHIPS = 'BMC_KEY_PARTNERSHIPS',
    BMC_COST_STRUCTURE = 'BMC_COST_STRUCTURE',

    // Phase 4: Branding & Identity
    // 4.1. Brand Strategy
    BRAND_VISION = 'BRAND_VISION',
    BRAND_MISSION = 'BRAND_MISSION',
    CORE_VALUES = 'CORE_VALUES',
    BRAND_PERSONALITY = 'BRAND_PERSONALITY',

    // 4.2. Verbal Identity
    BRAND_NAME = 'BRAND_NAME',
    TAGLINE = 'TAGLINE',
    TONE_OF_VOICE = 'TONE_OF_VOICE',

    // 4.3. Visual Identity
    LOGO_DESIGN_CONCEPTS = 'LOGO_DESIGN_CONCEPTS',
    COLOR_PALETTE = 'COLOR_PALETTE',
    TYPOGRAPHY = 'TYPOGRAPHY',

    // Phase 5: Product Development
    // 5.1. Product Specifications & Features
    FULL_PRODUCT_DESCRIPTION = 'FULL_PRODUCT_DESCRIPTION',
    FEATURE_PRIORITIZATION = 'FEATURE_PRIORITIZATION',
    PRODUCT_ROADMAP = 'PRODUCT_ROADMAP',

    // 5.2. Minimum Viable Product (MVP)
    MVP_SCOPE = 'MVP_SCOPE',
    MVP_USER_FLOW = 'MVP_USER_FLOW',

    // 5.3. Technical Aspects
    TECH_STACK = 'TECH_STACK',
    QA_PLAN = 'QA_PLAN',

    // Phase 6: Marketing & Sales Strategy
    // 6.1. Goals & Metrics
    MARKETING_OBJECTIVES = 'MARKETING_OBJECTIVES',
    KPIS = 'KPIS',

    // 6.2. Marketing Strategies
    CONTENT_MARKETING = 'CONTENT_MARKETING',
    SOCIAL_MEDIA_MARKETING = 'SOCIAL_MEDIA_MARKETING',
    PAID_ADVERTISING = 'PAID_ADVERTISING',

    // 6.3. Sales Strategy
    SALES_PROCESS = 'SALES_PROCESS',
    PRICING_STRATEGY = 'PRICING_STRATEGY',

    // 6.4. Execution Plan
    LAUNCH_CAMPAIGN = 'LAUNCH_CAMPAIGN',

    // Phase 7: Organization, Operations & Financials
    // 7.1. Organization & Team
    FOUNDING_TEAM = 'FOUNDING_TEAM',
    HIRING_PLAN = 'HIRING_PLAN',

    // 7.2. Legal & Corporate Affairs
    LEGAL_STRUCTURE = 'LEGAL_STRUCTURE',
    IP_STRATEGY = 'IP_STRATEGY',

    // 7.3. Operational Plan
    KEY_MILESTONES = 'KEY_MILESTONES',

    // 7.4. Financial Planning & Projections
    STARTUP_COSTS = 'STARTUP_COSTS',
    BURN_RATE = 'BURN_RATE',
    REVENUE_FORECAST = 'REVENUE_FORECAST',

    // Phase 8: Final Outputs & Fundraising
    // 8.1. Financial Needs
    FUNDRAISING_ASK = 'FUNDRAISING_ASK',
    USE_OF_FUNDS = 'USE_OF_FUNDS',

    // 8.2. Documents & Materials
    PITCH_DECK_OUTLINE = 'PITCH_DECK_OUTLINE',
    ONE_PAGER = 'ONE_PAGER',

    // 8.3. Exit Strategy
    EXIT_STRATEGY = 'EXIT_STRATEGY',

    COMPLETE = 'COMPLETE',
}

export enum MajorSection {
    CORE_CONCEPT = 'CORE_CONCEPT',
    MARKET_ANALYSIS = 'MARKET_ANALYSIS',
    BUSINESS_MODELING = 'BUSINESS_MODELING',
    BRANDING = 'BRANDING',
    PRODUCT_DEVELOPMENT = 'PRODUCT_DEVELOPMENT',
    MARKETING_SALES = 'MARKETING_SALES',
    ORGANIZATION_FINANCIALS = 'ORGANIZATION_FINANCIALS',
    FINAL_OUTPUTS = 'FINAL_OUTPUTS',
    MARKET_RESEARCH_TOOL = 'MARKET_RESEARCH_TOOL', // The standalone tool
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'system';
  isSuggestion?: boolean;
  sources?: { uri: string; title: string }[];
  images?: string[];
}

export interface TargetAudiencePersona {
    personaName: string;
    demographics: string;
    needsAndGoals: string;
    painPoints: string;
}

// Project member roles
export enum ProjectMemberRole {
    OWNER = 'owner',
    EDITOR = 'editor',
    VIEWER = 'viewer'
}

// Project member status
export enum ProjectMemberStatus {
    PENDING = 'pending',
    ACCEPTED = 'accepted',
    DECLINED = 'declined'
}

// Project member interface
export interface ProjectMember {
    id: string;
    project_id: string;
    user_id: string;
    role: ProjectMemberRole;
    status: ProjectMemberStatus;
    invited_by: string;
    invited_at: string;
    responded_at?: string;
    // User details (joined from auth.users or user_profiles)
    user_email?: string;
    user_name?: string;
}

export interface StartupData {
    projectName?: string;
    initialIdea?: string;

    // Phase 1: Core Concept & Validation (NEW STRUCTURE)
    // 1.1. Idea Definition
    idea_title?: string;
    elevator_pitch?: string;
    executive_summary?: string;

    // 1.2. Problem Statement
    problem_description?: string;
    problem_magnitude?: string;
    current_solutions?: string;

    // 1.3. Target Audience
    customer_segments?: string;
    early_adopter_persona?: string;

    // 1.4. Proposed Solution
    product_description?: string;
    how_it_works?: string;

    // 1.5. Unique Value Proposition
    uvp_statement?: string;
    unfair_advantage?: string;

    // 1.6. Practical Validation
    validation_summary?: string;

    // 1.7. Business Goals
    business_goals_timeline?: string;

    // Phase 2: Market, Competition & Risk Analysis (NEW STRUCTURE)
    // 2.1. Market Environment & Size
    pestel_analysis?: string;
    tam_analysis?: string;
    sam_analysis?: string;
    som_analysis?: string;

    // 2.2. Competitive Landscape
    competitor_identification?: string;
    competitor_analysis?: string;

    // 2.3. SWOT Analysis
    swot_analysis?: string;

    // 2.4. Risk Analysis & Management
    risk_analysis?: string;

    // Old fields (for backward compatibility)
    marketAnalysis_size?: string; // JSON { tam, sam, som }
    marketAnalysis_trends?: string; // JSON Array<String>
    marketAnalysis_oppThreats?: string; // JSON { opportunities, threats }
    marketAnalysis_competitor_list?: string; // JSON Array<string> of names
    marketAnalysis_competitors?: string; // JSON string for Competitor Analysis
    marketAnalysis_swot?: string; // JSON string for SWOT Analysis, built incrementally
    marketAnalysis_identified_risks?: string; // User's raw input list of risks
    marketAnalysis_risk_analysis?: string; // JSON string for Risk Analysis with mitigation
    marketAnalysisSummary?: string;

    // Phase 3: Business Modeling (NEW STRUCTURE)
    // 3.1. Business Model Canvas
    bmc_customer_segments?: string;
    bmc_value_propositions?: string;
    bmc_channels?: string;
    bmc_customer_relationships?: string;
    bmc_revenue_streams?: string;
    bmc_key_resources?: string;
    bmc_key_activities?: string;
    bmc_key_partnerships?: string;
    bmc_cost_structure?: string;

    // Old fields (for backward compatibility)
    bmc_customerSegments?: string,
    bmc_valuePropositions?: string,
    bmc_customerRelationships?: string,
    bmc_revenueStreams?: string,
    bmc_keyActivities?: string,
    bmc_keyResources?: string,
    bmc_keyPartnerships?: string,
    bmc_costStructure?: string,
    businessModelingSummary?: string;

    // Phase 4: Branding & Identity (NEW STRUCTURE)
    // 4.1. Brand Strategy
    brand_vision?: string;
    brand_mission?: string;
    core_values?: string;
    brand_personality?: string;

    // 4.2. Verbal Identity
    brand_name?: string;
    tagline?: string;
    tone_of_voice?: string;

    // 4.3. Visual Identity
    logo_design_concepts?: string;
    color_palette?: string;
    typography?: string;

    // Old fields (for backward compatibility)
    branding_vision?: string;
    branding_mission?: string;
    branding_coreValues?: string; // JSON array of strings
    branding_personality?: string;
    branding_positioning?: string;
    branding_name?: string;
    branding_tagline?: string;
    branding_toneOfVoice?: string;
    branding_keyMessages?: string; // JSON array of strings
    branding_logo?: string; // JSON { ideas: string[], prompt: string }
    branding_colorPalette?: string; // JSON array of { hex, name, description }
    branding_typography?: string; // JSON { headingFont, bodyFont }
    branding_visualStyle?: string; // JSON { moodboardImages: string[], moodboardPrompt: string, description: string }
    branding_guidelines?: string; // Markdown

    // Phase 5: Product Development (NEW STRUCTURE)
    // 5.1. Product Specifications & Features
    full_product_description?: string;
    feature_prioritization?: string;
    product_roadmap?: string;

    // 5.2. Minimum Viable Product (MVP)
    mvp_scope?: string;
    mvp_user_flow?: string;

    // 5.3. Technical Aspects
    tech_stack?: string;
    qa_plan?: string;

    // Old fields (for backward compatibility)
    productDev_coreFeatures?: string; // JSON array of objects
    productDev_userBenefits?: string; // JSON array of strings
    productDev_differentiators?: string; // JSON array of strings
    productDev_mvpDefinition?: string;
    productDev_mvpPhases?: string; // JSON array of strings
    productDev_mvpTechStack?: string; // JSON object
    productDev_mvpDataModel?: string;
    productDev_mvpUserFlow?: string; // JSON array of strings
    productDev_mvpResources?: string; // JSON object
    productDevSummary?: string;

    // Phase 6: Marketing & Sales Strategy (NEW STRUCTURE)
    // 6.1. Goals & Metrics
    marketing_objectives?: string;
    kpis?: string;

    // 6.2. Marketing Strategies
    content_marketing?: string;
    social_media_marketing?: string;
    paid_advertising?: string;

    // 6.3. Sales Strategy
    sales_process?: string;
    pricing_strategy?: string;

    // 6.4. Execution Plan
    launch_campaign?: string;

    // Old fields (for backward compatibility)
    marketing_strategy_content?: string;
    marketing_strategy_seo?: string;
    marketing_strategy_smm?: string;
    marketing_strategy_paid_ads?: string;
    marketing_strategy_email?: string;
    marketing_strategy_pr?: string;
    marketing_strategy_influencer?: string;
    sales_strategy_channels?: string;
    sales_strategy_process?: string;
    initial_campaigns?: string;
    marketing_kpis?: string;
    marketing_tools?: string;
    marketing_measurement?: string;
    marketingSummary?: string;

    // Phase 7: Organization, Operations & Financials (NEW STRUCTURE)
    // 7.1. Organization & Team
    founding_team?: string;
    hiring_plan?: string;

    // 7.2. Legal & Corporate Affairs
    legal_structure?: string;
    ip_strategy?: string;

    // 7.3. Operational Plan
    key_milestones?: string;

    // 7.4. Financial Planning & Projections
    startup_costs?: string;
    burn_rate?: string;
    revenue_forecast?: string;

    // Old fields (for backward compatibility)
    org_team?: string;
    org_agreement?: string;
    org_structure?: string;
    org_ip?: string;
    org_terms?: string;
    org_compliance?: string;
    org_managementLegal?: string;
    org_companyDescription?: string;
    org_ops_dailyProcesses?: string;
    org_ops_productRoadmap?: string;
    org_operationalPlan?: string;
    org_financials_assumptions?: string;
    org_financials_sales_forecast?: string;
    org_financials_pnl?: string;
    org_financials_cash_flow?: string;
    org_financials_break_even?: string;
    org_financials_funding_needs?: string;
    org_financialProjections?: string;
    orgSummary?: string;

    // Phase 8: Final Outputs & Fundraising (NEW STRUCTURE)
    // 8.1. Financial Needs
    fundraising_ask?: string;
    use_of_funds?: string;

    // 8.2. Documents & Materials
    pitch_deck_outline?: string;
    one_pager?: string;

    // 8.3. Exit Strategy
    exit_strategy?: string;

    // Old fields (for backward compatibility)
    final_fundingRequest?: string;
    final_businessPlan?: string;
    final_pitchDeck?: string;
    final_appendices?: string;
    finalOutputsSummary?: string;
}

// ==========================================
// Admin Panel Types
// ==========================================

// Feature categories
export enum FeatureCategory {
    PROJECTS = 'projects',
    AI = 'ai',
    TEAM = 'team',
    EXPORT = 'export',
    PHASES = 'phases',
    STORAGE = 'storage'
}

// Feature keys
export enum FeatureKey {
    // Projects
    UNLIMITED_PROJECTS = 'unlimited_projects',
    MAX_PROJECTS_3 = 'max_projects_3',
    MAX_PROJECTS_1 = 'max_projects_1',

    // AI
    UNLIMITED_AI = 'unlimited_ai',
    AI_CREDITS_2000 = 'ai_credits_2000',
    AI_CREDITS_500 = 'ai_credits_500',
    AI_CREDITS_50 = 'ai_credits_50',

    // Team
    TEAM_SHARING_UNLIMITED = 'team_sharing_unlimited',
    TEAM_SHARING_10 = 'team_sharing_10',
    TEAM_SHARING_2 = 'team_sharing_2',
    TEAM_SHARING_DISABLED = 'team_sharing_disabled',

    // Export
    EXPORT_ADVANCED = 'export_advanced',
    EXPORT_BASIC = 'export_basic',
    EXPORT_DISABLED = 'export_disabled',

    // Phases
    ALL_PHASES = 'all_phases',
    PHASE_5_LIMIT = 'phase_5_limit',
    PHASE_3_LIMIT = 'phase_3_limit',

    // Storage
    STORAGE_UNLIMITED = 'storage_unlimited',
    STORAGE_5GB = 'storage_5gb',
    STORAGE_500MB = 'storage_500mb',
    STORAGE_50MB = 'storage_50mb'
}

// Feature flag interface
export interface FeatureFlag {
    id: string;
    feature_key: FeatureKey;
    feature_name: string;
    feature_name_en: string;
    description?: string;
    category: FeatureCategory;
    is_enabled_globally: boolean;
    created_at: string;
    updated_at: string;
}

// User feature interface
export interface UserFeature {
    id: string;
    user_id: string;
    feature_key: FeatureKey;
    is_enabled: boolean;
    expires_at?: string;
    granted_by?: string;
    notes?: string;
    created_at: string;
    updated_at: string;
}

// Admin role
export enum AdminRole {
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin'
}

// Admin interface
export interface Admin {
    id: string;
    user_id: string;
    email: string;
    role: AdminRole;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

// Admin audit log
export interface AdminAuditLog {
    id: string;
    admin_id: string;
    action: string;
    target_user_id?: string;
    details?: any;
    ip_address?: string;
    created_at: string;
}

// User with features (for admin panel)
export interface UserWithFeatures {
    id: string;
    email: string;
    created_at: string;
    features: UserFeature[];
    current_plan?: string;
    plan_expires_at?: string;
}

// Upgrade request status
export enum UpgradeRequestStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    EXPIRED = 'expired'
}

// Upgrade request interface
export interface UpgradeRequest {
    id: string;
    user_id: string;
    requested_plan: 'pro' | 'enterprise';
    status: UpgradeRequestStatus;
    admin_notes?: string;
    expires_at?: string;
    requested_at: string;
    reviewed_at?: string;
    reviewed_by?: string;
    created_at: string;
    updated_at: string;
    // Joined fields
    user_email?: string;
    reviewer_email?: string;
}
