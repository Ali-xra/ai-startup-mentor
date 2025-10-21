import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { Locale } from '../../i18n';
import { ProjectSelectionScreen } from '../ProjectSelectionScreen';

/**
 * NewProjectPage
 * Wrapper برای ProjectSelectionScreen که از React Router استفاده می‌کنه
 */
export const NewProjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const locale: Locale = language === 'fa' ? 'fa' : 'en';

  const handleProjectSelect = (projectId: string) => {
    // وقتی پروژه انتخاب شد، به صفحه workspace برو
    navigate(`/entrepreneur/project/${projectId}`);
  };

  const handleLocaleToggle = () => {
    // این کار توسط LanguageSelector انجام میشه
  };

  return (
    <ProjectSelectionScreen
      onProjectSelect={handleProjectSelect}
      locale={locale}
      onLocaleToggle={handleLocaleToggle}
    />
  );
};
