import { H3, H4, H5, H6 } from "@/app/components";
import { SanitisedMarkdownProps } from "../SanitisedMarkdown/SanitisedMarkdown";

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

const createAccordionMarkdownOptions = (
  styles: Record<string, string>,
): SanitisedMarkdownProps["options"] => ({
  overrides: {
    h1: { component: H3 }, // "Extact 1": ... "Extract 2" ...
    h2: { component: H4 }, // Main headings from intranet sources
    h3: { component: H5 }, // Sub-headings from intranet sources
    h4: { component: H6 }, // Sub-headings from intranet sources
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
