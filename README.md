# Veebimajutus Webmail Client

Modern, full-featured webmail client with **production-ready** IMAP/SMTP support.

## ✅ Maintained Libraries

- **node-imap** (1.5k+ stars) - Stable IMAP client
- **nodemailer** (16k+ stars) - Industry-standard SMTP client
- **mailparser** (actively maintained) - Robust MIME parsing
- **express** - REST API backend
- **React + TypeScript** - Modern frontend

## Features

- ✅ Real IMAP/SMTP integration with mail.veebimajutus.ee
- ✅ Beautiful, responsive UI with orange branding
- ✅ Email reading, composing, and management
- ✅ Advanced search and filtering
- ✅ Draft auto-save
- ✅ Attachment support
- ✅ Mobile-responsive design
- ✅ Dark mode support
- ✅ **Production-ready backend architecture**

## Quick Start

### 1. Install All Dependencies

```bash
npm run install:all
```

This installs dependencies for both frontend and backend.

### 2. Start Development (Single Command!)

```bash
npm run dev
```

This starts **both** servers concurrently:
- 🔧 Backend API server on `http://localhost:3001`
- 🎨 Frontend dev server on `http://localhost:5173`

### Alternative: Start Servers Separately

**Backend only:**
```bash
npm run dev:server
```

**Frontend only:**
```bash
npm run dev:client
```

## Architecture

### Backend (Node.js + Express)
- **IMAP Service**: Handles all mailbox operations
- **SMTP Service**: Sends emails via nodemailer
- **Session Management**: Maintains IMAP connections per user
- **REST API**: Clean endpoints for all operations

### Frontend (React + TypeScript)
- **Service Layer**: Communicates with backend API
- **State Management**: Zustand for email state
- **Components**: Modular, reusable UI components
- **Styling**: Tailwind CSS with custom branding

## Server Configuration

- **IMAP Server**: mail.veebimajutus.ee:993 (SSL/TLS)
- **SMTP Server**: mail.veebimajutus.ee:465 (SSL/TLS)
- **Backend API**: localhost:3001
- **Frontend Dev**: localhost:5173

## API Endpoints

- `POST /api/imap/connect` - Connect to IMAP server
- `POST /api/imap/disconnect` - Disconnect from IMAP
- `POST /api/imap/folders` - Get folder list
- `POST /api/imap/emails` - Get emails from folder
- `POST /api/imap/mark-read` - Mark email as read
- `POST /api/imap/toggle-star` - Toggle star flag
- `POST /api/imap/delete` - Delete email
- `POST /api/imap/move` - Move email to folder
- `POST /api/smtp/send` - Send email

## Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both backend and frontend |
| `npm run dev:server` | Start backend only |
| `npm run dev:client` | Start frontend only |
| `npm run install:all` | Install all dependencies |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

## Security Notes

⚠️ **Production Deployment**:
- Use HTTPS for all connections
- Implement proper authentication (JWT, OAuth)
- Add rate limiting
- Use environment variables for configuration
- Implement session expiration
- Add request validation
- Enable CORS properly
- Use secure session storage

## Development

The app uses a clean service layer architecture:
- `server/imap.js` - IMAP operations (node-imap)
- `server/smtp.js` - SMTP operations (nodemailer)
- `server/index.js` - Express API server
- `src/services/emailService.ts` - Frontend API client
- `src/store/emailStore.ts` - Email state management
- `src/store/authStore.ts` - Authentication state

## Why This Architecture?

✅ **Maintained Libraries**: All dependencies actively maintained
✅ **Security**: Credentials never exposed to browser
✅ **Scalability**: Easy to add features and scale
✅ **Best Practices**: Industry-standard patterns
✅ **Production-Ready**: Suitable for real deployment

## Migration from Deprecated Libraries

**Removed**:
- ❌ emailjs-imap-client (deprecated)
- ❌ emailjs-mime-builder (deprecated)
- ❌ emailjs-tcp-socket (deprecated)
- ❌ emailjs-mime-types (deprecated)

**Replaced with**:
- ✅ node-imap (stable, maintained)
- ✅ nodemailer (industry standard)
- ✅ mailparser (actively maintained)

## Troubleshooting

### Port Already in Use

If you see "Port 3001 already in use":
```bash
# Find and kill the process
lsof -ti:3001 | xargs kill -9
```

### Backend Not Connecting

1. Check if backend is running: `curl http://localhost:3001`
2. Check server logs in the terminal
3. Verify mail.veebimajutus.ee is accessible

### Frontend API Errors

1. Ensure backend is running first
2. Check browser console for errors
3. Verify CORS is enabled in server/index.js
