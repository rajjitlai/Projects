# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack project showcase platform with a system engineer/terminal aesthetic. It features a public-facing gallery and a secured, obfuscated admin panel.

**Core Tech Stack:**
- Next.js 16+ (App Router)
- React 19
- TypeScript (strict mode)
- Tailwind CSS 4
- Lucide React (icons)
- Framer Motion + GSAP (animations)
- Custom SMTP-OTP Auth (nodemailer + jose JWT)
- Google Sheets API v4 (database)
- Cloudinary (image hosting)

**Design Theme:**
- Dark mode only with matrix green (#00ff41) accents
- Monospace fonts (JetBrains Mono/Geist Mono)
- Terminal/SaaS hybrid aesthetic with scanlines and blinking cursors

## Critical Warnings

**IMPORTANT:** This is Next.js 16+, which has breaking changes from earlier versions. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Pay attention to deprecation notices.

## Common Development Commands

```bash
# Development server (with hot reload)
npm run dev
# Runs on http://localhost:3000

# Production build
npm run build

# Start production server
npm start

# Lint codebase
npm run lint

# Run specific ESLint rules
npx eslint app/
npx eslint components/
```

## Project Structure

```
app/
├── layout.tsx                  # Root layout with fonts and theme
├── page.tsx                    # Public project listing (home)
├── globals.css                 # Global styles + Tailwind + theme vars
├── projects/[id]/page.tsx      # Single project detail page
├── ace/                        # Obfuscated admin panel (replaces /admin)
│   ├── page.tsx                # Admin dashboard
│   ├── projects/page.tsx       # Project management
│   ├── logs/page.tsx           # Audit logs viewer
│   ├── login/page.tsx          # OTP Request page
│   └── verify/page.tsx         # OTP Verification page
└── api/
    ├── projects/route.ts       # GET all projects
    ├── projects/[id]/route.ts  # GET single project
    ├── ace/                    # Protected admin APIs
    │   ├── projects/route.ts   # CRUD operations
    │   ├── upload/route.ts     # Cloudinary image upload
    │   ├── send-otp/route.ts   # Auth step 1
    │   ├── verify-otp/route.ts # Auth step 2
    │   └── logout/route.ts     # Session termination
    └── logs/route.ts           # Audit logs API

proxy.ts                        # Edge middleware for route protection
```

## Authentication

Authentication is handled via a custom SMTP-OTP flow:
1. Session verification via `proxy.ts` (middleware).
2. JWT tokens stored in `httpOnly` secure cookies.
3. No external auth providers (GitHub, etc.) are used.

## TypeScript Configuration

- Target: ES2017
- Strict mode enabled
- React JSX runtime: `react-jsx`
- Module resolution: `bundler` (ES Module)
- Path alias: `@/*` maps to project root
- Next.js plugin included

## Styling

- **Tailwind CSS v4** with `@tailwindcss/postcss`
- Import via `@import "tailwindcss"` in `globals.css`
- Shadcn/ui components will be installed under `components/ui/`
- Theme uses CSS variables with dark mode as default
- Google Fonts: Geist (sans + mono) via `next/font`

## ESLint Configuration

- Uses `eslint-config-next` (vitals + TypeScript)
- Flat config format (`eslint.config.mjs`)
- Ignores: `.next/`, `out/`, `build/`, `next-env.d.ts`

## Environment Variables

Required (see `prompt.md` for full list):
```
GOOGLE_SERVICE_ACCOUNT_JSON=
SHEET_ID=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
JWT_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

**Security:** `.env*` files are gitignored. Never commit credentials.

## Google Sheets Schema

**projects sheet:**
`id | title | description | image | liveUrl | repoUrl | tags | author | featured | createdAt`

**audit_logs sheet:**
`timestamp | route | method | action | status | user`

## Key Implementation Notes

1. **All API routes must audit:** Every route handler should call `appendAuditLog()` with route, method, action, status, and user (from session or "public")

2. **Images:** Use `next/image` with Cloudinary URLs. No Cloudinary SDK needed — just store URLs.

3. **Admin protection:** Single-user admin (your GitHub ID only). Check `ADMIN_GITHUB_ID` against session user ID.

4. **ISR:** Public project pages should use `revalidate: 60` for incremental static regeneration.

5. **Animations:** Use GSAP for hero/scroll effects, Framer Motion for component animations. Keep them performant.

6. **Responsive:** Terminal aesthetic must work on mobile. Test breakpoints.

7. **Shadcn setup:** After initializing Shadcn, override the theme colors to use matrix green palette instead of Slate.

## Setup Instructions (when starting implementation)

1. Install additional dependencies: `npm install googleapis framer-motion gsap nodemailer jose`
2. Run: `npx shadcn@latest init` (select dark mode, slate base — override later)
3. Add Shadcn components: Table, Badge, Button, Input, Textarea, Card, Dialog
4. Create Google Sheets with "projects" and "audit_logs" tabs
5. Share sheet with service account email from `GOOGLE_SERVICE_ACCOUNT_JSON`
6. Configure environment variables in `.env.local`

## Current State

The project is **fully implemented** (v1.0.0). It features a functional project management suite, Cloudinary integration for image uploads, and a robust audit logging system. The admin routes have been obfuscated to `/ace` for enhanced security.
