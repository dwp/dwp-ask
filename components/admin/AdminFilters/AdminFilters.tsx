"use client";

import {
  AccordionFilterItem,
  Button,
  DateFilters,
  ErrorFormGroup,
  FeedbackFilters,
  Link,
  SectionBreak,
  TopicFilters,
} from "@/components";
import { GDS_COLOURS } from "@/constants/Colours";
import { INITIAL_ADMIN_FILTERS } from "@/constants/Filters";
import { FILTER_IDS } from "@/constants/Ids";
import type { AdminFiltersProps } from "@/types";

export default function AdminFilters({
  adminFilters,
  setAdminFilters,
  handleReset,
  handleApply,
  topicList,
}: AdminFiltersProps) {
  return (
    <div data-testid="admin-filters" id={FILTER_IDS.admin}>
      <AccordionFilterItem
        title="Filter your results"
        openByDefault
        children={
          <>
            <SectionBreak visible level="m" />

            <ErrorFormGroup
              error={
                adminFilters.date.errorText !==
                INITIAL_ADMIN_FILTERS.date.errorText
              }
              errorMessage={adminFilters.date.errorText}
              errorId="admin-filters-invalid-dates-error"
            >
              <AccordionFilterItem
                title="Date"
                openByDefault
                children={
                  <DateFilters
                    from={adminFilters.date.from}
                    to={adminFilters.date.to}
                    onDateChange={(e, source) =>
                      setAdminFilters((prev) => ({
                        ...prev,
                        date: { ...prev.date, [source]: e },
                      }))
                    }
                  />
                }
              />
            </ErrorFormGroup>

            <SectionBreak visible level="m" />

            <ErrorFormGroup
              error={
                adminFilters.topics.errorText !==
                INITIAL_ADMIN_FILTERS.topics.errorText
              }
              errorMessage={adminFilters.topics.errorText}
              errorId="admin-filters-invalid-topics-error"
            >
              <AccordionFilterItem
                title="Question topics"
                children={
                  <TopicFilters
                    topicList={topicList}
                    topicsSelected={adminFilters.topics}
                    setTopicsSelected={setAdminFilters}
                  />
                }
              />
            </ErrorFormGroup>

            <SectionBreak visible level="m" />

            <AccordionFilterItem
              title="Feedback"
              children={
                <FeedbackFilters
                  feedbackFilters={adminFilters.feedback.values}
                  setFeedbackFilters={setAdminFilters}
                />
              }
            />

            <SectionBreak visible level="m" />

            <div
              className="w-full flex items-baseline h-7.5 mt-7.5 gap-3"
              data-testid="admin-filters-buttons-container"
            >
              <Button
                data-testid="admin-filters-apply-button"
                aria-label="Apply"
                buttonColour={GDS_COLOURS.BLUE}
                onClick={handleApply}
              >
                Apply
              </Button>
              <Link
                className="govuk-link"
                aria-label="Reset"
                tabIndex={0}
                onClick={handleReset}
                data-testid="admin-filters-reset-link"
              >
                Reset
              </Link>
            </div>
          </>
        }
      />
    </div>
  );
}
