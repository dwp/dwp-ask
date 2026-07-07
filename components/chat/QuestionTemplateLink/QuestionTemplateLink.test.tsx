import { render, screen } from "@testing-library/react";
import QuestionTemplateLink from "./QuestionTemplateLink";

vi.mock("@/components", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    openQuestionTemplatesPanel: vi.fn(),
  };
});

describe("QuestionTemplateLink", () => {
  it("renders null when copy is undefined", () => {
    const { container } = render(
      <QuestionTemplateLink copy={undefined} options={{}} />,
    );
    expect(container.innerHTML).toBe("");
  });

  it("renders markdown without template link when copy has no 'a template' match", () => {
    render(<QuestionTemplateLink copy="Some plain text" options={{}} />);
    expect(screen.getByTestId("no-template-matches-md")).toBeInTheDocument();
  });

  it("renders template link when copy contains 'a template' and options has no overrides", () => {
    render(<QuestionTemplateLink copy="Use a template to help" options={{}} />);
    expect(
      screen.getByTestId("question-feedback-template-link"),
    ).toBeInTheDocument();
  });

  it("renders template link when options is undefined", () => {
    render(
      <QuestionTemplateLink copy="Try a template here" options={undefined} />,
    );
    expect(
      screen.getByTestId("question-feedback-template-link"),
    ).toBeInTheDocument();
  });
});
