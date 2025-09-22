import { EMAILS, FOLDERS } from '../constants';
import type { Folder, Email, AuthCredentials, User } from '../types';
import { logService } from './logService';

// In a real app, this data would come from a server, and this `mockEmails`
// array wouldn't exist on the client.
let mockEmails: Email[] = JSON.parse(JSON.stringify(EMAILS)); // Deep copy to prevent mutation issues

const MOCK_API_DELAY = 150;

/**
 * Handles API responses, checking for errors and parsing JSON.
 * @param response The raw response from a fetch call.
 */
const handleResponse = async (response: Response) => {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || 'An unknown server error occurred.');
    }
    return response.json();
};


// --- API Functions ---

/**
 * Authenticates a user.
 * In live mode, it calls a backend API.
 * In test mode, it simulates a successful login.
 */
export const login = async (credentials: AuthCredentials, isTestMode: boolean): Promise<User> => {
    logService.log(`Attempting login for ${credentials.email}`, 'Service');
    if (isTestMode) {
        await new Promise(res => setTimeout(res, 500));
        const lowerCaseEmail = credentials.email.toLowerCase();
        const name = lowerCaseEmail === 'testikas@maantoa.ee' 
            ? 'Testikas' 
            : 'Test User';
        return { name, email: credentials.email };
    }

    // Real API call
    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    return handleResponse(response);
};

/**
 * Fetches the list of mail folders.
 */
export const getFolders = async (isTestMode: boolean): Promise<Folder[]> => {
  logService.log("Fetching folders...", 'Service');
  if (isTestMode) {
    await new Promise(res => setTimeout(res, MOCK_API_DELAY));
    return Promise.resolve(FOLDERS);
  }

  // Real API call
  const response = await fetch('/api/folders');
  return handleResponse(response);
};

/**
 * Fetches all emails for a specific folder.
 */
export const getEmailsForFolder = async (folderId: string, isTestMode: boolean): Promise<Email[]> => {
  logService.log(`Fetching emails for folder '${folderId}'`, 'Service');
  if (isTestMode) {
    await new Promise(res => setTimeout(res, 400));
    const filtered = mockEmails.filter((email) => email.folderId === folderId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return Promise.resolve(filtered);
  }

  // Real API call
  const response = await fetch(`/api/emails?folder=${folderId}`);
  return handleResponse(response);
};

/**
 * Updates an email's properties (e.g., marking as read).
 */
export const updateEmail = async (emailId: string, updates: Partial<Email>, isTestMode: boolean): Promise<Email> => {
    logService.log(`Updating email '${emailId}' with ${JSON.stringify(updates)}`, 'Service');
    if (isTestMode) {
        await new Promise(res => setTimeout(res, 50));
        const emailIndex = mockEmails.findIndex(e => e.id === emailId);
        if (emailIndex > -1) {
            mockEmails[emailIndex] = { ...mockEmails[emailIndex], ...updates };
            return Promise.resolve(mockEmails[emailIndex]);
        }
        return Promise.reject(new Error("Mock email not found"));
    }
    
    // Real API call
    const response = await fetch(`/api/emails/${emailId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    return handleResponse(response);
};

/**
 * Sends a new email.
 */
export const sendEmail = async (emailData: { to: string; subject: string; body: string }, isTestMode: boolean): Promise<{ success: boolean }> => {
    logService.log(`Sending email to '${emailData.to}'`, 'Service');
    if (isTestMode) {
        await new Promise(res => setTimeout(res, 600));
        // In test mode, we can just resolve successfully.
        // Or, we could add the sent email to the mock data.
        console.log('Mock email sent:', emailData);
        return Promise.resolve({ success: true });
    }

    // Real API call
    const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData),
    });
    return handleResponse(response);
};