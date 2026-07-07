import { describe, expect, it } from "vitest";
import { normaliseTopics } from "../normaliseTopics";

describe("normaliseTopics", () => {
  describe("when outOfScope is set", () => {
    it("returns an array containing the outOfScope value", () => {
      const result = normaliseTopics({
        outOfScope: "legacy-benefits",
        inScope: [],
      });

      expect(result).toEqual(["legacy-benefits"]);
    });

    it("ignores inScope values when outOfScope is set", () => {
      const result = normaliseTopics({
        outOfScope: "legacy-benefits",
        inScope: ["housing", "work-capability"],
      });

      expect(result).toEqual(["legacy-benefits"]);
      expect(result).not.toContain("housing");
    });

    it("returns a single-element array regardless of inScope length", () => {
      const result = normaliseTopics({
        outOfScope: "tax-credits",
        inScope: ["housing", "work-capability", "childcare"],
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toBe("tax-credits");
    });
  });

  describe("when outOfScope is empty", () => {
    it("returns the inScope array when outOfScope is an empty string", () => {
      const result = normaliseTopics({
        outOfScope: "",
        inScope: ["housing", "work-capability"],
      });

      expect(result).toEqual(["housing", "work-capability"]);
    });

    it("returns an empty array when both outOfScope and inScope are empty", () => {
      const result = normaliseTopics({ outOfScope: "", inScope: [] });

      expect(result).toEqual([]);
    });

    it("returns all inScope values", () => {
      const inScope = ["housing", "work-capability", "childcare"];
      const result = normaliseTopics({ outOfScope: "", inScope });

      expect(result).toEqual(inScope);
    });
  });

  describe("when inScope is nullish", () => {
    it("returns an empty array when inScope is undefined and outOfScope is empty", () => {
      const result = normaliseTopics({
        outOfScope: "",
        inScope: undefined as unknown as string[],
      });

      expect(result).toEqual([]);
    });
  });

  describe("return value", () => {
    it("always returns an array", () => {
      const result = normaliseTopics({ outOfScope: "", inScope: [] });

      expect(Array.isArray(result)).toBe(true);
    });

    it("does not mutate the original topics object", () => {
      const topics = { outOfScope: "", inScope: ["housing"] };
      normaliseTopics(topics);

      expect(topics.inScope).toEqual(["housing"]);
    });
  });
});
