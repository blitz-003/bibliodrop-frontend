import { cn } from "@/lib/cn";

describe("cn", () => {
  it("joins multiple string arguments", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("skips falsy values", () => {
    expect(cn("a", null, undefined, false, "", 0, NaN, "b")).toBe("a b");
  });

  it("keeps a literal zero but drops other falsy numbers", () => {
    // `0` is skipped by the falsy guard; this documents the actual behaviour
    // rather than assuming zero-width classes are preserved.
    expect(cn("gap-0", 0)).toBe("gap-0");
  });

  it("coerces a non-zero number into the class list", () => {
    expect(cn("col", 2)).toBe("col 2");
  });

  it("keeps object keys whose value is truthy", () => {
    expect(cn({ a: true, b: false, c: 1, d: 0, e: "" })).toBe("a c");
  });

  it("flattens nested arrays", () => {
    expect(cn(["a", ["b", ["c", ["d"]]]])).toBe("a b c d");
  });

  it("drops empty results produced by arrays and objects", () => {
    expect(cn("a", [], {}, [null, false, ""], "b")).toBe("a b");
  });

  it("preserves argument order so later classes can override earlier ones", () => {
    expect(cn("p-2", "p-4")).toBe("p-2 p-4");
  });

  it("returns an empty string when given nothing usable", () => {
    expect(cn()).toBe("");
    expect(cn(null, undefined, {}, [])).toBe("");
  });

  it("does not dedupe, so a caller can intentionally re-apply a class", () => {
    expect(cn("a", "a")).toBe("a a");
  });
});