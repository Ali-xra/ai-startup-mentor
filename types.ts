// FIX: Moved all type definitions here to resolve circular dependencies and module resolution errors.
export type Locale = 'en' | 'fa';

export enum Stage {
    INITIAL = 'INITIAL',

    // Phase 1: Core Concept & Validation (NEW STRUCTURE)
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
    
    // Phase 2: In-depth Market, Competitor & Risk Analysis
    MARKET_ANALYSIS_SIZE = 'MARKET_ANALYSIS_SIZE',
    MARKET_ANALYSIS_TRENDS = 'MARKET_ANALYSIS_TRENDS',
    MARKET_ANALYSIS_OPP_THREATS = 'MARKET_ANALYSIS_OPP_THREATS',
    MARKET_ANALYSIS_COMPETITOR_IDENTIFICATION = 'MARKET_ANALYSIS_COMPETITOR_IDENTIFICATION',
    MARKET_ANALYSIS_COMPETITOR_ANALYSIS = 'MARKET_ANALYSIS_COMPETITOR_ANALYSIS',
    MARKET_ANALYSIS_SWOT_STRENGTHS = 'MARKET_ANALYSIS_SWOT_STRENGTHS',
    MARKET_ANALYSIS_SWOT_WEAKNESSES = 'MARKET_ANALYSIS_SWOT_WEAKNESSES',
    MARKET_ANALYSIS_SWOT_OPPORTUNITIES = 'MARKET_ANALYSIS_SWOT_OPPORTUNITIES',
    MARKET_ANALYSIS_SWOT_THREATS = 'MARKET_ANALYSIS_SWOT_THREATS',
    MARKET_ANALYSIS_RISK_IDENTIFICATION = 'MARKET_ANALYSIS_RISK_IDENTIFICATION',
    MARKET_ANALYSIS_RISK_MITIGATION = 'MARKET_ANALYSIS_RISK_MITIGATION',
    MARKET_ANALYSIS_SUMMARY = 'MARKET_ANALYSIS_SUMMARY',

    // Phase 3: Business Modeling
    BMC_CUSTOMER_SEGMENTS = 'BMC_CUSTOMER_SEGMENTS',
    BMC_VALUE_PROPOSITIONS = 'BMC_VALUE_PROPOSITIONS',
    BMC_CHANNELS = 'BMC_CHANNELS',
    BMC_CUSTOMER_RELATIONSHIPS = 'BMC_CUSTOMER_RELATIONSHIPS',
    BMC_REVENUE_STREAMS = 'BMC_REVENUE_STREAMS',
    BMC_KEY_ACTIVITIES = 'BMC_KEY_ACTIVITIES',
    BMC_KEY_RESOURCES = 'BMC_KEY_RESOURCES',
    BMC_KEY_PARTNERSHIPS = 'BMC_KEY_PARTNERSHIPS',
    BMC_COST_STRUCTURE = 'BMC_COST_STRUCTURE',
    BUSINESS_MODELING_SUMMARY = 'BUSINESS_MODELING_SUMMARY',
    
    // Phase 4: Branding & Identity
    BRANDING_VISION = 'BRANDING_VISION',
    BRANDING_MISSION = 'BRANDING_MISSION',
    BRANDING_CORE_VALUES = 'BRANDING_CORE_VALUES',
    BRANDING_PERSONALITY = 'BRANDING_PERSONALITY',
    BRANDING_POSITIONING = 'BRANDING_POSITIONING',
    BRANDING_NAME = 'BRANDING_NAME',
    BRANDING_TAGLINE = 'BRANDING_TAGLINE',
    BRANDING_TONE_OF_VOICE = 'BRANDING_TONE_OF_VOICE',
    BRANDING_KEY_MESSAGES = 'BRANDING_KEY_MESSAGES',
    BRANDING_LOGO = 'BRANDING_LOGO',
    BRANDING_COLOR_PALETTE = 'BRANDING_COLOR_PALETTE',
    BRANDING_TYPOGRAPHY = 'BRANDING_TYPOGRAPHY',
    BRANDING_VISUAL_STYLE = 'BRANDING_VISUAL_STYLE',
    BRANDING_GUIDELINES = 'BRANDING_GUIDELINES',

