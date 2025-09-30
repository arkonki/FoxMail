import React, { useState } from 'react';
import { Trash2, Archive, FolderInput, AlertCircle } from 'lucide-react';
import { useEmailStore } from '../../store/emailStore';

interface EmailActionsProps {
  emailId: string;
}

export const EmailActions: React.FC<EmailActionsProps> = ({ emailId }) => {
  const { deleteEmail, archiveEmail, moveEmail, folders } = useEmailStore();
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    deleteEmail(emailId);
    setShowDeleteConfirm(false);
  };

  const handleArchive = () => {
    archiveEmail(emailId);
  };

  const handleMove = (targetFolder: string) => {
    moveEmail(emailId, targetFolder);
    setShowMoveMenu(false);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={handleArchive}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
        title="Archive"
      >
        <Archive className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-veebimajutus-orange" />
      </button>

      <div className="relative">
        <button
          onClick={() => setShowMoveMenu(!showMoveMenu)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
          title="Move to folder"
        >
          <FolderInput className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-veebimajutus-orange" />
        </button>

        {showMoveMenu && (
          <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[200px] z-50">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Move to
            </div>
            {folders
              .filter((f) => !['TRASH', 'DRAFTS'].includes(f.id))
              .map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => handleMove(folder.id)}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {folder.name}
                </button>
              ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setShowDeleteConfirm(true)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
        title="Delete"
      >
        <Trash2 className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-red-500" />
      </button>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-6 max-w-md w-full mx-4">
            <div className="flex items-start space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Delete Email?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This email will be moved to trash. You can restore it within 30 days.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
