import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../services/supabaseClient';
import { Loader } from '../Loader';

interface Project {
  id: string;
  project_name: string;
  updated_at: string;
  startup_data: any;
}

/**
 * SimpleNewProjectPage
 * صفحه ساده برای انتخاب بین شروع سفر جدید یا ادامه سفر قبلی
 */
export const SimpleNewProjectPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('id, project_name, updated_at, startup_data')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(5); // فقط 5 پروژه اخیر

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartNewJourney = async () => {
    if (!user) return;

    try {
      setCreating(true);

      // ساخت پروژه جدید
      const { data: newProject, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          project_name: `پروژه جدید ${new Date().toLocaleDateString('fa-IR')}`,
          initial_idea: '',
          stage: 'idea',
          startup_data: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // انتقال به workspace پروژه جدید
      navigate(`/entrepreneur/project/${newProject.id}`);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('خطا در ساخت پروژه جدید');
    } finally {
      setCreating(false);
    }
  };

  const handleContinueJourney = (projectId: string) => {
    navigate(`/entrepreneur/project/${projectId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4"></div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            سفر استارتاپی شما
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            آماده برای شروع یک ماجراجویی جدید هستید یا می‌خواهید سفر قبلی را ادامه دهید؟
          </p>
        </div>

        {/* Main Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Start New Journey */}
          <button
            onClick={handleStartNewJourney}
            disabled={creating}
            className="group relative bg-gradient-to-br from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-12 rounded-3xl shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-6"></div>
              <h2 className="text-3xl font-bold mb-4">شروع سفر جدید</h2>
              <p className="text-purple-100 text-lg">
                ایده جدیدی دارید؟ بیایید آن را به یک استارتاپ موفق تبدیل کنیم!
              </p>
            </div>
          </button>

          {/* Continue Previous Journey */}
          <button
            onClick={() => navigate('/entrepreneur/projects')}
            className="group relative bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-12 rounded-3xl shadow-2xl hover:shadow-indigo-500/50 transition-all transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-white/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="text-6xl mb-6"></div>
              <h2 className="text-3xl font-bold mb-4">ادامه سفر قبلی</h2>
              <p className="text-indigo-100 text-lg">
                روی پروژه‌های قبلی خود کار کنید و آنها را تکمیل کنید
              </p>
            </div>
          </button>
        </div>

        {/* Recent Projects Preview */}
        {projects.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                پروژه‌های اخیر شما
              </h3>
              <button
                onClick={() => navigate('/entrepreneur/projects')}
                className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
              >
                مشاهده همه
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.slice(0, 3).map((project) => (
                <button
                  key={project.id}
                  onClick={() => handleContinueJourney(project.id)}
                  className="text-right p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl hover:shadow-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all border-2 border-transparent hover:border-purple-500"
                >
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2 truncate">
                    {project.project_name || 'پروژه بدون نام'}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {new Date(project.updated_at).toLocaleDateString('fa-IR')}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Empty State for No Projects */}
        {projects.length === 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4"></div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              هنوز پروژه‌ای ندارید
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              اولین پروژه خود را با کلیک روی &quot;شروع سفر جدید&quot; ایجاد کنید!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
