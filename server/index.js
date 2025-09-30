import express from 'express';
import cors from 'cors';
import { ImapService } from './imap.js';
import { sendEmail } from './smtp.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Store active IMAP connections per session
const imapSessions = new Map();

// Connect to IMAP
app.post('/api/imap/connect', async (req, res) => {
  try {
    console.log('🔌 Connect request received:', { email: req.body.email, sessionId: req.body.sessionId });
    const { email, password, sessionId } = req.body;
    
    const imapService = new ImapService();
    await imapService.connect({ email, password });
    
    imapSessions.set(sessionId, { imapService, account: { email, password } });
    console.log('✅ Session created:', sessionId);
    
    res.json({ success: true });
  } catch (error) {
    console.error('❌ IMAP connect error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Disconnect from IMAP
app.post('/api/imap/disconnect', async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = imapSessions.get(sessionId);
    
    if (session) {
      session.imapService.disconnect();
      imapSessions.delete(sessionId);
      console.log('📪 Session disconnected:', sessionId);
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('❌ IMAP disconnect error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get folders
app.post('/api/imap/folders', async (req, res) => {
  try {
    console.log('📁 Folders request:', req.body.sessionId);
    const { sessionId } = req.body;
    const session = imapSessions.get(sessionId);
    
    if (!session) {
      console.error('❌ No session found:', sessionId);
      return res.status(401).json({ error: 'Not connected' });
    }
    
    const folders = await session.imapService.getFolders();
    console.log('✅ Folders retrieved:', folders.length);
    res.json({ folders });
  } catch (error) {
    console.error('❌ Get folders error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get emails
app.post('/api/imap/emails', async (req, res) => {
  try {
    console.log('📧 Emails request:', { sessionId: req.body.sessionId, folder: req.body.folder, limit: req.body.limit });
    const { sessionId, folder, limit } = req.body;
    const session = imapSessions.get(sessionId);
    
    if (!session) {
      console.error('❌ No session found:', sessionId);
      return res.status(401).json({ error: 'Not connected' });
    }
    
    console.log('🔍 Fetching emails from folder:', folder);
    const emails = await session.imapService.getEmails(folder, limit);
    console.log('✅ Emails retrieved:', emails.length);
    res.json({ emails });
  } catch (error) {
    console.error('❌ Get emails error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mark as read
app.post('/api/imap/mark-read', async (req, res) => {
  try {
    const { sessionId, folder, uid } = req.body;
    const session = imapSessions.get(sessionId);
    
    if (!session) {
      return res.status(401).json({ error: 'Not connected' });
    }
    
    await session.imapService.markAsRead(folder, uid);
    console.log('✅ Marked as read:', uid);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Mark read error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Toggle star
app.post('/api/imap/toggle-star', async (req, res) => {
  try {
    const { sessionId, folder, uid, isStarred } = req.body;
    const session = imapSessions.get(sessionId);
    
    if (!session) {
      return res.status(401).json({ error: 'Not connected' });
    }
    
    await session.imapService.toggleStar(folder, uid, isStarred);
    console.log('✅ Toggled star:', uid);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Toggle star error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete email
app.post('/api/imap/delete', async (req, res) => {
  try {
    const { sessionId, folder, uid } = req.body;
    const session = imapSessions.get(sessionId);
    
    if (!session) {
      return res.status(401).json({ error: 'Not connected' });
    }
    
    await session.imapService.deleteEmail(folder, uid);
    console.log('✅ Deleted email:', uid);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Move email
app.post('/api/imap/move', async (req, res) => {
  try {
    const { sessionId, fromFolder, uid, toFolder } = req.body;
    const session = imapSessions.get(sessionId);
    
    if (!session) {
      return res.status(401).json({ error: 'Not connected' });
    }
    
    await session.imapService.moveEmail(fromFolder, uid, toFolder);
    console.log('✅ Moved email:', uid, 'to', toFolder);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Move error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send email
app.post('/api/smtp/send', async (req, res) => {
  try {
    const { sessionId, emailData } = req.body;
    const session = imapSessions.get(sessionId);
    
    if (!session) {
      return res.status(401).json({ error: 'Not connected' });
    }
    
    await sendEmail(session.account, emailData);
    console.log('✅ Email sent to:', emailData.to);
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Send email error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Email server running on port ${PORT}`);
  console.log(`📧 Using maintained libraries:`);
  console.log(`   - node-imap (IMAP client)`);
  console.log(`   - nodemailer (SMTP client)`);
  console.log(`   - mailparser (MIME parsing)`);
  console.log(`\n🔍 Debug logging enabled`);
});
