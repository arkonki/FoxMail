import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Paperclip, Image as ImageIcon, Smile, Minimize2, Maximize2, Upload, XCircle } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { emailService } from '../../services/mockEmailService';
import { Draft } from '../../types/email';

export const ComposeModal: React.FC = () => {
  const { closeCompose, currentDraft, saveDraft, clearDraft } = useUIStore();
  const [to, setTo] = useState('');
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [sending, setSending] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const autoSaveTimerRef = useRef<NodeJS.Timeout>();

  // Load draft on mount
  useEffect(() => {
    if (currentDraft) {
      setTo(currentDraft.to);
      setCc(currentDraft.cc);
      setBcc(currentDraft.bcc);
      setSubject(currentDraft.subject);
      setBody(currentDraft.body);
      setAttachments(currentDraft.attachments);
      setShowCc(!!currentDraft.cc);
      setShowBcc(!!currentDraft.bcc);
    }
  }, [currentDraft]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (to || subject || body) {
      autoSaveTimerRef.current = setInterval(() => {
        const draft: Draft = {
          id: currentDraft?.id || `draft-${Date.now()}`,
          to,
          cc,
          bcc,
          subject,
          body,
          attachments,
          savedAt: new Date().toISOString(),
        };
        saveDraft(draft);
        setLastSaved(new Date());
      }, 30000);
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [to, cc, bcc, subject, body, attachments, currentDraft, saveDraft]);

  const handleSend = async () => {
    setSending(true);
    try {
      await emailService.sendEmail(
        to.split(',').map(e => e.trim()),
        subject,
        body,
        cc ? cc.split(',').map(e => e.trim()) : undefined,
        bcc ? bcc.split(',').map(e => e.trim()) : undefined
      );
      clearDraft();
      closeCompose();
    } catch (error) {
      console.error('Failed to send email:', error);
    } finally {
      setSending(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setAttachments([...attachments, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  if (minimized) {
    return (
      <div className="fixed bottom-0 right-4 md:right-20 bg-white dark:bg-gray-800 w-64 md:w-80 shadow-lg rounded-t-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between p-2 z-50">
        <span className="font-semibold text-sm text-gray-900 dark:text-white truncate pl-2">
          {subject || 'New Message'}
        </span>
        <div className="flex items-center">
          <button
            onClick={() => setMinimized(false)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            aria-label="Maximize"
          >
            <Maximize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={closeCompose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 md:inset-auto md:bottom-0 md:right-4 lg:right-20 bg-white dark:bg-gray-800 md:w-[90vw] md:max-w-[550px] md:h-[580px] md:shadow-2xl md:rounded-t-lg border-t md:border border-gray-200 dark:border-gray-700 flex flex-col z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-2 bg-gray-50 dark:bg-gray-700 md:rounded-t-lg border-b md:border-b-0 border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-2">
          <h3 className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">New Message</h3>
          {lastSaved && (
            <span className="hidden md:inline text-xs text-gray-500 dark:text-gray-400">
              Saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setMinimized(true)}
            className="hidden md:block p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            aria-label="Minimize"
          >
            <Minimize2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={closeCompose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Form */}
      <div
        className="flex-1 overflow-y-auto"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isDragging && (
          <div className="absolute inset-0 bg-veebimajutus-orange/10 border-2 border-dashed border-veebimajutus-orange rounded-lg flex items-center justify-center z-10">
            <div className="text-center">
              <Upload className="w-12 h-12 text-veebimajutus-orange mx-auto mb-2" />
              <p className="text-veebimajutus-orange font-semibold">Drop files to attach</p>
            </div>
          </div>
        )}

        <div className="p-4 space-y-3">
          {/* To */}
          <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12 md:w-16 flex-shrink-0">
              To
            </label>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Recipients"
              className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-sm md:text-base"
            />
            <div className="flex items-center space-x-2 ml-2">
              {!showCc && (
                <button
                  onClick={() => setShowCc(true)}
                  className="text-xs md:text-sm text-veebimajutus-orange hover:underline"
                >
                  Cc
                </button>
              )}
              {!showBcc && (
                <button
                  onClick={() => setShowBcc(true)}
                  className="text-xs md:text-sm text-veebimajutus-orange hover:underline"
                >
                  Bcc
                </button>
              )}
            </div>
          </div>

          {/* Cc */}
          {showCc && (
            <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12 md:w-16 flex-shrink-0">
                Cc
              </label>
              <input
                type="text"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="Carbon copy"
                className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-sm md:text-base"
              />
            </div>
          )}

          {/* Bcc */}
          {showBcc && (
            <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-3">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12 md:w-16 flex-shrink-0">
                Bcc
              </label>
              <input
                type="text"
                value={bcc}
                onChange={(e) => setBcc(e.target.value)}
                placeholder="Blind carbon copy"
                className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-sm md:text-base"
              />
            </div>
          )}

          {/* Subject */}
          <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12 md:w-16 flex-shrink-0">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Email subject"
              className="flex-1 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-sm md:text-base"
            />
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="space-y-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <Paperclip className="w-4 h-4 text-veebimajutus-orange flex-shrink-0" />
                    <span className="text-sm text-gray-900 dark:text-white truncate">{file.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                      ({(file.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <button
                    onClick={() => removeAttachment(index)}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors flex-shrink-0"
                  >
                    <XCircle className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Body */}
          <div className="pt-2">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message..."
              rows={attachments.length > 0 ? 6 : 10}
              className="w-full bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none resize-none text-sm md:text-base"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3 md:p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 md:space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Attach files"
            >
              <Paperclip className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="hidden md:block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" aria-label="Insert images">
              <ImageIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <button className="hidden md:block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" aria-label="Insert emoji">
              <Smile className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={closeCompose}
              className="hidden md:block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm"
            >
              Discard
            </button>
            <button
              onClick={handleSend}
              disabled={sending || !to || !subject}
              className="flex items-center space-x-2 px-4 md:px-6 py-2 bg-gradient-to-r from-veebimajutus-orange to-veebimajutus-darkorange text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm md:text-base"
            >
              <Send className="w-4 h-4" />
              <span>{sending ? 'Sending...' : 'Send'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
