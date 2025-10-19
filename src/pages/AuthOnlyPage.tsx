import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { LanguageProvider, useLanguage } from '../contexts/LanguageContext';
import { AuthScreen } from '../components/AuthScreen';
import { RoleSelection } from '../components/RoleSelection';
import { Locale } from '../i18n';
import { checkAuth } from '../auth-check';
import { Loader } from '../components/Loader';
import ErrorBoundary from '../components/ErrorBoundary';
import '../index.css';

/**
 * صفحه ورود/ثبت‌نام
 * از سیستم احراز هویت مرکزی استفاده می‌کنه
 * - اگر logged out → AuthScreen
 * - اگر logged in ولی بدون role → RoleSelection
 * - اگر logged in با role → redirect به dashboard
 */
const AuthOnlyPageContent: React.FC = () => {
    const { language, setLanguage } = useLanguage();
    const { user } = useAuth();
    const locale: Locale = language === 'fa' ? 'fa' : 'en';
    const [checking, setChecking] = useState(true);
    const [needsRoleSelection, setNeedsRoleSelection] = useState(false);

    const handleLocaleToggle = () => {
        const newLang = language === 'en' ? 'fa' : 'en';
        setLanguage(newLang);
    };

    // استفاده از سیستم احراز هویت مرکزی
    useEffect(() => {
        const checkAuthState = async () => {
            try {
                const result = await checkAuth();

                if (result.isAuthenticated && result.role) {
                    // اگر role داره، به dashboard بفرست
                    const rolePages: Record<string, string> = {
                        'entrepreneur': '/app',
                        'investor': '/investor',
                        'programmer': '/programmer',
                        'consultant': '/consultant',
                        'designer': '/designer'
                    };
                    if (rolePages[result.role]) {
                        window.location.href = rolePages[result.role];
                        return;
                    }
                }

                if (result.isAuthenticated && result.needsRoleSelection) {
                    // اگر لاگین کرده ولی role نداره، RoleSelection نمایش بده
                    setNeedsRoleSelection(true);
                }

                setChecking(false);
            } catch (error) {
                console.error('Auth check error:', error);
                setChecking(false);
            }
        };

        checkAuthState();
    }, []);

    if (checking) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    // اگر نیاز به انتخاب نقش داره
    if (needsRoleSelection && user) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
                <RoleSelection
                    locale={locale}
                    userId={user.id}
                    onComplete={() => {
                        // بعد از انتخاب نقش، reload کن تا auth check دوباره اجرا بشه
                        window.location.reload();
                    }}
                />
            </div>
        );
    }

    // اگر logged out هست، AuthScreen نمایش بده
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <AuthScreen locale={locale} onLocaleToggle={handleLocaleToggle} />
        </div>
    );
};

const AuthOnlyPage: React.FC = () => {
    return (
        <LanguageProvider>
            <AuthOnlyPageContent />
        </LanguageProvider>
    );
};

export default AuthOnlyPage;
