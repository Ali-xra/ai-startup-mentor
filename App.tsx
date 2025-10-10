import React, { useState, useEffect } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { ProjectSelectionScreen } from './components/ProjectSelectionScreen';
import { Header } from './components/Header';
import { ChatInterface } from './components/ChatInterface';
// FIX: Corrected import path to be a relative path.
import { BlueprintPreview } from './components/BlueprintPreview';
import { StageIndicator } from './components/StageIndicator';
// FIX: Corrected import path to be a relative path.
import { useStartupJourney } from './hooks/useStartupJourney';
// FIX: Corrected import path to be a relative path.
import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './contexts/LanguageContext';
import { Locale, t } from './i18n';
import { Loader } from './components/Loader';
import { LanguageCode } from './services/translationService';

const AppContent: React.FC = () => {
    const { session, loading } = useAuth();
    const { language } = useLanguage();
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'dark');

    // Map LanguageCode to Locale for backwards compatibility
    const locale: Locale = language === 'fa' ? 'fa' : 'en';

    const journey = useStartupJourney(selectedProjectId, locale);

    // Initialize theme on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'dark';
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
    
    const handleRestart = () => {
        if (window.confirm(t('settings_restart_confirm', locale))) {
            journey.restartJourney();
        }
    }
    
    const handleExportProject = () => {
        journey.exportProject();
    }

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    // No longer needed - LanguageSelector handles this
    const toggleLocale = () => {
        // Kept for backwards compatibility but does nothing
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
                <Loader />
            </div>
        );
    }
    
    if (!session) {
        return <AuthScreen locale={locale} onLocaleToggle={toggleLocale} />;
    }

    if (!selectedProjectId || !journey.isInitialized) {
        return <ProjectSelectionScreen onProjectSelect={handleProjectSelect} locale={locale} onLocaleToggle={toggleLocale} />;
    }

    return (
        <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 ${locale === 'fa' ? 'font-vazir' : 'font-sans'}`}>
            <Header
                progress={journey.progress}
                theme={theme}
                locale={locale}
                projectName={journey.startupData.projectName}
                initialIdea={journey.startupData.initialIdea}
                onThemeToggle={toggleTheme}
                onLocaleToggle={toggleLocale}
                onRestart={handleRestart}
                onSwitchProjects={handleSwitchProjects}
                onExportProject={handleExportProject}
            />
            <main className="max-w-screen-2xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-85px)]">
                <div className="lg:col-span-2 h-full overflow-y-auto">
                    <StageIndicator 
                        stages={journey.stages} 
                        currentStage={journey.stage}
                        onStageSelect={journey.jumpToStage}
                        onEditStage={journey.editStage}
                        locale={locale}
                    />
                </div>
                <div className="lg:col-span-5 h-full">
                    <ChatInterface
                        messages={journey.messages}
                        isLoading={journey.isLoading}
                        isComplete={journey.isComplete}
                        editingStage={journey.editingStage}
                        startupData={journey.startupData}
                        isReadyForNextSection={journey.isReadyForNextSection}
                        suggestionModalOpen={journey.suggestionModalOpen}
                        currentSuggestion={journey.currentSuggestion}
                        locale={locale}
                        onSendMessage={journey.handleSendMessage}
                        onRequestSuggestion={journey.handleRequestSuggestion}
                        onSuggestionModalAccept={journey.handleSuggestionModalAccept}
                        onRefineSuggestion={journey.handleRefineSuggestion}
                        onSuggestionModalClose={journey.handleSuggestionModalClose}
                        onProceedToNextSection={journey.proceedToNextSection}
                        onUpdateStageData={journey.handleUpdateStageData}
                        onCancelDirectEdit={journey.cancelDirectEdit}
                        onRefineEditedStage={journey.handleRefineEditedStage}
                    />
                </div>
                <div className="lg:col-span-5 h-full">
                    <BlueprintPreview startupData={journey.startupData} locale={locale} />
                </div>
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return <AppContent />;
};

export default App;