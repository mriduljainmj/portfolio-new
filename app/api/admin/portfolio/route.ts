import { NextRequest, NextResponse } from "next/server";
import {
  fallbackPortfolioData,
  type PortfolioCardItem,
  type PortfolioData,
  type SkillPillItem,
  type TerminalLine,
} from "@/lib/portfolio-data";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

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

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function hasAdminAccess(req: NextRequest): boolean {
  const configuredKey = process.env.ADMIN_DASHBOARD_KEY;
  if (!configuredKey) return true;

  const receivedKey = req.headers.get("x-admin-key");
  return receivedKey === configuredKey;
}

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

async function readPortfolioData(): Promise<PortfolioData> {
  const supabase = getSupabaseAdminClient();

  if (!supabase) {
    return fallbackPortfolioData;
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
    skillPills: cleanSkillRows(skillsRes.data),
    competencies: cleanCardRows(competenciesRes.data),
    featuredProjects: cleanCardRows(featuredRes.data),
    terminalLines: cleanTerminalRows(terminalRes.data),
  };

  if (data.skillPills.length === 0) data.skillPills = fallbackPortfolioData.skillPills;
  if (data.competencies.length === 0)
    data.competencies = fallbackPortfolioData.competencies;
  if (data.featuredProjects.length === 0)
    data.featuredProjects = fallbackPortfolioData.featuredProjects;
  if (data.terminalLines.length === 0)
    data.terminalLines = fallbackPortfolioData.terminalLines;

  return data;
}

export async function GET(req: NextRequest) {
  if (!hasAdminAccess(req)) return unauthorized();

  const data = await readPortfolioData();
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  if (!hasAdminAccess(req)) return unauthorized();

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Missing Supabase admin environment variables" },
      { status: 500 },
    );
  }

  let input: PortfolioData;
  try {
    input = (await req.json()) as PortfolioData;
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const profilePayload = {
    name: input.profile?.name ?? fallbackPortfolioData.profile.name,
    headline: input.profile?.headline ?? fallbackPortfolioData.profile.headline,
    subtitle: input.profile?.subtitle ?? fallbackPortfolioData.profile.subtitle,
    hiring_focus:
      input.profile?.hiringFocus ?? fallbackPortfolioData.profile.hiringFocus,
    email: input.profile?.email ?? fallbackPortfolioData.profile.email,
    github_url: input.profile?.githubUrl ?? fallbackPortfolioData.profile.githubUrl,
    linkedin_url:
      input.profile?.linkedinUrl ?? fallbackPortfolioData.profile.linkedinUrl,
    meeting_link:
      input.profile?.meetingLink ?? fallbackPortfolioData.profile.meetingLink,
    resume_url: input.profile?.resumeUrl ?? fallbackPortfolioData.profile.resumeUrl,
    recruiter_status:
      input.recruiter?.status ?? fallbackPortfolioData.recruiter.status,
    recruiter_role: input.recruiter?.role ?? fallbackPortfolioData.recruiter.role,
    recruiter_location:
      input.recruiter?.location ?? fallbackPortfolioData.recruiter.location,
    recruiter_notice_period:
      input.recruiter?.noticePeriod ?? fallbackPortfolioData.recruiter.noticePeriod,
  };

  const terminalPayload = (input.terminalLines ?? []).map((item, idx) => ({
    sort_order: idx + 1,
    type: item.type,
    text: item.text,
  }));

  const skillPayload = (input.skillPills ?? []).map((item, idx) => ({
    sort_order: idx + 1,
    strong: item.strong,
    rest: item.rest,
  }));

  const competenciesPayload = (input.competencies ?? []).map((item, idx) => ({
    sort_order: idx + 1,
    title: item.title,
    description: item.description,
    tags: item.tags ?? [],
    href: item.href ?? null,
  }));

  const projectsPayload = (input.featuredProjects ?? []).map((item, idx) => ({
    sort_order: idx + 1,
    title: item.title,
    description: item.description,
    tags: item.tags ?? [],
    href: item.href ?? null,
  }));

  const deleteQueries = [
    supabase.from("profile").delete().neq("id", 0),
    supabase.from("terminal_lines").delete().neq("id", 0),
    supabase.from("skill_pills").delete().neq("id", 0),
    supabase.from("competencies").delete().neq("id", 0),
    supabase.from("featured_projects").delete().neq("id", 0),
  ];

  const deleteResults = await Promise.all(deleteQueries);
  const deleteError = deleteResults.find((result) => result.error)?.error;
  if (deleteError) {
    return NextResponse.json(
      { error: `Delete failed: ${deleteError.message}` },
      { status: 500 },
    );
  }

  const insertQueries = [
    supabase.from("profile").insert(profilePayload),
    terminalPayload.length
      ? supabase.from("terminal_lines").insert(terminalPayload)
      : Promise.resolve({ error: null }),
    skillPayload.length
      ? supabase.from("skill_pills").insert(skillPayload)
      : Promise.resolve({ error: null }),
    competenciesPayload.length
      ? supabase.from("competencies").insert(competenciesPayload)
      : Promise.resolve({ error: null }),
    projectsPayload.length
      ? supabase.from("featured_projects").insert(projectsPayload)
      : Promise.resolve({ error: null }),
  ];

  const insertResults = await Promise.all(insertQueries);
  const insertError = insertResults.find((result) => result.error)?.error;
  if (insertError) {
    return NextResponse.json(
      { error: `Insert failed: ${insertError.message}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
