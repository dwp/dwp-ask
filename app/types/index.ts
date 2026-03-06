import type { NextRequest, NextResponse } from "next/server";
import type React from "react";
import { SanitisedMarkdownProps } from "../components/SanitisedMarkdown/SanitisedMarkdown";
import type { PageView } from "../enum";

type Citations = {
  title: string;
  url: string;
  chunks: string;
  highlights_url: string;
  highlights_text: string;
}[];

type ErrorStateType = {
  invalidchar: boolean;
  blank: boolean;
  charcount: boolean;
  location: boolean;
};

type QueryTextAreaProps = Readonly<{
  error: ErrorStateType;
  setError: React.Dispatch<React.SetStateAction<ErrorStateType>>;
  value: string;
  isModalOpen: boolean;
  sendQueryAndClear: () => void;
  onChange: (
    event?: React.ChangeEvent<HTMLTextAreaElement> | null,
    plainText?: string | null,
  ) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}>;

type QuestionFeedbackPayload = {
  topic_label: string;
  suggested_questions: string[];
  preamble?: string;
  postscript?: string;
  out_of_scope?: boolean;
};

type ChatHistoryType = {
  question: string;
  answer: string;
  feedback_given?: boolean;
  citations?: Citations;
  type?: string;
  id?: number;
  hasSetCountry?: boolean;
  location?: string;
  question_feedback?: QuestionFeedbackPayload | null;
};

type Feedback = {
  is_response_useful: boolean;
  selected_options: string[];
  feedback_text: string;
};

type ChatViewType = {
  question: string;
  answer: string;
  citations?: Citations;
  previous_chat_history: ChatViewType;
  type?: string;
  id?: number;
  feedback?: Feedback;
};

type QueryResponseType = {
  question: string;
  answer: string;
  citations?: Citations;
  error?: string;
  code?: number;
  type?: string;
  id?: number;
  question_feedback?: QuestionFeedbackPayload | null;
  answer_gen_enabled?: boolean;
};

type feedbackResponseType = {
  error?: string;
  code?: number;
  id: number;
};

type MessagesResponseType = {
  citations: string[];
  created_at: string;
  previous_chat_history: object;
  question: string;
  id: number;
  error?: string;
  code?: number;
  feedback?: Feedback;
};

type DateParts = {
  day: string;
  month: string;
  year: string;
};

type FiltersContainerProps = {
  errorStartText: string;
  errorEndText: string;
  startDate: DateParts;
  endDate: DateParts;
  setStartDate: React.Dispatch<React.SetStateAction<DateParts>>;
  setEndDate: React.Dispatch<React.SetStateAction<DateParts>>;
  handleReset: () => void;
  handleSubmit: (page?: number) => Promise<void>;
  sentiment?: Array<"true" | "false" | "none">;
  setSentiment?: React.Dispatch<
    React.SetStateAction<Array<"true" | "false" | "none">>
  >;
  pageView: PageView;
  enableHeader?: boolean;
  headerText?: string;
};

type PayloadProps = {
  start_date: string;
  end_date: string;
  currentPage: number;
  feedback_types?: Array<"true" | "false" | "none">;
};

type PageDescriptionProps = {
  backLink: string;
  title: string;
  warningText?: string;
  description: string;
  errorSummary?: { text: string; href: string }[];
};

type RouteHandler = (req: NextRequest, context?: any) => Promise<NextResponse>;

type FeedbackOption = {
  id: number;
  name: string;
};

type FeedbackResponseType = {
  created_at: string;
  feedback_free_text: string;
  id: number;
  selected_options: FeedbackOption[];
};

type FeedbackApiResponse = {
  data: FeedbackResponseType[];
};

type StructuredFeedbackProps = {
  copy?: string;
  options: SanitisedMarkdownProps["options"];
};

export type {
  QueryTextAreaProps,
  ChatHistoryType,
  ErrorStateType,
  Citations,
  QueryResponseType,
  QuestionFeedbackPayload,
  feedbackResponseType,
  MessagesResponseType,
  DateParts,
  ChatViewType,
  FiltersContainerProps,
  RouteHandler,
  FeedbackOption,
  FeedbackResponseType,
  FeedbackApiResponse,
  PageDescriptionProps,
  PayloadProps,
  StructuredFeedbackProps,
};
