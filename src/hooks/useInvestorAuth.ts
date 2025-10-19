// ==========================================
// Hook: useInvestorAuth
// مدیریت Authentication و Session سرمایه‌گذار
// ==========================================

import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { investorProfileService } from '../services/investorProfileService';
import type { InvestorProfile, UserProfile } from '../types/investor';

interface InvestorAuthState {
  user: any | null;
  profile: UserProfile | null;
  investorProfile: InvestorProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  isInvestor: boolean;
}

export function useInvestorAuth() {
  const [state, setState] = useState<InvestorAuthState>({
    user: null,
    profile: null,
    investorProfile: null,
    loading: true,
    isAuthenticated: false,
    isInvestor: false,
  });

  useEffect(() => {
    // چک کردن session فعلی
    checkSession();

    // Listen به تغییرات auth
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await loadUserData(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setState({
          user: null,
          profile: null,
          investorProfile: null,
          loading: false,
          isAuthenticated: false,
          isInvestor: false,
        });
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const checkSession = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        await loadUserData(session.user.id);
      } else {
        setState((prev) => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  const loadUserData = async (userId: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));

      // دریافت user profile
      const profile = await investorProfileService.getUserProfile(userId);

      // دریافت investor profile (اگر وجود داشته باشه)
      const investorProfile = await investorProfileService.getInvestorProfile(userId);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setState({
        user: user,
        profile: profile,
        investorProfile: investorProfile,
        loading: false,
        isAuthenticated: true,
        isInvestor: profile?.role === 'investor', // تغییر از user_type به role
      });
    } catch (error) {
      console.error('Error loading user data:', error);
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  // ثبت‌نام سرمایه‌گذار جدید
  const signUpInvestor = async (email: string, password: string, name?: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));

      // 1. ثبت‌نام در Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: 'investor', // تغییر از user_type به role
            name: name || '',
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Signup failed');

      // 2. ایجاد user profile
      await investorProfileService.upsertUserProfile(authData.user.id, {
        id: authData.user.id,
        email: email,
        name: name || null,
        role: 'investor', // تغییر از user_type به role
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      // 3. ایجاد investor profile
      await investorProfileService.createInvestorProfile({
        id: authData.user.id, // تغییر از user_id به id
        tier: 'free',
        investor_type: null,
        company_name: null,
        investment_min: null,
        investment_max: null,
        preferred_industries: [],
        preferred_stages: [],
        preferred_locations: [],
        years_of_experience: null,
        portfolio: [],
        verification_notes: null,
        verified_at: null,
        verified_by: null,
        monthly_project_views: 0,
        last_view_reset: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as any);

      await loadUserData(authData.user.id);

      return { success: true, user: authData.user };
    } catch (error: any) {
      setState((prev) => ({ ...prev, loading: false }));
      throw error;
    }
  };

  // ورود
  const signIn = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!data.user) throw new Error('Login failed');

      await loadUserData(data.user.id);

      return { success: true, user: data.user };
    } catch (error: any) {
      setState((prev) => ({ ...prev, loading: false }));
      throw error;
    }
  };

  // خروج
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setState({
        user: null,
        profile: null,
        investorProfile: null,
        loading: false,
        isAuthenticated: false,
        isInvestor: false,
      });
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  // رفرش داده‌ها
  const refreshProfile = async () => {
    if (state.user?.id) {
      await loadUserData(state.user.id);
    }
  };

  return {
    ...state,
    signUpInvestor,
    signIn,
    signOut,
    refreshProfile,
  };
}
