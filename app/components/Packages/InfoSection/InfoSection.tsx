import React from "react";
import styles from "./InfoSection.module.css";

type InfoSectionProps = {
  title: string;
  subtitle?: string;
  listItems?: string[];
  descriptionText?: string;
};

export default function InfoSection({
  title,
  subtitle,
  listItems = [],
  descriptionText = "",
}: InfoSectionProps) {
  return (
    <section className={styles.infoSection} data-testid="info-section">
      <h3 className={styles.title} data-testid="info-section-title">
        {title}
      </h3>
      {subtitle && (
        <h4 className={styles.subtitle} data-testid="info-section-subtitle">
          {subtitle}
        </h4>
      )}
      {listItems.length > 0 && (
        <ul className={styles.unorderedList} data-testid="info-section-list">
          {listItems.map((item, idx) => (
            <li key={idx} data-testid="info-section-list-item">
              {item}
            </li>
          ))}
        </ul>
      )}
      {descriptionText && (
        <div
          className={styles.descriptionList}
          data-testid="info-section-description"
        >
          <span className={styles.descriptionTitle}>More detail:</span>
          <span
            className={styles.descriptionContent}
            data-testid="info-section-description-text"
          >
            {descriptionText}
          </span>
        </div>
      )}
    </section>
  );
}
