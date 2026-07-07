import type { Dispatch, SetStateAction } from "react";

import type { UserView } from "@/enum";
import type {
  Citations,
  MessagesResponseType,
  TopicsResponse,
} from "./api.types";
import type { ChatHistoryType, LocationType } from "./chat.types";
import type {
  FeedbackResponseType,
  IsFeedbackHelpful,
  SentimentFilterArray,
} from "./feedback.types";
import type { DateParts } from "./form.types";
import type { SanitisedMarkdownProps } from "./markdown.types";

export type AnswerProps = {
  setLoadedChatHistory: Function;
  setTyping: Function;
  message: ChatHistoryType;
  isView?: boolean;
};

export type AuthWrapperProps = {
  children: React.ReactNode;
  redirectConfig:
    | { redirect: false }
    | { redirect: true; redirectPage: string };
};

export type ButtonArrowProps = {
  fill?: string;
};

export type ChangeClaimantLocationProps = { className?: string };

export type CountryCardsProps = {
  onClickHandler: (countryCode: LocationType) => void;
};

export type FeedbackTableProps = Readonly<{
  tableContent: FeedbackResponseType[];
}>;

export type HistoryTableProps = Readonly<{
  tableContent: MessagesResponseType[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
}>;

export type LayoutProps = {
  children: React.ReactNode;
};

export type MessageProps = {
  message: ChatHistoryType;
  setLoadedChatHistory: Function;
  setTyping: Function;
  isView?: boolean | false;
  userView?: UserView;
};

export type NavbarAccordionClientProps = {
  menuId: string;
  tabIndex?: number;
};

export type AdminViewNavigationProps = {
  className?: string;
};

export type CardProps = {
  text: string;
  onClick: (text: string) => void;
  className?: string;
  dataTestId?: string;
  disabled?: boolean;
};

export type CheckboxProps = {
  id: string;
  value: string;
  children: React.ReactNode;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  tabIndex?: number;
  checked?: boolean;
  "aria-checked"?: boolean;
  "data-testid"?: string;
  "aria-label"?: string;
};

export type ErrorCardProps = {
  children: React.ReactNode;
};

export type ErrorFormGroupProps = {
  error?: boolean;
  errorMessage?: string;
  errorId?: string;
  children: React.ReactNode;
};

export type ErrorSummaryItemType = {
  text: string;
  href: string;
  scope?: string;
};

export type ErrorSummaryProps = {
  title?: string;
  errors: ErrorSummaryItemType[];
  "data-testid"?: string;
};

export type FooterProps = {
  isModalOpen: boolean | undefined;
  pathname: string;
};

export type FormGroupProps = {
  children: React.ReactNode;
  error?: boolean;
};

export type TitleProps = {
  children: React.ReactNode;
  level: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  id?: string;
  role?: string;
  style?: { [key: string]: string } | object;
  tabIndex?: number;
  "aria-label"?: string;
  "data-testid"?: string;
};

export type TopicWithCategory = {
  name: string;
  category: string;
};

export type TopicWithConfidenceScore = {
  label: string;
  score: number;
};

export type InfoSectionProps = {
  title: string;
  subtitle?: string;
  listItems?: string[];
  descriptionText?: string;
  topics: TopicWithCategory[];
};

export type InputErrorProps = Readonly<
  | {
      type: "charcount";
      charLimit: number;
      query?: string;
      errorMessage?: string;
    }
  | {
      type: "invalidchar" | "blank" | "other" | "location";
      charLimit?: number;
      query?: string;
      errorMessage?: string;
    }
>;

export type InsetTextProps = {
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
};

export type LabelTextProps = {
  children: React.ReactNode;
  className?: string;
};

export type GDSMainProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  "data-testid"?: string;
};

export type ModalProps = {
  heading: string;
  confirm: { text: string; action?: Function };
  closeText: string;
  type: "standard" | "danger";
};

export type ModalConstantsType = {
  [key: string]: ModalProps;
};

export type GDSParagraphProps = {
  children: React.ReactNode | string;
  className?: string;
  tabIndex?: number;
  role?: string;
  "aria-hidden"?: boolean;
  "data-testid"?: string;
};

export type QuestionTemplatesProps = {
  handleCardClick: (text: string) => void;
  isDisabled: boolean;
};

export type SectionBreakProps = {
  visible: boolean;
  level: "m" | "l" | "xl";
};

export type GDSSelectProps = {
  id: string;
  label: string;
  options: string[];
  name?: string;
  className?: string;
  value?: string | number;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  autoComplete?: string;
  disabled?: boolean;
  tabIndex?: number;
  error?: boolean;
  "data-testid"?: string;
  "aria-label"?: string;
};

export type TableCellProps = Readonly<{
  "data-testid"?: string;
  title?: string;
  children: React.ReactNode;
}>;

export type TableRowProps = Readonly<{
  "data-testid"?: string;
  children: React.ReactNode;
}>;

export type TableWrapperProps = Readonly<{
  columnTitles: string[];
  children: React.ReactNode;
  "data-testid"?: string;
}>;

export type GDSUnorderedListProps = {
  children: React.ReactNode;
  className?: string;
  "data-testid"?: string;
};

export type GDSWarningTextProps = {
  children: React.ReactNode;
  bottomMargin?: boolean;
  className?: string;
  "data-testid"?: string;
};

export type GDSListItemProps = {
  "data-testid"?: string;
  children: React.ReactNode;
  className?: string;
};

export type SourceLinkProps = {
  source: Citations[number];
  index: number;
  showExtract?: boolean;
};

