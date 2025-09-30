import { Email, EmailFolder, EmailAccount, EmailAddress } from '../types/email';

class EmailService {
  private sessionId: string | null = null;
  private account: EmailAccount | null = null;
  private connected = false;
  private apiUrl = '/api';

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async connect(account: EmailAccount): Promise<void> {
    try {
      this.account = account;
      this.sessionId = this.generateSessionId();

      const response = await fetch(`${this.apiUrl}/imap/connect`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: account.email,
          password: account.password,
          sessionId: this.sessionId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to connect');
      }

      this.connected = true;
      console.log('✅ Connected to email server');
    } catch (error) {
      console.error('❌ Connection failed:', error);
      throw new Error('Failed to connect to email server. Please check your credentials.');
    }
  }

  async disconnect(): Promise<void> {
    if (this.sessionId && this.connected) {
      try {
        await fetch(`${this.apiUrl}/imap/disconnect`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId: this.sessionId }),
        });
        
        this.connected = false;
        this.sessionId = null;
        this.account = null;
        console.log('✅ Disconnected from email server');
      } catch (error) {
        console.error('❌ Disconnect error:', error);
      }
    }
  }

  async getFolders(): Promise<EmailFolder[]> {
    if (!this.sessionId || !this.connected) {
      throw new Error('Not connected to email server');
    }

    try {
      const response = await fetch(`${this.apiUrl}/imap/folders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: this.sessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch folders');
      }

      const data = await response.json();
      return data.folders;
    } catch (error) {
      console.error('❌ Failed to fetch folders:', error);
      throw new Error('Failed to fetch email folders');
    }
  }

  async getEmails(folderPath: string, limit: number = 50): Promise<Email[]> {
    if (!this.sessionId || !this.connected) {
      throw new Error('Not connected to email server');
    }

    try {
      const response = await fetch(`${this.apiUrl}/imap/emails`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          folder: folderPath,
          limit,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch emails');
      }

      const data = await response.json();
      return data.emails;
    } catch (error) {
      console.error('❌ Failed to fetch emails:', error);
      throw new Error('Failed to fetch emails from server');
    }
  }

  async sendEmail(
    to: string[],
    subject: string,
    body: string,
    cc?: string[],
    bcc?: string[],
    attachments?: File[]
  ): Promise<void> {
    if (!this.sessionId || !this.connected) {
      throw new Error('Not connected to email server');
    }

    try {
      const emailData = {
        to,
        subject,
        body,
        cc,
        bcc,
        attachments: attachments ? await this.processAttachments(attachments) : [],
      };

      const response = await fetch(`${this.apiUrl}/smtp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          emailData,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      console.log('✅ Email sent successfully');
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      throw new Error('Failed to send email. Please try again.');
    }
  }

  private async processAttachments(files: File[]): Promise<any[]> {
    const attachments = [];
    
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const base64 = btoa(
        new Uint8Array(arrayBuffer).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ''
        )
      );
      
      attachments.push({
        filename: file.name,
        content: base64,
        encoding: 'base64',
        contentType: file.type || 'application/octet-stream',
      });
    }
    
    return attachments;
  }

  async markAsRead(emailId: string, folder: string): Promise<void> {
    if (!this.sessionId || !this.connected) return;

    try {
      await fetch(`${this.apiUrl}/imap/mark-read`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          folder,
          uid: emailId,
        }),
      });
    } catch (error) {
      console.error('❌ Failed to mark as read:', error);
    }
  }

  async toggleStar(emailId: string, folder: string, isStarred: boolean): Promise<void> {
    if (!this.sessionId || !this.connected) return;

    try {
      await fetch(`${this.apiUrl}/imap/toggle-star`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          folder,
          uid: emailId,
          isStarred,
        }),
      });
    } catch (error) {
      console.error('❌ Failed to toggle star:', error);
    }
  }

  async deleteEmail(emailId: string, folder: string): Promise<void> {
    if (!this.sessionId || !this.connected) {
      throw new Error('Not connected to email server');
    }

    try {
      await fetch(`${this.apiUrl}/imap/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          folder,
          uid: emailId,
        }),
      });
    } catch (error) {
      console.error('❌ Failed to delete email:', error);
      throw new Error('Failed to delete email');
    }
  }

  async moveEmail(emailId: string, fromFolder: string, toFolder: string): Promise<void> {
    if (!this.sessionId || !this.connected) {
      throw new Error('Not connected to email server');
    }

    try {
      await fetch(`${this.apiUrl}/imap/move`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          fromFolder,
          uid: emailId,
          toFolder,
        }),
      });
    } catch (error) {
      console.error('❌ Failed to move email:', error);
      throw new Error('Failed to move email');
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  getAccount(): EmailAccount | null {
    return this.account;
  }
}

export const emailService = new EmailService();
