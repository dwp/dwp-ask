import { Link } from "@/app/components";
import styles from "./ExportAllButton.module.css";

export default function ExportAllButton({
  onClick,
  className,
  buttonName,
  resultText,
  rowsLength,
}: {
  onClick?: (
    event:
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>,
  ) => void;
  className?: string;
  buttonName: string;
  resultText?: string;
  rowsLength?: number;
}) {
  return (
    <div
      className={`${styles.exportButton} ${className} `}
      data-testid="export-all-container"
    >
      {resultText && <span className={styles.resultText}>{resultText}</span>}
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
