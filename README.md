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
  layout.tsx
  page.tsx
  page.module.css
  globals.css
components/
  TerminalIntro.tsx
  ProjectCard.tsx
  SkillPills.tsx
public/
  resume.pdf
```

## Customize Content

Edit `/Users/mridul/work/Portfolio/portfolio/app/page.tsx`:

- Name, headline, and intro copy
- Recruiter strip info (role, location, email, notice period)
- Social links (GitHub, LinkedIn)
- Project cards and links
- Meeting link:
  - `const meetingLink = "https://calendly.com/your-username/30min";`

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
