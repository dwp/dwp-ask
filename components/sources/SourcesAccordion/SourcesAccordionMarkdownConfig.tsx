import { Title } from "@/components";
import type { SanitisedMarkdownProps } from "@/components/shared/SanitisedMarkdown/SanitisedMarkdown";

/**
 * Helper component so VoiceOver/screen readers can state the following text is a link e.g. "Link. <Display text for link>"
 *
 * @param children display text for link
 * @param props other props e.g. className
 * @returns void
 */
const MarkDownLink = ({
  children,
  ...props
}: {
  children: React.ReactNode;
}) => (
  <a {...props} aria-label={`link. ${children}`}>
    {children}
  </a>
);

/**
 * Creates markdown-to-jsx options for rendering source accordion content.
 * Maps heading levels, links, paragraphs, lists, and tables to GOV.UK-styled elements.
 *
 * @param styles CSS module styles to apply to rendered elements
 * @returns markdown-to-jsx options configuration
 */
const createAccordionMarkdownOptions = (
  styles: Record<string, string>,
): SanitisedMarkdownProps["options"] => ({
  overrides: {
    h1: { component: Title, props: { level: "h3" } }, // "Extact 1": ... "Extract 2" ...
    h2: { component: Title, props: { level: "h4" } }, // Main headings from intranet sources
    h3: { component: Title, props: { level: "h5" } }, // Sub-headings from intranet sources
    h4: { component: Title, props: { level: "h6" } }, // Sub-headings from intranet sources
    a: {
      component: MarkDownLink,
      props: {
        target: "_blank",
        className: styles.markdown_link,
      },
    },
    p: { props: { className: styles.accordion_text } },
    li: {
      props: { className: styles.markdown_list_item },
    },
    td: { props: { className: styles.govuk_table__row } },
    th: { props: { className: styles.govuk_table__header } },
    table: { props: { className: styles.govuk_table } },
    code: { component: "div", props: { className: styles.answer__text } },
    pre: { component: "div", props: { className: styles.answer__text } },
  },
});

export { createAccordionMarkdownOptions };
