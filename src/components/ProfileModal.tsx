import React, { useState, useEffect } from 'react';
import { Locale, t } from '../i18n';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from './Loader';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    locale: Locale;
}

interface UserProfile {
    name: string;
    email: string;
    phone?: string;
    bio?: string;
    company?: string;
    position?: string;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, locale }) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile>({
        name: '',
        email: '',
        phone: '',
        bio: '',
        company: '',
        position: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // بارگذاری اطلاعات پروفایل
    useEffect(() => {
        if (isOpen && user) {
            fetchProfile();
        }
    }, [isOpen, user]);

    const fetchProfile = async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            // سعی می‌کنیم از جدول profiles اطلاعات رو بگیریم
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data && !error) {
                setProfile({
                    name: data.name || '',
                    email: data.email || user.email || '',
                    phone: data.phone || '',
                    bio: data.bio || '',
                    company: data.company || '',
                    position: data.position || ''
                });
            } else {
                // اگر اطلاعات در جدول نبود، از auth.users استفاده می‌کنیم
                setProfile({
                    name: user.user_metadata?.name || user.email?.split('@')[0] || '',
                    email: user.email || '',
                    phone: '',
                    bio: '',
                    company: '',
                    position: ''
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            // fallback به اطلاعات auth
            setProfile({
                name: user.user_metadata?.name || user.email?.split('@')[0] || '',
                email: user.email || '',
                phone: '',
                bio: '',
                company: '',
                position: ''
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) return;

        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    name: profile.name,
                    email: profile.email,
                    phone: profile.phone,
                    bio: profile.bio,
                    company: profile.company,
                    position: profile.position,
                    updated_at: new Date().toISOString()
                });

            if (error) throw error;

            alert(t('profile_saved_success', locale));
            onClose();
        } catch (error: any) {
            console.error('Error saving profile:', error);
            alert(`${t('profile_save_error', locale)}: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleInputChange = (field: keyof UserProfile, value: string) => {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md mx-auto">
                {/* هدر */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                        {t('profile_edit_title', locale)}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* محتوا */}
                <div className="p-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-32">
                            <Loader />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* نام */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                                    {t('profile_name', locale)}
                                </label>
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all"
                                    placeholder={t('profile_name_placeholder', locale)}
                                />
                            </div>

                            {/* ایمیل */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                                    {t('profile_email', locale)}
                                </label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all"
                                    placeholder={t('profile_email_placeholder', locale)}
                                />
                            </div>

                            {/* تلفن */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                                    {t('profile_phone', locale)}
                                </label>
                                <input
                                    type="tel"
                                    value={profile.phone || ''}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all"
                                    placeholder={t('profile_phone_placeholder', locale)}
                                />
                            </div>

                            {/* شرکت */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                                    {t('profile_company', locale)}
                                </label>
                                <input
                                    type="text"
                                    value={profile.company || ''}
                                    onChange={(e) => handleInputChange('company', e.target.value)}
                                    className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all"
                                    placeholder={t('profile_company_placeholder', locale)}
                                />
                            </div>

                            {/* موقعیت شغلی */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                                    {t('profile_position', locale)}
                                </label>
                                <input
                                    type="text"
                                    value={profile.position || ''}
                                    onChange={(e) => handleInputChange('position', e.target.value)}
                                    className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all"
                                    placeholder={t('profile_position_placeholder', locale)}
                                />
                            </div>

                            {/* بیوگرافی */}
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">
                                    {t('profile_bio', locale)}
                                </label>
                                <textarea
                                    value={profile.bio || ''}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    rows={3}
                                    className="w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all resize-none"
                                    placeholder={t('profile_bio_placeholder', locale)}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* دکمه‌ها */}
                <div className="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-semibold"
                    >
                        {t('profile_cancel', locale)}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving || isLoading}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 transition-all font-semibold flex justify-center items-center"
                    >
                        {isSaving ? <Loader /> : t('profile_save', locale)}
                    </button>
                </div>
            </div>
        </div>
    );
};
