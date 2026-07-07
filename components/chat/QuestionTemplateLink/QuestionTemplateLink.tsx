import {
  Link,
  openQuestionTemplatesPanel,
  SanitisedMarkdown,
} from "@/components";
import type { QuestionTemplateLinkProps } from "@/types";
import styles from "./QuestionTemplateLink.module.css";

const TEMPLATE_TRIGGER_REGEX = /a template/gi;

/**
 * Renders markdown copy and converts occurrences of "a template" into
 * clickable links that open the question templates panel.
 */
export default function QuestionTemplateLink({
  copy,
  options,
}: QuestionTemplateLinkProps) {
  if (!copy) return null;
  const matches = [...copy.matchAll(TEMPLATE_TRIGGER_REGEX)];

  if (matches.length === 0) {
    return (
      <SanitisedMarkdown
        options={options}
        className={styles.markdownContainer}
        data-testid="no-template-matches-md"
      >
        {copy}
      </SanitisedMarkdown>
    );
  }

  const handleTemplateLinkClick = () => {
    openQuestionTemplatesPanel();
  };

  const templateLinkHref = "#question-feedback-template-link";
  const processedCopy = copy.replace(
    TEMPLATE_TRIGGER_REGEX,
    (match) => `[${match}](${templateLinkHref})`,
  );

  const templateAwareOptions = {
    ...options,
    overrides: {
      ...(options?.overrides ?? {}),
      a: {
        component: Link,
        props: {
          onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault();
            handleTemplateLinkClick();
          },
          className: styles.markdown_link,
          "data-testid": "question-feedback-template-link",
          href: templateLinkHref,
        },
      },
    },
  };

  return (
    <SanitisedMarkdown
      options={templateAwareOptions}
      className={styles.markdownContainer}
    >
      {processedCopy}
    </SanitisedMarkdown>
  );
}
