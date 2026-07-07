import type React from "react";

export type ErrorStateType = {
  invalidchar: boolean;
  blank: boolean;
  charcount: boolean;
  location: boolean;
};

export type QueryTextAreaProps = Readonly<{
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

export type DateParts = {
  day: string;
  month: string;
  year: string;
};

export type FiltersContainerProps = {
  errorStartText: string;
  errorEndText: string;
  startDate: DateParts;
  endDate: DateParts;
  setStartDate: React.Dispatch<React.SetStateAction<DateParts>>;
  setEndDate: React.Dispatch<React.SetStateAction<DateParts>>;
  handleReset: () => void;
  handleSubmit: (page?: number) => Promise<void>;
  sentiment?: SentimentFilterArray;
  setSentiment?: React.Dispatch<React.SetStateAction<SentimentFilterArray>>;
  pageView: PageView;
  enableHeader?: boolean;
  headerText?: string;
};

export type PageDescriptionProps = {
  backLink: string;
  title: string;
  warningText?: string;
  description: string;
  errorSummary?: { text: string; href: string }[];
};

import type { PageView } from "@/enum";
import { SentimentFilterArray } from "./feedback.types";
