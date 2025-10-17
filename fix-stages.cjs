/**
 * اسکریپت برای رفع Stage های نادرست در i18n.ts
 */

const fs = require('fs');
const path = require('path');

// Stage های نادرست که باید comment شوند
const invalidStages = [
    // Phase 2 - Invalid stages
    'MARKET_ANALYSIS_SIZE',
    'MARKET_ANALYSIS_TRENDS',
    'MARKET_ANALYSIS_OPP_THREATS',
    'MARKET_ANALYSIS_COMPETITOR_IDENTIFICATION',
    'MARKET_ANALYSIS_COMPETITOR_ANALYSIS',
    'MARKET_ANALYSIS_SWOT_STRENGTHS',
    'MARKET_ANALYSIS_SWOT_WEAKNESSES',
    'MARKET_ANALYSIS_SWOT_OPPORTUNITIES',
    'MARKET_ANALYSIS_SWOT_THREATS',
    'MARKET_ANALYSIS_RISK_IDENTIFICATION',
    'MARKET_ANALYSIS_RISK_MITIGATION',
    'MARKET_ANALYSIS_SUMMARY',
    'BUSINESS_MODELING_SUMMARY',

    // Phase 4 - Invalid BRANDING_ prefix stages
    'BRANDING_VISION',
    'BRANDING_MISSION',
    'BRANDING_CORE_VALUES',
    'BRANDING_PERSONALITY',
    'BRANDING_POSITIONING',
    'BRANDING_NAME',
    'BRANDING_TAGLINE',
    'BRANDING_TONE_OF_VOICE',
    'BRANDING_KEY_MESSAGES',
    'BRANDING_LOGO',
    'BRANDING_COLOR_PALETTE',
    'BRANDING_TYPOGRAPHY',
    'BRANDING_VISUAL_STYLE',
    'BRANDING_GUIDELINES',

    // Phase 5 - Invalid PRODUCT_DEV_ prefix stages
    'PRODUCT_DEV_CORE_FEATURES',
    'PRODUCT_DEV_USER_BENEFITS',
    'PRODUCT_DEV_DIFFERENTIATORS',
    'PRODUCT_DEV_MVP_DEFINITION',
    'PRODUCT_DEV_MVP_PHASES',
    'PRODUCT_DEV_MVP_TECH_STACK',
    'PRODUCT_DEV_MVP_DATA_MODEL',
    'PRODUCT_DEV_MVP_USER_FLOW',
    'PRODUCT_DEV_MVP_RESOURCES',
    'PRODUCT_DEV_SUMMARY',

    // Phase 6 - Invalid MARKETING_STRATEGY_ prefix stages
    'MARKETING_STRATEGY_CONTENT',
    'MARKETING_STRATEGY_SEO',
    'MARKETING_STRATEGY_SMM',
    'MARKETING_STRATEGY_PAID_ADS',
    'MARKETING_STRATEGY_EMAIL',
    'MARKETING_STRATEGY_PR',
    'MARKETING_STRATEGY_INFLUENCER',
    'SALES_STRATEGY_CHANNELS',
    'SALES_STRATEGY_PROCESS',
    'INITIAL_CAMPAIGN_PLANNING',
    'MARKETING_MEASUREMENT_KPIS',
    'MARKETING_MEASUREMENT_TOOLS',
    'MARKETING_MEASUREMENT',
    'MARKETING_SUMMARY',

    // Phase 7 - Invalid ORGANIZATION_ prefix stages
    'ORGANIZATION_LEGAL_TEAM',
    'ORGANIZATION_LEGAL_AGREEMENT',
    'ORGANIZATION_LEGAL_STRUCTURE',
    'ORGANIZATION_LEGAL_IP',
    'ORGANIZATION_LEGAL_TERMS',
    'ORGANIZATION_LEGAL_COMPLIANCE',
    'ORGANIZATION_MANAGEMENT_LEGAL',
    'ORGANIZATION_COMPANY_SUMMARY',
    'ORGANIZATION_OPERATIONS_DAILY_PROCESSES',
    'ORGANIZATION_OPERATIONS_PRODUCT_ROADMAP',
    'ORGANIZATION_OPERATIONAL_PLAN',
    'ORGANIZATION_FINANCIALS_ASSUMPTIONS',
    'ORGANIZATION_FINANCIALS_SALES_FORECAST',
    'ORGANIZATION_FINANCIALS_PNL',
    'ORGANIZATION_FINANCIALS_CASH_FLOW',
    'ORGANIZATION_FINANCIALS_BREAK_EVEN',
    'ORGANIZATION_FINANCIALS_FUNDING_NEEDS',
    'ORGANIZATION_FINANCIAL_PROJECTIONS',
    'ORGANIZATION_SUMMARY',

    // Phase 8 - Invalid stages
    'FUNDING_REQUEST',
    'COMPREHENSIVE_BUSINESS_PLAN',
    'INVESTOR_PITCH_DECK',
    'APPENDICES',
    'FINAL_OUTPUTS_SUMMARY',
];

const i18nPath = path.join(__dirname, 'i18n.ts');

console.log('🔧 در حال رفع Stage های نادرست در i18n.ts...\n');

// خواندن فایل
let content = fs.readFileSync(i18nPath, 'utf-8');
let modifiedCount = 0;

// Comment کردن هر Stage نادرست
invalidStages.forEach(stage => {
    // پیدا کردن خطوط مربوط به این Stage
    const regex = new RegExp(`^(\\s*\\[Stage\\.${stage}\\]:.*?)$`, 'gm');

    const matches = content.match(regex);
    if (matches) {
        console.log(`✅ پیدا شد: Stage.${stage} (${matches.length} مورد)`);
        content = content.replace(regex, '    // $1  // ❌ REMOVED: Invalid stage');
        modifiedCount += matches.length;
    }
});

// ذخیره فایل
fs.writeFileSync(i18nPath, content, 'utf-8');

console.log(`\n✅ تعداد ${modifiedCount} Stage نادرست comment شدند!`);
console.log('📁 فایل i18n.ts به‌روز شد.');
