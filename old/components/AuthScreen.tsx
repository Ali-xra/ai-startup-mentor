import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Locale, t } from '../i18n';
import { Loader } from './Loader';

interface AuthScreenProps {
    locale: Locale;
    onLocaleToggle: () => void;
}

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"></path>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
        <path d="M1 1h22v22H1z" fill="none"></path>
    </svg>
);

export const AuthScreen: React.FC<AuthScreenProps> = ({ locale, onLocaleToggle }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
            } else {
                const { error } = await supabase.auth.signUp({ email, password });
                if (error) throw error;
                alert(t('auth_confirm_email_alert', locale));
            }
        } catch (err: any) {
            setError(err.error_description || err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        
        // By removing the `redirectTo` option, we allow the Supabase JS library
        // to automatically handle the OAuth flow, which typically uses a popup
        // in browser environments, avoiding the iframe redirect issue.
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        }
        // The onAuthStateChange listener in AuthContext will handle the successful login.
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 font-sans transition-colors duration-300">
            <div className="w-full max-w-md mx-auto relative">
                <button
                    onClick={onLocaleToggle}
                    className={`absolute top-0 p-2 w-10 h-10 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-bold text-sm z-10 ${locale === 'fa' ? 'left-4' : 'right-4'}`}
                    title={`Switch to ${locale === 'fa' ? 'English' : 'فارسی'}`}
                >
                    {locale === 'fa' ? 'EN' : 'FA'}
                </button>
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600 mb-2">
                        {t('welcome_title', locale)}
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300">{t('welcome_subtitle', locale)}</p>
                </div>
                
                <div className="bg-white dark:bg-slate-800/50 p-8 rounded-2xl shadow-xl shadow-black/10">
                    <div className="mb-6 flex justify-center border border-slate-200 dark:border-slate-700 rounded-lg p-1">
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${isLogin ? 'bg-purple-500 text-white shadow' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                            {t('auth_sign_in_tab', locale)}
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`w-1/2 py-2 text-sm font-semibold rounded-md transition-colors ${!isLogin ? 'bg-purple-500 text-white shadow' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                        >
                            {t('auth_sign_up_tab', locale)}
                        </button>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300">{t('auth_email_label', locale)}</label>
                            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="mt-1 w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all" required />
                        </div>
                        <div>
                            <label htmlFor="password"  className="block text-sm font-medium text-slate-600 dark:text-slate-300">{t('auth_password_label', locale)}</label>
                            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1 w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all" required />
                        </div>

                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                        <button type="submit" disabled={loading} className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg flex justify-center items-center">
                            {loading ? <Loader /> : (isLogin ? t('auth_sign_in_button', locale) : t('auth_sign_up_button', locale))}
                        </button>
                    </form>
                    <div className="relative flex py-5 items-center">
                        <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                        <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-sm">{t('auth_or_divider', locale)}</span>
                        <div className="flex-grow border-t border-slate-300 dark:border-slate-600"></div>
                    </div>
                     <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full py-3 px-4 flex justify-center items-center gap-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 transition-all shadow-sm"
                    >
                        {loading ? <Loader /> : (
                            <>
                                <GoogleIcon />
                                {t('auth_google_button', locale)}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};