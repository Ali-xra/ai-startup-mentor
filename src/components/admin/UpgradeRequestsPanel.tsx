import React, { useState, useEffect } from 'react';
import { UpgradeRequest, UpgradeRequestStatus } from '../../types';
import { upgradeRequestService } from '../../services/upgradeRequestService';

interface UpgradeRequestsPanelProps {
  adminId: string;
}

export const UpgradeRequestsPanel: React.FC<UpgradeRequestsPanelProps> = ({ adminId }) => {
  const [requests, setRequests] = useState<UpgradeRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<UpgradeRequestStatus | 'all'>('all');
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, [filter]);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const filterStatus = filter === 'all' ? undefined : filter;
      const data = await upgradeRequestService.getAllUpgradeRequests(filterStatus);
      setRequests(data);
    } catch (error) {
      console.error('Error loading upgrade requests:', error);
      alert('Error loading upgrade requests');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (requestId: string, durationMonths: number = 1) => {
    if (!confirm(`Are you sure you want to approve this request for ${durationMonths} month(s)?`))
      return;

    setProcessingId(requestId);
    try {
      await upgradeRequestService.approveUpgradeRequest(requestId, adminId, durationMonths);
      alert('✅ Request approved successfully!');
      await loadRequests();
    } catch (error: any) {
      console.error('Error approving request:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    const reason = prompt('Reason for rejection (optional):');
    if (reason === null) return; // User cancelled

    setProcessingId(requestId);
    try {
      await upgradeRequestService.rejectUpgradeRequest(requestId, adminId, reason || undefined);
      alert('❌ Request rejected');
      await loadRequests();
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleExtend = async (requestId: string) => {
    const months = prompt('Extend by how many months?', '1');
    if (!months) return;

    const additionalMonths = parseInt(months);
    if (isNaN(additionalMonths) || additionalMonths < 1) {
      alert('Invalid number of months');
      return;
    }

    setProcessingId(requestId);
    try {
      await upgradeRequestService.extendUpgradeRequest(requestId, adminId, additionalMonths);
      alert(`✅ Extended by ${additionalMonths} month(s)`);
      await loadRequests();
    } catch (error: any) {
      console.error('Error extending request:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: UpgradeRequestStatus) => {
    const badges = {
      [UpgradeRequestStatus.PENDING]:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
      [UpgradeRequestStatus.APPROVED]:
        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      [UpgradeRequestStatus.REJECTED]:
        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
      [UpgradeRequestStatus.EXPIRED]:
        'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badges[status]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDaysUntilExpiry = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          🎉 Upgrade Requests (Beta Access)
        </h2>
        <button
          onClick={loadRequests}
          disabled={isLoading}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {[
          'all',
          UpgradeRequestStatus.PENDING,
          UpgradeRequestStatus.APPROVED,
          UpgradeRequestStatus.REJECTED,
          UpgradeRequestStatus.EXPIRED,
        ].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === f
                ? 'bg-purple-600 text-white'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Requests Table */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-slate-600 dark:text-slate-400">No requests found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Requested
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {requests.map((request) => {
                const daysLeft = getDaysUntilExpiry(request.expires_at);
                const isProcessing = processingId === request.id;

                return (
                  <tr key={request.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">
                        {request.user_email}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {request.user_id.slice(0, 8)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                        {request.requested_plan.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(request.requested_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {request.expires_at ? (
                        <div>
                          <div className="text-slate-900 dark:text-white">
                            {formatDate(request.expires_at)}
                          </div>
                          {daysLeft !== null && (
                            <div
                              className={`text-xs ${daysLeft < 7 ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'}`}
                            >
                              {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-600">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {request.status === UpgradeRequestStatus.PENDING && (
                          <>
                            <button
                              onClick={() => handleApprove(request.id, 1)}
                              disabled={isProcessing}
                              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 transition-colors"
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => handleReject(request.id)}
                              disabled={isProcessing}
                              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                              ❌ Reject
                            </button>
                          </>
                        )}
                        {request.status === UpgradeRequestStatus.APPROVED && (
                          <button
                            onClick={() => handleExtend(request.id)}
                            disabled={isProcessing}
                            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                          >
                            ⏰ Extend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Notes Section */}
      {requests.some((r) => r.admin_notes) && (
        <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <h3 className="text-sm font-semibold mb-2 text-slate-900 dark:text-white">
            Admin Notes:
          </h3>
          {requests
            .filter((r) => r.admin_notes)
            .map((r) => (
              <div key={r.id} className="text-sm text-slate-600 dark:text-slate-400 mb-1">
                <strong>{r.user_email}:</strong> {r.admin_notes}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
