"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./TerminalIntro.module.css";

type Line = { type: "cmd"; text: string } | { type: "output"; text: string };

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function TerminalIntro({ lines }: { lines: Line[] }) {
  const [rendered, setRendered] = useState<
    Array<{ kind: "cmd" | "output"; text: string }>
  >([]);
  const [typing, setTyping] = useState<{ index: number; text: string } | null>(
    null,
  );
  const containerRef = useRef<HTMLDivElement | null>(null);

  const safeLines = useMemo(() => lines ?? [], [lines]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setRendered([]);
      setTyping(null);

      for (let i = 0; i < safeLines.length; i++) {
        if (cancelled) return;

        const item = safeLines[i];

        if (item.type === "cmd") {
          // add a new command line with empty text, then type into it
          setRendered((prev) => [...prev, { kind: "cmd", text: "" }]);
          await sleep(120);

          for (let k = 0; k <= item.text.length; k++) {
            if (cancelled) return;
            const slice = item.text.slice(0, k);
            setTyping({ index: i, text: slice });
            setRendered((prev) => {
              const copy = [...prev];
              // last item should be the cmd we just inserted
              copy[copy.length - 1] = { kind: "cmd", text: slice };
              return copy;
            });
            await sleep(16);
          }

          setTyping(null);
          await sleep(240);
        } else {
          setRendered((prev) => [...prev, { kind: "output", text: item.text }]);
          await sleep(220);
        }

        // auto-scroll
        requestAnimationFrame(() => {
          const el = containerRef.current;
          if (!el) return;
          el.scrollTop = el.scrollHeight;
        });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [safeLines]);

  return (
    <section className={styles.terminal} aria-label="Terminal intro">
      <div className={styles.header}>
        <div className={styles.dots}>
          <span className={`${styles.dot} ${styles.red}`} />
          <span className={`${styles.dot} ${styles.yellow}`} />
          <span className={`${styles.dot} ${styles.green}`} />
        </div>
        <div className={styles.title}>~/portfolio — bash</div>
      </div>

      <div className={styles.body} ref={containerRef}>
        {rendered.map((l, idx) => {
          if (l.kind === "cmd") {
            const showCursor = typing && idx === rendered.length - 1;
            return (
              <div key={idx} className={styles.line}>
                <span className={styles.prompt}>➜</span>
                <span className={styles.path}>~/portfolio</span>
                <span className={styles.cmd}>
                  {l.text}
                  {showCursor ? <span className={styles.cursor} /> : null}
                </span>
              </div>
            );
          }

          // outputs
          return (
            <div key={idx} className={styles.line}>
              <span className={styles.output}>{l.text}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
