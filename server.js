const express = require('express');
const cors = require('cors');
const imaps = require('imap-simple');
const nodemailer = require('nodemailer');
const { simpleParser } = require('mailparser');

const app = express();
app.use(cors()); // Allow requests from your frontend
app.use(express.json()); // Allow parsing of JSON request bodies

const PORT = process.env.PORT || 3003;

// --- IMAP/SMTP Configuration ---
// IMPORTANT: In a real production environment, you would use environment variables
// for host, user, and password, not hardcoded strings.
const IMAP_CONFIG = {
    imap: {
        user: '', // This will be set by the user's login
        password: '', // This will be set by the user's login
        host: 'mail.veebimajutus.ee',
        port: 993,
        tls: true,
        authTimeout: 5000,
        tlsOptions: {
            rejectUnauthorized: false
        }
    }
};

// Map frontend folder ID to IMAP box name
const folderNameMapping = {
    inbox: 'INBOX',
    sent: 'Sent',
    drafts: 'Drafts',
    spam: 'Junk',
    trash: 'Trash'
};

// --- API Endpoints ---

// POST /api/login
// Attempts to authenticate by opening an IMAP connection.
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    console.log(`Attempting login for: ${email}`);

    const config = JSON.parse(JSON.stringify(IMAP_CONFIG)); // Deep copy
    config.imap.user = email;
    config.imap.password = password;

    try {
        const connection = await imaps.connect(config);
        console.log(`Login successful for: ${email}`);
        await connection.end();
        // In a real app, you'd create a JWT or session here for security.
        // For simplicity, we just confirm login was successful.
        res.json({ name: email.split('@')[0], email: email });
    } catch (error) {
        console.error(`Login failed for ${email}:`, error.message);
        res.status(401).json({ message: 'Invalid credentials or connection error.' });
    }
});


// POST /api/folders
// Fetches the list of mail folders (mailboxes).
app.post('/api/folders', async (req, res) => {
    const { email, password } = req.body; // Pass credentials with each request
    console.log(`Fetching folders for: ${email}`);

    const config = JSON.parse(JSON.stringify(IMAP_CONFIG));
    config.imap.user = email;
    config.imap.password = password;

    try {
        const connection = await imaps.connect(config);
        const boxes = await connection.getBoxes();
        await connection.end();

        // Map IMAP folder names to the frontend's expected format
        const folderMapping = {
            'INBOX': { id: 'inbox', name: 'Inbox' },
            'Sent': { id: 'sent', name: 'Sent' },
            'Drafts': { id: 'drafts', name: 'Drafts' },
            'Junk': { id: 'spam', name: 'Spam' },
            'Trash': { id: 'trash', name: 'Trash' },
        };
        
        const folders = Object.keys(boxes.children).map(name => {
             return folderMapping[name] || null;
        }).filter(Boolean); // Filter out nulls for folders we don't map
        
        // Ensure standard folders are present even if empty
        if (!folders.find(f => f.id === 'inbox')) folders.unshift(folderMapping['INBOX']);
        
        res.json(folders);

    } catch (error) {
        console.error('Error fetching folders:', error.message);
        res.status(500).json({ message: 'Could not fetch folders.' });
    }
});