    // Phase 5: Product/Service Development
    PRODUCT_DEV_CORE_FEATURES = 'PRODUCT_DEV_CORE_FEATURES',
    PRODUCT_DEV_USER_BENEFITS = 'PRODUCT_DEV_USER_BENEFITS',
    PRODUCT_DEV_DIFFERENTIATORS = 'PRODUCT_DEV_DIFFERENTIATORS',
    PRODUCT_DEV_MVP_DEFINITION = 'PRODUCT_DEV_MVP_DEFINITION',
    PRODUCT_DEV_MVP_PHASES = 'PRODUCT_DEV_MVP_PHASES',
    PRODUCT_DEV_MVP_TECH_STACK = 'PRODUCT_DEV_MVP_TECH_STACK',
    PRODUCT_DEV_MVP_DATA_MODEL = 'PRODUCT_DEV_MVP_DATA_MODEL',
    PRODUCT_DEV_MVP_USER_FLOW = 'PRODUCT_DEV_MVP_USER_FLOW',
    PRODUCT_DEV_MVP_RESOURCES = 'PRODUCT_DEV_MVP_RESOURCES',
    PRODUCT_DEV_SUMMARY = 'PRODUCT_DEV_SUMMARY',

    // Phase 6: Marketing & Sales Strategy
    MARKETING_OBJECTIVES = 'MARKETING_OBJECTIVES',
    MARKETING_STRATEGY_CONTENT = 'MARKETING_STRATEGY_CONTENT',
    MARKETING_STRATEGY_SEO = 'MARKETING_STRATEGY_SEO',
    MARKETING_STRATEGY_SMM = 'MARKETING_STRATEGY_SMM',
    MARKETING_STRATEGY_PAID_ADS = 'MARKETING_STRATEGY_PAID_ADS',
    MARKETING_STRATEGY_EMAIL = 'MARKETING_STRATEGY_EMAIL',
    MARKETING_STRATEGY_PR = 'MARKETING_STRATEGY_PR',
    MARKETING_STRATEGY_INFLUENCER = 'MARKETING_STRATEGY_INFLUENCER',
    SALES_STRATEGY_CHANNELS = 'SALES_STRATEGY_CHANNELS',
    SALES_STRATEGY_PROCESS = 'SALES_STRATEGY_PROCESS',
    INITIAL_CAMPAIGN_PLANNING = 'INITIAL_CAMPAIGN_PLANNING',
    MARKETING_MEASUREMENT_KPIS = 'MARKETING_MEASUREMENT_KPIS',
    MARKETING_MEASUREMENT_TOOLS = 'MARKETING_MEASUREMENT_TOOLS',
    MARKETING_MEASUREMENT = 'MARKETING_MEASUREMENT',
    MARKETING_SUMMARY = 'MARKETING_SUMMARY',

