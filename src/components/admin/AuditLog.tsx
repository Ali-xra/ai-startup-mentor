import React, { useState, useEffect } from 'react';
import { featureFlagsService } from '../../services/featureFlagsService';
import { Loader } from '../Loader';

interface AuditLogEntry {
  id: string;
  admin_id: string;
  action: string;
  target_user_id?: string;
  details?: any;
  ip_address?: string;
  created_at: string;
}

export const AuditLog: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterAction, setFilterAction] = useState<string>('all');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await featureFlagsService.getAuditLog(100, 0);
      setLogs(data);
    } catch (error) {
      console.error('Error loading audit log:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionLabel = (action: string): { text: string; color: string; icon: string } => {
    const actions: Record<string, { text: string; color: string; icon: string }> = {
      grant_feature: { text: 'فعال‌سازی فیچر', color: 'green', icon: '' },
      revoke_feature: { text: 'غیرفعال‌سازی فیچر', color: 'red', icon: '' },
      revoke_all_features: { text: 'حذف تمام فیچرها', color: 'red', icon: '' },
      grant_plan: { text: 'فعال‌سازی پلن', color: 'blue', icon: '' },
      create_admin: { text: 'ایجاد ادمین', color: 'purple', icon: '' },
      delete_admin: { text: 'حذف ادمین', color: 'red', icon: '' },
    };

    return actions[action] || { text: action, color: 'slate', icon: '' };
  };

  const filteredLogs =
    filterAction === 'all' ? logs : logs.filter((log) => log.action === filterAction);

  const uniqueActions = Array.from(new Set(logs.map((log) => log.action)));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">مجموع لاگ‌ها</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-2">
                {logs.length}
              </p>
            </div>
            <div className="text-4xl"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">فعال‌سازی فیچر</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                {logs.filter((l) => l.action === 'grant_feature').length}
              </p>
            </div>
            <div className="text-4xl"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">غیرفعال‌سازی</p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
                {logs.filter((l) => l.action === 'revoke_feature').length}
              </p>
            </div>
            <div className="text-4xl"></div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-400">فعال‌سازی پلن</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                {logs.filter((l) => l.action.includes('plan')).length}
              </p>
            </div>
            <div className="text-4xl"></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="font-medium text-slate-700 dark:text-slate-300">فیلتر:</span>
          <button
            onClick={() => setFilterAction('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterAction === 'all'
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            همه ({logs.length})
          </button>
          {uniqueActions.map((action) => {
            const { text, color, icon } = getActionLabel(action);
            const count = logs.filter((l) => l.action === action).length;
            return (
              <button
                key={action}
                onClick={() => setFilterAction(action)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterAction === action
                    ? `bg-${color}-600 text-white`
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {icon} {text} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        {filteredLogs.map((log) => {
          const { text, color, icon } = getActionLabel(log.action);
          return (
            <div
              key={log.id}
              className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className={`text-3xl flex-shrink-0`}>{icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium bg-${color}-100 text-${color}-700 dark:bg-${color}-900/30 dark:text-${color}-400`}
                    >
                      {text}
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {new Date(log.created_at).toLocaleString('fa-IR')}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <p className="text-slate-700 dark:text-slate-300">
                      <span className="font-medium">Admin ID:</span>{' '}
                      <code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded font-mono text-xs">
                        {log.admin_id.slice(0, 8)}...
                      </code>
                    </p>
                    {log.target_user_id && (
                      <p className="text-slate-700 dark:text-slate-300">
                        <span className="font-medium">Target User:</span>{' '}
                        <code className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded font-mono text-xs">
                          {log.target_user_id.slice(0, 8)}...
                        </code>
                      </p>
                    )}
                    {log.details && Object.keys(log.details).length > 0 && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium">
                          جزئیات بیشتر
                        </summary>
                        <pre className="mt-2 p-3 bg-slate-50 dark:bg-slate-900 rounded text-xs overflow-x-auto">
                          {JSON.stringify(log.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredLogs.length === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-lg p-12 text-center">
          <div className="text-6xl mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            {filterAction === 'all' ? 'هیچ لاگی ثبت نشده است' : 'لاگی با این فیلتر یافت نشد'}
          </p>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">ℹ</div>
          <div className="flex-1">
            <h4 className="font-semibold text-amber-900 dark:text-amber-300 mb-1">Audit Log</h4>
            <p className="text-sm text-amber-800 dark:text-amber-400">
              تمام عملیات ادمین‌ها در این قسمت ثبت و نمایش داده می‌شود. این لاگ‌ها برای امنیت و
              بررسی تغییرات ضروری هستند.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
