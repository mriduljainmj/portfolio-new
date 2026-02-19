import { NextResponse } from "next/server";
import {
  fallbackPortfolioData,
  type PortfolioCardItem,
  type PortfolioData,
  type SkillPillItem,
  type TerminalLine,
} from "@/lib/portfolio-data";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type ProfileRow = {
  name?: string | null;
  headline?: string | null;
  subtitle?: string | null;
  hiring_focus?: string | null;
  email?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  meeting_link?: string | null;
  resume_url?: string | null;
  recruiter_status?: string | null;
  recruiter_role?: string | null;
  recruiter_location?: string | null;
  recruiter_notice_period?: string | null;
};

type SkillRow = {
  strong?: string | null;
  rest?: string | null;
};

type CardRow = {
  title?: string | null;
  description?: string | null;
  tags?: string[] | null;
  href?: string | null;
};

type TerminalRow = {
  type?: "cmd" | "output" | null;
  text?: string | null;
};

function cleanCardRows(rows: CardRow[] | null | undefined): PortfolioCardItem[] {
  if (!rows) return [];

  return rows
    .filter((row) => row.title && row.description)
    .map((row) => ({
      title: row.title as string,
      description: row.description as string,
      tags: Array.isArray(row.tags) ? row.tags.filter(Boolean) : [],
      href: row.href ?? undefined,
    }));
}

function cleanSkillRows(rows: SkillRow[] | null | undefined): SkillPillItem[] {
  if (!rows) return [];

  return rows
    .filter((row) => row.strong && row.rest)
    .map((row) => ({
      strong: row.strong as string,
      rest: row.rest as string,
    }));
}

function cleanTerminalRows(
  rows: TerminalRow[] | null | undefined,
): TerminalLine[] {
  if (!rows) return [];

  return rows
    .filter((row) => row.type && row.text)
    .map((row) => ({
      type: row.type as "cmd" | "output",
      text: row.text as string,
    }));
}

export async function GET() {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json(fallbackPortfolioData);
  }

  const [profileRes, skillsRes, competenciesRes, featuredRes, terminalRes] =
    await Promise.all([
      supabase.from("profile").select("*").limit(1).maybeSingle<ProfileRow>(),
      supabase
        .from("skill_pills")
        .select("strong, rest")
        .order("sort_order", { ascending: true })
        .returns<SkillRow[]>(),
      supabase
        .from("competencies")
        .select("title, description, tags, href")
        .order("sort_order", { ascending: true })
        .returns<CardRow[]>(),
      supabase
        .from("featured_projects")
        .select("title, description, tags, href")
        .order("sort_order", { ascending: true })
        .returns<CardRow[]>(),
      supabase
        .from("terminal_lines")
        .select("type, text")
        .order("sort_order", { ascending: true })
        .returns<TerminalRow[]>(),
    ]);

  const data: PortfolioData = {
    ...fallbackPortfolioData,
    profile: {
      ...fallbackPortfolioData.profile,
      name: profileRes.data?.name || fallbackPortfolioData.profile.name,
      headline:
        profileRes.data?.headline || fallbackPortfolioData.profile.headline,
      subtitle:
        profileRes.data?.subtitle || fallbackPortfolioData.profile.subtitle,
      hiringFocus:
        profileRes.data?.hiring_focus || fallbackPortfolioData.profile.hiringFocus,
      email: profileRes.data?.email || fallbackPortfolioData.profile.email,
      githubUrl:
        profileRes.data?.github_url || fallbackPortfolioData.profile.githubUrl,
      linkedinUrl:
        profileRes.data?.linkedin_url || fallbackPortfolioData.profile.linkedinUrl,
      meetingLink:
        profileRes.data?.meeting_link || fallbackPortfolioData.profile.meetingLink,
      resumeUrl:
        profileRes.data?.resume_url || fallbackPortfolioData.profile.resumeUrl,
    },
    recruiter: {
      ...fallbackPortfolioData.recruiter,
      status:
        profileRes.data?.recruiter_status || fallbackPortfolioData.recruiter.status,
      role: profileRes.data?.recruiter_role || fallbackPortfolioData.recruiter.role,
      location:
        profileRes.data?.recruiter_location ||
        fallbackPortfolioData.recruiter.location,
      noticePeriod:
        profileRes.data?.recruiter_notice_period ||
        fallbackPortfolioData.recruiter.noticePeriod,
    },
    skillPills:
      cleanSkillRows(skillsRes.data) || fallbackPortfolioData.skillPills,
    competencies:
      cleanCardRows(competenciesRes.data) || fallbackPortfolioData.competencies,
    featuredProjects:
      cleanCardRows(featuredRes.data) || fallbackPortfolioData.featuredProjects,
    terminalLines:
      cleanTerminalRows(terminalRes.data) || fallbackPortfolioData.terminalLines,
  };

  if (data.skillPills.length === 0) data.skillPills = fallbackPortfolioData.skillPills;
  if (data.competencies.length === 0)
    data.competencies = fallbackPortfolioData.competencies;
  if (data.featuredProjects.length === 0)
    data.featuredProjects = fallbackPortfolioData.featuredProjects;
  if (data.terminalLines.length === 0)
    data.terminalLines = fallbackPortfolioData.terminalLines;

  return NextResponse.json(data);
}
