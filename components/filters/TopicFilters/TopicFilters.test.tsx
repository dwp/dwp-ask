import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FILTER_IDS } from "@/constants/Ids";
import TopicFilters from "./TopicFilters";

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock("@/components", () => ({
  Paragraph: ({
    children,
    className,
    "data-testid": testId,
  }: {
    children: React.ReactNode;
    className?: string;
    "data-testid"?: string;
  }) => (
    <p data-testid={testId} className={className}>
      {children}
    </p>
  ),

  Checkbox: ({
    id,
    value,
    checked,
    onChange,
    children,
    "aria-checked": ariaChecked,
    "data-testid": testId,
  }: {
    id: string;
    value: string;
    checked: boolean;
    onChange: (e: { target: { name: string; value: string } }) => void;
    children: React.ReactNode;
    "aria-checked"?: boolean;
    "data-testid"?: string;
  }) => (
    <div data-testid={testId}>
      <input
        type="checkbox"
        id={id}
        // name mirrors value so the onChange handler's target.name resolves correctly
        name={value}
        value={value}
        checked={checked}
        aria-checked={ariaChecked}
        aria-label={typeof children === "string" ? children : value}
        onChange={(e) =>
          onChange({ target: { name: e.target.name, value: e.target.value } })
        }
      />
      <label htmlFor={id}>{children}</label>
    </div>
  ),

  Radio: ({
    option,
    name,
    checked,
    onChange,
  }: {
    option: { label: string; value: string };
    name: string;
    checked: boolean;
    onChange: (selected: { label: string; value: string }) => void;
  }) => (
    <div data-testid={`radio-${option.value}`}>
      <input
        type="radio"
        name={name}
        value={option.value}
        checked={checked}
        aria-label={option.label}
        onChange={() => onChange(option)}
      />
      <label>{option.label}</label>
    </div>
  ),
}));

vi.mock("@/constants/Ids", () => ({
  FILTER_IDS: { topics: "filter-topics-id" },
}));

vi.mock("@/utils", () => ({
  capitaliseHyphenatedString: (s: string) => s.toUpperCase(),
}));

// ── Fixtures ──────────────────────────────────────────────────────────────────

const inScopeTopics = [
  { id: 1, name: "housing", category: "in_scope" },
  { id: 2, name: "work-capability", category: "in_scope" },
];

const outOfScopeTopics = [
  { id: 3, name: "legacy-benefits", category: "out_of_scope" },
  { id: 4, name: "tax-credits", category: "out_of_scope" },
];

const allTopics = [...inScopeTopics, ...outOfScopeTopics];

const emptySelected = {
  inScope: [] as string[],
  outOfScope: "",
};

type TopicsSelected = typeof emptySelected;
type FilterState = { topics: { inScope: string[]; outOfScope: string } };

function makeFilterState(inScope: string[] = [], outOfScope = ""): FilterState {
  return { topics: { inScope, outOfScope } };
}

function renderTopicFilters(
  topicsSelected: TopicsSelected = emptySelected,
  setTopicsSelected = vi.fn(),
) {
  return render(
    <TopicFilters
      topicList={allTopics}
      topicsSelected={topicsSelected}
      setTopicsSelected={setTopicsSelected}
    />,
  );
}

function applyUpdater(
  setTopicsSelected: ReturnType<typeof vi.fn>,
  currentState: FilterState,
): FilterState {
  const updater = setTopicsSelected.mock.calls[0][0];
  return updater(currentState);
}

