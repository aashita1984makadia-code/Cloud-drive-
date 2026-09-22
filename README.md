# CloudDrive

A private Google Drive-style cloud storage application built with Node.js, Express, MongoDB/Mongoose, JWT, Multer, Socket.IO and Vanilla JavaScript.

## Requirements

- Node.js 18+
- MongoDB 6+
- Optional SMTP server for email features

## Install

```bash
npm install
cp .env.example .env
npm run seed
npm start
```

Open `http://localhost:3000`.

## Demo credentials

- Admin: value of `ADMIN_EMAIL` / `ADMIN_PASSWORD`
- Demo: value of `DEMO_EMAIL` / `DEMO_PASSWORD`

Change credentials before production use.

## Production notes

Use HTTPS, a strong JWT secret, a reverse proxy, a managed MongoDB instance, object storage for large deployments, antivirus/content scanning, backups, and a real SMTP provider. The application protects physical storage behind authenticated API endpoints and does not expose `/storage` as a static directory.

## Main API areas

`/api/auth`, `/api/users`, `/api/files`, `/api/folders`, `/api/uploads`, `/api/shares`, `/api/comments`, `/api/versions`, `/api/trash`, `/api/search`, `/api/notifications`, `/api/activity`, `/api/storage`, `/api/admin`.

## Chunk upload

The browser creates an upload session, sends chunks with `uploadId` and `chunkIndex`, then calls complete. SHA-256 can be supplied by the client and is verified server-side when available.

## Security

Helmet, CORS, rate limiting, JWT authentication, bcrypt hashing, authorization checks, filename sanitization, storage quota checks, archive path traversal protection, secure random share tokens, and centralized error handling are included.
