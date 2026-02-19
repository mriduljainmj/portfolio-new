"use client";

import { useMemo, useState } from "react";
import {
  fallbackPortfolioData,
  type PortfolioCardItem,
  type PortfolioData,
  type SkillPillItem,
  type TerminalLine,
} from "@/lib/portfolio-data";
import styles from "./page.module.css";

function parseTags(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function tagsToString(tags: string[]): string {
  return tags.join(", ");
}

export default function ManagePage() {
  const [adminKey, setAdminKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState<PortfolioData>(fallbackPortfolioData);

  const headers = useMemo(
    () => ({
      "Content-Type": "application/json",
      "x-admin-key": adminKey,
    }),
    [adminKey],
  );

  async function loadData() {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/portfolio", { headers });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error || `Failed to load (${response.status})`);
      }

      const payload = (await response.json()) as PortfolioData;
      setData(payload);
      setMessage("Loaded current data from Supabase.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  async function saveData() {
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/portfolio", {
        method: "PUT",
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error || `Failed to save (${response.status})`);
      }

      setMessage("Saved successfully to Supabase.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save data");
    } finally {
      setSaving(false);
    }
  }

  function updateProfileField<K extends keyof PortfolioData["profile"]>(
    key: K,
    value: PortfolioData["profile"][K],
  ) {
    setData((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        [key]: value,
      },
    }));
  }

  function updateRecruiterField<K extends keyof PortfolioData["recruiter"]>(
    key: K,
    value: PortfolioData["recruiter"][K],
  ) {
    setData((prev) => ({
      ...prev,
      recruiter: {
        ...prev.recruiter,
        [key]: value,
      },
    }));
  }

  function updateTerminalLine(index: number, patch: Partial<TerminalLine>) {
    setData((prev) => {
      const next = [...prev.terminalLines];
      next[index] = { ...next[index], ...patch };
      return { ...prev, terminalLines: next };
    });
  }

  function updateSkillPill(index: number, patch: Partial<SkillPillItem>) {
    setData((prev) => {
      const next = [...prev.skillPills];
      next[index] = { ...next[index], ...patch } as SkillPillItem;
      return { ...prev, skillPills: next };
    });
  }

  function updateCard(
    section: "competencies" | "featuredProjects",
    index: number,
    patch: Partial<PortfolioCardItem>,
  ) {
    setData((prev) => {
      const next = [...prev[section]];
      next[index] = { ...next[index], ...patch };
      return { ...prev, [section]: next };
    });
  }

  function addItem(section: "terminalLines" | "skillPills" | "competencies" | "featuredProjects") {
    setData((prev) => {
      if (section === "terminalLines") {
        return {
          ...prev,
          terminalLines: [...prev.terminalLines, { type: "cmd", text: "" }],
        };
      }
      if (section === "skillPills") {
        return {
          ...prev,
          skillPills: [...prev.skillPills, { strong: "", rest: "" }],
        };
      }
      const nextCard: PortfolioCardItem = {
        title: "",
        description: "",
        tags: [],
        href: "",
      };
      return {
        ...prev,
        [section]: [...prev[section], nextCard],
      };
    });
  }

  function removeItem(
    section: "terminalLines" | "skillPills" | "competencies" | "featuredProjects",
    index: number,
  ) {
    setData((prev) => {
      const next = [...prev[section]];
      next.splice(index, 1);
      return { ...prev, [section]: next };
    });
  }

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <h1>Portfolio Data Manager</h1>
          <p>Edit content and push updates directly to Supabase.</p>
        </header>

        <section className={styles.authCard}>
          <label className={styles.field}>
            <span>Admin Key (optional if not configured)</span>
            <input
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="ADMIN_DASHBOARD_KEY"
              type="password"
            />
          </label>
          <div className={styles.row}>
            <button type="button" className={styles.btnAlt} onClick={loadData}>
              {loading ? "Loading..." : "Load from Supabase"}
            </button>
            <button type="button" className={styles.btn} onClick={saveData}>
              {saving ? "Saving..." : "Save to Supabase"}
            </button>
          </div>
          {message ? <p className={styles.ok}>{message}</p> : null}
          {error ? <p className={styles.err}>{error}</p> : null}
        </section>

        <section className={styles.card}>
          <h2>Profile</h2>
          <div className={styles.grid2}>
            <label className={styles.field}>
              <span>Name</span>
              <input
                value={data.profile.name}
                onChange={(e) => updateProfileField("name", e.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span>Headline</span>
              <input
                value={data.profile.headline}
                onChange={(e) => updateProfileField("headline", e.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span>Email</span>
              <input
                value={data.profile.email}
                onChange={(e) => updateProfileField("email", e.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span>Meeting Link</span>
              <input
                value={data.profile.meetingLink}
                onChange={(e) => updateProfileField("meetingLink", e.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span>GitHub URL</span>
              <input
                value={data.profile.githubUrl}
                onChange={(e) => updateProfileField("githubUrl", e.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span>LinkedIn URL</span>
              <input
                value={data.profile.linkedinUrl}
                onChange={(e) => updateProfileField("linkedinUrl", e.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span>Resume URL</span>
              <input
                value={data.profile.resumeUrl}
                onChange={(e) => updateProfileField("resumeUrl", e.target.value)}
              />
            </label>
          </div>
          <label className={styles.field}>
            <span>Subtitle</span>
            <textarea
              value={data.profile.subtitle}
              onChange={(e) => updateProfileField("subtitle", e.target.value)}
              rows={2}
            />
          </label>
          <label className={styles.field}>
            <span>Hiring Focus</span>
            <textarea
              value={data.profile.hiringFocus}
              onChange={(e) => updateProfileField("hiringFocus", e.target.value)}
              rows={2}
            />
          </label>
        </section>

        <section className={styles.card}>
          <h2>Recruiter Strip</h2>
          <div className={styles.grid2}>
            <label className={styles.field}>
              <span>Status</span>
              <input
                value={data.recruiter.status}
                onChange={(e) => updateRecruiterField("status", e.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span>Role</span>
              <input
                value={data.recruiter.role}
                onChange={(e) => updateRecruiterField("role", e.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span>Location</span>
              <input
                value={data.recruiter.location}
                onChange={(e) => updateRecruiterField("location", e.target.value)}
              />
            </label>
            <label className={styles.field}>
              <span>Notice Period</span>
              <input
                value={data.recruiter.noticePeriod}
                onChange={(e) =>
                  updateRecruiterField("noticePeriod", e.target.value)
                }
              />
            </label>
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHead}>
            <h2>Terminal Lines</h2>
            <button
              type="button"
              className={styles.btnAlt}
              onClick={() => addItem("terminalLines")}
            >
              Add Line
            </button>
          </div>
          {data.terminalLines.map((line, idx) => (
            <div key={idx} className={styles.itemCard}>
              <div className={styles.grid2}>
                <label className={styles.field}>
                  <span>Type</span>
                  <select
                    value={line.type}
                    onChange={(e) =>
                      updateTerminalLine(idx, {
                        type: e.target.value as "cmd" | "output",
                      })
                    }
                  >
                    <option value="cmd">cmd</option>
                    <option value="output">output</option>
                  </select>
                </label>
                <button
                  type="button"
                  className={styles.danger}
                  onClick={() => removeItem("terminalLines", idx)}
                >
                  Remove
                </button>
              </div>
              <label className={styles.field}>
                <span>Text</span>
                <textarea
                  value={line.text}
                  onChange={(e) =>
                    updateTerminalLine(idx, { text: e.target.value })
                  }
                  rows={2}
                />
              </label>
            </div>
          ))}
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHead}>
            <h2>Skill Pills</h2>
            <button
              type="button"
              className={styles.btnAlt}
              onClick={() => addItem("skillPills")}
            >
              Add Skill
            </button>
          </div>
          {data.skillPills.map((item, idx) => (
            <div key={idx} className={styles.itemCard}>
              <div className={styles.grid2}>
                <label className={styles.field}>
                  <span>Strong</span>
                  <input
                    value={item.strong}
                    onChange={(e) =>
                      updateSkillPill(idx, { strong: e.target.value })
                    }
                  />
                </label>
                <label className={styles.field}>
                  <span>Rest</span>
                  <input
                    value={item.rest}
                    onChange={(e) =>
                      updateSkillPill(idx, { rest: e.target.value })
                    }
                  />
                </label>
              </div>
              <button
                type="button"
                className={styles.danger}
                onClick={() => removeItem("skillPills", idx)}
              >
                Remove
              </button>
            </div>
          ))}
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHead}>
            <h2>Competencies</h2>
            <button
              type="button"
              className={styles.btnAlt}
              onClick={() => addItem("competencies")}
            >
              Add Competency
            </button>
          </div>
          {data.competencies.map((item, idx) => (
            <div key={idx} className={styles.itemCard}>
              <div className={styles.grid2}>
                <label className={styles.field}>
                  <span>Title</span>
                  <input
                    value={item.title}
                    onChange={(e) =>
                      updateCard("competencies", idx, { title: e.target.value })
                    }
                  />
                </label>
                <label className={styles.field}>
                  <span>Tags (comma separated)</span>
                  <input
                    value={tagsToString(item.tags)}
                    onChange={(e) =>
                      updateCard("competencies", idx, {
                        tags: parseTags(e.target.value),
                      })
                    }
                  />
                </label>
              </div>
              <label className={styles.field}>
                <span>Description</span>
                <textarea
                  value={item.description}
                  onChange={(e) =>
                    updateCard("competencies", idx, {
                      description: e.target.value,
                    })
                  }
                  rows={2}
                />
              </label>
              <button
                type="button"
                className={styles.danger}
                onClick={() => removeItem("competencies", idx)}
              >
                Remove
              </button>
            </div>
          ))}
        </section>

        <section className={styles.card}>
          <div className={styles.sectionHead}>
            <h2>Featured Projects</h2>
            <button
              type="button"
              className={styles.btnAlt}
              onClick={() => addItem("featuredProjects")}
            >
              Add Project
            </button>
          </div>
          {data.featuredProjects.map((item, idx) => (
            <div key={idx} className={styles.itemCard}>
              <div className={styles.grid2}>
                <label className={styles.field}>
                  <span>Title</span>
                  <input
                    value={item.title}
                    onChange={(e) =>
                      updateCard("featuredProjects", idx, {
                        title: e.target.value,
                      })
                    }
                  />
                </label>
                <label className={styles.field}>
                  <span>Project URL</span>
                  <input
                    value={item.href ?? ""}
                    onChange={(e) =>
                      updateCard("featuredProjects", idx, {
                        href: e.target.value,
                      })
                    }
                  />
                </label>
              </div>
              <label className={styles.field}>
                <span>Tags (comma separated)</span>
                <input
                  value={tagsToString(item.tags)}
                  onChange={(e) =>
                    updateCard("featuredProjects", idx, {
                      tags: parseTags(e.target.value),
                    })
                  }
                />
              </label>
              <label className={styles.field}>
                <span>Description</span>
                <textarea
                  value={item.description}
                  onChange={(e) =>
                    updateCard("featuredProjects", idx, {
                      description: e.target.value,
                    })
                  }
                  rows={2}
                />
              </label>
              <button
                type="button"
                className={styles.danger}
                onClick={() => removeItem("featuredProjects", idx)}
              >
                Remove
              </button>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
