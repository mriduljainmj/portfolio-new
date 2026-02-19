create table if not exists profile (
  id bigint generated always as identity primary key,
  name text not null,
  headline text,
  subtitle text,
  hiring_focus text,
  email text not null,
  github_url text,
  linkedin_url text,
  meeting_link text,
  resume_url text,
  recruiter_status text,
  recruiter_role text,
  recruiter_location text,
  recruiter_notice_period text,
  updated_at timestamptz default now()
);

create table if not exists terminal_lines (
  id bigint generated always as identity primary key,
  sort_order int not null default 0,
  type text not null check (type in ('cmd', 'output')),
  text text not null
);

create table if not exists skill_pills (
  id bigint generated always as identity primary key,
  sort_order int not null default 0,
  strong text not null,
  rest text not null
);

create table if not exists competencies (
  id bigint generated always as identity primary key,
  sort_order int not null default 0,
  title text not null,
  description text not null,
  tags text[] not null default '{}',
  href text
);

create table if not exists featured_projects (
  id bigint generated always as identity primary key,
  sort_order int not null default 0,
  title text not null,
  description text not null,
  tags text[] not null default '{}',
  href text
);

alter table profile enable row level security;
alter table terminal_lines enable row level security;
alter table skill_pills enable row level security;
alter table competencies enable row level security;
alter table featured_projects enable row level security;

create policy "Public read profile" on profile
for select using (true);

create policy "Public read terminal_lines" on terminal_lines
for select using (true);

create policy "Public read skill_pills" on skill_pills
for select using (true);

create policy "Public read competencies" on competencies
for select using (true);

create policy "Public read featured_projects" on featured_projects
for select using (true);
