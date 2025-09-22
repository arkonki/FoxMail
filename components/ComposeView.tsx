import React, { useState } from 'react';
import { CloseIcon } from './icons';
import * as mailService from '../services/mailService';
import { logService } from '../services/logService';


interface ComposeViewProps {
  onClose: () => void;
  isTestMode: boolean;
}

const ComposeView: React.FC<ComposeViewProps> = ({ onClose, isTestMode }) => {
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!to || !subject) {
      alert("Please fill in the 'To' and 'Subject' fields.");
      return;
    }
    
    setIsSending(true);
    logService.log(`Attempting to send email to: ${to}`, 'UI');
    
    try {
      await mailService.sendEmail({ to, subject, body }, isTestMode);
      alert(`Email sent successfully to: ${to}`);
      logService.log(`Email successfully sent to: ${to}`, 'Service');
      onClose();
    } catch (error) {
      logService.log(`Failed to send email: ${(error as Error).message}`, 'Service');
      alert(`Failed to send email: ${(error as Error).message}`);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl animate-slide-up flex flex-col">
        <header className="flex items-center justify-between p-4 bg-gray-800 text-white rounded-t-lg">
          <h2 className="text-lg font-semibold">New Message</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700" disabled={isSending}>
            <CloseIcon className="w-6 h-6" />
          </button>
        </header>
        <div className="p-4 space-y-3 flex-grow">
          <input
            type="email"
            placeholder="To"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-primary bg-white"
            disabled={isSending}
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border-b border-gray-300 focus:outline-none focus:border-primary bg-white"
            disabled={isSending}
          />
          <div className="relative">
             <textarea
                placeholder="Compose your email..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full h-64 p-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                disabled={isSending}
             />
          </div>
        </div>
        <footer className="flex items-center justify-end p-4 bg-gray-100 rounded-b-lg border-t">
          <button
            onClick={handleSend}
            className="px-6 py-2 font-semibold text-white bg-primary rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Send'}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default ComposeView;