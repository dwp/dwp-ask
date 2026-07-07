import type { BorderedTextProps } from "@/types";
import Paragraph from "../Paragraph/Paragraph";

export default function BorderedText({
  text,
  borderColour = "var(--govuk-grey)",
}: BorderedTextProps) {
  return (
    <Paragraph
      className={`border-4 border-[${borderColour}] rounded-sm w-fit p-2 text-[19px]`}
      data-testid="bordered-text"
    >
      {text}
    </Paragraph>
  );
}
