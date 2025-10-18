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
import { Locale, t } from './i18n';
import { Loader } from './components/Loader';

const App: React.FC = () => {
    const { session, loading } = useAuth();
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'dark');
    const [locale, setLocale] = useState<Locale>(() => (localStorage.getItem('locale') as Locale) || 'en');

    const journey = useStartupJourney(selectedProjectId, locale);

    useEffect(() => {
        document.documentElement.className = theme;
        localStorage.setItem('theme', theme);
    }, [theme]);
    
    useEffect(() => {
        document.documentElement.lang = locale;
        document.documentElement.dir = locale === 'fa' ? 'rtl' : 'ltr';
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

    const toggleLocale = () => {
        setLocale(prev => prev === 'en' ? 'fa' : 'en');
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
                        locale={locale}
                        onSendMessage={journey.handleSendMessage}
                        onRequestSuggestion={journey.handleRequestSuggestion}
                        onSuggestionAccept={journey.handleSuggestionAccept}
                        onRefineSuggestion={journey.handleRefineSuggestion}
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

export default App;