    // Phase 7: Organization, Operations & Financials
    ORGANIZATION_LEGAL_TEAM = 'ORGANIZATION_LEGAL_TEAM',
    ORGANIZATION_LEGAL_AGREEMENT = 'ORGANIZATION_LEGAL_AGREEMENT',
    ORGANIZATION_LEGAL_STRUCTURE = 'ORGANIZATION_LEGAL_STRUCTURE',
    ORGANIZATION_LEGAL_IP = 'ORGANIZATION_LEGAL_IP',
    ORGANIZATION_LEGAL_TERMS = 'ORGANIZATION_LEGAL_TERMS',
    ORGANIZATION_LEGAL_COMPLIANCE = 'ORGANIZATION_LEGAL_COMPLIANCE',
    ORGANIZATION_MANAGEMENT_LEGAL = 'ORGANIZATION_MANAGEMENT_LEGAL',
    ORGANIZATION_COMPANY_SUMMARY = 'ORGANIZATION_COMPANY_SUMMARY',
    ORGANIZATION_OPERATIONS_DAILY_PROCESSES = 'ORGANIZATION_OPERATIONS_DAILY_PROCESSES',
    ORGANIZATION_OPERATIONS_PRODUCT_ROADMAP = 'ORGANIZATION_OPERATIONS_PRODUCT_ROADMAP',
    ORGANIZATION_OPERATIONAL_PLAN = 'ORGANIZATION_OPERATIONAL_PLAN',
    ORGANIZATION_FINANCIALS_ASSUMPTIONS = 'ORGANIZATION_FINANCIALS_ASSUMPTIONS',
    ORGANIZATION_FINANCIALS_SALES_FORECAST = 'ORGANIZATION_FINANCIALS_SALES_FORECAST',
    ORGANIZATION_FINANCIALS_PNL = 'ORGANIZATION_FINANCIALS_PNL',
    ORGANIZATION_FINANCIALS_CASH_FLOW = 'ORGANIZATION_FINANCIALS_CASH_FLOW',
    ORGANIZATION_FINANCIALS_BREAK_EVEN = 'ORGANIZATION_FINANCIALS_BREAK_EVEN',
    ORGANIZATION_FINANCIALS_FUNDING_NEEDS = 'ORGANIZATION_FINANCIALS_FUNDING_NEEDS',
    ORGANIZATION_FINANCIAL_PROJECTIONS = 'ORGANIZATION_FINANCIAL_PROJECTIONS',
    ORGANIZATION_SUMMARY = 'ORGANIZATION_SUMMARY',

    // Phase 8: Final Outputs & Pitching
    FUNDING_REQUEST = 'FUNDING_REQUEST',
    COMPREHENSIVE_BUSINESS_PLAN = 'COMPREHENSIVE_BUSINESS_PLAN',
    INVESTOR_PITCH_DECK = 'INVESTOR_PITCH_DECK',
    APPENDICES = 'APPENDICES',
    FINAL_OUTPUTS_SUMMARY = 'FINAL_OUTPUTS_SUMMARY',

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

    // Phase 2: Market Analysis
    marketAnalysis_size?: string; // JSON { tam, sam, som }
    marketAnalysis_trends?: string; // JSON Array<String>
    marketAnalysis_oppThreats?: string; // JSON { opportunities, threats }
    marketAnalysis_competitor_list?: string; // JSON Array<string> of names
    marketAnalysis_competitors?: string; // JSON string for Competitor Analysis
    marketAnalysis_swot?: string; // JSON string for SWOT Analysis, built incrementally
    marketAnalysis_identified_risks?: string; // User's raw input list of risks
    marketAnalysis_risk_analysis?: string; // JSON string for Risk Analysis with mitigation
    marketAnalysisSummary?: string;

    // Phase 3: Business Modeling
    bmc_customerSegments?: string,
    bmc_valuePropositions?: string,
    bmc_channels?: string,
    bmc_customerRelationships?: string,
    bmc_revenueStreams?: string,
    bmc_keyActivities?: string,
    bmc_keyResources?: string,
    bmc_keyPartnerships?: string,
    bmc_costStructure?: string,
    businessModelingSummary?: string;

    // Phase 4: Branding & Identity
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

    // Phase 5: Product Development
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

    // Phase 6: Marketing & Sales Strategy
    marketing_objectives?: string;
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

    // Phase 7: Organization, Operations & Financials
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

    // Phase 8: Final Outputs & Pitching
    final_fundingRequest?: string;
    final_businessPlan?: string;
    final_pitchDeck?: string;
    final_appendices?: string;
    finalOutputsSummary?: string;
}