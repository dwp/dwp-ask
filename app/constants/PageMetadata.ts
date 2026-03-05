import type { Metadata } from "next";

const AINoticeMetadata: Metadata = {
  title: "DWP Ask | AI notice",
  description: "DWP Ask | AI notice",
};

const AccessibilityStatementMetadata: Metadata = {
  title: "DWP Ask | Accessibility statement",
  description: "DWP Ask | Accessibility statement",
};

const AdminMetadata: Metadata = {
  title: "DWP Ask | Admin",
  description: "DWP Ask | Admin",
};

const AdminViewMetadata: Metadata = {
  title: "DWP Ask | Admin View",
  description: "DWP Ask | Admin View",
};

const ChatMetadata: Metadata = {
  title: "DWP Ask | Chat",
  description: "DWP Ask | Chat",
};

const ChatHistoryMetadata: Metadata = {
  title: "DWP Ask | Chat History",
  description: "DWP Ask | Chat History",
};

const LandingMetadata: Metadata = { title: "DWP Ask", description: "DWP Ask" };

const FeedbackMetadata: Metadata = {
  title: "DWP Ask | Feedback",
  description: "DWP Ask | Feedback",
};

/**
 * a-z: allows lowercase letters
 * A-Z: allows uppercase letters
 * 0-9: allows numbers
 * -: allows dashes
 * Regex is used to replace anything that doesn't match this pattern
 *  with an empty space in the sanitisePathname function
 */
const URLRegex = new RegExp(/[^a-zA-Z0-9-]/g);

export {
  AINoticeMetadata,
  ChatHistoryMetadata,
  AccessibilityStatementMetadata,
  ChatMetadata,
  LandingMetadata,
  FeedbackMetadata,
  URLRegex,
  AdminMetadata,
  AdminViewMetadata,
};
