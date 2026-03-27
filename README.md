# Projects

A personal project showcase platform built to display development work in a structured and accessible format. The application features a public-facing project gallery backed by Google Sheets, a secured admin panel for content management, and a terminal-inspired visual design.

## Overview

The platform is split into two distinct surfaces:

- **Public Site** — A filterable, searchable grid of projects with individual detail pages built with Incremental Static Regeneration (ISR).
- **Admin Panel** — A protected control panel for creating, editing, and deleting project entries, accessible only to a single authorized administrator via a one-time email code.

## Tech Stack

| Layer        | Technology                              |
|--------------|-----------------------------------------|
| Framework    | Next.js 16 (App Router)                 |
| Language     | TypeScript                              |
| Styling      | Tailwind CSS v4                         |
| Database     | Google Sheets (via Google Sheets API)   |
| Auth         | Custom SMTP-OTP (nodemailer + jose JWT) |
| Media        | Cloudinary (optional)                   |
| Animations   | GSAP, Framer Motion                     |
| UI           | shadcn/ui, Radix UI                     |

## Authentication

Authentication is handled without any third-party OAuth provider or database. The flow is:

1. Admin visits `/admin/login` and submits their email.
2. The server validates the email against `ADMIN_EMAIL` and sends a 6-digit OTP via SMTP.
3. Admin visits `/admin/verify` and enters the OTP.
4. On success, a signed `httpOnly` JWT cookie is set (8h expiry).
5. All `/admin` and `/api/admin` routes are protected by the middleware cookie check.

## Project Structure

```
app/
  admin/           Admin panel pages (login, verify, dashboard, projects, logs)
  api/             Route handlers (projects, admin CRUD, OTP auth, logs)
  projects/[id]/   Dynamic project detail pages (ISR)
  page.tsx         Public landing page
components/        Shared UI components (Terminal, AdminForm, ProjectGrid, etc.)
lib/               Core logic (sheets, otp, mailer, session, auth, api-utils)
types/             Shared TypeScript type definitions
middleware.ts      Edge middleware for protected route authentication
```

## Environment Variables

See `.env.local.example` for the full list. Required variables:

```
ADMIN_EMAIL        Email address allowed to access the admin panel
SESSION_SECRET     Strong random string for signing the session JWT

SMTP_HOST          SMTP server hostname
SMTP_PORT          SMTP port (587 for TLS, 465 for SSL)
SMTP_SECURE        true for SSL/465, false for TLS/587
SMTP_USER          SMTP login username
SMTP_PASS          SMTP password or app password

SHEET_ID                    Google Sheet ID used as the database
GOOGLE_SERVICE_ACCOUNT_JSON Full service account JSON (stringified)
```

## Getting Started

```bash
# Install dependencies
npm install

# Copy and fill in environment variables
cp .env.local.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public site.
The admin panel is at [http://localhost:3000/admin](http://localhost:3000/admin).

## Data Model (Google Sheets)

Projects are stored as rows in a Google Sheet. The expected columns are:

`id` | `title` | `description` | `image` | `tags` | `liveUrl` | `repoUrl` | `author` | `featured` | `createdAt`

Audit logs are written to a separate sheet tab named `audit_logs`.

## License

MIT
