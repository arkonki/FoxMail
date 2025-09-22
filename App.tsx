import React, { useState, useCallback, useEffect } from 'react';
import LoginScreen from './components/LoginScreen';
import MailClient from './components/MailClient';
import type { User, AuthCredentials } from './types';
import { logService } from './services/logService';
import * as mailService from './services/mailService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isTestMode, setIsTestMode] = useState(false);
  const [isDiagnosticsMode, setIsDiagnosticsMode] = useState(false);

  useEffect(() => {
    logService.log('App Initialized', 'System');
  }, []);

  const handleLogin = useCallback(async (credentials: AuthCredentials) => {
    const { email } = credentials;
    const lowerCaseEmail = email.toLowerCase();
    const testMode = lowerCaseEmail === 'test@example.com' || lowerCaseEmail === 'testikas@maantoa.ee';
    const diagnosticsMode = lowerCaseEmail === 'testikas@maantoa.ee';

    setIsTestMode(testMode);
    setIsDiagnosticsMode(diagnosticsMode);
    
    try {
      // The mail service will use mock data in test mode or call the API
      const loggedInUser = await mailService.login(credentials, testMode);
      setUser(loggedInUser);
      logService.log(`User logged in: ${email} (Test: ${testMode}, Diagnostics: ${diagnosticsMode})`, 'System');
    } catch (error) {
      logService.log(`Login failed for ${email}: ${(error as Error).message}`, 'System');
      alert(`Login Failed: ${(error as Error).message}`);
      // Reset modes if login fails
      setIsTestMode(false);
      setIsDiagnosticsMode(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    logService.log(`User logged out: ${user?.email}`, 'System');
    setUser(null);
    setIsTestMode(false);
    setIsDiagnosticsMode(false);
  }, [user]);

  return (
    <div className="w-screen h-screen font-sans text-gray-800">
      {user ? (
        <MailClient 
          user={user} 
          onLogout={handleLogout} 
          isTestMode={isTestMode}
          isDiagnosticsMode={isDiagnosticsMode} 
        />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;