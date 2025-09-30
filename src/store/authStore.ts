import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EmailAccount } from '../types/email';

interface AuthState {
  isAuthenticated: boolean;
  account: EmailAccount | null;
  login: (account: EmailAccount) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      account: null,
      login: (account) => set({ isAuthenticated: true, account }),
      logout: () => set({ isAuthenticated: false, account: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
