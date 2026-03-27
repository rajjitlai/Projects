# Plan: Replace NextAuth with Custom SMTP OTP Authentication

## Context
The project currently uses NextAuth with GitHub OAuth for admin authentication. The requirement is to replace this with a custom OTP system:
- Admin enters email on `/admin/login`
- System checks against `ADMIN_EMAIL` env var
- If match, sends 6-digit OTP via SMTP (nodemailer)
- OTP stored server-side with 5-minute expiry
- User enters OTP on `/admin/verify` page
- On success, sets signed httpOnly cookie containing admin session
- Middleware protects all `/admin` routes by checking the cookie
- No database required, no NextAuth dependency

## Current Auth Implementation (To Remove)

**Files using NextAuth:**
- `lib/auth.ts` - NextAuth config + isAdmin
- `lib/api-utils.ts` - getServerSession, adminOnly, requireAuth helpers
- `app/layout.tsx` - SessionProvider wrapper
- `app/admin/login/page.tsx` - uses `signIn('github')`
- `app/admin/page.tsx` - uses `useSession()`
- `app/admin/projects/page.tsx` - uses `useSession()`
- `app/admin/logs/page.tsx` - uses `useSession()`
- `app/api/auth/[...nextauth]/route.ts` - NextAuth endpoint
- `types/next-auth.d.ts` - type augmentations

**Env vars to remove:**
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `ADMIN_GITHUB_ID`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

**Dependency to remove:**
- `next-auth` from package.json

## New OTP System Architecture

### 1. OTP Storage (`lib/otp-store.ts`)
- Simple in-memory Map<otp, { email, expiresAt }>
- `generateOtp(email): string` - creates 6-digit OTP, stores with 5min expiry
- `verifyOtp(otp: string): boolean` - checks validity, deletes after use
- `cleanup()` - periodic cleanup of expired OTPs
- For serverless/process persistence, could use global variable

### 2. Email Service (`lib/email.ts`)
- `sendOtpEmail(email: string, otp: string): Promise<void>`
- Uses nodemailer with SMTP env vars: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- Sends plain text email with OTP code

### 3. Middleware (`middleware.ts`)
- Runs on all `/admin/*` routes (except `/admin/login` and `/admin/verify`)
- Checks for `adminSession` signed cookie
- If missing/invalid → redirect to `/admin/login`
- Uses Next.js middleware with `secrets` for cookie signing

### 4. Auth Utilities (`lib/auth.ts` rename to `lib/session.ts`)
- `createSession(email: string): string` - creates signed JWT-like token or random session ID
- `verifySession(token: string): boolean` - verifies signature
- Actually simpler: use Next.js `cookies()` API with `httpOnly`, `signed`, `secret` options
- Store session token in httpOnly cookie: `admin_session`
- No server-side session store needed - just validate signature and expiry

**Simpler approach:** Use Next.js built-in signed cookies only:
- On OTP success: `cookies().set('admin_session', email, { httpOnly: true, signed: true, secret: process.env.ADMIN_SESSION_SECRET, maxAge: 60 * 60 * 24 * 7 })`
- Middleware checks: `cookies().get('admin_session')` and verify signature automatically
- No server-side storage needed!

So files:
- `lib/session.ts` - helpers: `setAdminSession(cookies, email)`, `clearAdminSession(cookies)`, `verifyAdminSession(cookies): string | null`
- Actually these can be inline in middleware and routes.

### 5. Login Flow (`app/admin/login/page.tsx`)
- Replace GitHub button with email input form
- On submit: check email === `ADMIN_EMAIL`
- If match: generate OTP, send email, redirect to `/admin/verify?email=...`
- If not: show 403 error
- Disable submit button while sending

### 6. Verify Flow (`app/admin/verify/page.tsx`) - NEW FILE
- Email passed via query param or store in temporary cookie/localStorage
- OTP input form (6 digits)
- On submit: verify OTP
- If valid: set `admin_session` signed cookie, redirect to `/admin`
- If invalid: show error
- Auto-redirect to login if no email in query

