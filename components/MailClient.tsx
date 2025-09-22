import React, { useState, useMemo, useEffect, useCallback } from 'react';
import type { User, Email, Folder } from '../types';
import * as mailService from '../services/mailService';
import { logService } from '../services/logService';
import { MenuIcon, SearchIcon, StarIcon, BugIcon, PencilIcon, MailIcon } from './icons';
import ComposeView from './ComposeView';
import DiagnosticsView from './DiagnosticsView';


interface MailClientProps {
  user: User;
  onLogout: () => void;
  isTestMode: boolean;
  isDiagnosticsMode: boolean;
}

const Header: React.FC<{ onToggleSidebar: () => void; user: User; onLogout: () => void; onCompose: () => void }> = ({ onToggleSidebar, user, onLogout, onCompose }) => (
  <header className="flex items-center justify-between p-2 bg-white border-b border-gray-200 sticky top-0 z-20">
    <div className="flex items-center gap-4">
      <button onClick={onToggleSidebar} className="p-2 rounded-full hover:bg-gray-200">
        <MenuIcon className="w-6 h-6 text-gray-600" />
      </button>
      <h1 className="text-xl font-bold text-primary hidden sm:block">Webmail</h1>
    </div>
    <div className="flex-1 max-w-xl mx-4">
      <div className="relative">
        <SearchIcon className="absolute w-5 h-5 text-gray-400 top-1/2 left-3 transform -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search mail"
          className="w-full py-2 pl-10 pr-4 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white"
        />
      </div>
    </div>
    <div className="flex items-center gap-4">
      <button onClick={onCompose} className="hidden lg:flex items-center justify-center gap-2 px-6 py-2 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark shadow">
          <PencilIcon className="w-5 h-5" />
          Compose
      </button>
      <div className="relative group">
        <button className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-lg font-bold text-white" style={{backgroundColor: '#EF8005'}}>
          {user.name.charAt(0)}
        </button>
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
           <div className="px-4 py-2 text-sm text-gray-700 font-semibold">{user.name}</div>
           <div className="px-4 text-xs text-gray-500 truncate">{user.email}</div>
           <div className="border-t my-1"></div>
           <a href="#logout" onClick={(e) => { e.preventDefault(); onLogout(); }} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</a>
        </div>
      </div>
    </div>
  </header>
);

