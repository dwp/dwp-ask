import { SentimentFilter } from "./feedback.types";

export type FeedbackFiltersType = {
  id: string;
  name: string;
  value: SentimentFilter;
  label: string;
};
