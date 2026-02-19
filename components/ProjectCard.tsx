import styles from "./ProjectCard.module.css";

export default function ProjectCard({
  title,
  description,
  tags,
  href,
}: {
  title: string;
  description: string;
  tags: string[];
  href?: string;
}) {
  const Content = (
    <>
      <h3 className={styles.h3}>{title}</h3>
      <p className={styles.p}>{description}</p>
      <div className={styles.meta}>
        {tags.map((t) => (
          <span key={t} className={styles.tag}>
            {t}
          </span>
        ))}
      </div>
      {href ? (
        <p className={styles.linkRow}>
          <span className={styles.link}>View →</span>
        </p>
      ) : null}
    </>
  );

  return href ? (
    <a className={styles.card} href={href} target="_blank" rel="noreferrer">
      {Content}
    </a>
  ) : (
    <div className={styles.card}>{Content}</div>
  );
}
