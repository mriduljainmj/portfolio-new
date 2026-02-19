"use client";

import { CSSProperties, useEffect, useRef, useState } from "react";
import TerminalIntro from "@/components/TerminalIntro";
import ProjectCard from "@/components/ProjectCard";
import SkillPills from "@/components/SkillPills";
import {
  fallbackPortfolioData,
  type PortfolioData,
} from "@/lib/portfolio-data";
import styles from "./page.module.css";

const sectionItems = [
  { id: "home", label: "Intro" },
  { id: "skills", label: "Skills" },
  { id: "impact", label: "Impact" },
  { id: "projects", label: "Projects" },
  { id: "resume", label: "Resume" },
];

export default function Page() {
  const snapRef = useRef<HTMLDivElement | null>(null);
  const [activeSection, setActiveSection] = useState(sectionItems[0].id);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [meetingOpen, setMeetingOpen] = useState(false);
  const [portfolioData, setPortfolioData] =
    useState<PortfolioData>(fallbackPortfolioData);

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

  useEffect(() => {
    let cancelled = false;

    async function loadPortfolioData() {
      try {
        const response = await fetch("/api/portfolio", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as PortfolioData;
        if (!cancelled) {
          setPortfolioData(data);
        }
      } catch {
        // Keep fallback data on errors.
      }
    }

    loadPortfolioData();

    return () => {
      cancelled = true;
    };
  }, []);

  const pageStyle = {
    "--scroll-progress": scrollProgress.toString(),
    "--parallax-shift": `${scrollProgress * 90}px`,
  } as CSSProperties;

  const meetingLink = portfolioData.profile.meetingLink;
  const resumeUrl = portfolioData.profile.resumeUrl;
  const emailAddress = portfolioData.profile.email;

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
          <a className={styles.btnAlt} href={`mailto:${emailAddress}`}>
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
              <span className={styles.recruiterTag}>
                {portfolioData.recruiter.status}
              </span>
              <span className={styles.recruiterFact}>
                Role: {portfolioData.recruiter.role}
              </span>
              <span className={styles.recruiterFact}>
                Location: {portfolioData.recruiter.location}
              </span>
              <a
                className={styles.recruiterFactLink}
                href={`mailto:${emailAddress}`}
              >
                Email: {emailAddress}
              </a>
              <span className={styles.recruiterFact}>
                Notice Period: {portfolioData.recruiter.noticePeriod}
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
              <TerminalIntro lines={portfolioData.terminalLines} />
            </div>

            <aside className={styles.profilePanel}>
              <p className={styles.kicker}>Open to backend-heavy SDE roles</p>
              <h1 className={styles.h1}>{portfolioData.profile.name}</h1>
              <p className={styles.subtitle}>{portfolioData.profile.subtitle}</p>
              <p className={styles.jobFocus}>{portfolioData.profile.hiringFocus}</p>

              <div className={styles.quickStats}>
                <span>API Design</span>
                <span>Data Modeling</span>
                <span>Observability</span>
              </div>

              <div className={styles.actions}>
                <a
                  className={styles.btn}
                  href={portfolioData.profile.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
                <a
                  className={styles.btn}
                  href={portfolioData.profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  className={styles.btn}
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Resume
                </a>
                <a className={styles.btnAlt} href="#resume">
                  View Resume
                </a>
              </div>

              <SkillPills items={portfolioData.skillPills} />
            </aside>
          </div>
        </section>

        <section id="skills" className={styles.section}>
          <h2 className={styles.sectionTitle}>Core Competencies</h2>
          <div className={styles.grid2}>
            {portfolioData.competencies.map((item, index) => (
              <ProjectCard
                key={`${item.title}-${index}`}
                title={item.title}
                description={item.description}
                tags={item.tags}
                href={item.href}
              />
            ))}
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
                Design focus: low-latency reads, consistent writes, and resilient
                retries.
              </p>
            </article>
          </div>
        </section>

        <section id="projects" className={styles.section}>
          <h2 className={styles.sectionTitle}>Featured Projects</h2>
          <div className={styles.grid2}>
            {portfolioData.featuredProjects.map((item, index) => (
              <ProjectCard
                key={`${item.title}-${index}`}
                title={item.title}
                description={item.description}
                tags={item.tags}
                href={item.href}
              />
            ))}
          </div>
          <p className={styles.footer}>
            Copyright {new Date().getFullYear()} {portfolioData.profile.name}
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
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
              >
                Open Full Resume
              </a>
            </div>
            <iframe
              title={`${portfolioData.profile.name} Resume`}
              src={`${resumeUrl}#view=FitH`}
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
