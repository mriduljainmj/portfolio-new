begin;

truncate table featured_projects restart identity;
truncate table competencies restart identity;
truncate table skill_pills restart identity;
truncate table terminal_lines restart identity;
truncate table profile restart identity;

insert into profile (
  name,
  headline,
  subtitle,
  hiring_focus,
  email,
  github_url,
  linkedin_url,
  meeting_link,
  resume_url,
  recruiter_status,
  recruiter_role,
  recruiter_location,
  recruiter_notice_period
)
values (
  'Mridul Jain',
  'Backend and Full-Stack Engineer',
  'Building reliable systems with backend-first thinking, sharp trade-off analysis, and pragmatic product execution.',
  'Hiring Focus: Software Development Engineer roles where I can build reliable backend systems and ship product impact.',
  'itsme.mriduljain@gmail.com',
  'https://github.com/mriduljainmj',
  'https://linkedin.com/in/mriduljainmj',
  'https://calendly.com/workwithmj27/30min',
  '/resume.pdf',
  'Actively Interviewing',
  'Software Development Engineer',
  'India (Open to Remote)',
  'Immediate Joiner'
);

insert into terminal_lines (sort_order, type, text)
values
  (1, 'cmd', 'whoami'),
  (2, 'output', 'Mridul Jain - Backend and Full-Stack Engineer'),
  (3, 'cmd', 'cat focus.txt'),
  (4, 'output', 'Scalable APIs | Performance | Clean architecture | System design'),
  (5, 'cmd', 'ls projects/'),
  (6, 'output', 'url-shortener ecommerce-order-system notification-service'),
  (7, 'cmd', 'cat highlights.md'),
  (8, 'output', 'Indexed lookups, Redis caching, idempotency patterns, retry/backoff, Dockerized setup.');

insert into skill_pills (sort_order, strong, rest)
values
  (1, 'Java', 'Spring Boot'),
  (2, 'SQL', 'Indexing'),
  (3, 'Redis', 'Caching'),
  (4, 'Docker', 'CI/CD'),
  (5, 'System Design', 'Trade-offs');

insert into competencies (sort_order, title, description, tags, href)
values
  (1, 'Backend', 'Spring Boot services, REST design, auth, caching, rate-limiting, and observability patterns.', array['Java', 'Spring Boot', 'JWT', 'Redis'], null),
  (2, 'Data + Performance', 'Schema design, indexing, query tuning, pagination strategies, and latency-first thinking.', array['MySQL', 'Postgres', 'Indexes', 'Profiling'], null),
  (3, 'Infra + DevOps', 'Dockerized local development, stable configs, CI checks, and production-safe rollouts.', array['Docker', 'CI/CD', 'Configs', 'Logging'], null),
  (4, 'System Design', 'Balanced decisions on consistency, caching strategy, scaling reads/writes, and resiliency.', array['Trade-offs', 'Consistency', 'Caching'], null);

insert into featured_projects (sort_order, title, description, tags, href)
values
  (1, 'Scalable URL Shortener', 'Base62 short codes, indexed lookups, hot-key caching, expiry strategy, and abuse protection.', array['Spring Boot', 'MySQL', 'Redis', 'Rate Limit'], 'https://github.com/yourgithub/url-shortener'),
  (2, 'E-commerce Order System', 'Order lifecycle, inventory safety via optimistic locking, idempotency controls, and retries.', array['Transactions', 'Optimistic Lock', 'Schedulers'], 'https://github.com/yourgithub/ecommerce-order-system'),
  (3, 'Notification Microservice', 'Async delivery with retries plus dead-letter handling and reliable failure isolation.', array['Events', 'Retry', 'DLQ', 'Observability'], 'https://github.com/yourgithub/notification-service'),
  (4, 'System Design Notes', 'Short practical writeups on caching strategy, indexing trade-offs, scaling, and consistency.', array['Docs', 'Trade-offs'], '#');

commit;
