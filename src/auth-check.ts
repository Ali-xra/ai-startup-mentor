/**
 * ==========================================
 * احراز هویت مرکزی
 * Central Authentication Checker
 * ==========================================
 *
 * این فایل قبل از لود کردن هر صفحه اجرا میشه و چک می‌کنه:
 * - اگر user logged in هست
 * - role کاربر چیه (entrepreneur یا investor)
 * - باید به کدوم صفحه redirect بشه
 */

import { supabase } from './services/supabaseClient';

export interface AuthCheckResult {
    isAuthenticated: boolean;
    role: 'entrepreneur' | 'investor' | 'programmer' | 'consultant' | 'designer' | null;
    needsRoleSelection: boolean;
    shouldRedirect: boolean;
    redirectTo: string | null;
}

/**
 * چک کردن وضعیت احراز هویت کاربر
 * این تابع ASYNC هست و باید await بشه
 */
export async function checkAuth(): Promise<AuthCheckResult> {
    try {
        // 1. چک کردن session
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            return {
                isAuthenticated: false,
                role: null,
                needsRoleSelection: false,
                shouldRedirect: false,
                redirectTo: null
            };
        }

        // 2. چک کردن profile و role
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, role')
            .eq('id', session.user.id)
            .maybeSingle(); // تغییر از .single() به .maybeSingle() - خطای 406 نمیده

        if (error) {
            // برای error های واقعی
            console.error('Profile check error:', error);
            return {
                isAuthenticated: true,
                role: null,
                needsRoleSelection: false,
                shouldRedirect: false,
                redirectTo: null
            };
        }

        // اگر profile وجود نداره (null)
        if (!profile) {
            return {
                isAuthenticated: true,
                role: null,
                needsRoleSelection: true,
                shouldRedirect: false,
                redirectTo: null
            };
        }

        // 3. اگر profile داره ولی role نداره
        if (!profile.role) {
            return {
                isAuthenticated: true,
                role: null,
                needsRoleSelection: true,
                shouldRedirect: false,
                redirectTo: null
            };
        }

        // 4. اگر همه چی OK باشه
        return {
            isAuthenticated: true,
            role: profile.role as 'entrepreneur' | 'investor' | 'programmer' | 'consultant' | 'designer',
            needsRoleSelection: false,
            shouldRedirect: false,
            redirectTo: null
        };

    } catch (err) {
        console.error('Auth check error:', err);
        return {
            isAuthenticated: false,
            role: null,
            needsRoleSelection: false,
            shouldRedirect: false,
            redirectTo: null
        };
    }
}

/**
 * تعیین اینکه کاربر باید به کدوم صفحه redirect بشه
 * بر اساس:
 * - صفحه فعلی (currentPage)
 * - نقش کاربر (role)
 */
export function getRedirectPath(
    authResult: AuthCheckResult,
    currentPage: 'login' | 'entrepreneur' | 'investor' | 'programmer' | 'consultant' | 'designer' | 'landing'
): string | null {
    // اگر logged out هست
    if (!authResult.isAuthenticated) {
        // اگر توی هر dashboard هست، بفرستش به لاگین
        if (currentPage !== 'login' && currentPage !== 'landing') {
            return '/login.html';
        }
        // اگر توی login هست یا landing، نگهش دار همونجا
        return null;
    }

    // اگر نیاز به انتخاب نقش داره
    if (authResult.needsRoleSelection) {
        // فقط login.html نمایش RoleSelection میده
        if (currentPage !== 'login') {
            return '/login.html';
        }
        return null;
    }

    // اگر role داره، ببرش به صفحه مربوط به role اش
    const rolePages: Record<string, string> = {
        'entrepreneur': '/entrepreneur.html',
        'investor': '/investor.html',
        'programmer': '/programmer.html',
        'consultant': '/consultant.html',
        'designer': '/designer.html'
    };

    if (authResult.role && rolePages[authResult.role]) {
        const expectedPage = authResult.role;
        if (currentPage !== expectedPage) {
            return rolePages[authResult.role];
        }
    }

    return null;
}

/**
 * چک کردن و redirect کردن اگر لازم باشه
 * این تابع باید در entry point هر صفحه اجرا بشه
 */
export async function checkAndRedirect(currentPage: 'login' | 'entrepreneur' | 'investor' | 'programmer' | 'consultant' | 'designer' | 'landing'): Promise<AuthCheckResult> {
    const authResult = await checkAuth();
    const redirectPath = getRedirectPath(authResult, currentPage);

    if (redirectPath) {
        console.log(`[Auth Check] Redirecting to ${redirectPath}`);
        window.location.href = redirectPath;
    }

    return authResult;
}
