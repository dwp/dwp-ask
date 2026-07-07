import type { AdminFiltersState, FeedbackFiltersType } from "@/types";
import { convertDateToParts } from "@/utils";
import { DEFAULT_DATE_RANGE_DAYS } from "./Layout";

const now = new Date();
const current_date = convertDateToParts(now);
const pass_date = new Date();
pass_date.setDate(now.getDate() - DEFAULT_DATE_RANGE_DAYS);
const datefield_start = convertDateToParts(pass_date);

const initialFromDate = {
  day: datefield_start.day,
  month: datefield_start.month,
  year: datefield_start.year,
};
const initialToDate = {
  day: current_date.day,
  month: current_date.month,
  year: current_date.year,
};

const INITIAL_ADMIN_FILTERS: AdminFiltersState = {
  date: {
    from: initialFromDate,
    to: initialToDate,
    errorText: "",
  },
  topics: {
    inScope: [],
    outOfScope: "",
    errorText: "",
  },
  feedback: {
    values: ["true", "false", "none"],
    errorText: "",
  },
  applied: false,
};

const INITIAL_CHAT_FILTERS = {
  date: {
    from: initialFromDate,
    to: initialToDate,
    errorText: "",
  },
};

const FEEDBACK_FILTERS: FeedbackFiltersType[] = [
  {
    id: "feedback-positive",
    name: "feedback",
    value: "true",
    label: "Positive",
  },
  {
    id: "feedback-negative",
    name: "feedback",
    value: "false",
    label: "Negative",
  },
  {
    id: "feedback-none",
    name: "feedback",
    value: "none",
    label: "None",
  },
];

export { FEEDBACK_FILTERS, INITIAL_ADMIN_FILTERS, INITIAL_CHAT_FILTERS };
