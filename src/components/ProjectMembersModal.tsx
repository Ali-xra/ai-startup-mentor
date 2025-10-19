import React, { useState, useEffect } from 'react';
import { Locale } from '../i18n';
import { ProjectMember, ProjectMemberRole } from '../types';
import { projectMembersService } from '../services/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from './Loader';

interface ProjectMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  locale: Locale;
  isOwner: boolean; // ✅ prop جدید برای چک کردن صاحب پروژه
}

export const ProjectMembersModal: React.FC<ProjectMembersModalProps> = ({
  isOpen,
  onClose,
  projectId,
  projectName,
  locale,
  isOwner, // ✅ دریافت prop
}) => {
  const { user } = useAuth();
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<ProjectMemberRole>(ProjectMemberRole.EDITOR);

  // Load project members
  const loadMembers = async () => {
    if (!projectId) return;

    setIsLoading(true);
    try {
      const data = await projectMembersService.getMembers(projectId);
      setMembers(data || []);
    } catch (error) {
      console.error('Error loading members:', error);
      alert('Error loading project members');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && projectId) {
      loadMembers();
    }
  }, [isOpen, projectId]);

  // Add new member
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail.trim() || !user) return;

    setIsAddingMember(true);
    try {
      await projectMembersService.addMember(
        projectId,
        newMemberEmail.trim(),
        newMemberRole,
        user.id
      );

      setNewMemberEmail('');
      setNewMemberRole(ProjectMemberRole.EDITOR);
      await loadMembers();

      alert(locale === 'fa' ? 'دعوت‌نامه ارسال شد' : 'Invitation sent');
    } catch (error: any) {
      console.error('Error adding member:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsAddingMember(false);
    }
  };

  // Update member role
  const handleUpdateRole = async (memberId: string, newRole: ProjectMemberRole) => {
    try {
      await projectMembersService.updateMemberRole(memberId, newRole);
      await loadMembers();
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Error updating member role');
    }
  };

  // Remove member
  const handleRemoveMember = async (memberId: string) => {
    if (!confirm(locale === 'fa' ? 'آیا مطمئن هستید؟' : 'Are you sure?')) return;

    try {
      await projectMembersService.removeMember(memberId);
      await loadMembers();
    } catch (error) {
      console.error('Error removing member:', error);
      alert('Error removing member');
    }
  };

  // Get role display name (unused but kept for future use)
  // const getRoleDisplayName = (role: ProjectMemberRole) => {
  //     switch (role) {
  //         case ProjectMemberRole.OWNER:
  //             return locale === 'fa' ? 'صاحب پروژه' : 'Owner';
  //         case ProjectMemberRole.EDITOR:
  //             return locale === 'fa' ? 'ویرایشگر' : 'Editor';
  //         case ProjectMemberRole.VIEWER:
  //             return locale === 'fa' ? 'مشاهده‌گر' : 'Viewer';
  //         default:
  //             return role;
  //     }
  // };

  // Get status display name
  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case 'pending':
        return locale === 'fa' ? 'در انتظار تایید' : 'Pending';
      case 'accepted':
        return locale === 'fa' ? 'تایید شده' : 'Accepted';
      case 'declined':
        return locale === 'fa' ? 'رد شده' : 'Declined';
      default:
        return status;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
              {locale === 'fa' ? 'مدیریت اعضا' : 'Manage Members'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{projectName}</p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Add Member Form - فقط برای صاحب پروژه */}
          {isOwner && (
            <form
              onSubmit={handleAddMember}
              className="mb-6 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
            >
              <h3 className="text-lg font-semibold mb-3 text-slate-800 dark:text-slate-100">
                {locale === 'fa' ? 'اضافه کردن عضو جدید' : 'Add New Member'}
              </h3>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder={locale === 'fa' ? 'ایمیل عضو جدید' : 'Member email'}
                  className="flex-1 p-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                />
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as ProjectMemberRole)}
                  className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value={ProjectMemberRole.EDITOR}>
                    {locale === 'fa' ? 'ویرایشگر' : 'Editor'}
                  </option>
                  <option value={ProjectMemberRole.VIEWER}>
                    {locale === 'fa' ? 'مشاهده‌گر' : 'Viewer'}
                  </option>
                </select>
                <button
                  type="submit"
                  disabled={isAddingMember || !newMemberEmail.trim()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isAddingMember ? <Loader /> : null}
                  {locale === 'fa' ? 'دعوت' : 'Invite'}
                </button>
              </div>
            </form>
          )}

          {/* Members List */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {locale === 'fa' ? 'اعضای پروژه' : 'Project Members'}
            </h3>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader />
              </div>
            ) : members.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                {locale === 'fa' ? 'هنوز عضوی اضافه نشده' : 'No members yet'}
              </p>
            ) : (
              members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-slate-800 dark:text-slate-100">
                      {member.user_email}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {getStatusDisplayName(member.status)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {member.status === 'accepted' && (
                      <select
                        value={member.role}
                        onChange={(e) =>
                          handleUpdateRole(member.id, e.target.value as ProjectMemberRole)
                        }
                        className="px-2 py-1 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-purple-500"
                      >
                        <option value={ProjectMemberRole.EDITOR}>
                          {locale === 'fa' ? 'ویرایشگر' : 'Editor'}
                        </option>
                        <option value={ProjectMemberRole.VIEWER}>
                          {locale === 'fa' ? 'مشاهده‌گر' : 'Viewer'}
                        </option>
                      </select>
                    )}

                    {member.status === 'accepted' && member.role !== ProjectMemberRole.OWNER && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        {locale === 'fa' ? 'حذف' : 'Remove'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
