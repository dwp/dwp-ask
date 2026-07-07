import type { TopicFiltersType } from "@/types";

/**
 * Normalises the topics to be sent to the backend. If out of scope is defined, it will be sent to the backend. If not, the in scope topics will be sent to the backend.
 * @param topics the topic filters from which either out of scope or in scope will be sent to the backend
 * @returns an array of the appropriate topics - out of scope topic string is converted to string][]
 */
const normaliseTopics = (topics: TopicFiltersType): string[] => {
  let topicsToFilter = [];

  if (topics.outOfScope) {
    topicsToFilter.push(topics.outOfScope);
  } else {
    topicsToFilter = topics.inScope ?? [];
  }

  return topicsToFilter ?? [];
};

export { normaliseTopics };
