"use client";

import { useRouter } from "next/navigation";
import {
  SectionBreak,
  BackLink,
  Main,
  Paragraph,
  LabelText,
  H3,
  UnorderedListItem,
  UnorderedList,
  Analytics,
  Heading,
  Link,
} from "@/app/components";
import styles from "./Accessibility.module.css";

export default function Accessibility() {
  const router = useRouter();

  return (
    <Main>
      <Analytics />
      <BackLink
        data-testid="accessibility-statement-home-link"
        aria-label="Home"
        tabIndex={0}
        onClick={() => router.push("/")}
      >
        <span className={styles.accessibilityBacklink}>Home</span>
      </BackLink>
      <SectionBreak visible={false} level="m" />
      <Heading data-testid="accessibility-statement-heading">
        Accessibility statement for DWP Ask
      </Heading>
      <LabelText>
        This accessibility statement applies to the DWP Ask application. It does
        not cover other DWP tools or services.
        <Paragraph>
          This is DWP Ask’s own accessibility page, with details of how
          accessible the service is and how to report problems. You can access
          this page from the footer inside of the service.
        </Paragraph>
      </LabelText>
      <br></br>
      <LabelText>
        This website is run by{" "}
        <strong>DWP’s AI & Innovation Directorate</strong>.
      </LabelText>
      <br></br>
      <LabelText>
        We want as many people as possible to be able to use this tool. For
        example, that means you should be able to:
      </LabelText>
      <br></br>
      <UnorderedList>
        <UnorderedListItem>
          Change colours, contrast levels and fonts using browser or device
          settings
        </UnorderedListItem>
        <UnorderedListItem>
          Zoom in up to 200% without the text spilling off the screen
        </UnorderedListItem>
        <UnorderedListItem>
          Navigate most of the application using a keyboard or speech
          recognition software
        </UnorderedListItem>
        <UnorderedListItem>
          Listen to most of the application using a screen reader (including the
          most recent versions of JAWS, NVDA and VoiceOver)
        </UnorderedListItem>
        <UnorderedListItem>
          Change the device orientation from horizontal to vertical without
          making it more difficult to view the content
        </UnorderedListItem>
        <UnorderedListItem>
          It is possible for users to change text size without some of the
          content overlapping
        </UnorderedListItem>
      </UnorderedList>
      <br />
      <LabelText>
        We’ve also made the application text as simple as possible to
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
        has advice on making your device easier to use if you have a disability.
      </LabelText>
      <SectionBreak visible={false} level="m" />
      <H3>How accessible this tool is</H3>
      <LabelText>
        We know some parts of this website are not fully accessible, for
        example:
      </LabelText>
      <br />
      <UnorderedList>
        <UnorderedListItem>
          Some tables displayed within source extracts as part of a generated
          response may not be complete tables, which means assistive
          technologies, such as macOS VoiceOver, may not read the content within
          these incomplete tables in an accessible way.
          <UnorderedList>
            <UnorderedListItem>
              Users may be able to obtain this information in an accessible way
              by:
              <UnorderedList>
                <UnorderedListItem>
                  Asking the tool to provide the entire table content in a table
                  format for that specific table
                </UnorderedListItem>
                <UnorderedListItem>
                  Or navigating to the DWP Intranet link provided by DWP Ask
                  where the complete table is shown, and then can be read using
                  assistive technologies
                </UnorderedListItem>
              </UnorderedList>
            </UnorderedListItem>
            <UnorderedListItem>
              This is caused by the current document processing method for the
              documents DWP Ask uses to generate its answers. We plan to correct
              this in a future release so that any table displayed in source
              extracts is a complete table.
            </UnorderedListItem>
          </UnorderedList>
        </UnorderedListItem>
        <UnorderedListItem>
          When using Voice Control software, you may encounter difficulties
          scrolling the chat and new content may not be tagged with numbers
          automatically. This is due to an issue with the Voice Control
          software.
        </UnorderedListItem>
        <UnorderedList>
          <UnorderedListItem>
            To overcome this issue, users can:
            <UnorderedList>
              <UnorderedListItem>
                Say “go to next field” until the focus is set to the next
                element to update the voice control tags
              </UnorderedListItem>
              <UnorderedListItem>
                Say “go to next field” until the focus is set to the scrollable
                container so that the chat can be scrolled using Voice Control
              </UnorderedListItem>
            </UnorderedList>
          </UnorderedListItem>
        </UnorderedList>
        <UnorderedListItem>
          There’s a limit to how far you can scroll through the chat and view
          the messages when zooming to 400%
        </UnorderedListItem>
        <UnorderedListItem>
          On the Chat History screen, users of assistive technologies may find
          it difficult to identify the record they are looking for. Users can
          minimise the number of returned records in the table to search through
          by setting the date filter to a small range. This will be an area for
          future improvement of DWP Ask.
        </UnorderedListItem>
      </UnorderedList>
      <SectionBreak visible={false} level="m" />
      <br />
      <H3>Feedback and contact information</H3>
      <LabelText>
        If you find any problems not listed on this page or think we’re not
        meeting accessibility requirements, contact:{" "}
        <Link
          href="mailto:digitalgroup.cassitgn@DWP.GOV.UK"
          className={`${styles.noUnderline} ${styles.link}`}
          target="_blank"
        >
          digitalgroup.cassitgn@DWP.GOV.UK
        </Link>
        .
      </LabelText>
      <SectionBreak visible={false} level="m" />
      <H3>Enforcement procedure</H3>
      <Paragraph>
        The Equality and Human Rights Commission (EHRC) is responsible for
        enforcing the Public Sector Bodies (Websites and Mobile Applications)
        (No. 2) Accessibility Regulations 2018 (the ‘accessibility
        regulations’).
      </Paragraph>
      <LabelText>
        If you’re not happy with how we respond to your complaint,{" "}
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
      <H3>Technical information about this website’s accessibility</H3>
      <Paragraph>
        DWP is committed to making its website accessible, in accordance with
        the Public Sector Bodies (Websites and Mobile Applications) (No. 2)
        Accessibility Regulations 2018.
      </Paragraph>
      <H3>Compliance status</H3>
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
      <H3>
        Content that’s not within the scope of the accessibility regulations
      </H3>
      <Paragraph>
        There are a handful of documents which contain embedded videos. In these
        cases, given the complex technical process to search on videos, the
        video content is not used to generate the response, but we have included
        the remaining content on the page as a source.
      </Paragraph>
      <Paragraph>
        However, this will have a low impact in responses as most of the pages
        containing videos have a transcript, therefore the impact of not
        including videos as sources is low as content will be covered in
        transcripts, and thus included in DWP Ask responses. Furthermore, users
        can use the source links provided by DWP Ask to access the videos.
      </Paragraph>
      <SectionBreak visible={false} level="m" />
      <H3>Preparation of this accessibility statement</H3>
      <LabelText>
        This statement was prepared on 25 September 2024. It was last reviewed
        on 12 June 2025.
      </LabelText>
      <br />
      <LabelText>
        This website was last tested on 12 June 2025 against the WCAG 2.2 AA
        standard.
      </LabelText>
      <br />
      <LabelText>
        The test was carried out by the DWP Ask Quality Assurance team. The
        landing page, chat window, AI notice and accessibility statement pages
        were tested manually and using automated and assistive technology tools.
      </LabelText>
      <SectionBreak visible={false} level="m" />
    </Main>
  );
}
