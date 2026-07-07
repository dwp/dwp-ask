import type { NextRequest, NextResponse } from "next/server";
import type { TopicWithConfidenceScore } from "./component.types";
import type { SentimentFilterArray } from "./feedback.types";

export type Citations = {
  title: string;
  url: string;
  chunks: string;
  highlights_url: string;
  highlights_text: string;
}[];

export type QuestionFeedbackPayload = {
  topic_label: string;
  suggested_questions: string[];
  preamble?: string;
  postscript?: string;
  out_of_scope?: boolean;
};

export type Feedback = {
  is_response_useful: boolean;
  selected_options: string[];
  feedback_text: string;
};

export type QueryResponseType = {
  question: string;
  answer: string;
  citations?: Citations;
  error?: string;
  code?: number;
  type?: string;
  id?: number;
  question_feedback?: QuestionFeedbackPayload | null;
  answer_gen_enabled?: boolean;
  topics: TopicWithConfidenceScore[];
};

export type MessagesResponseType = {
  citations: string[];
  created_at: string;
  previous_chat_history: object;
  question: string;
  id: number;
  error?: string;
  code?: number;
  feedback?: Feedback;
};

export type RequestHandlerParams = {
  req: NextRequest;
  route: string;
  body?: RequestInit["body"];
};

export type RouteHandlerType = (
  req: NextRequest,
  context?: { params: Promise<Record<string, string>> },
) => Promise<NextResponse>;

export type PayloadProps = {
  start_date: string;
  end_date: string;
  currentPage: number;
  topics: string[];
  feedback_types?: SentimentFilterArray;
};

export type ViewDetailsData = {
  parsedDate: [string, string];
  items: MessagesResponseType;
};

export type TopicsResponse = {
  id: number;
  name: string;
  category: string;
};

export type AdminViewDataResponse = {
  data: MessagesResponseType[];
  total_pages: number;
  total_count: number;
};
