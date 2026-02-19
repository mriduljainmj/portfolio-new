# Portfolio Website

Personal portfolio built with Next.js to showcase backend/full-stack engineering work, projects, resume, and recruiter-focused contact flow.

## Live Site

- Production: [https://mriduljainmj.vercel.app](https://mriduljainmj.vercel.app)

## Highlights

- Full-screen section-based layout with smooth snap scrolling
- Recruiter-focused top strip (role, location, email, notice period)
- Dedicated sections for skills, impact infographics, projects, and resume
- Embedded resume preview with direct download/open CTA
- Right-side meeting modal with Calendly embed
- Responsive UI for desktop and mobile

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- CSS Modules
- ESLint
- Vercel (hosting + Git-based deployments)

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Open:

[http://localhost:3000](http://localhost:3000)

## Scripts

```bash
npm run dev
npm run lint
npm run build
```

## Project Structure

```txt
app/
  api/portfolio/route.ts
  layout.tsx
  page.tsx
  page.module.css
  globals.css
components/
  TerminalIntro.tsx
  ProjectCard.tsx
  SkillPills.tsx
lib/
  portfolio-data.ts
  supabase/server.ts
public/
  resume.pdf
supabase/
  schema.sql
```

## Supabase Setup

1. Create a Supabase project.
2. Run SQL from `/Users/mridul/work/Portfolio/portfolio/supabase/schema.sql` in the Supabase SQL Editor.
3. Create env file:

```bash
cp .env.example .env.local
```

4. Add your project values in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
ADMIN_DASHBOARD_KEY=...
```

5. Insert/update rows in Supabase tables:
- `profile`
- `terminal_lines`
- `skill_pills`
- `competencies`
- `featured_projects`

## Dynamic Content Source

Portfolio content is now loaded from:

- API route: `/Users/mridul/work/Portfolio/portfolio/app/api/portfolio/route.ts`
- Supabase tables listed above

If Supabase is not configured or tables are empty, the app falls back to default local data from:

- `/Users/mridul/work/Portfolio/portfolio/lib/portfolio-data.ts`

## Admin Frontend (Manage Data)

Use this page to edit content visually and save directly to Supabase:

- `/manage`

Backend endpoints:

- `GET /api/admin/portfolio`
- `PUT /api/admin/portfolio`

Security behavior:

- If `ADMIN_DASHBOARD_KEY` is set, `/manage` requests must send that key.
- Server writes use `SUPABASE_SERVICE_ROLE_KEY`, so keep it server-side only.

## Customize Content (Fallback)

Edit `/Users/mridul/work/Portfolio/portfolio/lib/portfolio-data.ts`:

- Name, headline, and intro copy
- Recruiter strip info (role, location, email, notice period)
- Social links (GitHub, LinkedIn)
- Project cards and links
- Meeting link and resume URL

Add your resume file at:

- `/Users/mridul/work/Portfolio/portfolio/public/resume.pdf`

## Deployment (Vercel + Git)

This repo is connected to Vercel via Git.

- Push feature branch -> Preview deployment is created automatically
- Merge into production branch (for example `main`) -> Production deployment is created automatically

Manual deploy (optional):

```bash
npx vercel --prod
```

## Notes

- If the embedded meeting calendar is blocked in some environments, the modal includes a direct "Open Booking Page" fallback link.
- Keep project links and resume updated for job applications.
