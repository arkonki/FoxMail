import React from 'react';
import { Star, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import { useEmailStore } from '../../store/emailStore';
import { Email } from '../../types/email';

export const EmailList: React.FC = () => {
  const { emails, selectedEmail, setSelectedEmail, markAsRead, toggleStar } = useEmailStore();

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    if (!email.isRead) {
      markAsRead(email.id);
    }
  };

  const handleStarClick = (e: React.MouseEvent, emailId: string) => {
    e.stopPropagation();
    toggleStar(emailId);
  };

  return (
    <div className="w-full md:w-96 bg-white dark:bg-gray-800 md:border-r border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Inbox
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {emails.filter(e => !e.isRead).length} unread messages
        </p>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {emails.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p>No emails to display</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {emails.map((email) => (
              <button
                key={email.id}
                onClick={() => handleEmailClick(email)}
                className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors active:bg-gray-100 dark:active:bg-gray-700 ${
                  selectedEmail?.id === email.id
                    ? 'bg-orange-50 dark:bg-orange-900/20 md:border-l-4 border-veebimajutus-orange'
                    : ''
                } ${!email.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
              >
                <div className="flex items-start space-x-3">
                  {/* Star Button */}
                  <button
                    onClick={(e) => handleStarClick(e, email.id)}
                    className="mt-1 flex-shrink-0 p-1 -m-1"
                  >
                    <Star
                      className={`w-5 h-5 transition-colors ${
                        email.isStarred
                          ? 'fill-veebimajutus-orange text-veebimajutus-orange'
                          : 'text-gray-400 hover:text-veebimajutus-orange'
                      }`}
                    />
                  </button>

                  {/* Email Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-sm truncate ${
                          !email.isRead
                            ? 'font-semibold text-gray-900 dark:text-white'
                            : 'font-medium text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {email.from[0].name || email.from[0].address}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 flex-shrink-0">
                        {format(new Date(email.date), 'MMM d')}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 mb-1">
                      <h3
                        className={`text-sm truncate ${
                          !email.isRead
                            ? 'font-semibold text-gray-900 dark:text-white'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {email.subject}
                      </h3>
                      {email.attachments.length > 0 && (
                        <Paperclip className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {email.preview}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
