import React from "react";
import { capitalise } from "@/app/utils";

/**
 *
 * @param title title of policy document
 * @param index display order number e.g. 1. Title, 2. Title
 * @returns capitalised title
 */
const formatTitle = (title: string, index: number) => {
  // Split the title by dashes
  const split = title.replaceAll(".txt", " ").split("-");
  // Capitalise each word
  const capitalised = split.map((word) => {
    return capitalise(word);
  });
  // Join the words in the array into a single string
  const joined = capitalised.join(" ");
  return `${index + 1}. ${joined}`;
};

/**
 * Adds needed escape characters to a markdown string
 *
 * @param markdown markdown to be formatted
 * @returns formatted markdown string
 */
const formatMarkdown = (markdown: string) => {
  // Detect singular instances of \n in the markdown
  const regex = /(?<!\n)\n(?!\n)/g;
  // Replace detected instances with an extra \n
  return markdown.replace(regex, "    \n");
};

/**
 * Trims whitespace when text is copied
 *
 * @param e default ClipboardEvent
 */
const trimWhitespace = (e: React.ClipboardEvent<HTMLElement>) => {
  e.preventDefault();
  const copiedText = window.getSelection()?.toString();
  const trimmedText = copiedText?.trim();
  e.clipboardData.setData("text/plain", trimmedText!);
};

export { formatMarkdown, formatTitle, trimWhitespace };
