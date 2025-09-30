import React, { useEffect } from 'react';
import { LoginPage } from './components/auth/LoginPage';
import { MainLayout } from './components/layout/MainLayout';
import { useAuthStore } from './store/authStore';
import { useUIStore } from './store/uiStore';

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const theme = useUIStore(state => state.theme);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return isAuthenticated ? <MainLayout /> : <LoginPage />;
}

export default App;