function getCheckboxInput(topicId: number) {
  return screen
    .getByTestId(`in-scope-topic-filter-checkbox-${topicId}`)
    .querySelector("input")!;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("TopicFilters", () => {
  describe("rendering", () => {
    it("renders the outer container with the correct id", () => {
      renderTopicFilters();

      expect(screen.getByTestId("topics-filters")).toHaveAttribute(
        "id",
        FILTER_IDS.topics,
      );
    });

    it("renders the in-scope section", () => {
      renderTopicFilters();

      expect(screen.getByTestId("in-scope-topic-filters")).toBeInTheDocument();
    });

    it("renders the out-of-scope section", () => {
      renderTopicFilters();

      expect(
        screen.getByTestId("out-of-scope-topic-filters"),
      ).toBeInTheDocument();
    });

    it("renders the UC question topics heading", () => {
      renderTopicFilters();

      expect(screen.getByText("UC question topics")).toBeInTheDocument();
    });

    it("renders the out of scope heading", () => {
      renderTopicFilters();

      expect(screen.getByText("Out of scope topics")).toBeInTheDocument();
    });

    it("renders the in-scope hint text", () => {
      renderTopicFilters();

      expect(
        screen.getByText(
          "All questions will fall under more than just one topic.",
        ),
      ).toBeInTheDocument();
    });

    it("renders the out-of-scope hint text", () => {
      renderTopicFilters();

      expect(
        screen.getByText(/If you have selected a UC question topic/),
      ).toBeInTheDocument();
    });
  });

  describe("in-scope checkboxes", () => {
    it("renders a checkbox for each in-scope topic", () => {
      renderTopicFilters();

      inScopeTopics.forEach((topic) => {
        expect(
          screen.getByTestId(`in-scope-topic-filter-checkbox-${topic.id}`),
        ).toBeInTheDocument();
      });
    });

    it("does not render checkboxes for out-of-scope topics in the in-scope section", () => {
      renderTopicFilters();

      outOfScopeTopics.forEach((topic) => {
        expect(
          screen.queryByTestId(`in-scope-topic-filter-checkbox-${topic.id}`),
        ).not.toBeInTheDocument();
      });
    });

    it("passes the topic name as value to each in-scope checkbox", () => {
      renderTopicFilters();

      inScopeTopics.forEach((topic) => {
        expect(getCheckboxInput(topic.id)).toHaveAttribute("value", topic.name);
      });
    });

    it("calls capitaliseHyphenatedString for each in-scope topic label", () => {
      renderTopicFilters();

      inScopeTopics.forEach((topic) => {
        expect(screen.getByText(topic.name.toUpperCase())).toBeInTheDocument();
      });
    });

    it("renders all in-scope checkboxes unchecked when inScope is empty", () => {
      renderTopicFilters();

      inScopeTopics.forEach((topic) => {
        expect(getCheckboxInput(topic.id)).not.toBeChecked();
      });
    });

    it("renders a checkbox as checked when its name is in topicsSelected.inScope", () => {
      renderTopicFilters({ inScope: ["housing"], outOfScope: "" });

      expect(getCheckboxInput(1)).toBeChecked();
      expect(getCheckboxInput(2)).not.toBeChecked();
    });

    it("renders multiple checkboxes as checked when multiple values are selected", () => {
      renderTopicFilters({
        inScope: ["housing", "work-capability"],
        outOfScope: "",
      });

      inScopeTopics.forEach((topic) => {
        expect(getCheckboxInput(topic.id)).toBeChecked();
      });
    });

    it("sets aria-checked consistently with checked", () => {
      renderTopicFilters({ inScope: ["housing"], outOfScope: "" });

      expect(getCheckboxInput(1)).toHaveAttribute("aria-checked", "true");
      expect(getCheckboxInput(2)).toHaveAttribute("aria-checked", "false");
    });
  });

  describe("in-scope checkbox onChange — adding", () => {
    it("calls setTopicsSelected when an unchecked checkbox is clicked", async () => {
      const setTopicsSelected = vi.fn();
      renderTopicFilters(emptySelected, setTopicsSelected);

      await userEvent.click(getCheckboxInput(1));

      expect(setTopicsSelected).toHaveBeenCalledTimes(1);
    });

    it("adds the topic name to inScope when it does not exist", async () => {
      const setTopicsSelected = vi.fn();
      renderTopicFilters(emptySelected, setTopicsSelected);

      await userEvent.click(getCheckboxInput(1));

      const next = applyUpdater(setTopicsSelected, makeFilterState());
      expect(next.topics.inScope).toContain("housing");
    });

    it("preserves existing inScope values when adding a new one", async () => {
      const setTopicsSelected = vi.fn();
      renderTopicFilters(
        { inScope: ["work-capability"], outOfScope: "" },
        setTopicsSelected,
      );

      await userEvent.click(getCheckboxInput(1));

      const next = applyUpdater(
        setTopicsSelected,
        makeFilterState(["work-capability"]),
      );
      expect(next.topics.inScope).toContain("work-capability");
      expect(next.topics.inScope).toContain("housing");
    });
  });

  describe("in-scope checkbox onChange — removing", () => {
    it("removes the topic name from inScope when it already exists", async () => {
      const setTopicsSelected = vi.fn();
      renderTopicFilters(
        { inScope: ["housing"], outOfScope: "" },
        setTopicsSelected,
      );

      await userEvent.click(getCheckboxInput(1));

      const next = applyUpdater(
        setTopicsSelected,
        makeFilterState(["housing"]),
      );
      expect(next.topics.inScope).not.toContain("housing");
    });

    it("does not affect other inScope values when removing one", async () => {
      const setTopicsSelected = vi.fn();
      renderTopicFilters(
        { inScope: ["housing", "work-capability"], outOfScope: "" },
        setTopicsSelected,
      );

      await userEvent.click(getCheckboxInput(1));

      const next = applyUpdater(
        setTopicsSelected,
        makeFilterState(["housing", "work-capability"]),
      );
      expect(next.topics.inScope).not.toContain("housing");
      expect(next.topics.inScope).toContain("work-capability");
    });

    it("results in an empty array when the only selected value is removed", async () => {
      const setTopicsSelected = vi.fn();
      renderTopicFilters(
        { inScope: ["housing"], outOfScope: "" },
        setTopicsSelected,
      );

      await userEvent.click(getCheckboxInput(1));

      const next = applyUpdater(
        setTopicsSelected,
        makeFilterState(["housing"]),
      );
      expect(next.topics.inScope).toHaveLength(0);
    });
  });

  describe("out-of-scope radios", () => {
    it("renders a radio for each out-of-scope topic", () => {
      renderTopicFilters();

      outOfScopeTopics.forEach((topic) => {
        expect(screen.getByTestId(`radio-${topic.name}`)).toBeInTheDocument();
      });
    });

    it("does not render radios for in-scope topics", () => {
      renderTopicFilters();

      inScopeTopics.forEach((topic) => {
        expect(
          screen.queryByTestId(`radio-${topic.name}`),
        ).not.toBeInTheDocument();
      });
    });

    it("renders all radios unchecked when outOfScope is empty", () => {
      renderTopicFilters();

      outOfScopeTopics.forEach((topic) => {
        const input = screen
          .getByTestId(`radio-${topic.name}`)
          .querySelector("input")!;
        expect(input).not.toBeChecked();
      });
    });

    it("renders the matching radio as checked when outOfScope is set", () => {
      renderTopicFilters({ inScope: [], outOfScope: "legacy-benefits" });

      const checkedInput = screen
        .getByTestId("radio-legacy-benefits")
        .querySelector("input")!;
      const uncheckedInput = screen
        .getByTestId("radio-tax-credits")
        .querySelector("input")!;

      expect(checkedInput).toBeChecked();
      expect(uncheckedInput).not.toBeChecked();
    });

    it("passes name='out-of-scope-topic-filter' to every radio", () => {
      renderTopicFilters();

      outOfScopeTopics.forEach((topic) => {
        const input = screen
          .getByTestId(`radio-${topic.name}`)
          .querySelector("input")!;
        expect(input).toHaveAttribute("name", "out-of-scope-topic-filter");
      });
    });
  });

  describe("out-of-scope radio onChange", () => {
    it("calls setTopicsSelected when a radio is clicked", async () => {
      const setTopicsSelected = vi.fn();
      renderTopicFilters(emptySelected, setTopicsSelected);

      const input = screen
        .getByTestId("radio-legacy-benefits")
        .querySelector("input")!;
      await userEvent.click(input);

      expect(setTopicsSelected).toHaveBeenCalledTimes(1);
    });

    it("sets outOfScope to the selected topic label", async () => {
      const setTopicsSelected = vi.fn();
      renderTopicFilters(emptySelected, setTopicsSelected);

      const input = screen
        .getByTestId("radio-legacy-benefits")
        .querySelector("input")!;
      await userEvent.click(input);

      const next = applyUpdater(setTopicsSelected, makeFilterState());
      expect(next.topics.outOfScope).toBe("legacy-benefits");
    });

    it("preserves inScope values when selecting an out-of-scope radio", async () => {
      const setTopicsSelected = vi.fn();
      renderTopicFilters(emptySelected, setTopicsSelected);

      const input = screen
        .getByTestId("radio-legacy-benefits")
        .querySelector("input")!;
      await userEvent.click(input);

      const next = applyUpdater(
        setTopicsSelected,
        makeFilterState(["housing"]),
      );
      expect(next.topics.inScope).toContain("housing");
    });
  });

  describe("topic filtering", () => {
    it("only shows in-scope topics in the in-scope section when mixed list is given", () => {
      renderTopicFilters();

      const inScopeSection = screen.getByTestId("in-scope-topic-filters");
      inScopeTopics.forEach((topic) => {
        expect(
          inScopeSection.querySelector(
            `[data-testid="in-scope-topic-filter-checkbox-${topic.id}"]`,
          ),
        ).toBeInTheDocument();
      });
      outOfScopeTopics.forEach((topic) => {
        expect(
          inScopeSection.querySelector(
            `[data-testid="in-scope-topic-filter-checkbox-${topic.id}"]`,
          ),
        ).not.toBeInTheDocument();
      });
    });

    it("renders nothing in the in-scope section when all topics are out-of-scope", () => {
      render(
        <TopicFilters
          topicList={outOfScopeTopics}
          topicsSelected={emptySelected}
          setTopicsSelected={vi.fn()}
        />,
      );

      const inScopeSection = screen.getByTestId("in-scope-topic-filters");
      expect(
        inScopeSection.querySelectorAll("input[type='checkbox']"),
      ).toHaveLength(0);
    });

    it("renders nothing in the out-of-scope section when all topics are in-scope", () => {
      render(
        <TopicFilters
          topicList={inScopeTopics}
          topicsSelected={emptySelected}
          setTopicsSelected={vi.fn()}
        />,
      );

      const outOfScopeSection = screen.getByTestId(
        "out-of-scope-topic-filters",
      );
      expect(
        outOfScopeSection.querySelectorAll("input[type='radio']"),
      ).toHaveLength(0);
    });

    it("renders nothing when topicList is empty", () => {
      render(
        <TopicFilters
          topicList={[]}
          topicsSelected={emptySelected}
          setTopicsSelected={vi.fn()}
        />,
      );

      expect(
        screen.getByTestId("in-scope-topic-filters").querySelectorAll("input"),
      ).toHaveLength(0);
      expect(
        screen
          .getByTestId("out-of-scope-topic-filters")
          .querySelectorAll("input"),
      ).toHaveLength(0);
    });
  });
});
