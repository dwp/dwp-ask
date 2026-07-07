import React from "react";
import {
  Paragraph,
  Title,
  UnorderedList,
  UnorderedListItem,
} from "@/components";
import type { InfoSectionListProps } from "@/types";
import { toTitleCase } from "@/utils";

export default function InfoSectionList({
  title,
  items,
  fallbackText,
  descriptionText,
  subtitle,
  topicOutOfScope,
}: InfoSectionListProps) {
  return (
    <React.Fragment>
      <Title
        level="h3"
        className="text-xl font-bold mb-1"
        data-testid="info-section-list-title"
      >
        {title}
      </Title>

      {subtitle && (
        <Title
          level="h4"
          className="text-base mb-3"
          data-testid="info-section-list-subtitle"
        >
          {subtitle}
        </Title>
      )}

      {items?.length > 0 && topicOutOfScope && (
        <Paragraph data-testid="info-section-list-out-of-scope-topic">
          <strong>Out of scope question - </strong>
          {toTitleCase(items[0])}
        </Paragraph>
      )}

      {items?.length > 0 && !topicOutOfScope && (
        <UnorderedList
          className="p-0 mb-4 ml-6"
          data-testid="info-section-list"
        >
          {items.map((item, idx) => (
            <UnorderedListItem
              key={idx}
              data-testid="info-section-list-item"
              className="text-[19px]"
            >
              {toTitleCase(item)}
            </UnorderedListItem>
          ))}
        </UnorderedList>
      )}

      {!items?.length && fallbackText && (
        <Paragraph data-testid="info-section-list-fallback-text">
          {fallbackText}
        </Paragraph>
      )}

      {descriptionText && (
        <div
          className="flex items-center gap-2"
          data-testid="info-section-list-description"
        >
          <span className="font-bold text-[19px]">More detail:</span>
          <span
            className="text-[19px]"
            data-testid="info-section-list-description-text"
          >
            {descriptionText}
          </span>
        </div>
      )}
    </React.Fragment>
  );
}
