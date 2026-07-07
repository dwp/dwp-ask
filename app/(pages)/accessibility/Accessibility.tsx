"use client";

import { useRouter } from "next/navigation";
import { Fragment } from "react";
import {
  Analytics,
  BackLink,
  LabelText,
  Link,
  Main,
  Paragraph,
  SectionBreak,
  Title,
  UnorderedList,
  UnorderedListItem,
} from "@/components";
import {
  INACCESSIBILE_EXAMPLES,
  PREPARATION_CONSTANTS,
  SUPPORT_EMAIL,
  USABILITY_EXAMPLES,
} from "@/constants/Accessibilty";
import styles from "./Accessibility.module.css";

export default function Accessibility() {
  const router = useRouter();

  return (
    <Main>
      <Analytics />
      <BackLink
        data-testid="accessibility-statement-home-link"
        aria-label="Back"
        tabIndex={0}
        onClick={() => router.push("/chat")}
      >
        <span className={styles.accessibilityBacklink}>Back</span>
      </BackLink>
      <SectionBreak visible={false} level="m" />
      <Title level="h1" data-testid="accessibility-statement-heading">
        Accessibility statement for DWP Ask
      </Title>
      <section id="main" tabIndex={-1}>
        {" "}
        <LabelText>
          This accessibility statement applies to the DWP Ask application. It
          does not cover other DWP tools or services.
          <Paragraph>
            This is DWP Ask&apos;s own accessibility page, with details of how
            accessible the service is and how to report a problem.
          </Paragraph>
        </LabelText>
        <br></br>
        <LabelText>
          This website is run by{" "}
          <strong>DWP&apos;s AI & Innovation Function</strong>.
        </LabelText>
        <br></br>
        <LabelText>
          We want as many people as possible to be able to use this tool. For
          example, that means you should be able to:
        </LabelText>
        <br></br>
        <UnorderedList>
          {USABILITY_EXAMPLES.map((example, index) => (
            <UnorderedListItem key={index}>{example}</UnorderedListItem>
          ))}
        </UnorderedList>
        <br />
        <LabelText>
          We&apos;ve also made the application text as simple as possible to
          understand.
        </LabelText>
        <br />
        <LabelText>
          <Link
            href="https://mcmw.abilitynet.org.uk/"
            className={`${styles.link}`}
            target="_blank"
          >
            AbilityNet
          </Link>{" "}
          has advice on making your device easier to use if you have a
          disability.
        </LabelText>
        <SectionBreak visible={false} level="m" />
        <Title level="h3">How accessible this tool is</Title>
        <LabelText>
          We know some parts of this website are not fully accessible, for
          example:
        </LabelText>
        <br />
        <UnorderedList>
          {INACCESSIBILE_EXAMPLES.map((example, index) => (
            <Fragment key={index}>
              <UnorderedListItem>{example.description}</UnorderedListItem>
              {example.solutions && (
                <UnorderedList>
                  <UnorderedListItem>
                    To overcome this issue, users can:
                  </UnorderedListItem>
                  <UnorderedList>
                    {example.solutions.map((solution, si) => (
                      <UnorderedListItem key={si}>{solution}</UnorderedListItem>
                    ))}
                  </UnorderedList>
                </UnorderedList>
              )}
            </Fragment>
          ))}
        </UnorderedList>
        <SectionBreak visible={false} level="m" />
        <br />
        <Title level="h3">Feedback and contact information</Title>
        <LabelText>
          If you find any problems not listed on this page or think we&apos;re
          not meeting accessibility requirements, contact:{" "}
          <Link
            href={`mailto:${SUPPORT_EMAIL}`}
            className={`${styles.noUnderline} ${styles.link}`}
            target="_blank"
          >
            {SUPPORT_EMAIL}
          </Link>
          .
        </LabelText>
        <SectionBreak visible={false} level="m" />
        <Title level="h3">Enforcement procedure</Title>
        <Paragraph>
          The Equality and Human Rights Commission (EHRC) is responsible for
          enforcing the Public Sector Bodies (Websites and Mobile Applications)
          (No. 2) Accessibility Regulations 2018 (the &apos;accessibility
          regulations&apos;).
        </Paragraph>
        <LabelText>
          If you&apos;re not happy with how we respond to your complaint,{" "}
          <Link
            href="https://www.equalityadvisoryservice.com/"
            className={`${styles.underline} ${styles.link}`}
            target="_blank"
          >
            contact the Equality Advisory and Support Service (EASS)
          </Link>
          .
        </LabelText>
        <br />
        <br />
        <Title level="h3">
          Technical information about this website&apos;s accessibility
        </Title>
        <Paragraph>
          DWP is committed to making its website accessible, in accordance with
          the Public Sector Bodies (Websites and Mobile Applications) (No. 2)
          Accessibility Regulations 2018.
        </Paragraph>
        <Title level="h3">Compliance status</Title>
        <LabelText>
          This website is fully compliant with the{" "}
          <Link
            href="https://www.w3.org/TR/WCAG22/"
            className={`${styles.noUnderline} ${styles.link}`}
            target="_blank"
          >
            Web Content Accessibility Guidelines version 2.2
          </Link>{" "}
          AA standard.
        </LabelText>
        <SectionBreak visible={false} level="m" />
        <Title level="h3">
          Content that&apos;s not within the scope of the accessibility
          regulations
        </Title>
        <Paragraph>
          There are a handful of documents which contain embedded videos. In
          these cases, given the complex technical process to search on videos,
          the video content is not used to generate the response, but we have
          included the remaining content on the page as a source.
        </Paragraph>
        <Paragraph>
          However, this will have a low impact in responses as most of the pages
          containing videos have a transcript, therefore the impact of not
          including videos as sources is low as content will be covered in
          transcripts, and thus included in DWP Ask responses. Furthermore,
          users can use the source links provided by DWP Ask to access the
          videos.
        </Paragraph>
        <SectionBreak visible={false} level="m" />
        <Title level="h3">Preparation of this accessibility statement</Title>
        <LabelText>
          This statement was prepared on {PREPARATION_CONSTANTS.preparedDate}.
          It was last reviewed on {PREPARATION_CONSTANTS.lastReviewedDate}.
        </LabelText>
        <br />
        <LabelText>
          This website was last tested on {PREPARATION_CONSTANTS.lastTestedDate}{" "}
          against the WCAG 2.2 AA standard.
        </LabelText>
        <br />
        <LabelText>
          The test was carried out by the DWP Ask Quality Assurance team. The
          landing page, chat window, AI notice and accessibility statement pages
          were tested manually, and using automated and assistive technology
          tools.
        </LabelText>
      </section>

      <SectionBreak visible={false} level="m" />
    </Main>
  );
}
