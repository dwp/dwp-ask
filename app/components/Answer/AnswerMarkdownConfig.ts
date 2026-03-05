import { H3, H4, H5, Link, LabelText } from "@/app/components";
import { SanitisedMarkdownProps } from "../SanitisedMarkdown/SanitisedMarkdown";

const createAnswerMarkdownOptions = (
  styles: Record<string, string>,
): SanitisedMarkdownProps["options"] => ({
  overrides: {
    p: { props: { className: styles.answer__text } },
    h3: { component: H3 },
    h4: { component: H4 },
    h5: { component: H5 },
    li: {
      props: { className: styles.markdown_list_item },
    },
    span: {
      component: LabelText,
      props: { className: styles.markdown_span_paragraph },
    },
    a: {
      component: Link,
      props: { target: "_blank", className: styles.markdown_link },
    },
    td: { props: { className: styles.govuk_table__row } },
    th: { props: { className: styles.govuk_table__header } },
    table: { props: { className: styles.govuk_table } },
    code: { component: "div", props: { className: styles.answer__text } },
    pre: { component: "div", props: { className: styles.answer__text } },
  },
});

export { createAnswerMarkdownOptions };
