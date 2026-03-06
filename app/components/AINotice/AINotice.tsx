import { Fragment } from "react";
import { AINoticeList } from "@/app/content/AINotice";
import Paragraph from "../Packages/Paragraph/Paragraph";
import SectionBreak from "../Packages/SectionBreak/SectionBreak";
import WarningText from "../Packages/WarningText/WarningText";

export default function AINotice() {
  return (
    <Fragment>
      <section id="main" tabIndex={-1}>
        {AINoticeList.map((item, index) => (
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
