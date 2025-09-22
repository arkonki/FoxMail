# Webmail Client for Veebimajutus.ee

This is a modern, single-page webmail client built with React and Tailwind CSS for the frontend, and a dedicated Node.js backend to securely connect to `mail.veebimajutus.ee` IMAP and SMTP servers.

The application provides a clean, responsive, and intuitive interface for managing emails, designed to be both fast and easy to use.

![Webmail Client Screenshot](https://i.imgur.com/8a3zL4B.png)

---

## Key Features

- **Secure Authentication**: Securely log in with `mail.veebimajutus.ee` credentials.
- **Full Email Functionality**:
  - **Folder Sync**: Automatically fetches and displays mail folders (Inbox, Sent, Trash, etc.).
  - **Email Retrieval**: View email lists with read/unread status, sender, subject, and timestamps.
  - **Read Emails**: View full HTML email content in a dedicated panel.
  - **Compose & Send**: A full-featured composer to write and send emails, which are then automatically saved to the "Sent" folder.
- **Responsive Design**: A seamless experience across desktop and mobile devices.
- **Dual-Mode System for Development**:
  - **Live Mode**: The default mode, connecting to the live mail server.
  - **Test Mode**: Use `test@example.com` to run the UI with mock data, completely independent of the backend.
  - **Diagnostics Mode**: Use `testikas@maantoa.ee` to activate a floating, real-time log panel for easy debugging.

---

## Tech Stack

| Area    | Technology                                                                                                  |
|---------|-------------------------------------------------------------------------------------------------------------|
| **Frontend** | React, TypeScript, Tailwind CSS                                                                             |
| **Backend**  | Node.js, Express.js                                                                                         |
| **Mail Protocols** | [imap-simple](https://www.npmjs.com/package/imap-simple) (IMAP), [nodemailer](https://nodemailer.com/) (SMTP) |

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### 1. Backend Setup

The backend is a Node.js server that handles the IMAP/SMTP connections.

1.  **Navigate to the project directory**. This is where `server.js` and `package.json` are located.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Start the server**:
    ```bash
    npm start
    ```
4.  The backend API will now be running at `http://localhost:3003`.

### 2. Frontend Setup

The frontend consists of static files that need to be served by a web server. For local development, it's crucial to also set up a proxy to forward API requests to the backend.

1.  **Serve the frontend files**. You can use a simple tool like `serve`.
    ```bash
    # Install serve globally if you don't have it
    npm install -g serve

    # From your project root, serve the files
    serve -s .
    ```
    This will typically serve your frontend on `http://localhost:3000`.

2.  **Handle API Requests (Proxy)**:
    Your frontend will make API calls to `/api/...`, but your backend is on port `3003`. You need a reverse proxy. If you deploy using the Nginx configuration below, this is handled automatically. For local development, you could use a tool like `vite` or `create-react-app` which have built-in proxy support, or configure a lightweight Nginx instance locally.

---

## Deployment

To deploy this application to a production server:

### 1. Deploy the Backend API

1.  Upload `server.js` and `package.json` to a directory on your server (e.g., `/var/www/webmail-server`).
2.  Run `npm install` in that directory.
3.  Use a process manager like `pm2` to run the server persistently.
    ```bash
    # Install pm2 globally
    npm install pm2 -g

    # Start the server
    pm2 start server.js --name "webmail-api"
    ```

### 2. Deploy the Frontend

1.  Upload all frontend files (`index.html`, `index.tsx`, `components/`, etc.) to your web root (e.g., `/var/www/webmail-app`).
2.  Configure your web server (e.g., Nginx) to serve these files and to act as a reverse proxy for API calls.

#### Sample Nginx Configuration

Create a file at `/etc/nginx/sites-available/your-domain.com` with the following content:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Path to your frontend files
    root /var/www/webmail-app;
    index index.html;

    # Serve static files and handle client-side routing
    location / {
        try_files $uri /index.html;
    }

    # Reverse proxy for API calls
    # This forwards any request to /api/... to your backend server
    location /api/ {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site and restart Nginx, and your webmail client will be live.
