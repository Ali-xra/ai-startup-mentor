import React, { useEffect, useState } from 'react';
import '../index.css';
import { supabase } from '../services/supabaseClient';
import { checkAndRedirect } from '../auth-check';
import { Loader } from '../components/Loader';

/**
 * ================================================
 * Investor Dashboard - HTML Mockup (No Backend)
 * ================================================
 */

type InvestorPage = 'dashboard' | 'startups' | 'portfolio' | 'profile';

const InvestorDashboard: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<InvestorPage>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      window.location.href = '/login';
    }
  };

  // Mock Data
  const stats = {
    totalInvestments: 8,
    activeStartups: 5,
    totalInvested: '500,000,000',
    portfolioValue: '750,000,000',
  };

  const mockStartups = [
    { id: 1, name: 'تک‌سان', sector: 'فین‌تک', stage: 'رشد اولیه', fundingNeeded: '2,000,000,000', status: 'نیازمند بررسی' },
    { id: 2, name: 'نوآوران', sector: 'هوش مصنوعی', stage: 'ایده', fundingNeeded: '500,000,000', status: 'نیازمند بررسی' },
    { id: 3, name: 'سلامت آنلاین', sector: 'سلامت', stage: 'MVP', fundingNeeded: '1,000,000,000', status: 'تحت بررسی' },
  ];

  const portfolioCompanies = [
    { id: 1, name: 'فروشگاه آنلاین', invested: '100,000,000', currentValue: '150,000,000', growth: '+50%', stage: 'رشد' },
    { id: 2, name: 'اپلیکیشن حمل و نقل', invested: '200,000,000', currentValue: '300,000,000', growth: '+50%', stage: 'رشد' },
    { id: 3, name: 'پلتفرم آموزشی', invested: '100,000,000', currentValue: '120,000,000', growth: '+20%', stage: 'اولیه' },
  ];

  // Render Functions
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-blue-100 dark:border-blue-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">مجموع سرمایه‌گذاری‌ها</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{stats.totalInvestments}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-green-100 dark:border-green-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">استارتاپ‌های فعال</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{stats.activeStartups}</p>
            </div>
            <div className="text-4xl">🚀</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-purple-100 dark:border-purple-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">سرمایه‌گذاری شده</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">{stats.totalInvested} تومان</p>
            </div>
            <div className="text-4xl">💰</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-indigo-100 dark:border-indigo-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">ارزش پورتفولیو</p>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2">{stats.portfolioValue} تومان</p>
            </div>
            <div className="text-4xl">📈</div>
          </div>
        </div>
      </div>

      {/* Investment Opportunities */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">فرصت‌های سرمایه‌گذاری جدید</h2>
        <div className="space-y-3">
          {mockStartups.map((startup) => (
            <div key={startup.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{startup.name}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{startup.sector} • {startup.stage}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  startup.status === 'نیازمند بررسی'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                }`}>
                  {startup.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  نیاز به سرمایه: <span className="font-semibold text-slate-900 dark:text-white">{startup.fundingNeeded} تومان</span>
                </p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors">
                    مشاهده جزئیات
                  </button>
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors">
                    سرمایه‌گذاری
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Overview */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">خلاصه پورتفولیو</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">شرکت</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">سرمایه‌گذاری</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">ارزش فعلی</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">رشد</th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700 dark:text-slate-300">مرحله</th>
              </tr>
            </thead>
            <tbody>
              {portfolioCompanies.map((company) => (
                <tr key={company.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                  <td className="py-3 px-4 text-slate-900 dark:text-white font-medium">{company.name}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{company.invested} تومان</td>
                  <td className="py-3 px-4 text-slate-900 dark:text-white font-semibold">{company.currentValue} تومان</td>
                  <td className="py-3 px-4">
                    <span className="text-green-600 dark:text-green-400 font-semibold">{company.growth}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                      {company.stage}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderStartups = () => (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">استارتاپ‌های موجود</h2>
        <div className="flex gap-2">
          <select className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm">
            <option>همه بخش‌ها</option>
            <option>فین‌تک</option>
            <option>هوش مصنوعی</option>
            <option>سلامت</option>
          </select>
          <select className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm">
            <option>همه مراحل</option>
            <option>ایده</option>
            <option>MVP</option>
            <option>رشد اولیه</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mockStartups.map((startup) => (
          <div key={startup.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">{startup.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{startup.sector}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                {startup.stage}
              </span>
            </div>
            <div className="mb-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">نیاز به سرمایه:</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{startup.fundingNeeded} تومان</p>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors">
                مشاهده جزئیات
              </button>
              <button className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors">
                سرمایه‌گذاری
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">پورتفولیو من</h2>
      <div className="space-y-4">
        {portfolioCompanies.map((company) => (
          <div key={company.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{company.name}</h3>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
                  {company.stage}
                </span>
              </div>
              <span className="text-2xl font-bold text-green-600 dark:text-green-400">{company.growth}</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">سرمایه‌گذاری اولیه</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{company.invested} تومان</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">ارزش فعلی</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{company.currentValue} تومان</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">سود</p>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {parseInt(company.currentValue.replace(/,/g, '')) - parseInt(company.invested.replace(/,/g, ''))} تومان
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors">
                مشاهده گزارش
              </button>
              <button className="px-4 py-2 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-md text-sm transition-colors">
                تماس با تیم
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">پروفایل من</h2>
      <div className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">نام و نام خانوادگی</label>
          <input
            type="text"
            defaultValue="امیر حسینی"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">ایمیل</label>
          <input
            type="email"
            defaultValue="amir.investor@example.com"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">نوع سرمایه‌گذار</label>
          <select
            defaultValue="angel"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            <option value="angel">Angel Investor</option>
            <option value="vc">Venture Capital</option>
            <option value="private">Private Equity</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">حوزه‌های علاقه‌مندی</label>
          <div className="grid grid-cols-2 gap-3">
            {['فین‌تک', 'هوش مصنوعی', 'سلامت', 'آموزش', 'حمل و نقل', 'تجارت الکترونیک'].map((sector) => (
              <label key={sector} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-slate-700 dark:text-slate-300">{sector}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">محدوده سرمایه‌گذاری (تومان)</label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">حداقل</label>
              <input
                type="text"
                defaultValue="50,000,000"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                readOnly
              />
            </div>
            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-400 mb-1">حداکثر</label>
              <input
                type="text"
                defaultValue="500,000,000"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                readOnly
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">درباره من</label>
          <textarea
            rows={4}
            defaultValue="سرمایه‌گذار با 10 سال تجربه در حوزه استارتاپ‌های فناوری. علاقه‌مند به ایده‌های نوآورانه و تیم‌های با انگیزه."
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            readOnly
          />
        </div>

        <div className="pt-4">
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
            ذخیره تغییرات
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-900 text-white transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-blue-500/30">
          <div className="flex items-center justify-between">
            {sidebarOpen && <h1 className="text-xl font-bold">پنل سرمایه‌گذار 💰</h1>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-blue-700/50 rounded-lg transition-colors"
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', icon: '📊', label: 'داشبورد' },
            { id: 'startups', icon: '🚀', label: 'استارتاپ‌ها' },
            { id: 'portfolio', icon: '💼', label: 'پورتفولیو' },
            { id: 'profile', icon: '👤', label: 'پروفایل' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as InvestorPage)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentPage === item.id
                  ? 'bg-white/20 font-semibold'
                  : 'hover:bg-white/10'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-blue-500/30">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-red-200"
          >
            <span className="text-xl">🚪</span>
            {sidebarOpen && <span>خروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {currentPage === 'dashboard' && renderDashboard()}
          {currentPage === 'startups' && renderStartups()}
          {currentPage === 'portfolio' && renderPortfolio()}
          {currentPage === 'profile' && renderProfile()}
        </div>
      </main>
    </div>
  );
};

/**
 * Wrapper with auth check
 */
const InvestorAppWithAuthCheck: React.FC = () => {
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAndRedirect('investor').then(() => {
      setAuthChecked(true);
    });
  }, []);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return <InvestorDashboard />;
};

export default InvestorAppWithAuthCheck;
