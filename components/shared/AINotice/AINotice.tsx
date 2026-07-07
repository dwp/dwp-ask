import { Fragment } from "react";
import { Paragraph, SectionBreak, WarningText } from "@/components";
import { AI_NOTICE_LIST } from "@/constants/AINotice";

/** Renders the AI usage notice content and PII warning shown on the landing page. */
export default function AINotice() {
  return (
    <Fragment>
      <section id="main" tabIndex={-1}>
        {AI_NOTICE_LIST.map((item, index) => (
          <Fragment key={`ai-notice-list-item-${index + 1}`}>
            <Paragraph data-testid={`ai-notice-list-item-${index + 1}`}>
              {item}
            </Paragraph>
            <SectionBreak level="m" visible={false} />
          </Fragment>
        ))}
      </section>

      <WarningText data-testid="ai-notice-pii-warning">
        Do not enter information that can identify your claimant, such as their
        real name, contact details or banking information.
      </WarningText>
    </Fragment>
  );
}
