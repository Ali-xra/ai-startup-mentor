/* Legacy file - type issues will be resolved during refactoring */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../Header';
import { ChatInterface } from '../ChatInterface';
import { BlueprintPreview } from '../BlueprintPreview';
import { StageIndicator } from '../StageIndicator';
import { useStartupJourney } from '../../hooks/useStartupJourney';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Locale, t } from '../../i18n';
import { Loader } from '../Loader';
import { PublicProjectsService } from '../../services/publicProjectsService';

/**
 * ProjectWorkspace
 * صفحه کار روی پروژه - همان AppContent قبلی اما به صورت جداگانه
 */
export const ProjectWorkspace: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { language } = useLanguage();
  const [theme, setTheme] = useState<'light' | 'dark'>(
    () => (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
  );
  const [selectedStageForPreview, setSelectedStageForPreview] = useState<string | null>(null);

  // Map LanguageCode to Locale for backwards compatibility
  const locale: Locale = language === 'fa' ? 'fa' : 'en';

  const journey = useStartupJourney(projectId || null, locale);

  // اگر پروژه انتخاب نشده، به لیست پروژه‌ها برگرد
  useEffect(() => {
    if (!projectId) {
      navigate('/entrepreneur/projects');
    }
  }, [projectId, navigate]);

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

  const handleSwitchProjects = () => {
    navigate('/entrepreneur/projects');
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
    alert(
      locale === 'fa' ? 'قابلیت Export Excel بزودی اضافه خواهد شد' : 'Excel Export coming soon'
    );
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // No longer needed - LanguageSelector handles this
  const toggleLocale = () => {
    // Kept for backwards compatibility but does nothing
  };

  if (!journey.isInitialized) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div
      className={`h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 ${locale === 'fa' ? 'font-vazir' : 'font-sans'}`}
    >
      {/* @ts-expect-error - HeaderProps will be updated in refactoring */}
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
        currentTheme={theme}
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
          {/* @ts-expect-error - ChatInterfaceProps will be updated in refactoring */}
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
            // @ts-expect-error - Type mismatch will be fixed in refactoring
            locale={locale}
            selectedStage={selectedStageForPreview}
            onEditStage={journey.editStage}
          />
        </div>
      </main>
    </div>
  );
};
