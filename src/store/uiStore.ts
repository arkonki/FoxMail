import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Draft } from '../types/email';

type ComposeMode = 'new' | 'reply' | 'forward';

interface UIState {
  theme: 'light' | 'dark';
  composeOpen: boolean;
  composeMode: ComposeMode;
  sidebarOpen: boolean;
  currentDraft: Draft | null;
  setTheme: (theme: 'light' | 'dark') => void;
  openCompose: (mode: ComposeMode, draft?: Draft) => void;
  closeCompose: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  saveDraft: (draft: Draft) => void;
  clearDraft: () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      composeOpen: false,
      composeMode: 'new',
      sidebarOpen: false,
      currentDraft: null,
      setTheme: (theme) => set({ theme }),
      openCompose: (mode, draft) => set({ composeOpen: true, composeMode: mode, currentDraft: draft || null }),
      closeCompose: () => set({ composeOpen: false, currentDraft: null }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      saveDraft: (draft) => set({ currentDraft: draft }),
      clearDraft: () => set({ currentDraft: null }),
    }),
    {
      name: 'ui-storage',
    }
  )
);
