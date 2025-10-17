import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Locale, t } from '../i18n';
import { Stage } from '../types';
import { supabase, projectMembersService } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import { useLimitChecker } from '../hooks/useLimitChecker';
import { Loader } from './Loader';
import { ConfirmationModal } from './ConfirmationModal';
import LanguageSelector from './LanguageSelector';
import { ProjectMembersModal } from './ProjectMembersModal';
import { ProfileModal } from './ProfileModal';
import { PlanBadge } from './PlanBadge';
import LimitReachedModal from './LimitReachedModal';

interface ProjectSelectionScreenProps {
    onProjectSelect: (projectId: string) => void;
    locale: Locale;
    onLocaleToggle: () => void;
}

interface ProjectSummary {
    id: string;
    name: string;
    idea: string;
    updated_at: string;
    stage?: string;
    startup_data?: any;
    is_owner?: boolean;
    is_shared?: boolean;
    shared_by?: string;
    shared_by_email?: string;
}

export const ProjectSelectionScreen: React.FC<ProjectSelectionScreenProps> = ({ onProjectSelect, locale }) => {
    const { user, signOut } = useAuth();
    const { maxProjects, planName } = useFeatureFlags();
    const { checkProjectLimit, showLimitModal, limitInfo, closeLimitModal, checkAndShowLimit } = useLimitChecker();
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
    const [projectName, setProjectName] = useState('');
    const [initialIdea, setInitialIdea] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<ProjectSummary | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [membersModalOpen, setMembersModalOpen] = useState(false);
    const [selectedProjectForMembers, setSelectedProjectForMembers] = useState<ProjectSummary | null>(null);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [pendingInvitations, setPendingInvitations] = useState<any[]>([]);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const fetchProjects = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            // دریافت پروژه‌های صاحب کاربر
            const { data: ownedProjects, error: ownedError } = await supabase
                .from('projects')
                .select('id, project_name, initial_idea, updated_at, stage, startup_data, user_id')
                .eq('user_id', user.id);

            if (ownedError) throw ownedError;

            // دریافت پروژه‌هایی که کاربر عضوشونه با اطلاعات فرستنده
            const { data: memberProjects, error: memberError } = await supabase
                .from('project_members')
                .select(`
                    project_id,
                    user_email,
                    invited_by,
                    status,
                    projects!project_id (
                        id,
                        project_name,
                        initial_idea,
                        updated_at,
                        stage,
                        startup_data,
                        user_id
                    )
                `)
                .eq('user_id', user.id)
                .eq('status', 'accepted');

            if (memberError) throw memberError;

            // دریافت اطلاعات فرستنده‌ها از جدول profiles
            const invitedByIds = [...new Set(
                (memberProjects || [])
                    .map(mp => mp.invited_by)
                    .filter(Boolean)
            )];

            let invitersMap: { [key: string]: any } = {};
            if (invitedByIds.length > 0) {
                try {
                    // سعی می‌کنیم از جدول profiles اطلاعات رو بگیریم
                    const { data: profiles, error: profilesError } = await supabase
                        .from('profiles')
                        .select('id, name, email')
                        .in('id', invitedByIds);

                    if (!profilesError && profiles) {
                        invitersMap = profiles.reduce((acc: any, profile: any) => {
                            acc[profile.id] = profile;
                            return acc;
                        }, {});
                    } else {
                        // اگر جدول profiles کار نکرد، از روش جایگزین استفاده می‌کنیم
                        console.log('جدول profiles در دسترس نیست، از روش جایگزین استفاده می‌کنیم');
                        // برای هر فرستنده، از user metadata استفاده می‌کنیم
                        for (const mp of (memberProjects || [])) {
                            if (mp.invited_by && !invitersMap[mp.invited_by]) {
                                invitersMap[mp.invited_by] = {
                                    id: mp.invited_by,
                                    name: mp.invited_by, // fallback به UUID
                                    email: mp.invited_by
                                };
                            }
                        }
                    }
                } catch (error) {
                    console.log('خطا در دریافت اطلاعات از جدول profiles:', error);
                    // fallback ساده
                    for (const mp of (memberProjects || [])) {
                        if (mp.invited_by && !invitersMap[mp.invited_by]) {
                            invitersMap[mp.invited_by] = {
                                id: mp.invited_by,
                                name: mp.invited_by,
                                email: mp.invited_by
                            };
                        }
                    }
                }
            }

            // پروژه‌های اشتراکی رو استخراج می‌کنیم
            const sharedProjects = (memberProjects || [])
                .map(mp => mp.projects)
                .filter(Boolean);

            // ترکیب پروژه‌ها
            const allProjects = [
                ...(ownedProjects || []),
                ...sharedProjects
            ];

            // حذف پروژه‌های تکراری
            const uniqueProjects = allProjects.filter((project: any, index, self) =>
                index === self.findIndex((p: any) => p.id === project.id)
            );

            // مرتب‌سازی بر اساس updated_at
            uniqueProjects.sort((a: any, b: any) =>
                new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime()
            );

            const projectSummaries: ProjectSummary[] = uniqueProjects.map((p: any) => {
                // تشخیص اینکه آیا کاربر فعلی صاحب این پروژه هست یا نه
                const isOwner = p.user_id === user.id;

                // پیدا کردن اطلاعات فرستنده برای این پروژه (فقط اگر کاربر صاحب نباشه)
                const memberData = (memberProjects || []).find((mp: any) => mp.project_id === p.id);

                // نمایش نام فرستنده از user_email به جای invited_by
                const _displayName = memberData?.user_email ||
                                   memberData?.invited_by ||
                                   'نامشخص';

                return {
                    id: p.id,
                    name: p.project_name,
                    idea: p.initial_idea,
                    updated_at: p.updated_at,
                    stage: p.stage,
                    startup_data: p.startup_data || {},
                    is_owner: isOwner, // آیا کاربر فعلی صاحب این پروژه هست؟
                    is_shared: !isOwner && !!memberData, // فقط اگر صاحب نباشه و از memberProjects اومده باشه
                    shared_by: displayName,
                    shared_by_email: displayName
                };
            });

            setProjects(projectSummaries);
        } catch (err: any) {
            console.error('Error fetching projects:', err);
            alert(`Error fetching projects: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    // تابع دریافت اطلاعات پروفایل کاربر
    const fetchUserProfile = useCallback(async () => {
        if (!user) return;

        try {
            // مستقیم از اطلاعات auth استفاده می‌کنیم چون جدول profiles نداریم
            setUserProfile({
                email: user.email,
                name: user.user_metadata?.name || user.email?.split('@')[0] || 'کاربر'
            });
        } catch (error) {
            setUserProfile({
                email: user.email,
                name: user.email?.split('@')[0] || 'کاربر'
            });
        }
    }, [user]);

    // تابع دریافت دعوت‌نامه‌های در انتظار
    const fetchPendingInvitations = useCallback(async () => {
        if (!user) return;

        try {
            const data = await projectMembersService.getPendingInvitations(user.email || '');
            setPendingInvitations(data || []);
        } catch (error) {
            // خطاها رو بی‌صدا مدیریت می‌کنیم
        }
    }, [user]);

    useEffect(() => {
        fetchProjects();
        fetchUserProfile();
        fetchPendingInvitations();
    }, [fetchProjects, fetchUserProfile, fetchPendingInvitations]);

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!initialIdea.trim() || !projectName.trim() || !user) {
            alert(t('welcome_alert_no_details', locale));
            return;
        }

        // چک کردن محدودیت تعداد پروژه
        const ownedProjectsCount = projects.filter(p => p.is_owner).length;
        const limitCheck = checkProjectLimit(ownedProjectsCount);

        if (!checkAndShowLimit(limitCheck)) {
            return; // محدودیت وجود داره، مودال نشون داده شد
        }

        setIsCreating(true);

        const { data, error } = await supabase
            .from('projects')
            .insert({
                project_name: projectName,
                initial_idea: initialIdea,
                user_id: user.id,
                stage: Stage.IDEA_TITLE,
                startup_data: { projectName, initialIdea },
                messages: [],
            })
            .select()
            .single();

        if (error || !data) {
            console.error('Error creating project:', error);
            alert(`Error creating project: ${error?.message || 'Could not retrieve project after creation.'}`);
        } else {
            onProjectSelect(data.id);
        }
        setIsCreating(false);
    };
    
    const handleDeleteClick = (e: React.MouseEvent, project: ProjectSummary) => {
        e.stopPropagation();
        setProjectToDelete(project);
    };

    const confirmDelete = async () => {
        if (!projectToDelete) return;

        setIsDeleting(true);
        try {
            const { data, error } = await supabase
                .from('projects')
                .delete()
                .eq('id', projectToDelete.id)
                .select();

            if (error) {
                throw error;
            }

            if (!data || data.length === 0) {
                const rlsErrorMsg = "Deletion failed. This is likely due to a security policy (RLS) on your database. Please ensure your 'DELETE' policy in the Supabase dashboard allows users to delete their own records (e.g., using `auth.uid() = user_id`).";
                alert(rlsErrorMsg);
                throw new Error("RLS policy silently blocked deletion.");
            }
            
            await fetchProjects();

        } catch (err: any) {
            alert(`Could not delete project: ${err.message}`);
            console.error('Error in confirmDelete:', err);
        } finally {
            setIsDeleting(false);
            setProjectToDelete(null);
        }
    };

    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !user) {
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("File content is not readable.");
                }
                const importedData = JSON.parse(text);

                if (!importedData.stage || !importedData.data || !importedData.messages) {
                    throw new Error(t('welcome_alert_invalid_file', locale));
                }
                
                const projectNameFromFile = importedData.data.projectName || t('welcome_unnamed_project', locale);
                const initialIdeaFromFile = importedData.data.initialIdea || t('welcome_no_description', locale);

                const { error } = await supabase
                    .from('projects')
                    .insert({
                        project_name: projectNameFromFile,
                        initial_idea: initialIdeaFromFile,
                        user_id: user.id,
                        stage: importedData.stage,
                        startup_data: importedData.data,
                        messages: importedData.messages,
                    });

                if (error) {
                    throw error;
                }

                await fetchProjects();
                alert(`Project "${projectNameFromFile}" imported successfully!`);

            } catch (err: any) {
                console.error("Error importing project:", err);
                alert(`${t('welcome_alert_invalid_file', locale)}: ${err.message}`);
            } finally {
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
        };
        reader.readAsText(file);
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    // تابع تایید دعوت‌نامه
    const handleAcceptInvitation = async (invitationId: string) => {
        if (!user) return;

        try {
            await projectMembersService.acceptInvitation(invitationId, user.id);
            await fetchPendingInvitations();
            await fetchProjects(); // پروژه‌های جدید رو هم بگیر
            alert('دعوت‌نامه تایید شد!');
        } catch (error) {
            console.error('Error accepting invitation:', error);
            alert('خطا در تایید دعوت‌نامه');
        }
    };

    // تابع رد دعوت‌نامه
    const handleDeclineInvitation = async (invitationId: string) => {
        try {
            await projectMembersService.declineInvitation(invitationId);
            await fetchPendingInvitations();
            alert('دعوت‌نامه رد شد');
        } catch (error) {
            console.error('Error declining invitation:', error);
            alert('خطا در رد دعوت‌نامه');
        }
    };

    // محاسبه درصد پیشرفت پروژه
    const calculateProgress = (project: ProjectSummary): number => {
        if (!project.startup_data) {
            return 0;
        }

        // تمام فیلدهای ممکن در startup_data
        const allFields = [
            'idea_title', 'elevator_pitch', 'executive_summary', 'problem_description',
            'problem_magnitude', 'current_solutions', 'customer_segments', 'early_adopter_persona',
            'product_description', 'how_it_works', 'uvp_statement', 'unfair_advantage',
            'validation_summary', 'business_goals_timeline', 'pestel_analysis', 'tam_analysis',
            'sam_analysis', 'som_analysis', 'competitor_identification', 'competitor_analysis',
            'swot_analysis', 'risk_analysis', 'bmc_customer_segments', 'bmc_value_propositions',
            'bmc_channels', 'bmc_customer_relationships', 'bmc_revenue_streams', 'bmc_key_resources',
            'bmc_key_activities', 'bmc_key_partnerships', 'bmc_cost_structure', 'brand_vision',
            'brand_mission', 'core_values', 'brand_personality', 'brand_name', 'tagline',
            'tone_of_voice', 'logo_design_concepts', 'color_palette', 'typography',
            'full_product_description', 'feature_prioritization', 'product_roadmap', 'mvp_scope',
            'mvp_user_flow', 'tech_stack', 'qa_plan', 'marketing_objectives', 'kpis',
            'content_marketing', 'social_media_marketing', 'paid_advertising', 'sales_process',
            'pricing_strategy', 'launch_campaign', 'founding_team', 'hiring_plan', 'legal_structure',
            'ip_strategy', 'key_milestones', 'startup_costs', 'burn_rate', 'revenue_forecast',
            'fundraising_ask', 'use_of_funds', 'pitch_deck_outline', 'one_pager', 'exit_strategy'
        ];

        // شمارش فیلدهای تکمیل شده
        const completedFields = allFields.filter(field => {
            const value = project.startup_data[field];
            return value && (typeof value === 'string' ? value.trim().length > 0 : true);
        });

        return Math.round((completedFields.length / allFields.length) * 100);
    };

    return (
        <>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 font-sans transition-colors duration-300">
                <div className="w-full max-w-4xl mx-auto relative">
                    <div className="absolute top-0 flex gap-2" style={{[locale === 'fa' ? 'left' : 'right']: '1rem'}}>
                        <LanguageSelector />
                        <button
                            onClick={signOut}
                            className="p-2 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            title="Sign Out"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" /></svg>
                        </button>
                    </div>
                    <div className="text-center mb-10">
                        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-600 mb-2">
                            {t('welcome_title', locale)}
                        </h1>
                        <p className="text-lg text-slate-600 dark:text-slate-300">{t('welcome_subtitle', locale)}</p>
                        {userProfile && (
                            <div className="mt-4 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                            👋 خوش آمدید، <span className="font-semibold text-purple-600 dark:text-purple-400">{userProfile.name}</span>!
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                                            📧 {userProfile.email}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setProfileModalOpen(true)}
                                        className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-sm font-medium flex items-center gap-2"
                                        title={locale === 'fa' ? 'ویرایش پروفایل' : 'Edit Profile'}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                        <span className="hidden sm:inline">{locale === 'fa' ? 'ویرایش پروفایل' : 'Edit Profile'}</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* نمایش پلن فعلی */}
                    <div className="mb-6">
                        <PlanBadge locale={locale} />
                    </div>

                    {/* نمایش دعوت‌نامه‌های در انتظار */}
                    {pendingInvitations.length > 0 && (
                        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
                                📧 دعوت‌نامه‌های جدید
                            </h3>
                            <div className="space-y-3">
                                {pendingInvitations.map((invitation) => (
                                    <div key={invitation.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg border border-blue-200 dark:border-blue-800">
                                        <div>
                                            <p className="font-medium text-slate-800 dark:text-slate-200">
                                                دعوت به پروژه: {invitation.project_id || 'نامشخص'}
                                            </p>
                                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                                نقش: {invitation.role === 'editor' ? 'ویرایشگر' : 'مشاهده‌گر'}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAcceptInvitation(invitation.id)}
                                                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                                            >
                                                تایید
                                            </button>
                                            <button
                                                onClick={() => handleDeclineInvitation(invitation.id)}
                                                className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                                            >
                                                رد
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-xl shadow-black/10">
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">{t('welcome_new_journey', locale)}</h2>
                            <form onSubmit={handleCreateProject} className="space-y-4">
                                <div>
                                    <label htmlFor="projectName" className="block text-sm font-medium text-slate-600 dark:text-slate-300">{t('welcome_project_name', locale)}</label>
                                    <input id="projectName" type="text" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder={t('welcome_project_name_placeholder', locale)} className="mt-1 w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all" required />
                                </div>
                                <div>
                                    <label htmlFor="initialIdea" className="block text-sm font-medium text-slate-600 dark:text-slate-300">{t('welcome_idea', locale)}</label>
                                    <textarea id="initialIdea" value={initialIdea} onChange={(e) => setInitialIdea(e.target.value)} placeholder={t('welcome_idea_placeholder', locale)} rows={4} className="mt-1 w-full p-3 bg-slate-100 dark:bg-slate-900 rounded-lg border-2 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all resize-none" required />
                                </div>
                                <button type="submit" disabled={isCreating} className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-md hover:shadow-lg flex justify-center items-center">
                                    {isCreating ? <Loader /> : t('welcome_begin_button', locale)}
                                </button>
                            </form>
                        </div>

                        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-xl shadow-black/10">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{t('welcome_continue_journey', locale)}</h2>
                                <div>
                                    <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".json" />
                                    <button 
                                        onClick={triggerFileSelect}
                                        className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all text-sm font-semibold flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" /></svg>
                                        <span>{t('welcome_load_from_file', locale)}</span>
                                    </button>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="flex justify-center items-center h-48"><Loader/></div>
                            ) : projects.length > 0 ? (
                                <div className="space-y-3">
                                    {projects.map(p => {
                                        const progress = calculateProgress(p);
                                        const isShared = p.is_shared && p.shared_by;
                                        const _displayName = isShared ? `${p.name} - به اشتراک گذاشته شده توسط ${p.shared_by}` : p.name;

                                        return (
                                            <div key={p.id} className="group flex flex-col gap-2 p-3 bg-slate-100/50 dark:bg-slate-900/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-all">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onProjectSelect(p.id)}>
                                                        <div className="flex items-center justify-between mb-1">
                                                            <div className="flex items-center gap-2 min-w-0 flex-1">
                                                                <h3 className="font-semibold text-slate-700 dark:text-slate-200 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400">
                                                                    {p.name}
                                                                </h3>
                                                                {isShared && (
                                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                                        <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                        </svg>
                                                                        <span className="text-xs text-blue-600 dark:text-blue-400 font-medium whitespace-nowrap">
                                                                            اشتراکی
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ml-2 ${
                                                                progress >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                                progress >= 50 ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                                                progress >= 25 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                                                'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                                                            }`}>
                                                                {progress}%
                                                            </span>
                                                        </div>

                                                        {/* نمایش اسم فرستنده برای پروژه‌های اشتراکی */}
                                                        {isShared && (
                                                            <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                                                                <div className="flex items-center gap-2">
                                                                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                                    </svg>
                                                                    <div className="min-w-0 flex-1">
                                                                        <p className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                                                                            به اشتراک گذاشته شده توسط:
                                                                        </p>
                                                                        <p className="text-sm text-blue-800 dark:text-blue-200 font-semibold truncate">
                                                                            {p.shared_by}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-2 line-clamp-2">{p.idea}</p>
                                                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                                                            <div
                                                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                                                    progress >= 80 ? 'bg-green-500' :
                                                                    progress >= 50 ? 'bg-blue-500' :
                                                                    progress >= 25 ? 'bg-yellow-500' :
                                                                    'bg-gray-400'
                                                                }`}
                                                                style={{ width: `${progress}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                    {/* فقط صاحب پروژه می‌تونه دکمه‌های مدیریت و حذف رو ببینه */}
                                                    {p.is_owner && (
                                                        <div className="flex gap-1">
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setSelectedProjectForMembers(p);
                                                                    setMembersModalOpen(true);
                                                                }}
                                                                className="p-2 text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20 flex-shrink-0"
                                                                title={locale === 'fa' ? 'مدیریت اعضا' : 'Manage Members'}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625-2.938c.507-.978.755-1.988.755-3.015 0-1.02-.248-2.037-.755-3.015A9.38 9.38 0 0 0 15 7.222c-.507-.978-.755-1.988-.755-3.015 0-1.02.248-2.037.755-3.015A9.38 9.38 0 0 1 17.625.284c.507.978.755 1.988.755 3.015 0 1.02-.248 2.037-.755 3.015A9.38 9.38 0 0 1 15 9.252c.507.978.755 1.988.755 3.015 0 1.02-.248 2.037-.755 3.015zM12 17.25c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25zm0 3.75c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25zm0 3.75c.69 0 1.25-.56 1.25-1.25s-.56-1.25-1.25-1.25-1.25.56-1.25 1.25.56 1.25 1.25 1.25z" />
                                                                </svg>
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleDeleteClick(e, p)}
                                                                disabled={isDeleting}
                                                                className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 disabled:opacity-50 flex-shrink-0"
                                                                title={locale === 'fa' ? 'حذف پروژه' : 'Delete Project'}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-slate-500 dark:text-slate-400 text-center mt-8">{t('welcome_no_projects', locale)}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmationModal
                isOpen={!!projectToDelete}
                onClose={() => setProjectToDelete(null)}
                onConfirm={confirmDelete}
                title={t('delete_project_modal_title', locale)}
                message={`${t('delete_project_modal_message', locale)} "${projectToDelete?.name}"?`}
                isLoading={isDeleting}
                locale={locale}
            />
            {selectedProjectForMembers && (
                <ProjectMembersModal
                    isOpen={membersModalOpen}
                    onClose={() => {
                        setMembersModalOpen(false);
                        setSelectedProjectForMembers(null);
                    }}
                    projectId={selectedProjectForMembers.id}
                    projectName={selectedProjectForMembers.name}
                    locale={locale}
                    isOwner={selectedProjectForMembers.is_owner ?? false}
                />
            )}
            <ProfileModal
                isOpen={profileModalOpen}
                onClose={() => setProfileModalOpen(false)}
                locale={locale}
            />
            <LimitReachedModal
                isOpen={showLimitModal}
                onClose={closeLimitModal}
                limitType={limitInfo?.limitType || 'projects'}
                currentValue={limitInfo?.currentValue}
                maxValue={limitInfo?.maxValue}
            />
        </>
    );
};
