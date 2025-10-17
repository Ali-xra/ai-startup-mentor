const fs = require('fs');
const path = require('path');

// تصحیح import paths در فایل‌های src/pages/
const pagesDir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

const replacements = [
    // contexts
    { from: "from './contexts/", to: "from '../contexts/" },
    { from: 'from "./contexts/', to: 'from "../contexts/' },

    // components
    { from: "from './components/", to: "from '../components/" },
    { from: 'from "./components/', to: 'from "../components/' },

    // services
    { from: "from './services/", to: "from '../services/" },
    { from: 'from "./services/', to: 'from "../services/' },

    // hooks
    { from: "from './hooks/", to: "from '../hooks/" },
    { from: 'from "./hooks/', to: 'from "../hooks/' },

    // i18n
    { from: "from './i18n'", to: "from '../i18n'" },
    { from: 'from "./i18n"', to: 'from "../i18n"' },
    { from: "from './i18n/", to: "from '../i18n/" },
    { from: 'from "./i18n/', to: 'from "../i18n/' },

    // types
    { from: "from './types'", to: "from '../types'" },
    { from: 'from "./types"', to: 'from "../types"' },

    // ErrorBoundary fix (double src)
    { from: "from './src/components/", to: "from '../components/" },
    { from: 'from "./src/components/', to: 'from "../components/' },

    // index.css
    { from: "import './index.css'", to: "import '../index.css'" },
    { from: 'import "./index.css"', to: 'import "../index.css"' },

    // auth-check
    { from: "from './auth-check'", to: "from '../auth-check'" },
    { from: 'from "./auth-check"', to: 'from "../auth-check"' },

    // AppContent
    { from: "from './AppContent'", to: "from './AppContent'" }, // در همون پوشه است
];

console.log(`Found ${files.length} files to process:\n`);

files.forEach(file => {
    const filePath = path.join(pagesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    replacements.forEach(({ from, to }) => {
        if (content.includes(from)) {
            content = content.replaceAll(from, to);
            modified = true;
        }
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed: ${file}`);
    } else {
        console.log(`⏭️  Skipped: ${file} (no changes needed)`);
    }
});

console.log('\n✨ Import paths fixed successfully!');
