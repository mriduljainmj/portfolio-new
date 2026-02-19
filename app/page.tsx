"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import TerminalIntro from "@/components/TerminalIntro";
import ProjectCard from "@/components/ProjectCard";
import SkillPills from "@/components/SkillPills";
import styles from "./page.module.css";

const sectionItems = [
  { id: "home", label: "Intro" },
  { id: "skills", label: "Skills" },
  { id: "impact", label: "Impact" },
  { id: "projects", label: "Projects" },
  { id: "resume", label: "Resume" },
];
const meetingLink = "https://calendly.com/workwithmj27/30min";

export default function Page() {
  const snapRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState(sectionItems[0].id);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [meetingOpen, setMeetingOpen] = useState(false);

  useEffect(() => {
    const snapEl = snapRef.current;
    if (!snapEl) return;

    let rafId = 0;

    const update = () => {
      const maxScroll = snapEl.scrollHeight - snapEl.clientHeight;
      const nextProgress = maxScroll > 0 ? snapEl.scrollTop / maxScroll : 0;
      setScrollProgress(nextProgress);

      const sections = sectionItems
        .map((item) => snapEl.querySelector<HTMLElement>(`#${item.id}`))
        .filter((node): node is HTMLElement => Boolean(node));

      const focusLine = snapEl.scrollTop + snapEl.clientHeight * 0.45;
      let closestId = sectionItems[0].id;
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const section of sections) {
        const distance = Math.abs(section.offsetTop - focusLine);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestId = section.id;
        }
      }

      setActiveSection((prev) => (prev === closestId ? prev : closestId));
      rafId = 0;
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(update);
    };

    update();
    snapEl.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      snapEl.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const pageStyle = {
    "--scroll-progress": scrollProgress.toString(),
    "--parallax-shift": `${scrollProgress * 90}px`,
  } as CSSProperties;

  return (
    <main className={styles.page} style={pageStyle}>
      <div className={styles.orbA} />
      <div className={styles.orbB} />
      <div className={styles.gridOverlay} />

      <div className={styles.progressTop} aria-hidden="true">
        <span
          style={{ transform: `scaleX(${Math.max(scrollProgress, 0.02)})` }}
        />
      </div>

      <nav className={styles.sectionNav} aria-label="Section navigation">
        {sectionItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`${styles.navItem} ${activeSection === item.id ? styles.navItemActive : ""}`}
          >
            <span className={styles.navDot} aria-hidden="true" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      <aside
        className={`${styles.meetingModal} ${meetingOpen ? styles.meetingModalOpen : ""}`}
        aria-label="Schedule meeting panel"
        aria-hidden={!meetingOpen}
      >
        <div className={styles.meetingModalTop}>
          <div>
            <p className={styles.meetingModalKicker}>Let us connect</p>
            <h3 className={styles.meetingModalTitle}>
              Schedule a 30-min Meeting
            </h3>
          </div>
          <button
            type="button"
            className={styles.meetingClose}
            onClick={() => setMeetingOpen(false)}
            aria-label="Close meeting panel"
          >
            Close
          </button>
        </div>
        <p className={styles.meetingModalText}>
          Pick a slot that works for you. If the embedded calendar does not
          load, use the direct booking link below.
        </p>
        <div className={styles.meetingFrameWrap}>
          <iframe
            title="Schedule a meeting"
            src={meetingLink}
            className={styles.meetingFrame}
          />
        </div>
        <div className={styles.meetingActions}>
          <a
            className={styles.btn}
            href={meetingLink}
            target="_blank"
            rel="noreferrer"
          >
            Open Booking Page
          </a>
          <a className={styles.btnAlt} href="mailto:youremail@example.com">
            Email Instead
          </a>
        </div>
      </aside>

      <div className={styles.snap} ref={snapRef}>
        <section id="home" className={styles.section}>
          <div
            className={styles.recruiterStrip}
            aria-label="Recruiter quick facts"
          >
            <div className={styles.recruiterFacts}>
              <span className={styles.recruiterTag}>Actively Interviewing</span>
              <span className={styles.recruiterFact}>
                Role: Software Development Engineer
              </span>
              <span className={styles.recruiterFact}>
                Location: India (Open to Remote)
              </span>
              <a
                className={styles.recruiterFactLink}
                href="mailto:itsme.mriduljain@gmail.com"
              >
                Email: itsme.mriduljain@gmail.com
              </a>
              <span className={styles.recruiterFact}>
                Notice Period: Immediate Joiner
              </span>
            </div>
            <a className={styles.stripCta} href="#resume">
              View Resume
            </a>
            <button
              type="button"
              className={styles.stripCtaAlt}
              onClick={() => setMeetingOpen(true)}
            >
              Schedule Meeting
            </button>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.glassPanel}>
              <TerminalIntro
                lines={[
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
                ]}
              />
            </div>

            <aside className={styles.profilePanel}>
              <p className={styles.kicker}>Open to backend-heavy SDE roles</p>
              <h1 className={styles.h1}>Mridul Jain</h1>
              <p className={styles.subtitle}>
                Building reliable systems with backend-first thinking, sharp
                trade-off analysis, and pragmatic product execution.
              </p>
              <p className={styles.jobFocus}>
                Hiring Focus: Software Development Engineer roles where I can
                build reliable backend systems and ship product impact.
              </p>

              <div className={styles.quickStats}>
                <span>API Design</span>
                <span>Data Modeling</span>
                <span>Observability</span>
              </div>

              <div className={styles.actions}>
                <a
                  className={styles.btn}
                  href="https://github.com/mriduljainmj"
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
                <a
                  className={styles.btn}
                  href="https://linkedin.com/in/mriduljainmj"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  className={styles.btn}
                  href="/resume.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Resume
                </a>
                <a className={styles.btnAlt} href="#resume">
                  View Resume
                </a>
              </div>

              <SkillPills
                items={[
                  { strong: "Java", rest: "Spring Boot" },
                  { strong: "SQL", rest: "Indexing" },
                  { strong: "Redis", rest: "Caching" },
                  { strong: "Docker", rest: "CI/CD" },
                  { strong: "System Design", rest: "Trade-offs" },
                ]}
              />
            </aside>
          </div>
        </section>

        <section id="skills" className={styles.section}>
          <h2 className={styles.sectionTitle}>Core Competencies</h2>
          <div className={styles.grid2}>
            <ProjectCard
              title="Backend"
              description="Spring Boot services, REST design, auth, caching, rate-limiting, and observability patterns."
              tags={["Java", "Spring Boot", "JWT", "Redis"]}
            />
            <ProjectCard
              title="Data + Performance"
              description="Schema design, indexing, query tuning, pagination strategies, and latency-first thinking."
              tags={["MySQL", "Postgres", "Indexes", "Profiling"]}
            />
            <ProjectCard
              title="Infra + DevOps"
              description="Dockerized local development, stable configs, CI checks, and production-safe rollouts."
              tags={["Docker", "CI/CD", "Configs", "Logging"]}
            />
            <ProjectCard
              title="System Design"
              description="Balanced decisions on consistency, caching strategy, scaling reads/writes, and resiliency."
              tags={["Trade-offs", "Consistency", "Caching"]}
            />
          </div>
        </section>

        <section id="impact" className={styles.section}>
          <h2 className={styles.sectionTitle}>Impact Infographics</h2>
          <div className={styles.infographicGrid}>
            <article className={styles.infoPanel}>
              <h3 className={styles.infoTitle}>Engineering Snapshot</h3>
              <div className={styles.metricTiles}>
                <div className={styles.metricTile}>
                  <p className={styles.metricValue}>12+</p>
                  <p className={styles.metricLabel}>Backend Modules</p>
                </div>
                <div className={styles.metricTile}>
                  <p className={styles.metricValue}>99.9%</p>
                  <p className={styles.metricLabel}>Target Reliability</p>
                </div>
                <div className={styles.metricTile}>
                  <p className={styles.metricValue}>35%</p>
                  <p className={styles.metricLabel}>Latency Improvements</p>
                </div>
                <div className={styles.metricTile}>
                  <p className={styles.metricValue}>4x</p>
                  <p className={styles.metricLabel}>Scalable Throughput</p>
                </div>
              </div>
            </article>

            <article className={styles.infoPanel}>
              <h3 className={styles.infoTitle}>Strength Radar</h3>
              <div className={styles.skillBars}>
                <div className={styles.skillBarRow}>
                  <span>Backend Systems</span>
                  <div className={styles.skillTrack}>
                    <span className={styles.skillFill} style={{ width: "95%" }} />
                  </div>
                </div>
                <div className={styles.skillBarRow}>
                  <span>Data + SQL</span>
                  <div className={styles.skillTrack}>
                    <span className={styles.skillFill} style={{ width: "88%" }} />
                  </div>
                </div>
                <div className={styles.skillBarRow}>
                  <span>System Design</span>
                  <div className={styles.skillTrack}>
                    <span className={styles.skillFill} style={{ width: "90%" }} />
                  </div>
                </div>
                <div className={styles.skillBarRow}>
                  <span>DevOps and CI/CD</span>
                  <div className={styles.skillTrack}>
                    <span className={styles.skillFill} style={{ width: "82%" }} />
                  </div>
                </div>
              </div>
            </article>

            <article className={styles.infoPanel}>
              <h3 className={styles.infoTitle}>Architecture Flow</h3>
              <div className={styles.flowMap}>
                <div className={styles.flowNode}>Client Apps</div>
                <div className={styles.flowArrow}>→</div>
                <div className={styles.flowNode}>API Layer</div>
                <div className={styles.flowArrow}>→</div>
                <div className={styles.flowNode}>Service Core</div>
                <div className={styles.flowArrow}>→</div>
                <div className={styles.flowNode}>Data + Cache</div>
              </div>
              <p className={styles.infoNote}>
                Design focus: low-latency reads, consistent writes, and resilient retries.
              </p>
            </article>

          </div>
        </section>

        <section id="projects" className={styles.section}>
          <h2 className={styles.sectionTitle}>Featured Projects</h2>
          <div className={styles.grid2}>
            <ProjectCard
              title="Scalable URL Shortener"
              description="Base62 short codes, indexed lookups, hot-key caching, expiry strategy, and abuse protection."
              tags={["Spring Boot", "MySQL", "Redis", "Rate Limit"]}
              href="https://github.com/yourgithub/url-shortener"
            />
            <ProjectCard
              title="E-commerce Order System"
              description="Order lifecycle, inventory safety via optimistic locking, idempotency controls, and retries."
              tags={["Transactions", "Optimistic Lock", "Schedulers"]}
              href="https://github.com/yourgithub/ecommerce-order-system"
            />
            <ProjectCard
              title="Notification Microservice"
              description="Async delivery with retries plus dead-letter handling and reliable failure isolation."
              tags={["Events", "Retry", "DLQ", "Observability"]}
              href="https://github.com/yourgithub/notification-service"
            />
            <ProjectCard
              title="System Design Notes"
              description="Short practical writeups on caching strategy, indexing trade-offs, scaling, and consistency."
              tags={["Docs", "Trade-offs"]}
              href="#"
            />
          </div>
          <br></br>
          <p className={styles.footer}>
            Copyright {new Date().getFullYear()} Mridul Jain
          </p>
        </section>

        <section id="resume" className={styles.section}>
          <h2 className={styles.sectionTitle}>Resume</h2>
          <div className={styles.resumeWrap}>
            <div className={styles.resumeTop}>
              <p className={styles.resumeLead}>
                Recruiter-friendly quick view with direct download.
              </p>
              <a
                className={styles.btn}
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Open Full Resume
              </a>
            </div>
            <iframe
              title="Mridul Jain Resume"
              src="/resume.pdf#view=FitH"
              className={styles.resumeFrame}
            />
          </div>
          <p className={styles.footer}>
            Open to SDE opportunities | Backend and Full-Stack roles
          </p>
        </section>
      </div>
    </main>
  );
}
