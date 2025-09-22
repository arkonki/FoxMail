// Fix: Import React to resolve `React.ComponentType` type error.
import React from 'react';

export interface User {
  name: string;
  email: string;
}

export interface AuthCredentials {
  email: string;
  password?: string;
}

export interface Folder {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface Email {
  id: string;
  folderId: string;
  sender: string;
  senderEmail: string;
  recipient: string;
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
  avatar: string;
}

export type LogCategory = 'System' | 'UI' | 'Service';

export interface LogEntry {
  timestamp: Date;
  message: string;
  category: LogCategory;
}