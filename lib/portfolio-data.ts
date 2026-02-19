export type TerminalLine =
  | { type: "cmd"; text: string }
  | { type: "output"; text: string };

export type SkillPillItem = {
  strong: string;
  rest: string;
};

export type PortfolioCardItem = {
  title: string;
  description: string;
  tags: string[];
  href?: string;
};

export type ProfileData = {
  name: string;
  headline: string;
  subtitle: string;
  hiringFocus: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  meetingLink: string;
  resumeUrl: string;
};

export type RecruiterStripData = {
  status: string;
  role: string;
  location: string;
  noticePeriod: string;
};

export type PortfolioData = {
  profile: ProfileData;
  recruiter: RecruiterStripData;
  terminalLines: TerminalLine[];
  skillPills: SkillPillItem[];
  competencies: PortfolioCardItem[];
  featuredProjects: PortfolioCardItem[];
};

export const fallbackPortfolioData: PortfolioData = {
  profile: {
    name: "Mridul Jain2",
    headline: "Backend and Full-Stack Engineer",
    subtitle:
      "Building reliable systems with backend-first thinking, sharp trade-off analysis, and pragmatic product execution.",
    hiringFocus:
      "Hiring Focus: Software Development Engineer roles where I can build reliable backend systems and ship product impact.",
    email: "itsme.mriduljain@gmail.com",
    githubUrl: "https://github.com/mriduljainmj",
    linkedinUrl: "https://linkedin.com/in/mriduljainmj",
    meetingLink: "https://calendly.com/workwithmj27/30min",
    resumeUrl: "/resume.pdf",
  },
  recruiter: {
    status: "Actively Interviewing",
    role: "Software Development Engineer",
    location: "India (Open to Remote)",
    noticePeriod: "Immediate Joiner",
  },
  terminalLines: [
    { type: "cmd", text: "whoami" },
    {
      type: "output",
      text: "Mridul Jain - Backend and Full-Stack Engineer",
    },
    { type: "cmd", text: "cat focus.txt" },
    {
      type: "output",
      text: "Scalable APIs | Performance | Clean architecture | System design",
    },
    { type: "cmd", text: "ls projects/" },
    {
      type: "output",
      text: "url-shortener ecommerce-order-system notification-service",
    },
    { type: "cmd", text: "cat highlights.md" },
    {
      type: "output",
      text: "Indexed lookups, Redis caching, idempotency patterns, retry/backoff, Dockerized setup.",
    },
  ],
  skillPills: [
    { strong: "Java", rest: "Spring Boot" },
    { strong: "SQL", rest: "Indexing" },
    { strong: "Redis", rest: "Caching" },
    { strong: "Docker", rest: "CI/CD" },
    { strong: "System Design", rest: "Trade-offs" },
  ],
  competencies: [
    {
      title: "Backend",
      description:
        "Spring Boot services, REST design, auth, caching, rate-limiting, and observability patterns.",
      tags: ["Java", "Spring Boot", "JWT", "Redis"],
    },
    {
      title: "Data + Performance",
      description:
        "Schema design, indexing, query tuning, pagination strategies, and latency-first thinking.",
      tags: ["MySQL", "Postgres", "Indexes", "Profiling"],
    },
    {
      title: "Infra + DevOps",
      description:
        "Dockerized local development, stable configs, CI checks, and production-safe rollouts.",
      tags: ["Docker", "CI/CD", "Configs", "Logging"],
    },
    {
      title: "System Design",
      description:
        "Balanced decisions on consistency, caching strategy, scaling reads/writes, and resiliency.",
      tags: ["Trade-offs", "Consistency", "Caching"],
    },
  ],
  featuredProjects: [
    {
      title: "Scalable URL Shortener",
      description:
        "Base62 short codes, indexed lookups, hot-key caching, expiry strategy, and abuse protection.",
      tags: ["Spring Boot", "MySQL", "Redis", "Rate Limit"],
      href: "https://github.com/yourgithub/url-shortener",
    },
    {
      title: "E-commerce Order System",
      description:
        "Order lifecycle, inventory safety via optimistic locking, idempotency controls, and retries.",
      tags: ["Transactions", "Optimistic Lock", "Schedulers"],
      href: "https://github.com/yourgithub/ecommerce-order-system",
    },
    {
      title: "Notification Microservice",
      description:
        "Async delivery with retries plus dead-letter handling and reliable failure isolation.",
      tags: ["Events", "Retry", "DLQ", "Observability"],
      href: "https://github.com/yourgithub/notification-service",
    },
    {
      title: "System Design Notes",
      description:
        "Short practical writeups on caching strategy, indexing trade-offs, scaling, and consistency.",
      tags: ["Docs", "Trade-offs"],
      href: "#",
    },
  ],
};
