import styles from "./Chevrons.module.css";

export function ChevronUp({ className }: { className?: string }) {
  return (
    <span
      className={`govuk-accordion-nav__chevron ${styles.chevron_spacing} ${className}`}
    ></span>
  );
}

export function ChevronDown({ className }: { className?: string }) {
  return (
    <span
      className={`govuk-accordion-nav__chevron govuk-accordion-nav__chevron--down
        ${styles.chevron_spacing} ${className}`}
    ></span>
  );
}