### 7. Admin Pages Updates
- Remove `useSession()` from all admin pages
- Replace with checking cookies directly? Actually middleware handles protection
- But need to show current admin email: read from cookie or pass via context?
- Simplest: create `lib/use-admin.ts` hook that reads admin_session cookie client-side
- Or just show "Admin Panel" without user info
- Remove redirect logic from useEffect - middleware handles it

### 8. API Routes Updates
- Remove `getAuthContext()` and `adminOnly()` calls
- Instead: admin pages call APIs; API routes don't need auth because middleware already protects them
- Actually: middleware protects `/admin/*` routes (pages) but API routes are `/api/admin/*` which also need protection
- Solution: Apply middleware to `/api/admin/*` as well
- Then API routes can assume admin is authenticated, no need to check
- Keep audit logging but simplify

### 9. Environment Variables
New/Updated:
```
ADMIN_EMAIL=admin@example.com
ADMIN_SESSION_SECRET=random-32-char-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=app_password
```

Remove:
```
GITHUB_CLIENT_ID
GITHUB_CLIENT_SECRET
ADMIN_GITHUB_ID
NEXTAUTH_SECRET
NEXTAUTH_URL
```

### 10. Dependencies
Remove: `next-auth`
Add: `nodemailer`

## Steps

1. **Install nodemailer**
   ```bash
   npm install nodemailer
   ```

2. **Remove next-auth**
   ```bash
   npm uninstall next-auth
   ```

3. **Create lib/session.ts** - cookie helpers
4. **Create lib/otp-store.ts** - in-memory OTP store
5. **Create lib/email.ts** - nodemailer transport and send function
6. **Create middleware.ts** - protect /admin and /api/admin routes
7. **Update app/layout.tsx** - remove SessionProvider
8. **Update app/admin/login/page.tsx** - email form with OTP send
9. **Create app/admin/verify/page.tsx** - OTP input and verification
10. **Update app/admin/page.tsx** - remove useSession, simplify
11. **Update app/admin/projects/page.tsx** - remove useSession
12. **Update app/admin/logs/page.tsx** - remove useSession
13. **Delete lib/auth.ts**
14. **Update lib/api-utils.ts** - remove auth helpers (or keep if needed for client-side?). Actually can delete the file or deprecate.
15. **Delete types/next-auth.d.ts**
16. **Update .env.local.example** with new env vars
17. **Update CLAUDE.md** to reflect new auth system
18. **Update CLAUDE.md, prompt.md references** to remove GitHub OAuth mentions

## Verification

1. Start dev server: `npm run dev`
2. Navigate to `/admin` → should redirect to `/admin/login`
3. Enter incorrect email → see 403 error
4. Enter correct email (matches ADMIN_EMAIL) → should redirect to `/admin/verify?email=...`
5. Check email (or use test SMTP like Mailtrap) for 6-digit OTP
6. Enter correct OTP → should redirect to `/admin` dashboard
7. Enter incorrect OTP → see error
8. After login, access `/admin/projects` and `/admin/logs` - should work
9. Logout - need logout button that clears cookie (new API route `/api/auth/logout` or client action)
10. Test audit logging still works
11. Ensure public homepage (`/`) doesn't require auth
12. TypeScript compiles, ESLint passes

## Notes

- OTP expiry: 5 minutes (300 seconds)
- Max OTP attempts: could limit, but not required
- Session cookie: signed with ADMIN_SESSION_SECRET, 7-day expiry
- No rate limiting on OTP requests (could add later)
- In production, use actual SMTP; for dev, could print OTP to console if SMTP not configured? Maybe add fallback.

## Risk Mitigation

- Keep implementation simple with Next.js cookies (no external session store)
- Test thoroughly before removing old files
- Backup/commit current working state before starting
