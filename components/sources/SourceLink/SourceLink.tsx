import {
  createAccordionMarkdownOptions,
  Link,
  SanitisedMarkdown,
} from "@/components";
import type { SourceLinkProps } from "@/types";
import { formatMarkdown, formatTitle } from "@/utils";
import styles from "./SourceLink.module.css";

/**
 * Renders a numbered source citation link with an optional extract preview.
 * Links open the policy document in a new tab.
 */
export default function SourceLink({
  source,
  index,
  showExtract,
}: SourceLinkProps) {
  const options = createAccordionMarkdownOptions(styles);

  return (
    <div data-testid="source-link-wrapper">
      <Link
        target="_blank"
        href={source.highlights_url ?? source.url}
        className={styles.accordion_title + " " + styles.accordion_left}
        data-testid="source-link-title"
      >
        {formatTitle(source.title, index)}
      </Link>
      {showExtract && (
        <div
          className={styles.accordion_content}
          role="alert"
          data-testid="source-link-extract-text"
        >
          <SanitisedMarkdown
            data-testid="source-link-markdown"
            options={options}
          >
            {formatMarkdown(source.chunks)}
          </SanitisedMarkdown>
        </div>
      )}
    </div>
  );
}
