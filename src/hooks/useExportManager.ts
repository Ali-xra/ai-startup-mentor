import { Stage, StartupData, ChatMessage, Locale } from '../types';
import { t } from '../i18n';

/**
 * useExportManager Hook
 *
 * Handles all export functionality:
 * - JSON export
 * - PDF export (HTML format for printing)
 * - Word export (HTML format)
 * - CSV export
 * - Excel export
 *
 * Extracted from useStartupJourney to follow Single Responsibility Principle
 */

interface ExportData {
  version: string;
  stage: Stage;
  data: Partial<StartupData>;
  messages: ChatMessage[];
}

interface UseExportManagerProps {
  locale: Locale;
}

interface UseExportManagerReturn {
  exportProject: (
    stage: Stage,
    startupData: Partial<StartupData>,
    messages: ChatMessage[],
    format?: 'json' | 'pdf' | 'word' | 'csv' | 'excel'
  ) => void;
}

export const useExportManager = ({ locale }: UseExportManagerProps): UseExportManagerReturn => {
  /**
   * Generate HTML content for PDF export
   */
  const generatePDFContent = (data: ExportData): string => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${data.data.projectName || 'Startup Project'} - Export</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
                h1, h2, h3 { color: #333; }
                .section { margin-bottom: 30px; }
                .field { margin-bottom: 15px; }
                .field-label { font-weight: bold; color: #666; }
                .field-value { margin-top: 5px; }
            </style>
        </head>
        <body>
            <h1>${data.data.projectName || 'Startup Project'}</h1>
            <p><strong>Stage:</strong> ${data.stage}</p>
            <p><strong>Export Date:</strong> ${new Date().toLocaleDateString()}</p>

            ${Object.entries(data.data)
              .map(
                ([key, value]) => `
                <div class="section">
                    <h2>${key.replace(/_/g, ' ').toUpperCase()}</h2>
                    <div class="field-value">${value || 'Not completed'}</div>
                </div>
            `
              )
              .join('')}
        </body>
        </html>`;
  };

  /**
   * Generate HTML content for Word export
   */
  const generateWordContent = (data: ExportData): string => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${data.data.projectName || 'Startup Project'} - Word Export</title>
            <style>
                body { font-family: 'Times New Roman', serif; margin: 40px; line-height: 1.6; }
                h1, h2, h3 { color: #000; }
                .section { margin-bottom: 30px; page-break-inside: avoid; }
                .field { margin-bottom: 15px; }
                .field-label { font-weight: bold; color: #333; }
                .field-value { margin-top: 5px; text-align: justify; }
            </style>
        </head>
        <body>
            <h1>${data.data.projectName || 'Startup Project'}</h1>
            <p><strong>Stage:</strong> ${data.stage}</p>
            <p><strong>Export Date:</strong> ${new Date().toLocaleDateString()}</p>

            ${Object.entries(data.data)
              .map(
                ([key, value]) => `
                <div class="section">
                    <h2>${key.replace(/_/g, ' ').toUpperCase()}</h2>
                    <div class="field-value">${value || 'Not completed'}</div>
                </div>
            `
              )
              .join('')}
        </body>
        </html>`;
  };

  /**
   * Generate CSV content for CSV export
   */
  const generateCSVContent = (data: ExportData): string => {
    const rows = [
      ['Field', 'Value'],
      ['Project Name', data.data.projectName || ''],
      ['Stage', data.stage],
      ['Export Date', new Date().toLocaleDateString()],
      ...Object.entries(data.data).map(([key, value]) => [key.replace(/_/g, ' '), value || '']),
    ];
    return rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
  };

  /**
   * Generate Excel-formatted CSV content
   */
  const generateExcelContent = (data: ExportData): string => {
    // Create a more structured format for Excel
    const sections = [
      ['Project Information'],
      ['Field', 'Value'],
      ['Project Name', data.data.projectName || ''],
      ['Stage', data.stage],
      ['Export Date', new Date().toLocaleDateString()],
      [''],
      ['Project Data'],
      ['Section', 'Content'],
      ...Object.entries(data.data).map(([key, value]) => [key.replace(/_/g, ' '), value || '']),
    ];
    return sections.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
  };

  /**
   * Download a file with given content
   */
  const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);

    console.log('[useExportManager] File downloaded:', fileName);
  };

  /**
   * Download JSON file
   */
  const downloadJSON = (data: ExportData, projectName: string) => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `${projectName}-export.json`;
    link.click();

    console.log('[useExportManager] JSON downloaded:', projectName);
  };

  /**
   * Export project in various formats
   */
  const exportProject = (
    stage: Stage,
    startupData: Partial<StartupData>,
    messages: ChatMessage[],
    format: 'json' | 'pdf' | 'word' | 'csv' | 'excel' = 'json'
  ) => {
    try {
      const projectData: ExportData = {
        version: '1.0',
        stage,
        data: startupData,
        messages,
      };

      const projectName = startupData.projectName || 'unnamed-project';
      const safeProjectName = projectName.toLowerCase().replace(/\s+/g, '-');

      switch (format) {
        case 'pdf': {
          const htmlContent = generatePDFContent(projectData);
          downloadFile(htmlContent, `${safeProjectName}-export.html`, 'text/html');
          break;
        }

        case 'word': {
          const htmlContent = generateWordContent(projectData);
          downloadFile(htmlContent, `${safeProjectName}-export.html`, 'text/html');
          break;
        }

        case 'csv': {
          const csvContent = generateCSVContent(projectData);
          downloadFile(csvContent, `${safeProjectName}-export.csv`, 'text/csv');
          break;
        }

        case 'excel': {
          const csvContent = generateExcelContent(projectData);
          downloadFile(csvContent, `${safeProjectName}-export.csv`, 'text/csv');
          break;
        }

        case 'json':
        default: {
          downloadJSON(projectData, safeProjectName);
          break;
        }
      }

      console.log('[useExportManager] Export completed successfully:', {
        format,
        projectName: safeProjectName,
      });
    } catch (error) {
      console.error('[useExportManager] Export error:', error);
      alert(t('export_error', locale));
    }
  };

  return {
    exportProject,
  };
};

export default useExportManager;
