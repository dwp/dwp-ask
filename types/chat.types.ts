import type { Citations, Feedback, QuestionFeedbackPayload } from "./api.types";
import type { TopicWithCategory } from "./component.types";

export type ChatHistoryType = {
  question: string;
  answer: string;
  feedback_given?: boolean;
  citations?: Citations;
  type?: string;
  id?: number;
  hasSetCountry?: boolean;
  location?: LocationType;
  question_feedback?: QuestionFeedbackPayload;
};

export type ChatViewType = {
  question: string;
  answer: string;
  citations?: Citations;
  previous_chat_history: ChatViewType;
  type?: string;
  id?: number;
  feedback?: Feedback;
  topics: TopicWithCategory[];
};

export type LocationType = "England" | "Scotland" | "Wales" | null;
