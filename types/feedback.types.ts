export type FeedbackType = "yes" | "no";

export type IsFeedbackHelpful = FeedbackType | null;

export type FeedbackOption = {
  id: number;
  name: string;
};

export type FeedbackResponseType = {
  created_at: string;
  feedback_free_text: string;
  id: number;
  selected_options: FeedbackOption[];
};

export type FeedbackApiResponse = {
  data: FeedbackResponseType[];
};

export type FeedbackProps = {
  setIsFeedbackHelpful: Function;
  feedbackCompleted: boolean;
  messageId: number;
};

export type FeedbackExpandedProps = {
  messageId: number;
  setFeedbackCompleted: Function;
  setIsFeedbackHelpful: Function;
};

export type SentimentFilter = "true" | "false" | "none";

export type SentimentFilterArray = SentimentFilter[];
