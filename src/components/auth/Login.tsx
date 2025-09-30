import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useEmailStore } from '../../store/emailStore';
import { emailService } from '../../services/emailService';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const { setFolders, setEmails, setCurrentFolder, setLoading } = useEmailStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Connect to email server
      await emailService.connect({ email, password });

      // Fetch folders
      const folders = await emailService.getFolders();
      setFolders(folders);

      // Fetch emails from INBOX
      const inboxFolder = folders.find(f => f.specialUse === 'inbox') || folders[0];
      if (inboxFolder) {
        setCurrentFolder(inboxFolder.path);
        setLoading(true);
        const emails = await emailService.getEmails(inboxFolder.path);
        setEmails(emails);
        setLoading(false);
      }

      // Login successful
      login({ email, password });
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to email server');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-veebimajutus-orange via-veebimajutus-lightorange to-veebimajutus-darkorange flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-xl mb-4">
            <Mail className="w-10 h-10 text-veebimajutus-orange" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Veebimajutus Webmail</h1>
          <p className="text-white/90 text-lg">Sign in to your email account</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-veebimajutus-orange focus:border-transparent transition-all"
                  placeholder="you@veebimajutus.ee"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-veebimajutus-orange focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-veebimajutus-orange to-veebimajutus-darkorange text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Server: <span className="font-semibold">mail.veebimajutus.ee</span>
            </p>
            <p className="text-center text-xs text-gray-500 mt-1">
              IMAP: 993 (SSL) • SMTP: 465 (SSL)
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/80 text-sm mt-6">
          © 2024 Veebimajutus.ee • Secure Email Access
        </p>
      </div>
    </div>
  );
};
