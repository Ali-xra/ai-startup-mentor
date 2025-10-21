// @ts-nocheck - Legacy file, will be refactored with new routing system
import React, { useState, useEffect } from 'react';
import { AuthScreen } from '../components/AuthScreen';
import { RoleSelection } from '../components/RoleSelection';
import { ProjectSelectionScreen } from '../components/ProjectSelectionScreen';
import { Header } from '../components/Header';
import { ChatInterface } from '../components/ChatInterface';
// FIX: Corrected import path to be a relative path.
import { BlueprintPreview } from '../components/BlueprintPreview';
import { StageIndicator } from '../components/StageIndicator';
// FIX: Corrected import path to be a relative path.
import { useStartupJourney } from '../hooks/useStartupJourney';
// FIX: Corrected import path to be a relative path.
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Locale, t } from '../i18n';
import { Loader } from '../components/Loader';
import { supabase } from '../services/supabaseClient';
import { PublicProjectsService } from '../services/publicProjectsService';

const AppContent: React.FC = () => {
  const { session, loading, user } = useAuth();
  const { language } = useLanguage();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
  );
  const [selectedStageForPreview, setSelectedStageForPreview] = useState<string | null>(null);
  const [profileCheckDone, setProfileCheckDone] = useState(false);
  const [needsRoleSelection, setNeedsRoleSelection] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true); // شروع با true تا profile رو چک کنه
  const [isPublished, setIsPublished] = useState(false);

  // Map LanguageCode to Locale for backwards compatibility
  const locale: Locale = language === 'fa' ? 'fa' : 'en';

  const journey = useStartupJourney(selectedProjectId, locale);

  // چک کردن وضعیت انتشار پروژه
  useEffect(() => {
    const checkPublishStatus = async () => {
      if (!selectedProjectId) return;

      try {
        const userProjects = await PublicProjectsService.getUserProjects();
        const currentProject = userProjects.find((p) => p.project_id === selectedProjectId);
        setIsPublished(!!currentProject?.is_published);
      } catch (error) {
        console.error('Error checking publish status:', error);
      }
    };

    checkPublishStatus();
  }, [selectedProjectId]);

  // چک کردن profile بعد از login/signup
  useEffect(() => {
    let isMounted = true; // جلوگیری از race conditions

    const checkProfile = async () => {
      if (!session || !user) {
        if (isMounted) setCheckingProfile(false);
        return;
      }

      if (profileCheckDone) return;

      if (isMounted) setCheckingProfile(true);

      try {
        // چک کردن اینکه profile داره یا نه
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('id', user.id)
          .maybeSingle(); // تغییر از .single() به .maybeSingle() - خطای 406 نمیده

        if (!isMounted) return; // اگه component unmount شده، ادامه نده

        // Mark as done اولین کار - جلوی infinite loop
        setProfileCheckDone(true);
        setCheckingProfile(false);

        if (error) {
          // فقط برای خطاهای واقعی لاگ کن
          console.error('Profile check error:', error);
          return;
        }

        if (!profile) {
          // Profile وجود نداره - نیاز به انتخاب role
          setNeedsRoleSelection(true);
          return;
        }

        // Redirect بر اساس role
        if (profile.role === 'investor') {
          window.location.href = '/investor';
        } else if (profile.role === 'programmer') {
          window.location.href = '/programmer';
        } else if (profile.role === 'consultant') {
          window.location.href = '/consultant';
        } else if (profile.role === 'designer') {
          window.location.href = '/designer';
        } else if (!profile.role) {
          // اگه role نداره، RoleSelection نشون بده
          setNeedsRoleSelection(true);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error checking profile:', err);
          setProfileCheckDone(true);
          setCheckingProfile(false);
        }
      }
    };

    checkProfile();

    return () => {
      isMounted = false; // cleanup
    };
  }, [session, user, profileCheckDone]);

  const handleRoleComplete = () => {
    setNeedsRoleSelection(false);
    setProfileCheckDone(false); // Reset to re-check
  };

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Update theme when it changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Sync old locale system with new language context
    localStorage.setItem('locale', locale);
    if (journey.isInitialized) {
      journey.reloadLocale();
    }
  }, [locale, journey.isInitialized]);

  const handleProjectSelect = (id: string) => {
    setSelectedProjectId(id);
  };

  const handleSwitchProjects = () => {
    setSelectedProjectId(null);
  };

  // Handle suggestion requests from ChatInterface
  useEffect(() => {
    const handleRequestSuggestion = () => {
      if (journey && !journey.isLoading && !journey.suggestionModalOpen) {
        journey.handleRequestSuggestion();
      }
    };

    window.addEventListener('requestSuggestion', handleRequestSuggestion);
    return () => window.removeEventListener('requestSuggestion', handleRequestSuggestion);
  }, [journey]);

  const handleRestart = () => {
    if (window.confirm(t('settings_restart_confirm', locale))) {
      journey.restartJourney();
    }
  };

  const handleExportProject = () => {
    journey.exportProject();
  };

  const handleExportPDF = () => {
    alert(locale === 'fa' ? 'قابلیت Export PDF بزودی اضافه خواهد شد' : 'PDF Export coming soon');
  };

  const handleExportWord = () => {
    alert(locale === 'fa' ? 'قابلیت Export Word بزودی اضافه خواهد شد' : 'Word Export coming soon');
  };

  const handleExportCSV = () => {
    alert(locale === 'fa' ? 'قابلیت Export CSV بزودی اضافه خواهد شد' : 'CSV Export coming soon');
  };

  const handleExportExcel = () => {
    alert(locale === 'fa' ? 'قابلیت Export Excel بزودی اضافه خواهد شد' : 'Excel Export coming soon');
  };

  const handlePublishToggle = async () => {
    if (!selectedProjectId || !journey.startupData.projectName) return;

    try {
      if (isPublished) {
        // خصوصی کردن
        await PublicProjectsService.unpublishProject(selectedProjectId);
        setIsPublished(false);
        alert(locale === 'fa' ? 'پروژه خصوصی شد' : 'Project is now private');
      } else {
        // منتشر کردن
        const title = journey.startupData.projectName || journey.startupData.initialIdea || 'پروژه بدون نام';
        const description = journey.startupData.initialIdea || journey.startupData.problemSolution || '';
        const tags: string[] = [];

        // استخراج تگ‌ها از داده‌های پروژه
        if (journey.startupData.targetAudience) tags.push(journey.startupData.targetAudience);
        if (journey.startupData.industry) tags.push(journey.startupData.industry);

        await PublicProjectsService.publishProject(selectedProjectId, title, description, tags);
        setIsPublished(true);
        alert(locale === 'fa' ? '✅ پروژه در بازار منتشر شد!' : '✅ Project published to marketplace!');
      }
    } catch (error) {
      console.error('Error toggling publish:', error);
      alert(locale === 'fa' ? 'خطا در انتشار پروژه' : 'Error publishing project');
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // No longer needed - LanguageSelector handles this
  const toggleLocale = () => {
    // Kept for backwards compatibility but does nothing
  };

  if (loading || checkingProfile) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!session) {
    return <AuthScreen locale={locale} onLocaleToggle={toggleLocale} />;
  }

  // اگر profile نداره، RoleSelection رو نمایش بده
  if (needsRoleSelection && user) {
    return <RoleSelection locale={locale} userId={user.id} onComplete={handleRoleComplete} />;
  }

  if (!selectedProjectId || !journey.isInitialized) {
    return (
      <ProjectSelectionScreen
        onProjectSelect={handleProjectSelect}
        locale={locale}
        onLocaleToggle={toggleLocale}
      />
    );
  }

  return (
    <div
      className={`h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 ${locale === 'fa' ? 'font-vazir' : 'font-sans'}`}
    >
      {/* @ts-ignore - HeaderProps will be updated in refactoring */}
      <Header
        progress={journey.progress}
        theme={theme}
        locale={locale}
        projectName={journey.startupData.projectName}
        initialIdea={journey.startupData.initialIdea}
        startupData={journey.startupData}
        onThemeToggle={toggleTheme}
        onLocaleToggle={toggleLocale}
        onRestart={handleRestart}
        onSwitchProjects={handleSwitchProjects}
        onExportProject={handleExportProject}
        onExportPDF={handleExportPDF}
        onExportWord={handleExportWord}
        onExportCSV={handleExportCSV}
        onExportExcel={handleExportExcel}
        onToggleTheme={toggleTheme}
        onPublishToggle={handlePublishToggle}
        currentTheme={theme}
        isPublished={isPublished}
        onNavigate={(section) => setSelectedStageForPreview(section)}
        onSearch={(term) => console.log('Search:', term)}
      />
      <main className="flex-1 w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        <div className="lg:col-span-2 overflow-y-auto">
          <StageIndicator
            stages={journey.stages}
            currentStage={journey.stage}
            onStageSelect={(stage) => {
              // فقط برای preview - مسیر رو reset نکن
              setSelectedStageForPreview(stage);
            }}
            locale={locale}
          />
        </div>
        <div className="lg:col-span-5 flex flex-col overflow-hidden">
          {/* @ts-ignore - ChatInterfaceProps will be updated in refactoring */}
          <ChatInterface
            messages={journey.messages}
            isLoading={journey.isLoading}
            isComplete={journey.isComplete}
            editingStage={journey.editingStage}
            startupData={journey.startupData}
            isReadyForNextSection={journey.isReadyForNextSection}
            suggestionModalOpen={journey.suggestionModalOpen}
            currentSuggestion={journey.currentSuggestion}
            selectedStageForPreview={selectedStageForPreview}
            locale={locale}
            onSendMessage={journey.handleSendMessage}
            onSuggestionModalAccept={journey.handleSuggestionModalAccept}
            onRefineSuggestion={journey.handleRefineSuggestion}
            onSuggestionModalClose={journey.handleSuggestionModalClose}
            onProceedToNextSection={journey.proceedToNextSection}
            onUpdateStageData={journey.handleUpdateStageData}
            onCancelDirectEdit={journey.cancelDirectEdit}
            onRefineEditedStage={journey.handleRefineEditedStage}
          />
        </div>
        <div className="lg:col-span-5 overflow-y-auto">
          <BlueprintPreview
            startupData={journey.startupData}
            // @ts-ignore - Type mismatch will be fixed in refactoring
            locale={locale}
            selectedStage={selectedStageForPreview}
            onEditStage={journey.editStage}
          />
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return <AppContent />;
};

export default App;
