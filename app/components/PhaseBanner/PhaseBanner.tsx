"use client";

import Link from "../Packages/Link/Link";
import styles from "./PhaseBanner.module.css";

const FEEDBACK_SURVEY_URL =
  "https://forms.office.com/Pages/ResponsePage.aspx?id=6fbxllcQF0GsKIDN_ob4w6rrSuFQrmFPoX55GfVFhs1UM0RMOFBVRjJNNUhTS0FQRlJWWlJZMlhKNC4u";

export default function PhaseBanner() {
  return (
    <div
      className={"govuk-phase-banner" + " " + styles.phaseBannerWrapper}
      data-testid="phase-banner"
      id="phase-banner"
    >
      <p className="govuk-phase-banner__content">
        <strong
          className="govuk-tag govuk-phase-banner__content__tag"
          data-testid="phase-banner-tag"
        >
          Beta
        </strong>
        <span
          className="govuk-phase-banner__text"
          data-testid="phase-banner-text"
        >
          This is a new service. Help us improve it and{" "}
          <Link
            href={FEEDBACK_SURVEY_URL}
            data-testid="phase-banner-link"
            target="_blank"
          >
            give your feedback (opens in a new tab).
          </Link>
        </span>
      </p>
    </div>
  );
}
