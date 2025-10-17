const fs = require('fs');
const path = require('path');

// لیست فایل‌ها و متغیرهای unused که باید prefix بشوند
const fixes = [
    {
        file: 'src/components/admin/FeatureManagement.tsx',
        replacements: [
            { from: 'handleToggleFeature', to: '_handleToggleFeature' },
            { from: 'category', to: '_category' },
            { from: 'activeFeature', to: '_activeFeature' },
        ]
    },
    {
        file: 'src/components/investor/InvestorDashboard.tsx',
        replacements: [
            { from: 'connectionService', to: '_connectionService' },
        ]
    },
    {
        file: 'src/components/investor/InvestorLayout.tsx',
        replacements: [
            { from: 'navigate', to: '_navigate' },
        ]
    },
    {
        file: 'src/components/investor/InvestorSignup.tsx',
        replacements: [
            { from: 't', to: '_t' },
        ]
    },
    {
        file: 'src/components/investor/ProjectDetail.tsx',
        replacements: [
            { from: 'investorProfile', to: '_investorProfile' },
        ]
    },
    {
        file: 'src/components/ProjectSelectionScreen.tsx',
        replacements: [
            { from: 'displayName', to: '_displayName' },
        ]
    },
    {
        file: 'src/components/RoleSelection.tsx',
        replacements: [
            { from: 't', to: '_t' },
            { from: 'onComplete', to: '_onComplete' },
        ]
    },
    {
        file: 'src/pages/EntrepreneurApp.tsx',
        replacements: [
            { from: 'checkAndRedirect', to: '_checkAndRedirect' },
        ]
    },
    {
        file: 'src/services/investorProjectService.ts',
        replacements: [
            { from: 'SavedProjectWithDetails', to: '_SavedProjectWithDetails' },
        ]
    },
];

fixes.forEach(({ file, replacements }) => {
    const filePath = path.join(__dirname, file);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  ${file} - File not found, skipping`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    replacements.forEach(({ from, to }) => {
        // فقط اولین occurrence را replace کن (declaration)
        if (content.includes(from)) {
            // برای متغیرها
            content = content.replace(new RegExp(`(const|let|var|function)\\s+${from}\\b`, 'g'), `$1 ${to}`);
            // برای parameters
            content = content.replace(new RegExp(`\\(([^)]*,\\s*)?${from}(\\s*[,)])`, 'g'), `($1${to}$2`);
            // برای destructuring
            content = content.replace(new RegExp(`\\{([^}]*,\\s*)?${from}(\\s*[,}])`, 'g'), `{$1${to}$2`);
            // برای interface/type
            content = content.replace(new RegExp(`(interface|type)\\s+${from}\\b`, 'g'), `$1 ${to}`);
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ ${file} - Fixed ${replacements.length} variables`);
    } else {
        console.log(`⏭️  ${file} - No changes needed`);
    }
});

console.log('\n✨ Unused variables fixed!');
