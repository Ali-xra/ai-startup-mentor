import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { AuthScreen } from '../components/AuthScreen';
import { RoleSelection } from '../components/RoleSelection';
import { Locale } from '../i18n';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { Loader } from '../components/Loader';
import '../index.css';

/**
 * Auth Page - Login/Signup
 * با احراز هویت و انتخاب نقش
 */

const AuthPage: React.FC = () => {
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const locale: Locale = language === 'fa' ? 'fa' : 'en';
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);
  const [checking, setChecking] = useState(true);

  const handleLocaleToggle = () => {
    // Language toggle handled by LanguageContext
  };

  // فعال کردن dark theme فقط برای صفحه لاگین
  useEffect(() => {
    document.documentElement.classList.add('dark');
    return () => {
      // وقتی از صفحه خارج میشیم، dark mode رو خاموش نمی‌کنیم
      // چون ممکنه صفحات دیگه هم dark باشن
    };
  }, []);

  // چک کردن وضعیت user بعد از login
  useEffect(() => {
    const checkUserRole = async () => {
      if (authLoading) {
        return; // Wait for auth to load
      }

      if (!user) {
        // User not logged in, show login screen
        setChecking(false);
        setNeedsRoleSelection(false);
        return;
      }

      // User is logged in, check if they have a role
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking user role:', error);
          setChecking(false);
          return;
        }

        if (profile && profile.role) {
          // User has a role, redirect to their dashboard
          const roleRoutes: Record<string, string> = {
            'entrepreneur': '/entrepreneur',
            'investor': '/investor',
            'programmer': '/programmer',
            'consultant': '/consultant',
            'designer': '/designer',
            'admin': '/admin'
          };

          const route = roleRoutes[profile.role];
          if (route) {
            navigate(route, { replace: true });
            return;
          }
        }

        // User doesn't have a role, show role selection
        setNeedsRoleSelection(true);
        setChecking(false);
      } catch (error) {
        console.error('Error checking user role:', error);
        setChecking(false);
      }
    };

    checkUserRole();
  }, [user, authLoading, navigate]);

  // Loading state
  if (authLoading || checking) {
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
            // بعد از انتخاب نقش، دوباره check کن
            setChecking(true);
            setNeedsRoleSelection(false);
          }}
        />
      </div>
    );
  }

  // صفحه login/signup
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <AuthScreen locale={locale} onLocaleToggle={handleLocaleToggle} />
    </div>
  );
};

export default AuthPage;
