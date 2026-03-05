"use client";

import React from "react";
import { Paragraph, SectionBreak } from "@/app/components";

type LandingItemProps = {
  text: string;
  className?: string;
  "data-testid"?: string;
};

const LandingItem = ({ text, className, ...props }: LandingItemProps) => {
  const dataTestid = props["data-testid"] ?? "landing-item";
  return (
    <React.Fragment>
      <Paragraph className={className ?? ""} data-testid={dataTestid}>
        {text}
      </Paragraph>
      <SectionBreak level="m" visible={false} />
    </React.Fragment>
  );
};

export default LandingItem;
