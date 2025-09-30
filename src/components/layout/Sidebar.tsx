import React from 'react';
import { 
  Inbox, 
  Send, 
  FileText, 
  Trash2, 
  Archive, 
  AlertOctagon,
  PenSquare,
  LogOut,
  Settings,
  Moon,
  Sun,
  X
} from 'lucide-react';
import { useEmailStore } from '../../store/emailStore';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';

export const Sidebar: React.FC = () => {
  const { folders, currentFolder, setCurrentFolder } = useEmailStore();
  const { openCompose, theme, setTheme, setSidebarOpen } = useUIStore();
  const { logout, account } = useAuthStore();

  const getFolderIcon = (specialUse?: string) => {
    switch (specialUse) {
      case 'inbox': return Inbox;
      case 'sent': return Send;
      case 'drafts': return FileText;
      case 'trash': return Trash2;
      case 'junk': return AlertOctagon;
      default: return Archive;
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    document.documentElement.classList.toggle('dark');
  };

  const handleFolderClick = (path: string) => {
    setCurrentFolder(path);
    setSidebarOpen(false); // Close sidebar on mobile after selection
  };

  const handleComposeClick = () => {
    openCompose('new');
    setSidebarOpen(false); // Close sidebar on mobile after compose
  };

  return (
    <div className="w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-gradient-to-br from-veebimajutus-orange to-veebimajutus-darkorange rounded-lg flex items-center justify-center flex-shrink-0">
              <Inbox className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                Veebimajutus
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {account?.email}
              </p>
            </div>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <button
          onClick={handleComposeClick}
          className="w-full bg-gradient-to-r from-veebimajutus-orange to-veebimajutus-darkorange text-white py-2.5 px-4 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <PenSquare className="w-4 h-4" />
          <span>Compose</span>
        </button>
      </div>

      {/* Folders */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {folders.map((folder) => {
            const Icon = getFolderIcon(folder.specialUse);
            const isActive = currentFolder === folder.path;

            return (
              <button
                key={folder.path}
                onClick={() => handleFolderClick(folder.path)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-orange-50 dark:bg-orange-900/20 text-veebimajutus-orange'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{folder.name}</span>
                </div>
                {folder.unreadCount > 0 && (
                  <span className="bg-veebimajutus-orange text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    {folder.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="font-medium">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <button
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};
