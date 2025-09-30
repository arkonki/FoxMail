import { create } from 'zustand';
import { Email, EmailFolder, SearchFilters } from '../types/email';

interface EmailState {
  emails: Email[];
  folders: EmailFolder[];
  selectedEmail: Email | null;
  currentFolder: string;
  isLoading: boolean;
  searchFilters: SearchFilters;
  setEmails: (emails: Email[]) => void;
  setFolders: (folders: EmailFolder[]) => void;
  setSelectedEmail: (email: Email | null) => void;
  setCurrentFolder: (folder: string) => void;
  setLoading: (loading: boolean) => void;
  setSearchFilters: (filters: SearchFilters) => void;
  markAsRead: (emailId: string) => void;
  toggleStar: (emailId: string) => void;
  deleteEmail: (emailId: string) => void;
  archiveEmail: (emailId: string) => void;
  moveEmail: (emailId: string, targetFolder: string) => void;
  getFilteredEmails: () => Email[];
}

export const useEmailStore = create<EmailState>((set, get) => ({
  emails: [],
  folders: [],
  selectedEmail: null,
  currentFolder: 'INBOX',
  isLoading: false,
  searchFilters: { query: '' },
  setEmails: (emails) => set({ emails }),
  setFolders: (folders) => set({ folders }),
  setSelectedEmail: (email) => set({ selectedEmail: email }),
  setCurrentFolder: (folder) => set({ currentFolder: folder }),
  setLoading: (loading) => set({ isLoading: loading }),
  setSearchFilters: (filters) => set({ searchFilters: filters }),
  markAsRead: (emailId) =>
    set((state) => ({
      emails: state.emails.map((email) =>
        email.id === emailId ? { ...email, isRead: true } : email
      ),
      selectedEmail:
        state.selectedEmail?.id === emailId
          ? { ...state.selectedEmail, isRead: true }
          : state.selectedEmail,
    })),
  toggleStar: (emailId) =>
    set((state) => ({
      emails: state.emails.map((email) =>
        email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
      ),
      selectedEmail:
        state.selectedEmail?.id === emailId
          ? { ...state.selectedEmail, isStarred: !state.selectedEmail.isStarred }
          : state.selectedEmail,
    })),
  deleteEmail: (emailId) =>
    set((state) => ({
      emails: state.emails.map((email) =>
        email.id === emailId ? { ...email, folder: 'TRASH' } : email
      ),
      selectedEmail: state.selectedEmail?.id === emailId ? null : state.selectedEmail,
    })),
  archiveEmail: (emailId) =>
    set((state) => ({
      emails: state.emails.map((email) =>
        email.id === emailId ? { ...email, folder: 'ARCHIVE' } : email
      ),
      selectedEmail: state.selectedEmail?.id === emailId ? null : state.selectedEmail,
    })),
  moveEmail: (emailId, targetFolder) =>
    set((state) => ({
      emails: state.emails.map((email) =>
        email.id === emailId ? { ...email, folder: targetFolder } : email
      ),
      selectedEmail: state.selectedEmail?.id === emailId ? null : state.selectedEmail,
    })),
  getFilteredEmails: () => {
    const state = get();
    let filtered = state.emails.filter((email) => email.folder === state.currentFolder);

    const { query, hasAttachments, isStarred, dateFrom, dateTo } = state.searchFilters;

    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (email) =>
          email.subject.toLowerCase().includes(lowerQuery) ||
          email.from.some((addr) =>
            (addr.name || addr.address).toLowerCase().includes(lowerQuery)
          ) ||
          email.body.text.toLowerCase().includes(lowerQuery)
      );
    }

    if (hasAttachments) {
      filtered = filtered.filter((email) => email.attachments.length > 0);
    }

    if (isStarred) {
      filtered = filtered.filter((email) => email.isStarred);
    }

    if (dateFrom) {
      filtered = filtered.filter((email) => new Date(email.date) >= new Date(dateFrom));
    }

    if (dateTo) {
      filtered = filtered.filter((email) => new Date(email.date) <= new Date(dateTo));
    }

    return filtered;
  },
}));