const Sidebar: React.FC<{ folders: Folder[]; selectedFolder: string; onSelectFolder: (id: string) => void; onCompose: () => void }> = ({ folders, selectedFolder, onSelectFolder, onCompose }) => (
  <aside className={`absolute lg:relative transform transition-transform duration-300 ease-in-out w-64 bg-white h-full border-r border-gray-200 p-4 z-30 lg:translate-x-0`}>
    <button onClick={onCompose} className="w-full mb-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary-dark shadow flex items-center justify-center gap-2">
      <PencilIcon className="w-6 h-6" />
      Compose
    </button>
    <nav>
      <ul>
        {folders.map((folder) => (
          <li key={folder.id}>
            <button
              onClick={() => onSelectFolder(folder.id)}
              className={`w-full flex items-center gap-4 px-4 py-2 rounded-r-full text-left font-medium transition-colors ${
                selectedFolder === folder.id
                  ? 'bg-primary-light text-primary'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <folder.icon className="w-5 h-5" />
              <span>{folder.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);

const EmailListItem: React.FC<{ email: Email; isSelected: boolean; onSelect: () => void }> = ({ email, isSelected, onSelect }) => (
  <li
    onClick={onSelect}
    className={`flex items-start gap-3 p-3 border-b border-gray-200 cursor-pointer transition-colors ${
      isSelected ? 'bg-primary-light' : 'hover:bg-gray-100'
    } ${!email.read ? 'bg-white font-bold' : 'bg-gray-50'}`}
  >
    <img src={email.avatar} alt="sender avatar" className="w-10 h-10 rounded-full" />
    <div className="flex-1 overflow-hidden">
      <div className="flex justify-between items-baseline">
        <p className={`text-sm truncate ${!email.read ? 'text-gray-900' : 'text-gray-700'}`}>{email.sender}</p>
        <p className={`text-xs flex-shrink-0 ${!email.read ? 'text-primary' : 'text-gray-500'}`}>{new Date(email.timestamp).toLocaleDateString()}</p>
      </div>
      <p className={`text-sm truncate ${!email.read ? 'text-gray-800' : 'text-gray-600'}`}>{email.subject}</p>
      <p className="text-xs text-gray-500 font-normal truncate">{email.body.replace(/<[^>]+>/g, '')}</p>
    </div>
    <button className="p-1 rounded-full hover:bg-yellow-200 text-gray-400 hover:text-yellow-500">
        <StarIcon className="w-5 h-5" />
    </button>
  </li>
);

const EmailList: React.FC<{ emails: Email[]; selectedEmail: Email | null; onSelectEmail: (email: Email) => void; title: string; isLoading: boolean; }> = ({ emails, selectedEmail, onSelectEmail, title, isLoading }) => (
  <section className="w-full md:w-2/5 xl:w-1/3 bg-white border-r border-gray-200 flex flex-col">
    <div className="p-4 border-b">
        <h2 className="text-xl font-semibold capitalize">{title}</h2>
    </div>
    <ul className="overflow-y-auto flex-1">
      {isLoading ? (
        <li className="p-4 text-center text-gray-500">Loading emails...</li>
      ) : emails.length > 0 ? (
        emails.map((email) => (
          <EmailListItem
            key={email.id}
            email={email}
            isSelected={selectedEmail?.id === email.id}
            onSelect={() => onSelectEmail(email)}
          />
        ))
      ) : (
        <li className="p-4 text-center text-gray-500">No emails in this folder.</li>
      )}
    </ul>
  </section>
);


const EmailView: React.FC<{ email: Email | null }> = ({ email }) => (
  <section className="flex-1 flex flex-col bg-white">
    {email ? (
      <>
        <header className="p-4 border-b">
          <h2 className="text-2xl font-bold">{email.subject}</h2>
          <div className="flex items-center gap-3 mt-2">
            <img src={email.avatar} alt="sender avatar" className="w-10 h-10 rounded-full" />
            <div>
              <p className="font-semibold">{email.sender}</p>
              <p className="text-sm text-gray-500">to {email.recipient}</p>
            </div>
            <p className="text-sm text-gray-500 ml-auto">{new Date(email.timestamp).toLocaleString()}</p>
          </div>
        </header>
        <div className="flex-1 p-6 overflow-y-auto" dangerouslySetInnerHTML={{ __html: email.body }} />
        <footer className="p-4 border-t">
            <button className="px-6 py-2 border border-gray-300 rounded-full font-semibold hover:bg-gray-100">Reply</button>
        </footer>
      </>
    ) : (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
         <MailIcon className="w-24 h-24 text-gray-300" />
        <p className="mt-4 text-lg">Select an email to read</p>
        <p className="text-sm">Nothing is selected.</p>
      </div>
    )}
  </section>
);


const MailClient: React.FC<MailClientProps> = ({ user, onLogout, isTestMode, isDiagnosticsMode }) => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDiagnosticsPanelOpen, setIsDiagnosticsPanelOpen] = useState(false);

  useEffect(() => {
    mailService.getFolders(isTestMode).then(setFolders);
  }, [isTestMode]);

  const handleSelectFolder = useCallback((folderId: string) => {
    logService.log(`Folder selected: ${folderId}`, 'UI');
    setSelectedFolderId(folderId);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setSelectedEmail(null);
    mailService.getEmailsForFolder(selectedFolderId, isTestMode).then(emails => {
      setEmails(emails);
      setIsLoading(false);
    });
  }, [selectedFolderId, isTestMode]);
  
  const handleSelectEmail = useCallback((email: Email) => {
    logService.log(`Email selected: ${email.id} ("${email.subject}")`, 'UI');
    setSelectedEmail(email);
    if (!email.read) {
      mailService.updateEmail(email.id, { read: true }, isTestMode).then(updatedEmail => {
        setEmails(prevEmails => prevEmails.map(e => e.id === updatedEmail.id ? updatedEmail : e));
      });
    }
  }, [isTestMode]);
  
  const handleCompose = useCallback(() => {
    logService.log('Compose window opened', 'UI');
    setIsComposing(true);
  }, []);

  const selectedFolderName = useMemo(() => folders.find(f => f.id === selectedFolderId)?.name ?? 'Inbox', [folders, selectedFolderId]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {isTestMode && (
          <div className={`text-center p-1 text-sm font-semibold ${isDiagnosticsMode ? 'bg-indigo-300 text-indigo-800' : 'bg-yellow-300 text-yellow-800'}`}>
              {isDiagnosticsMode ? "Diagnostics Mode Active" : "Test Mode Active"}
          </div>
      )}
      <Header 
        user={user} 
        onLogout={onLogout} 
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        onCompose={handleCompose}
      />
      <div className="flex flex-1 overflow-hidden relative">
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity lg:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)}></div>
        <div className={`absolute lg:relative transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out z-30`}>
            <Sidebar 
                folders={folders} 
                selectedFolder={selectedFolderId} 
                onSelectFolder={handleSelectFolder}
                onCompose={handleCompose}
            />
        </div>
        <main className="flex flex-1 overflow-hidden">
          <EmailList 
            emails={emails} 
            selectedEmail={selectedEmail} 
            onSelectEmail={handleSelectEmail}
            title={selectedFolderName}
            isLoading={isLoading}
          />
          <EmailView email={selectedEmail} />
        </main>
      </div>
      {isComposing && <ComposeView onClose={() => setIsComposing(false)} isTestMode={isTestMode} />}
      {isDiagnosticsMode && (
        <>
            <button
                onClick={() => setIsDiagnosticsPanelOpen(true)}
                className="fixed bottom-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 z-50"
                aria-label="Open Diagnostics Panel"
            >
                <BugIcon className="w-6 h-6" />
            </button>
            {isDiagnosticsPanelOpen && <DiagnosticsView onClose={() => setIsDiagnosticsPanelOpen(false)} />}
        </>
      )}
    </div>
  );
};

export default MailClient;