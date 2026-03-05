import styles from "./Chevrons.module.css";

export function ChevronUp() {
  return (
    <span
      className={`govuk-accordion-nav__chevron ${styles.chevron_spacing}`}
    ></span>
  );
}

export function ChevronDown() {
  return (
    <span
      className={`govuk-accordion-nav__chevron govuk-accordion-nav__chevron--down
        ${styles.chevron_spacing}`}
    ></span>
  );
}
