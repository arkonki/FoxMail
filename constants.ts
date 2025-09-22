
import type { Folder, Email } from './types';
import { InboxIcon, SentIcon, DraftsIcon, SpamIcon, TrashIcon, StarIcon } from './components/icons';

export const FOLDERS: Folder[] = [
  { id: 'inbox', name: 'Inbox', icon: InboxIcon },
  { id: 'starred', name: 'Starred', icon: StarIcon },
  { id: 'sent', name: 'Sent', icon: SentIcon },
  { id: 'drafts', name: 'Drafts', icon: DraftsIcon },
  { id: 'spam', name: 'Spam', icon: SpamIcon },
  { id: 'trash', name: 'Trash', icon: TrashIcon },
];

export const EMAILS: Email[] = [
  {
    id: '1',
    folderId: 'inbox',
    sender: 'GitHub',
    senderEmail: 'noreply@github.com',
    recipient: 'you@veebimajutus.ee',
    subject: '[react-project] A new issue was created (#135)',
    body: `
      <p>Hi there,</p>
      <p>A new issue has been created in the <strong>react-project</strong> repository:</p>
      <ul>
        <li><strong>Title:</strong> UI Bug on Mobile View</li>
        <li><strong>Author:</strong> JaneDoe</li>
        <li><strong>Status:</strong> Open</li>
      </ul>
      <p>You can view the issue details here: <a href="#" class="text-primary">#135</a></p>
      <p>Thanks,<br/>The GitHub Team</p>
    `,
    timestamp: '2024-07-29T10:30:00Z',
    read: false,
    avatar: 'https://picsum.photos/seed/github/40/40',
  },
  {
    id: '2',
    folderId: 'inbox',
    sender: 'Vercel',
    senderEmail: 'notifications@vercel.com',
    recipient: 'you@veebimajutus.ee',
    subject: 'Deployment "my-portfolio" is complete!',
    body: `
      <p>Your deployment for the project <strong>my-portfolio</strong> is now ready.</p>
      <p>You can preview it here: <a href="#" class="text-primary">https://my-portfolio-xyz.vercel.app</a></p>
      <p>The deployment completed successfully and is now aliased to your production domain.</p>
      <p>Best,<br/>The Vercel Team</p>
    `,
    timestamp: '2024-07-29T09:15:00Z',
    read: true,
    avatar: 'https://picsum.photos/seed/vercel/40/40',
  },
    {
    id: '3',
    folderId: 'inbox',
    sender: 'Figma',
    senderEmail: 'team@figma.com',
    recipient: 'you@veebimajutus.ee',
    subject: 'John Doe invited you to a new project',
    body: `
      <p>Hey!</p>
      <p><strong>John Doe</strong> has invited you to collaborate on the "Q3 Marketing Campaign" project in Figma.</p>
      <p>Click the button below to join the team and start designing.</p>
      <a href="#" class="inline-block bg-primary text-white px-4 py-2 rounded-md">Open in Figma</a>
      <p>Happy designing!</p>
    `,
    timestamp: '2024-07-28T14:00:00Z',
    read: true,
    avatar: 'https://picsum.photos/seed/figma/40/40',
  },
  {
    id: '4',
    folderId: 'sent',
    sender: 'You',
    senderEmail: 'you@veebimajutus.ee',
    recipient: 'client@example.com',
    subject: 'Re: Project Update',
    body: `
      <p>Hi Team,</p>
      <p>Just wanted to follow up on the project update. The new mockups are attached for your review.</p>
      <p>Let me know your thoughts.</p>
      <p>Best regards</p>
    `,
    timestamp: '2024-07-28T11:05:00Z',
    read: true,
    avatar: 'https://picsum.photos/seed/you/40/40',
  },
  {
    id: '5',
    folderId: 'drafts',
    sender: 'You',
    senderEmail: 'you@veebimajutus.ee',
    recipient: 'hr@company.com',
    subject: 'Vacation Request',
    body: `<p>I would like to request time off from...</p>`,
    timestamp: '2024-07-29T11:00:00Z',
    read: true,
    avatar: 'https://picsum.photos/seed/you/40/40',
  },
    {
    id: '6',
    folderId: 'spam',
    sender: 'Free Prizes',
    senderEmail: 'win@spam.com',
    recipient: 'you@veebimajutus.ee',
    subject: 'You have won a new car!',
    body: `<p>Click here to claim your prize!</p>`,
    timestamp: '2024-07-27T18:30:00Z',
    read: true,
    avatar: 'https://picsum.photos/seed/spam/40/40',
  },
];
