const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

console.log(`Found ${files.length} page files to fix:\n`);

files.forEach(file => {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // پیدا کردن نام component اصلی
    const componentName = file.replace('.tsx', '');

    // چک کردن اینکه آیا قبلاً default export دارد یا نه
    if (content.includes('export default')) {
        console.log(`⏭️  ${file} - Already has default export`);
        return;
    }

    // پیدا کردن آخرین export
    const lines = content.split('\n');
    let lastExportIndex = -1;
    let componentToExport = null;

    // جستجو برای component اصلی که باید export بشود
    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].trim();

        // پیدا کردن createRoot که component اصلی را render می‌کند
        if (line.includes('root.render(') || line.includes('<')) {
            const match = line.match(/<(\w+)/);
            if (match && match[1]) {
                componentToExport = match[1];
                break;
            }
        }

        // یا پیدا کردن App-like component
        if (line.includes('const ') && line.includes('React.FC') && !componentToExport) {
            const match = line.match(/const (\w+):/);
            if (match && match[1]) {
                componentToExport = match[1];
            }
        }
    }

    if (!componentToExport) {
        console.log(`⚠️  ${file} - Could not find component to export`);
        return;
    }

    // اضافه کردن default export در انتها
    content += `\n\nexport default ${componentToExport};\n`;

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file} - Added: export default ${componentToExport}`);
});

console.log('\n✨ Default exports fixed!');
