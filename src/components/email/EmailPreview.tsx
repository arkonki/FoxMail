import React from 'react';
import { 
  ArrowLeft,
  Reply, 
  ReplyAll, 
  Forward, 
  Trash2, 
  Archive, 
  Star,
  MoreVertical,
  Paperclip,
  Download
} from 'lucide-react';
import { format } from 'date-fns';
import DOMPurify from 'dompurify';
import { useEmailStore } from '../../store/emailStore';

export const EmailPreview: React.FC = () => {
  const { selectedEmail, toggleStar, deleteEmail, archiveEmail, setSelectedEmail } = useEmailStore();

  if (!selectedEmail) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-veebimajutus-orange to-veebimajutus-darkorange rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
            <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No email selected
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Select an email from the list to read
          </p>
        </div>
      </div>
    );
  }

  const sanitizedHtml = DOMPurify.sanitize(selectedEmail.html || selectedEmail.text || '');

  const handleBack = () => {
    setSelectedEmail(null);
  };

  return (
    <div className="flex-1 bg-white dark:bg-gray-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          {/* Back button for mobile */}
          <button
            onClick={handleBack}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors -ml-2"
            aria-label="Back to list"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Action buttons */}
          <div className="flex items-center space-x-2 ml-auto">
            <button
              onClick={() => toggleStar(selectedEmail.id)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Star email"
            >
              <Star
                className={`w-5 h-5 ${
                  selectedEmail.isStarred
                    ? 'fill-veebimajutus-orange text-veebimajutus-orange'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              />
            </button>
            <button
              onClick={() => archiveEmail(selectedEmail.id)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Archive email"
            >
              <Archive className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => deleteEmail(selectedEmail.id)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Delete email"
            >
              <Trash2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" aria-label="More options">
              <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Reply/Forward buttons - Second row */}
        <div className="flex items-center space-x-2 mb-4">
          <button className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-veebimajutus-orange to-veebimajutus-darkorange text-white rounded-lg hover:shadow-lg transition-all text-sm">
            <Reply className="w-4 h-4" />
            <span className="hidden sm:inline">Reply</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
            <ReplyAll className="w-4 h-4" />
            <span className="hidden sm:inline">Reply All</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
            <Forward className="w-4 h-4" />
            <span className="hidden sm:inline">Forward</span>
          </button>
        </div>

        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {selectedEmail.subject}
        </h1>

        <div className="flex items-start space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-veebimajutus-orange to-veebimajutus-darkorange rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white font-semibold text-sm">
              {selectedEmail.from[0].name?.[0] || selectedEmail.from[0].address[0].toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {selectedEmail.from[0].name || selectedEmail.from[0].address}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedEmail.from[0].address}
                </p>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                {format(new Date(selectedEmail.date), 'MMM d, yyyy h:mm a')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Email Body */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div
          className="prose prose-sm md:prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />

        {/* Attachments */}
        {selectedEmail.attachments.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <Paperclip className="w-4 h-4 mr-2" />
              {selectedEmail.attachments.length} Attachment{selectedEmail.attachments.length > 1 ? 's' : ''}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedEmail.attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-veebimajutus-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Paperclip className="w-5 h-5 text-veebimajutus-orange" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {attachment.filename}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(attachment.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors flex-shrink-0 ml-2">
                    <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
