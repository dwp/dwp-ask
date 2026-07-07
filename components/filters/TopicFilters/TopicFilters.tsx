import { Checkbox, Paragraph, Radio } from "@/components";
import { FILTER_IDS } from "@/constants/Ids";
import type { TopicFiltersProps } from "@/types";
import { capitaliseHyphenatedString } from "@/utils";

export default function TopicFilters({
  topicList,
  topicsSelected,
  setTopicsSelected,
}: TopicFiltersProps) {
  const inScopeTopics = topicList.filter(
    (topic) => topic.category === "in_scope",
  );
  const outOfScopeTopics = topicList.filter(
    (topic) => topic.category === "out_of_scope",
  );

  return (
    <div id={FILTER_IDS.topics} data-testid="topics-filters">
      <Paragraph data-testid="accordion-filter-item-title">
        <strong>UC question topics</strong>
      </Paragraph>

      <Paragraph className="govuk-hint">
        All questions will fall under more than just one topic.
      </Paragraph>

      <section className="mb-5" data-testid="in-scope-topic-filters">
        {inScopeTopics.map((topic) => (
          <Checkbox
            key={topic.id}
            id={topic.id.toString()}
            value={topic.name}
            aria-checked={topicsSelected.inScope.includes(topic.name)}
            checked={topicsSelected.inScope.includes(topic.name)}
            onChange={({ target }) =>
              setTopicsSelected((prev) => {
                const exists = prev.topics.inScope.includes(target.name);
                return {
                  ...prev,
                  topics: {
                    ...prev.topics,
                    inScope: exists
                      ? prev.topics.inScope.filter((v) => v !== target.name)
                      : [...prev.topics.inScope, target.name],
                  },
                };
              })
            }
            data-testid={`in-scope-topic-filter-checkbox-${topic.id}`}
          >
            {capitaliseHyphenatedString(topic.name)}
          </Checkbox>
        ))}
      </section>

      <Paragraph data-testid="accordion-filter-item-title">
        <strong>Out of scope topics</strong>
      </Paragraph>

      <Paragraph className="govuk-hint">
        If you have selected a UC question topic you won't be able to select an
        out of scope topic as well.
      </Paragraph>

      <section className="mb-5" data-testid="out-of-scope-topic-filters">
        <div className="govuk-radios">
          {outOfScopeTopics.map((topic) => (
            <Radio
              key={topic.name}
              option={{ label: topic.name, value: topic.name }}
              name="out-of-scope-topic-filter"
              checked={topicsSelected.outOfScope === topic.name}
              onChange={(selected) =>
                setTopicsSelected((prev) => ({
                  ...prev,
                  topics: {
                    ...prev.topics,
                    outOfScope: selected.label,
                  },
                }))
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
