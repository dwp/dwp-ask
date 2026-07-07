"use client";

import { useId, useState } from "react";
import { AccordionToggle, SectionBreak, Title } from "@/components";
import type { AccordionFilterItemProps } from "@/types";

export default function AccordionFilterItem({
  title,
  children,
  openByDefault,
}: AccordionFilterItemProps) {
  const titleId = useId();
  const [isOpen, setIsOpen] = useState<boolean>(openByDefault ?? false);

  return (
    <div>
      <Title
        level="h4"
        id={titleId}
        data-testid={`accordion-filter-item-title-${title.toLowerCase()}`}
      >
        {title}
      </Title>

      <AccordionToggle
        toggleText={{ hidden: "Show", visible: "Hide" }}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        children={children}
        labelledBy={titleId}
      />

      {title === "Filter your results" && !isOpen && (
        <SectionBreak visible level="m" />
      )}
    </div>
  );
}
