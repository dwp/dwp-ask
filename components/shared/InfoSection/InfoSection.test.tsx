import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InfoSection from "./InfoSection";
import InfoSectionList from "./InfoSectionList";

describe("InfoSection", () => {
  it("does not render subtitle when not provided", () => {
    render(<InfoSection title="Title" topics={[]} />);
    expect(screen.queryByTestId("info-section-subtitle")).toBeNull();
  });

  it("renders list items when provided", () => {
    render(
      <InfoSection
        title="Title"
        listItems={["Item 1", "Item 2"]}
        topics={[]}
      />,
    );
    const items = screen.getAllByTestId("info-section-list-item");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Item 1");
    expect(items[1]).toHaveTextContent("Item 2");
  });

  it("does not render list when listItems is empty", () => {
    render(<InfoSection title="Title" topics={[]} />);
    expect(screen.queryByTestId("info-section-list")).toBeNull();
  });

  it("does not render description when not provided", () => {
    render(<InfoSection title="Title" topics={[]} />);
    expect(screen.queryByTestId("info-section-description")).toBeNull();
  });
});

describe("InfoSectionList", () => {
  it("renders title", () => {
    render(<InfoSectionList title="Test Title" items={[]} />);
    expect(screen.getByTestId("info-section-list-title")).toHaveTextContent(
      "Test Title",
    );
  });

  it("renders subtitle when provided", () => {
    render(<InfoSectionList title="Title" subtitle="Subtitle" items={[]} />);
    expect(screen.getByTestId("info-section-list-subtitle")).toHaveTextContent(
      "Subtitle",
    );
  });

  it("renders description text when provided", () => {
    render(
      <InfoSectionList
        title="Title"
        descriptionText="Some detail"
        items={[]}
      />,
    );
    expect(
      screen.getByTestId("info-section-list-description-text"),
    ).toHaveTextContent("Some detail");
  });

  it("renders a list when provided a non-empty list", () => {
    render(<InfoSectionList title="Title" items={["Topic 1", "Topic 2"]} />);
    expect(screen.queryByTestId("info-section-list")).toBeInTheDocument();
  });

  it("does not render a list when provided a empty list", () => {
    render(<InfoSectionList title="Title" items={[]} />);
    expect(screen.queryByTestId("info-section-list")).not.toBeInTheDocument();
  });

  it("renders fallback text when an empty topics list is provided", () => {
    render(
      <InfoSectionList
        title="Title"
        items={[]}
        fallbackText="No topics were classified at the time this response was generated."
      />,
    );
    expect(
      screen.queryByTestId("info-section-list-fallback-text"),
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId("info-section-list-fallback-text"),
    ).toHaveTextContent(
      "No topics were classified at the time this response was generated.",
    );
  });

  it("renders in scope topic names when topics are provided", () => {
    render(
      <InfoSection
        title="Title"
        topics={[
          { name: "Topic A", category: "in_scope" },
          { name: "Topic B", category: "in_scope" },
        ]}
      />,
    );
    const items = screen.getAllByTestId("info-section-list-item");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("Topic A");
    expect(items[1]).toHaveTextContent("Topic B");
  });

  it("renders the out of scope topic when passed", () => {
    render(
      <InfoSectionList
        title="Topics this question relates to:"
        items={["HR"]}
        fallbackText="No topics were classified at the time this response was generated."
        topicOutOfScope={
          [{ name: "HR", category: "out_of_scope" }].filter(
            (topic) => topic.category === "out_of_scope",
          ).length > 0
        }
      />,
    );

    const outOfScopeLabel = screen.getByTestId(
      "info-section-list-out-of-scope-topic",
    );
    expect(outOfScopeLabel).toBeInTheDocument();
  });
});
