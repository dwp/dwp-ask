import { Button, H3, DateField, Link } from "@/app/components";
import { type FiltersContainerProps, DateParts } from "@/app/types";
import styles from "./FiltersContainer.module.css";
import { PageView } from "@/app/enum";

export default function FiltersContainer({
  errorStartText,
  errorEndText,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  handleReset,
  handleSubmit,
  sentiment,
  setSentiment,
  pageView,
  enableHeader = true,
  headerText,
}: FiltersContainerProps) {
  return (
    <>
      {enableHeader && (
        <H3
          className={styles.chatHistoryFilterLabel}
          data-testid="history-filter-label"
        >
          {headerText}
        </H3>
      )}
      <div className={styles.filter} data-testid="history-filter-container">
        <div
          className={styles.dateField}
          data-testid="history-date-field-container"
        >
          <DateField
            id="from-date"
            title="From date"
            data-testid="history-date-field-from-date"
            errorText={errorStartText}
            value={startDate}
            onChange={(e: DateParts) =>
              setStartDate((prev: any) => ({ ...prev, ...e }))
            }
          />
        </div>
        <div className={styles.dateField}>
          <DateField
            title="To date (optional)"
            id="to-date"
            data-testid="history-date-field-to-date"
            errorText={errorEndText}
            value={endDate}
            onChange={(e: DateParts) =>
              setEndDate((prev: any) => ({ ...prev, ...e }))
            }
          />
        </div>
      </div>
      {pageView == PageView.Admin && sentiment && setSentiment && (
        <div className={"govuk-form-group" + " " + styles.marginTop}>
          <fieldset
            className="govuk-fieldset"
            aria-describedby="sentiment-hint"
          >
            <span className={styles.filterCheckboxTitle}>Feedback Type</span>
            <div
              className={`govuk-checkboxes ${styles.filterCheckbox}`}
              data-module="govuk-checkboxes"
            >
              <div className="govuk-checkboxes__item">
                <input
                  data-testid="sentiment-positive-checkbox"
                  className="govuk-checkboxes__input"
                  id="sentiment-positive"
                  name="sentiment"
                  type="checkbox"
                  value="true"
                  checked={sentiment.includes("true")}
                  onChange={() => {
                    setSentiment((prev) =>
                      prev.includes("true")
                        ? prev.filter((v) => v !== "true")
                        : [...prev, "true"],
                    );
                  }}
                />
                <label
                  data-testid="sentiment-positive-label"
                  className="govuk-label govuk-checkboxes__label"
                  htmlFor="sentiment-positive"
                >
                  Positive
                </label>
              </div>
              <div className="govuk-checkboxes__item">
                <input
                  data-testid="sentiment-negative-checkbox"
                  className="govuk-checkboxes__input"
                  id="sentiment-negative"
                  name="sentiment"
                  type="checkbox"
                  value="false"
                  checked={sentiment.includes("false")}
                  onChange={() => {
                    setSentiment((prev) =>
                      prev.includes("false")
                        ? prev.filter((v) => v !== "false")
                        : [...prev, "false"],
                    );
                  }}
                />
                <label
                  data-testid="sentiment-negative-label"
                  className="govuk-label govuk-checkboxes__label"
                  htmlFor="sentiment-negative"
                >
                  Negative
                </label>
              </div>
              <div className="govuk-checkboxes__item">
                <input
                  data-testid="sentiment-none-checkbox"
                  className="govuk-checkboxes__input"
                  id="sentiment-none"
                  name="sentiment"
                  type="checkbox"
                  value="none"
                  checked={sentiment.includes("none")}
                  onChange={() => {
                    setSentiment((prev) =>
                      prev.includes("none")
                        ? prev.filter((v) => v !== "none")
                        : [...prev, "none"],
                    );
                  }}
                />
                <label
                  data-testid="sentiment-none-label"
                  className="govuk-label govuk-checkboxes__label"
                  htmlFor="sentiment-none"
                >
                  None
                </label>
              </div>
            </div>
          </fieldset>
        </div>
      )}
      <div
        className={styles.filterButtons}
        data-testid="history-filter-buttons-container"
      >
        <Button
          data-testid="history-apply-button"
          disabled={false}
          aria-label="Apply"
          buttonColour="#1D70B8"
          onClick={() => handleSubmit()}
        >
          Apply
        </Button>
        <Link
          className="govuk-link"
          aria-label="Reset"
          tabIndex={0}
          onClick={handleReset}
          data-testid="history-reset-link"
        >
          Reset
        </Link>
      </div>
    </>
  );
}
