const fs = require('fs');
const path = require('path');

/**
 * اسکریپت حذف تمام ایموجی‌ها و کاراکترهای شکلی از فایل‌های پروژه
 */

// Regex برای پیدا کردن همه ایموجی‌ها و کاراکترهای شکلی
const emojiRegex = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2300}-\u{23FF}\u{2B50}\u{2764}\u{FE0F}\u{200D}\u{20E3}\u{FE0E}\u{1F1E6}-\u{1F1FF}]|[\u2190-\u21FF\u2300-\u23FF\u2460-\u24FF\u2600-\u27FF]/gu;

// فایل‌هایی که باید پردازش بشن
const filesToProcess = [
  // Admin Components
  'src/components/admin/AdminDashboard.tsx',
  'src/components/admin/AdminLayout.tsx',
  'src/components/admin/AdminLogin.tsx',
  'src/components/admin/AuditLog.tsx',
  'src/components/admin/FeatureManagement.tsx',
  'src/components/admin/UpgradeRequestsPanel.tsx',
  'src/components/admin/UserDetailsPage.tsx',
  'src/components/admin/UsersManagement.tsx',

  // Entrepreneur Components
  'src/components/entrepreneur/EntrepreneurDashboard.tsx',
  'src/components/entrepreneur/EntrepreneurLayout.tsx',
  'src/components/entrepreneur/EntrepreneurProfile.tsx',
  'src/components/entrepreneur/ProjectsList.tsx',
  'src/components/entrepreneur/ShareModal.tsx',
  'src/components/entrepreneur/SimpleNewProjectPage.tsx',

  // General Components
  'src/components/AdminProtectedRoute.tsx',
  'src/components/ErrorBoundary.tsx',
  'src/components/ErrorFallback.tsx',
  'src/components/LimitReachedModal.tsx',
  'src/components/marketplace/CommentsModal.tsx',
  'src/components/marketplace/ProjectFilters.tsx',
  'src/components/PlanBadge.tsx',
  'src/components/ProgressBar.tsx',
  'src/components/ProjectMembersModal.tsx',
  'src/components/ProjectSelectionScreen.tsx',
  'src/components/RoleSelection.tsx',
  'src/components/SettingsMenu.tsx',
  'src/components/UpgradeRequestModal.tsx',

  // Pages
  'src/pages/AboutPage.tsx',
  'src/pages/AppContent.tsx',
  'src/pages/ConsultantApp.tsx',
  'src/pages/DesignerApp.tsx',
  'src/pages/InvestorApp.tsx',
  'src/pages/LandingPage.tsx',
  'src/pages/MarketplacePage.tsx',
  'src/pages/PricingPage.tsx',
  'src/pages/ProgrammerApp.tsx',
  'src/pages/SessionManager.tsx',

  // Services (فقط error messages)
  'src/services/errorHandler.ts',
];

function removeEmojisFromFile(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);

    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️  فایل یافت نشد: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(fullPath, 'utf8');
    const originalContent = content;

    // حذف ایموجی‌ها
    // اما فاصله‌های قبل و بعدش رو حفظ کن
    content = content.replace(emojiRegex, '');

    // پاکسازی فاصله‌های اضافی
    content = content.replace(/  +/g, ' '); // چند فاصله متوالی -> یک فاصله
    content = content.replace(/ \n/g, '\n'); // فاصله قبل از newline
    content = content.replace(/\n\n\n+/g, '\n\n'); // چند newline متوالی -> دو newline

    if (content !== originalContent) {
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`✅ حذف شد: ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  ایموجی نداشت: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ خطا در ${filePath}:`, error.message);
    return false;
  }
}

// اجرای اسکریپت
console.log('شروع حذف ایموجی‌ها...\n');

let processedCount = 0;
let removedCount = 0;

filesToProcess.forEach(file => {
  processedCount++;
  if (removeEmojisFromFile(file)) {
    removedCount++;
  }
});

console.log(`\n✅ تمام! ${removedCount} فایل از ${processedCount} فایل ویرایش شد.`);
console.log('\n⚠️  توجه: فایل‌های test و i18n.ts را دستی بررسی کنید!');
