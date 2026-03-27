Build a full-stack Next.js 14 (App Router) project showcase platform with an admin panel. This is a portfolio-style site to list projects (mine and others') with a system engineer / terminal aesthetic.

## TECH STACK
- Next.js 14 (App Router)
- TailwindCSS
- Shadcn/ui
- Framer Motion
- GSAP (for scroll-based and complex animations)
- NextAuth.js (GitHub provider, admin only)
- Google Sheets API v4 (via googleapis package) as database
- Cloudinary (image hosting, URL-based only — no SDK uploads needed)

## DESIGN SYSTEM
- Theme: System engineer / terminal aesthetic
- Primary color: Green (#00ff41 or similar matrix green) on dark backgrounds (#0a0a0a, #0d0d0d)
- Font: JetBrains Mono or Geist Mono for headings/labels, Inter for body
- UI feel: Think terminal UI meets modern SaaS — monospace labels, grid overlays, scanline effects, blinking cursors, bracket syntax like [PROJECT_001]
- Shadcn theme: Dark mode only, customize CSS variables to match green/dark palette
- No light mode

## PROJECT STRUCTURE
src/
├── app/
│   ├── page.tsx                  # Public project listing
│   ├── projects/[id]/page.tsx    # Single project detail
│   ├── admin/
│   │   ├── page.tsx              # Admin dashboard
│   │   ├── projects/page.tsx     # Manage projects
│   │   └── logs/page.tsx         # Audit logs viewer
│   └── api/
│       ├── projects/route.ts     # GET all projects
│       ├── projects/[id]/route.ts
│       ├── admin/projects/route.ts  # POST/PUT/DELETE
│       └── logs/route.ts
├── components/
│   ├── ui/                       # Shadcn components
│   ├── ProjectCard.tsx
│   ├── ProjectGrid.tsx
│   ├── Terminal.tsx              # Reusable terminal-style component
│   ├── AuditLog.tsx
│   └── AdminForm.tsx
├── lib/
│   ├── sheets.ts                 # Google Sheets read/write helpers
│   ├── audit.ts                  # Audit log writer
│   └── auth.ts                   # NextAuth config
└── types/index.ts

## GOOGLE SHEETS STRUCTURE
Sheet 1 - "projects" tab columns:
id | title | description | image (Cloudinary URL) | liveUrl | repoUrl | tags (comma separated) | author | featured (boolean) | createdAt

Sheet 2 - "audit_logs" tab columns:
timestamp | route | method | action | status | user

## FEATURES

### Public Page (/)
- Hero section with GSAP text animation — typewriter effect for a terminal-style intro
- Filter/search bar styled as a terminal input (> search projects_)
- Project grid with Framer Motion staggered entrance animations
- Each card shows: image, title, tags as [TAG] badges, description truncated, live/repo links
- Tags filter — clicking a tag filters the grid
- Scanline CSS overlay on hero
- ISR with revalidate: 60

### Project Card
- Terminal-style card border (green glow on hover)
- Image with overlay on hover showing links
- Project ID shown as [PROJECT_XXX]
- Framer Motion hover scale + glow effect

### Admin Panel (/admin) — protected via NextAuth
- Login via GitHub (only your GitHub account gets access — check email/id in env)
- Dashboard shows: total projects, last updated, recent audit logs
- Projects page: table of all projects with edit/delete actions
- Add/Edit form: all fields, Cloudinary URL input with preview
- Audit logs page: table view of Sheet 2 data, filterable by route/action

### API Routes
Every API route must:
1. Do its operation
2. Append a row to the audit_logs sheet with: timestamp, route, method, action (e.g. "created project: X"), status (success/error), user (from session or "public")

### Audit Log Writer (lib/audit.ts)
Reusable function: appendAuditLog({ route, method, action, status, user })
Call this at the end of every API route handler.

## ANIMATIONS
- GSAP: Hero typewriter, scroll-triggered project counter, page transition timeline
- Framer Motion: Card stagger on load, card hover states, admin panel page transitions
- CSS: Scanline overlay, blinking cursor, green glow pulse on interactive elements

## ENV VARIABLES NEEDED
GOOGLE_SERVICE_ACCOUNT_JSON=
SHEET_ID=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
ADMIN_GITHUB_ID=        # your GitHub user ID, gate admin access to this only
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

## SETUP INSTRUCTIONS
After scaffolding:
1. Run: npx shadcn@latest init (dark mode, slate base but we override with green)
2. Install: npm install googleapis framer-motion gsap next-auth
3. Set all env variables
4. Create Google Sheet with two tabs: "projects" and "audit_logs" with the column headers listed above
5. Share sheet with service account email

## NOTES
- No Cloudinary SDK needed — images are just URLs stored in the sheet
- Admin is single user (me), no user management needed
- Mobile responsive — terminal aesthetic should hold on mobile too
- Use next/image for all project images with Cloudinary URLs
- Shadcn components to use: Table, Badge, Button, Input, Textarea, Card, Dialog, Sheet (sidebar)
