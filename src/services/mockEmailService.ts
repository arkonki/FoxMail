import { Email, EmailFolder, EmailAccount } from '../types/email';

class MockEmailService {
  private connected = false;
  private account: EmailAccount | null = null;

  async connect(account: EmailAccount): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    this.account = account;
    this.connected = true;
  }

  async disconnect(): Promise<void> {
    this.connected = false;
    this.account = null;
  }

  async getFolders(): Promise<EmailFolder[]> {
    return [
      { name: 'Inbox', path: 'INBOX', specialUse: 'inbox', unreadCount: 3 },
      { name: 'Sent', path: 'SENT', specialUse: 'sent', unreadCount: 0 },
      { name: 'Drafts', path: 'DRAFTS', specialUse: 'drafts', unreadCount: 1 },
      { name: 'Trash', path: 'TRASH', specialUse: 'trash', unreadCount: 0 },
      { name: 'Junk', path: 'JUNK', specialUse: 'junk', unreadCount: 0 },
    ];
  }

  async getEmails(folder: string): Promise<Email[]> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const mockEmails: Email[] = [
      {
        id: '1',
        from: [{ name: 'Sarah Johnson', address: 'sarah@example.com' }],
        to: [{ address: this.account?.email || 'you@veebimajutus.ee' }],
        subject: 'Q4 Marketing Strategy Review',
        body: {
          text: 'Hi team, I wanted to share our Q4 marketing strategy...',
          html: '<p>Hi team,</p><p>I wanted to share our Q4 marketing strategy and get your feedback on the proposed campaigns.</p><p>Key highlights:</p><ul><li>Social media expansion</li><li>Email marketing automation</li><li>Content marketing focus</li></ul><p>Please review and share your thoughts.</p><p>Best regards,<br>Sarah</p>',
        },
        date: new Date().toISOString(),
        isRead: false,
        isStarred: true,
        attachments: [
          {
            filename: 'Q4-Strategy.pdf',
            contentType: 'application/pdf',
            size: 245678,
          },
        ],
        preview: 'Hi team, I wanted to share our Q4 marketing strategy and get your feedback...',
      },
      {
        id: '2',
        from: [{ name: 'Michael Chen', address: 'michael@techcorp.com' }],
        to: [{ address: this.account?.email || 'you@veebimajutus.ee' }],
        subject: 'Project Timeline Update',
        body: {
          text: 'Hello, Quick update on the project timeline...',
          html: '<p>Hello,</p><p>Quick update on the project timeline. We are on track to meet the deadline, but there are a few items that need attention:</p><ol><li>API integration testing</li><li>UI/UX review</li><li>Security audit</li></ol><p>Let me know if you have any questions.</p><p>Thanks,<br>Michael</p>',
        },
        date: new Date(Date.now() - 3600000).toISOString(),
        isRead: false,
        isStarred: false,
        attachments: [],
        preview: 'Quick update on the project timeline. We are on track to meet the deadline...',
      },
      {
        id: '3',
        from: [{ name: 'Emma Wilson', address: 'emma@design.studio' }],
        to: [{ address: this.account?.email || 'you@veebimajutus.ee' }],
        subject: 'New Design Mockups Ready',
        body: {
          text: 'Hi! The new design mockups are ready for review...',
          html: '<p>Hi!</p><p>The new design mockups are ready for review. I have incorporated all the feedback from our last meeting.</p><p>Changes include:</p><ul><li>Updated color scheme</li><li>Improved navigation</li><li>Mobile-responsive layouts</li></ul><p>Looking forward to your feedback!</p><p>Cheers,<br>Emma</p>',
        },
        date: new Date(Date.now() - 7200000).toISOString(),
        isRead: false,
        isStarred: false,
        attachments: [
          {
            filename: 'mockups-v2.zip',
            contentType: 'application/zip',
            size: 1234567,
          },
        ],
        preview: 'The new design mockups are ready for review. I have incorporated all the feedback...',
      },
      {
        id: '4',
        from: [{ name: 'David Park', address: 'david@startup.io' }],
        to: [{ address: this.account?.email || 'you@veebimajutus.ee' }],
        subject: 'Meeting Notes - Product Roadmap',
        body: {
          text: 'Thanks for joining the meeting today...',
          html: '<p>Thanks for joining the meeting today. Here are the key takeaways:</p><ul><li>Launch date confirmed for Q1 2025</li><li>Feature prioritization completed</li><li>Resource allocation approved</li></ul><p>Action items have been assigned in the project tracker.</p><p>Best,<br>David</p>',
        },
        date: new Date(Date.now() - 86400000).toISOString(),
        isRead: true,
        isStarred: false,
        attachments: [],
        preview: 'Thanks for joining the meeting today. Here are the key takeaways from our discussion...',
      },
      {
        id: '5',
        from: [{ name: 'Lisa Anderson', address: 'lisa@consulting.com' }],
        to: [{ address: this.account?.email || 'you@veebimajutus.ee' }],
        subject: 'Invoice #2024-001',
        body: {
          text: 'Please find attached the invoice for services rendered...',
          html: '<p>Dear Client,</p><p>Please find attached the invoice for services rendered in December 2024.</p><p>Payment terms: Net 30 days</p><p>If you have any questions, please do not hesitate to contact me.</p><p>Best regards,<br>Lisa Anderson</p>',
        },
        date: new Date(Date.now() - 172800000).toISOString(),
        isRead: true,
        isStarred: true,
        attachments: [
          {
            filename: 'invoice-2024-001.pdf',
            contentType: 'application/pdf',
            size: 89456,
          },
        ],
        preview: 'Please find attached the invoice for services rendered in December 2024...',
      },
    ];

    return mockEmails;
  }

  async sendEmail(
    to: string[],
    subject: string,
    body: string,
    cc?: string[],
    bcc?: string[]
  ): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Email sent:', { to, subject, body, cc, bcc });
  }
}

export const emailService = new MockEmailService();
