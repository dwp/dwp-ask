import { Checkbox } from "@/components";
import { FEEDBACK_FILTERS } from "@/constants/Filters";
import { FILTER_IDS } from "@/constants/Ids";
import type { FeedbackFilterProps, SentimentFilter } from "@/types";

export default function FeedbackFilters({
  feedbackFilters,
  setFeedbackFilters,
}: FeedbackFilterProps) {
  return (
    <div className="govuk-form-group mt-6" id={FILTER_IDS.feedback}>
      <fieldset className="govuk-fieldset" aria-describedby="sentiment-hint">
        <span className="font-bold">Feedback Type</span>
        <div className="govuk-checkboxes mt-2.5" data-module="govuk-checkboxes">
          {FEEDBACK_FILTERS.map((filter) => (
            <div className="govuk-checkboxes__item" key={filter.id}>
              <Checkbox
                id={filter.id}
                value={filter.value}
                aria-label={filter.label}
                aria-checked={feedbackFilters.includes(filter.value)}
                checked={feedbackFilters.includes(filter.value)}
                onChange={({ target }) =>
                  setFeedbackFilters((prev) => {
                    const value = target.value as SentimentFilter;
                    const exists = prev.feedback.values.includes(value);
                    return {
                      ...prev,
                      feedback: {
                        ...prev.feedback,
                        values: exists
                          ? prev.feedback.values.filter((v) => v !== value)
                          : [...prev.feedback.values, value],
                      },
                    };
                  })
                }
              >
                {filter.label}
              </Checkbox>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
