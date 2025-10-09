import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Locale, t } from '../i18n';
import { Stage } from '../types';
import { supabase } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from './Loader';
import { ConfirmationModal } from './ConfirmationModal';

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
}

export const ProjectSelectionScreen: React.FC<ProjectSelectionScreenProps> = ({ onProjectSelect, locale, onLocaleToggle }) => {
    const { user, signOut } = useAuth();
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
    const [projectName, setProjectName] = useState('');
    const [initialIdea, setInitialIdea] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<ProjectSummary | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const fetchProjects = useCallback(async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('projects')
                .select('id, project_name, initial_idea, updated_at')
                .order('updated_at', { ascending: false });

            if (error) {
                throw error;
            }

            if (data) {
                const projectSummaries: ProjectSummary[] = data.map(p => ({
                    id: p.id,
                    name: p.project_name,
                    idea: p.initial_idea,
                    updated_at: p.updated_at
                }));
                setProjects(projectSummaries);
            }
        } catch (err: any) {
            console.error('Error fetching projects:', err);
            alert(`Error fetching projects: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!initialIdea.trim() || !projectName.trim() || !user) {
            alert(t('welcome_alert_no_details', locale));
            return;
        }
        
        setIsCreating(true);

        const { data, error } = await supabase
            .from('projects')
            .insert({
                project_name: projectName,
                initial_idea: initialIdea,
                user_id: user.id,
                stage: Stage.CORE_CONCEPT_IDEA_TITLE,
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

    return (
        <>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 font-sans transition-colors duration-300">
                <div className="w-full max-w-4xl mx-auto relative">
                    <div className="absolute top-0 flex gap-2" style={{[locale === 'fa' ? 'left' : 'right']: '1rem'}}>
                        <button
                            onClick={onLocaleToggle}
                            className="p-2 w-10 h-10 flex items-center justify-center rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors font-bold text-sm"
                            title={`Switch to ${locale === 'fa' ? 'English' : 'فارسی'}`}
                        >
                            {locale === 'fa' ? 'EN' : 'FA'}
                        </button>
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
                    </div>

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
                                <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                                    {projects.map(p => (
                                        <div key={p.id} className="group flex items-center justify-between gap-2 p-3 bg-slate-100/50 dark:bg-slate-900/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-all">
                                            <div className="flex-1 cursor-pointer" onClick={() => onProjectSelect(p.id)}>
                                                <h3 className="font-semibold text-slate-700 dark:text-slate-200 truncate group-hover:text-purple-600 dark:group-hover:text-purple-400">{p.name}</h3>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{p.idea}</p>
                                            </div>
                                            <button 
                                                onClick={(e) => handleDeleteClick(e, p)} 
                                                disabled={isDeleting}
                                                className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 disabled:opacity-50"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                                            </button>
                                        </div>
                                    ))}
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
        </>
    );
};