// POST /api/emails
// Fetches emails for a given folder, or a single email if a UID is provided.
app.post('/api/emails', async (req, res) => {
    const { email, password, folderId, uid } = req.body;
    
    const boxName = folderNameMapping[folderId] || 'INBOX';

    const config = JSON.parse(JSON.stringify(IMAP_CONFIG));
    config.imap.user = email;
    config.imap.password = password;
    
    let connection;
    try {
        connection = await imaps.connect(config);
        await connection.openBox(boxName);

        if (uid) {
            // --- Fetch a single, specific email ---
            console.log(`Fetching single email UID ${uid} in '${boxName}' for user: ${email}`);
            const messages = await connection.search([['UID', uid]], { bodies: [''] });
            
            if (!messages || messages.length === 0) {
                return res.status(404).json({ message: 'Email not found.' });
            }

            const message = messages[0];
            const rawBody = message.parts.find(p => p.which === '').body;
            const parsed = await simpleParser(rawBody);

            let recipientText = '';
            if (parsed.to) {
                recipientText = Array.isArray(parsed.to.value)
                    ? parsed.to.value.map(addr => addr.name || addr.address).join(', ')
                    : parsed.to.text;
            }

            const emailData = {
                id: message.attributes.uid,
                folderId: folderId,
                sender: parsed.from?.text || 'Unknown Sender',
                senderEmail: parsed.from?.value[0]?.address || '',
                recipient: recipientText,
                subject: parsed.subject || 'No Subject',
                body: parsed.html || parsed.textAsHtml,
                timestamp: parsed.date ? parsed.date.toISOString() : new Date().toISOString(),
                read: message.attributes.flags.includes('\\Seen'),
                avatar: `https://picsum.photos/seed/${parsed.from?.value[0]?.address?.split('@')[0] || 'avatar'}/40/40`
            };
            
            res.json(emailData);

        } else {
            // --- Fetch a list of emails (summary) ---
            console.log(`Fetching email list for folder '${boxName}' for user: ${email}`);
            const searchCriteria = ['ALL'];
            const fetchOptions = {
                bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
                markSeen: false,
                struct: true
            };
            const messages = await connection.search(searchCriteria, fetchOptions);
            
            const emails = await Promise.all(messages.map(async (item) => {
                const parsedText = await simpleParser(item.parts.find(p => p.which === 'TEXT').body);
                const header = item.parts.find(p => p.which.includes('HEADER')).body;
                
                return {
                    id: item.attributes.uid,
                    folderId: folderId,
                    sender: header.from ? header.from[0] : 'Unknown Sender',
                    senderEmail: header.from ? header.from[0] : '', // Simplified for list view
                    recipient: header.to ? header.to.join(', ') : '',
                    subject: header.subject ? header.subject[0] : 'No Subject',
                    body: (parsedText.text || '').substring(0, 100), // Snippet for list view
                    timestamp: header.date ? header.date[0] : new Date().toISOString(),
                    read: item.attributes.flags.includes('\\Seen'),
                    avatar: `https://picsum.photos/seed/${header.from ? header.from[0].split('@')[0] : 'avatar'}/40/40`
                };
            }));
            
            res.json(emails.reverse()); // Show newest first
        }
    } catch (error) {
        console.error(`Error fetching emails for ${boxName}:`, error);
        res.status(500).json({ message: `Could not fetch emails from ${boxName}.` });
    } finally {
        if (connection && connection.state !== 'disconnected') {
            await connection.end();
        }
    }
});

// POST /api/send
// Sends an email using Nodemailer and SMTP.
app.post('/api/send', async (req, res) => {
    const { email, password, to, subject, body } = req.body;
    console.log(`Sending email from ${email} to ${to}`);

    let transporter = nodemailer.createTransport({
        host: "mail.veebimajutus.ee",
        port: 465, // Use 465 for SSL
        secure: true, // true for 465, false for other ports
        auth: {
            user: email,
            pass: password,
        },
    });

    try {
        await transporter.sendMail({
            from: `"${email}" <${email}>`,
            to: to,
            subject: subject,
            html: body,
        });
        
        // Optional: Also save the sent email to the 'Sent' folder via IMAP
        // This makes the client experience much better.
        const config = JSON.parse(JSON.stringify(IMAP_CONFIG));
        config.imap.user = email;
        config.imap.password = password;
        const connection = await imaps.connect(config);
        const rawMessage = `From: ${email}\nTo: ${to}\nSubject: ${subject}\n\n${body}`;
        await connection.append(rawMessage, { mailbox: 'Sent' });
        await connection.end();

        console.log("Email sent and saved to Sent folder successfully.");
        res.json({ success: true });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send email." });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Webmail server listening on http://localhost:${PORT}`);
});