import styles from "./SkillPills.module.css";

export default function SkillPills({
  items,
}: {
  items: Array<{ strong: string; rest: string }>;
}) {
  return (
    <div className={styles.pills}>
      {items.map((it) => (
        <div key={`${it.strong}-${it.rest}`} className={styles.pill}>
          <strong>{it.strong}</strong> • {it.rest}
        </div>
      ))}
    </div>
  );
}
