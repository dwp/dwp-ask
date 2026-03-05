import { Link, SanitisedMarkdown } from "@/app/components";
import { formatTitle, formatMarkdown } from "@/app/utils/message-helpers";
import { createAccordionMarkdownOptions } from "../../SourcesAccordion/SourcesAccordionMarkdownConfig";
import styles from "./SourceLink.module.css";

type SourceLinkProps = {
  source: { title: string; url: string; chunks: string };
  index: number;
  showExtract?: boolean;
};

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
        href={source.url}
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
