import type { InfoSectionProps } from "@/types";
import InfoSectionList from "./InfoSectionList";

/**
 * Structured information section with a title, optional subtitle,
 * bullet-point list, and expandable description text.
 */
export default function InfoSection({
  title,
  subtitle,
  topics,
  listItems = [],
  descriptionText = "",
}: InfoSectionProps) {
  return (
    <section data-testid="info-section">
      <InfoSectionList
        title="Topics this question relates to:"
        items={topics?.map((topic) => topic.name) ?? []}
        fallbackText="No topics were classified at the time this response was generated."
        topicOutOfScope={
          topics?.filter((topic) => topic.category === "out_of_scope").length >
          0
        }
      />

      <InfoSectionList
        title={title}
        subtitle={subtitle}
        items={listItems}
        descriptionText={descriptionText}
      />
    </section>
  );
}
