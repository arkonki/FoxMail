import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { EmailList } from '../email/EmailList';
import { EmailPreview } from '../email/EmailPreview';
import { ComposeModal } from '../email/ComposeModal';
import { SearchBar } from '../email/SearchBar';
import { useEmailStore } from '../../store/emailStore';
import { emailService } from '../../services/emailService';

export const MainLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const { currentFolder, setEmails, setLoading, selectedEmail } = useEmailStore();

  useEffect(() => {
    const loadEmails = async () => {
      if (!currentFolder) return;

      try {
        setLoading(true);
        const emails = await emailService.getEmails(currentFolder);
        setEmails(emails);
      } catch (error) {
        console.error('Failed to load emails:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEmails();
  }, [currentFolder, setEmails, setLoading]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-veebimajutus-orange to-veebimajutus-darkorange rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Veebimajutus</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Webmail</p>
            </div>
          </div>

          <div className="flex-1 max-w-2xl">
            <SearchBar />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onCompose={() => setIsComposeOpen(true)}
        />

        {/* Email List - Hidden on mobile when email is selected */}
        <div className={`${selectedEmail ? 'hidden md:block' : 'block'} w-full md:w-96 border-r border-gray-200 dark:border-gray-700`}>
          <EmailList />
        </div>

        {/* Email Preview - Full width on mobile when email is selected */}
        <div className={`${selectedEmail ? 'block' : 'hidden md:block'} flex-1`}>
          <EmailPreview />
        </div>
      </div>

      {/* Compose Modal */}
      {isComposeOpen && <ComposeModal onClose={() => setIsComposeOpen(false)} />}
    </div>
  );
};
