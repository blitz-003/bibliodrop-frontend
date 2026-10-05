import { http, HttpResponse } from "msw";

import { getBooks } from "@/services/bookService";
import { makeBooksResponse } from "@/tests/mocks/fixtures";
import { server } from "@/tests/setup/server";

/*
 * `bookService` imports `authClient` at module scope for `createBook`, which
 * transitively loads `better-auth/react` -- an ESM-only entry point Jest's
 * CommonJS registry cannot `require`. That is handled once in `jest.config.mjs`
 * via `moduleNameMapper` rather than per file here.
 */

const API = "http://localhost:5000";

/**
 * `getBooks` is the only request builder in the app that is a plain exported
 * function, so its branching is worth pinning directly. Every other endpoint is
 * an inline `fetch` inside a component and is covered by the integration tests
 * instead.
 */
describe("getBooks", () => {
  let seenUrl;

  beforeEach(() => {
    seenUrl = null;

    server.use(
      http.get(`${API}/books`, ({ request }) => {
        seenUrl = request.url;
        return HttpResponse.json(makeBooksResponse());
      }),
    );
  });

  function params() {
    return new URL(seenUrl).searchParams;
  }

  it("requests the books endpoint with no parameters when given none", async () => {
    await getBooks();

    expect(new URL(seenUrl).pathname).toBe("/books");
    expect([...params().keys()]).toEqual([]);
  });

  it("returns the parsed response body unchanged", async () => {
    const payload = makeBooksResponse({ totalCount: 3 });
    server.use(http.get(`${API}/books`, () => HttpResponse.json(payload)));

    // The fixtures carry real `Date` objects, but everything crosses the wire
    // as JSON, so what callers actually receive has ISO strings in place of
    // dates. Comparing against the round-tripped payload documents that
    // contract instead of asserting an equality that only holds pre-serialisation.
    await expect(getBooks()).resolves.toEqual(JSON.parse(JSON.stringify(payload)));
  });

  it("returns timestamps as ISO strings, not Date instances", async () => {
    const [book] = makeBooksResponse().books;
    server.use(http.get(`${API}/books`, () => HttpResponse.json({ books: [book] })));

    const result = await getBooks();

    expect(typeof result.books[0].createdAt).toBe("string");
    expect(result.books[0].createdAt).toBe(book.createdAt.toISOString());
  });

  it.each([
    ["search", "atomic"],
    ["category", "Self Help"],
    ["sort", "price_asc"],
    ["page", 2],
    ["limit", 8],
  ])("forwards %s", async (key, value) => {
    await getBooks({ [key]: value });

    expect(params().get(key)).toBe(String(value));
  });

  it("includes available=false, because the check is `!== undefined`", async () => {
    // Intentional: the page relies on `available=false` being sent rather than
    // dropped, so this asserts the real (comparatively unusual) comparison.
    await getBooks({ available: false });

    expect(params().get("available")).toBe("false");
  });

  it("omits available when the key is absent", async () => {
    await getBooks({ search: "atomic" });

    expect(params().has("available")).toBe(false);
  });

  it.each([
    ["minDeliveryFee", "5"],
    ["maxDeliveryFee", "20"],
  ])("includes %s when it has a value", async (key, value) => {
    await getBooks({ [key]: value });

    expect(params().get(key)).toBe(value);
  });

  it.each(["minDeliveryFee", "maxDeliveryFee"])(
    "omits %s when it is an empty string",
    async (key) => {
      // The inputs are text fields, so "" is a real submission value, not a
      // hypothetical. It must not become `?minDeliveryFee=`.
      await getBooks({ [key]: "" });

      expect(params().has(key)).toBe(false);
    },
  );

  it("includes a zero fee bound, since only an empty string counts as absent", async () => {
    await getBooks({ minDeliveryFee: 0 });

    expect(params().get("minDeliveryFee")).toBe("0");
  });

  it("drops empty values for the string filters", async () => {
    await getBooks({ search: "", category: "", sort: "" });

    expect([...params().keys()]).toEqual([]);
  });

  it("sends every filter together", async () => {
    await getBooks({
      search: "habits",
      category: "Self Help",
      available: true,
      page: 2,
      limit: 8,
      sort: "price_desc",
      minDeliveryFee: 5,
      maxDeliveryFee: 20,
    });

    expect([...params().entries()].sort()).toEqual(
      [
        ["available", "true"],
        ["category", "Self Help"],
        ["limit", "8"],
        ["maxDeliveryFee", "20"],
        ["minDeliveryFee", "5"],
        ["page", "2"],
        ["search", "habits"],
        ["sort", "price_desc"],
      ].sort(),
    );
  });

  it("rejects when the backend returns a non-ok status", async () => {
    server.use(
      http.get(`${API}/books`, () =>
        HttpResponse.json({ error: "Failed to fetch books." }, { status: 500 }),
      ),
    );

    await expect(getBooks()).rejects.toThrow("Failed to fetch books");
  });

  it("rejects on a 401 as well as a 500", async () => {
    server.use(
      http.get(`${API}/books`, () =>
        HttpResponse.json({ error: "Unauthorized" }, { status: 401 }),
      ),
    );

    await expect(getBooks()).rejects.toThrow("Failed to fetch books");
  });
});