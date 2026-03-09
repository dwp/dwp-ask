import type { StructuredFeedbackProps } from "@/app/types";
import Link from "../Packages/Link/Link";
import { openQuestionTemplatesPanel } from "../Packages/QuestionTemplates/questionTemplatesController";
import SanitisedMarkdown from "../SanitisedMarkdown/SanitisedMarkdown";
import styles from "./StructuredFeedback.module.css";

const TEMPLATE_TRIGGER_REGEX = /a question template/gi;

export default function StructuredFeedback({
  copy,
  options,
}: StructuredFeedbackProps) {
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