export type SourcesAccordionProps = {
  source: { title: string; url: string; chunks: string };
  index: number;
  isModalOpen: boolean;
};

export type DateFieldProps = {
  id: string;
  title: string;
  errorText: string;
  value: DateParts;
  onChange: (e: DateParts) => void;
  "data-testid": string;
};

export type ChooseCountryProps = {
  setLoadedChatHistory: React.Dispatch<React.SetStateAction<ChatHistoryType[]>>;
  setTyping: React.Dispatch<React.SetStateAction<boolean>>;
};

export type PaginationProps = Readonly<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}>;

export type QuestionTemplateLinkProps = {
  copy?: string;
  options: SanitisedMarkdownProps["options"];
};

export type AIDisclaimerProps = {
  showAIStatement: boolean;
};

export type AnswerContentProps = {
  message: ChatHistoryType;
  options: SanitisedMarkdownProps["options"];
  hasStructuredQuestionFeedback: boolean;
};

export type SuggestedQuestionsProps = {
  suggestionQuestions: string[];
  onSuggestionClick: (question: string) => void;
  isSubmitting: boolean;
  disabled: boolean;
};

export type FeedbackSectionProps = {
  message: ChatHistoryType;
  isError: boolean;
  isView?: boolean;
  isFeedbackHelpful: IsFeedbackHelpful;
  feedbackCompleted: boolean;
  setIsFeedbackHelpful: (value: IsFeedbackHelpful) => void;
  setFeedbackCompleted: (value: boolean) => void;
};

export interface LoadingBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  spinnerColor?: string;
  backgroundColor?: string;
  backgroundColorOpacity?: number;
  loading?: boolean;
  timeIn?: number;
  timeOut?: number;
}

export interface BackLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  "data-testid"?: string;
  "aria-label"?: string;
  role?: string;
  tabIndex?: number;
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  className?: string;
  children?: React.ReactNode;
  href?: string;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  start?: boolean;
  buttonColour?: string;
  buttonHoverColour?: string;
  buttonShadowColour?: string;
  buttonTextColour?: string;
  "data-testid"?: string;
}

export interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  fill?: string;
}

export type CustomTableProps<T> = Readonly<{
  tableContent: T[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  totalPages: number;
  columnTitles: string[];
  columnWidths?: string[];
  renderRow: (item: T, index: number) => React.ReactNode;
}>;

export type ChatInputProps = {
  loadedChatHistory: ChatHistoryType[];
  setLoadedChatHistory: Function;
  typing: boolean;
  setTyping: Function;
  isModalOpen: boolean;
};

export type ExportAllButtonProps = {
  onClick: (
    event:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>,
  ) => void;
  className?: string;
  buttonName: string;
  resultText?: string;
  rowsLength?: number;
};

export type AdminTableProps = {
  chatMessages: MessagesResponseType[];
  totalPages: number;
  currentPage: number;
  handlePagination: (page: number) => Promise<void>;
};

export type AccordionFilterItemProps = {
  title: string;
  children: React.ReactNode;
  openByDefault?: boolean;
};

export type AccordionToggleProps = {
  toggleText: { hidden: string; visible: string };
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  dataTestId?: string;
  children: React.ReactNode;
  labelledBy: string;
};

export type AdminFiltersProps = {
  adminFilters: AdminFiltersState;
  setAdminFilters: Dispatch<SetStateAction<AdminFiltersState>>;
  handleReset: () => void;
  handleApply: () => Promise<void>;
  topicList: TopicsResponse[];
};

export type DateFilters = {
  from: DateParts;
  to: DateParts;
  errorText: string;
};

export type TopicFiltersType = {
  inScope: string[];
  outOfScope: string;
};

export type AdminFiltersState = {
  date: DateFilters;
  topics: TopicFiltersType & {
    errorText: string;
  };
  feedback: {
    values: SentimentFilterArray;
    errorText: string;
  };
  applied: boolean;
};

export type ChatFiltersState = {
  date: DateFilters;
};

export type ChatFiltersProps = {
  chatFilters: ChatFiltersState;
  setChatFilters: Dispatch<SetStateAction<ChatFiltersState>>;
  handleReset: () => void;
  handleApply: () => Promise<void>;
};

export type AdminViewProps = {
  topicList: TopicsResponse[];
};

export type TopicFiltersProps = {
  topicList: TopicsResponse[];
  topicsSelected: TopicFiltersType;
  setTopicsSelected: Dispatch<SetStateAction<AdminFiltersState>>;
};

export type DateFiltersProps = {
  from: DateParts;
  to: DateParts;
  onDateChange: (date: DateParts, source: "from" | "to") => void;
};

export type RadioProps = {
  option: { label: string; value: string | number };
  name: string;
  checked: boolean;
  onChange: (option: { label: string; value: string | number }) => void;
  "data-testid"?: string;
};

export type FeedbackFilterProps = {
  setFeedbackFilters: Dispatch<SetStateAction<AdminFiltersState>>;
  feedbackFilters: SentimentFilterArray;
};

export type AppliedFilterItem = { label: string; value: string };

export type AppliedFiltersProps = {
  filters:
    | { filterType: "chat"; filters: ChatFiltersState }
    | { filterType: "admin"; filters: AdminFiltersState };
  handleReset: () => void;
};

export type BorderedTextProps = {
  text: string;
  borderColour?: string;
};

export type InfoSectionListProps = {
  title: string;
  items: string[];
  fallbackText?: string;
  descriptionText?: string;
  subtitle?: string;
  topicOutOfScope?: boolean;
};
