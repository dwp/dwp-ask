import { FILTER_IDS } from "./Ids";
import { MAX_CSV_ROWS_DEFAULT } from "./Layout";

const MAX_ROWS_EXCEEDED_ERROR_INLINE = `Adjust the filters so you have less than ${MAX_CSV_ROWS_DEFAULT} search results.`;

const LARGE_EXPORT_ERROR = [
  {
    text: `The download is too big. Adjust the filters so you have less than ${MAX_CSV_ROWS_DEFAULT} search results.`,
    href: FILTER_IDS.admin,
  },
];

const TOPIC_CLASH_ERROR_INLINE =
  "Adjust the filters so you have chosen only one or the other.";

const TOPIC_CLASH_ERROR = [
  {
    text: `You cannot filter both a UC question topic and out of scope topic. ${TOPIC_CLASH_ERROR_INLINE}`,
    href: FILTER_IDS.topics,
  },
];

export {
  LARGE_EXPORT_ERROR,
  MAX_ROWS_EXCEEDED_ERROR_INLINE,
  TOPIC_CLASH_ERROR,
  TOPIC_CLASH_ERROR_INLINE,
};
