import { Link } from "@/components";
import type { ExportAllButtonProps } from "@/types";
import styles from "./ExportAllButton.module.css";

/**
 * Displays a result count and an export link button.
 * The link is hidden when there are no rows to export.
 */
export default function ExportAllButton({
  onClick,
  className,
  buttonName,
  resultText,
  rowsLength,
}: ExportAllButtonProps) {
  return (
    <div
      className={`${styles.exportButton} ${className} `}
      data-testid="export-all-container"
    >
      {resultText && (
        <p aria-live="polite" role="status" className={styles.resultText}>
          {resultText}
        </p>
      )}
      {rowsLength !== 0 && (
        <Link
          data-testid="export-all-link"
          tabIndex={0}
          onClick={onClick}
          className={styles.exportLink}
        >
          {buttonName}
        </Link>
      )}
    </div>
  );
}
