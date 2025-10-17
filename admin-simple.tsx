import { createRoot } from 'react-dom/client';
import './index.css';

// نسخه خیلی ساده برای تست
const SimpleAdmin = () => {
    return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Admin Panel</h1>
                <p className="text-slate-400">Panel is loading...</p>
                <p className="text-green-400 mt-4">✅ If you see this, the file is working!</p>
            </div>
        </div>
    );
};

const root = createRoot(document.getElementById('root')!);
root.render(<SimpleAdmin />);
