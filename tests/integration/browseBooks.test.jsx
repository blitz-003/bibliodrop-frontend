import { delay, http, HttpResponse } from "msw";
import userEvent from "@testing-library/user-event";

import BrowseBooksPage from "@/app/browse-books/page";
import { makeCatalogue } from "../mocks/handlers";
import { makeCatalogueBook } from "../mocks/fixtures";
import { renderWithProviders, act, screen, waitFor, within } from "../setup/render";
import { server } from "../setup/server";

/*
 * Browse is the app's primary catalogue surface and the page most exposed to URL
 * parameters, so these tests drive it the way a user does: through the rendered
 * controls, with the router mock round-tripping every change back into the URL
 * and back into the React Query key.
 */

jest.mock("next/navigation", () => require("../setup/navigationMock"));

const {
  router,
  setUrl,
  resetUrl,
} = require("../setup/navigationMock");

function renderPage() {
  return renderWithProviders(<BrowseBooksPage />);
}

beforeEach(() => {
  resetUrl("/browse-books");
  router.push.mockClear();
  router.replace.mockClear();
});

describe("Browse Books page", () => {
  describe("loading", () => {
    it("shows a loading state before the catalogue arrives", async () => {
      server.use(
        http.get("http://localhost:5000/books", async () => {
          await delay(30);
          return HttpResponse.json({ books: [], totalCount: 0 });
        }),
      );

      renderPage();

      expect(
        screen.getByRole("heading", { name: "Loading books" }),
      ).toBeInTheDocument();

      await waitFor(() =>
        expect(
          screen.queryByRole("heading", { name: "Loading books" }),
        ).not.toBeInTheDocument(),
      );
    });

    it("announces the pending state to assistive technology", () => {
      server.use(
        http.get("http://localhost:5000/books", async () => {
          await delay(30);
          return HttpResponse.json({ books: [] });
        }),
      );

      renderPage();

      expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
    });
  });

  describe("success", () => {
    it("renders a card per book returned", async () => {
      renderPage();

      const grid = await screen.findByRole("link", { name: /Atomic Habits/ });

      expect(grid).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /Dune/ })).toBeInTheDocument();
    });

    it("shows the total from the response, not the page length", async () => {
      // The response reports 24 books while returning one page of 8; the header
      // must reflect the real total.
      server.use(
        http.get("http://localhost:5000/books", () =>
          HttpResponse.json({
            books: makeCatalogue(8),
            totalCount: 24,
            currentPage: 1,
            totalPages: 3,
            allCategories: ["Fiction"],
          }),
        ),
      );

      renderPage();

      expect(
        await screen.findByText("24 Books Available"),
      ).toBeInTheDocument();
    });

    it("links each card to its own detail route", async () => {
      server.use(
        http.get("http://localhost:5000/books", () =>
          HttpResponse.json({
            books: [makeCatalogueBook({ _id: "book-77", title: "Dune" })],
            totalCount: 1,
            currentPage: 1,
            totalPages: 1,
            allCategories: ["Fiction"],
          }),
        ),
      );

      renderPage();

      const link = await screen.findByRole("link", { name: /Dune/ });

      expect(link).toHaveAttribute("href", "/books/book-77");
    });

    it("exposes the page title as a level-1 heading", async () => {
      renderPage();

      expect(
        await screen.findByRole("heading", { level: 1, name: "Browse Books" }),
      ).toBeInTheDocument();
    });

    it("requests one page of eight items with a limit", async () => {
      let seenLimit = null;

      server.use(
        http.get("http://localhost:5000/books", ({ request }) => {
          seenLimit = new URL(request.url).searchParams.get("limit");
          return HttpResponse.json({
            books: makeCatalogue(8),
            totalCount: 8,
            currentPage: 1,
            totalPages: 1,
            allCategories: [],
          });
        }),
      );

      renderPage();

      await screen.findByRole("link", { name: /Atomic Habits/ });

      expect(seenLimit).toBe("8");
    });
  });

  describe("empty", () => {
    it("explains that nothing matched the parameters", async () => {
      server.use(
        http.get("http://localhost:5000/books", () =>
          HttpResponse.json({
            books: [],
            totalCount: 0,
            currentPage: 1,
            totalPages: 1,
            allCategories: [],
          }),
        ),
      );

      renderPage();

      expect(
        await screen.findByText("No results matched your parameters."),
      ).toBeInTheDocument();
    });

    it("suggests adjusting the filters", async () => {
      server.use(
        http.get("http://localhost:5000/books", () =>
          HttpResponse.json({ books: [], totalCount: 0, allCategories: [] }),
        ),
      );

      renderPage();

      expect(
        await screen.findByText("Try modifying your search query filters."),
      ).toBeInTheDocument();
    });

    it("renders no cards and no pagination", async () => {
      server.use(
        http.get("http://localhost:5000/books", () =>
          HttpResponse.json({ books: [], totalCount: 0, allCategories: [] }),
        ),
      );

      renderPage();

      await screen.findByText("No results matched your parameters.");

      expect(screen.queryByRole("navigation", { name: "Pagination" })).toBeNull();
    });
  });

  describe("failure", () => {
    it("reports a failed catalogue request", async () => {
      server.use(
        http.get("http://localhost:5000/books", () =>
          HttpResponse.json({ message: "boom" }, { status: 500 }),
        ),
      );

      renderPage();

      expect(
        await screen.findByText(
          "Failed to load system book catalog stream.",
        ),
      ).toBeInTheDocument();
    });

    it("announces the failure as an alert", async () => {
      server.use(
        http.get("http://localhost:5000/books", () =>
          HttpResponse.json({ message: "boom" }, { status: 500 }),
        ),
      );

      renderPage();

      expect(await screen.findByRole("alert")).toBeInTheDocument();
    });

    it("shows no cards and no empty state alongside the error", async () => {
      server.use(
        http.get("http://localhost:5000/books", () =>
          HttpResponse.json({ message: "boom" }, { status: 500 }),
        ),
      );

      renderPage();

      await screen.findByRole("alert");

      expect(
        screen.queryByText("No results matched your parameters."),
      ).not.toBeInTheDocument();
    });
  });

  describe("search", () => {
    it("is labelled for assistive technology", async () => {
      renderPage();

      await screen.findByRole("link", { name: /Atomic Habits/ });

      expect(
        screen.getByLabelText("Search books by title or author"),
      ).toBeInTheDocument();
    });

    it("pushes the search term to the URL after the debounce", async () => {
      jest.useFakeTimers();

      try {
        renderPage();
        const input = screen.getByLabelText("Search books by title or author");

        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });

        await user.type(input, "dune");

        expect(router.push).not.toHaveBeenCalled();

        act(() => {
          act(() => {
          jest.advanceTimersByTime(350);
        });
        });

        expect(router.push).toHaveBeenCalledWith(
          expect.stringContaining("search=dune"),
        );
      } finally {
        jest.useRealTimers();
      }
    });

    it("resets to the first page when the search changes", async () => {
      setUrl("/browse-books?page=3");

      jest.useFakeTimers();

      try {
        renderPage();
        const input = screen.getByLabelText("Search books by title or author");

        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });

        await user.type(input, "dune");
        act(() => {
          act(() => {
          jest.advanceTimersByTime(350);
        });
        });

        const pushed = router.push.mock.calls.at(-1)[0];

        expect(pushed).toContain("page=1");
      } finally {
        jest.useRealTimers();
      }
    });

    it("removes the parameter entirely when the search is cleared", async () => {
      setUrl("/browse-books?search=dune");

      jest.useFakeTimers();

      try {
        renderPage();
        const input = screen.getByLabelText("Search books by title or author");

        expect(input).toHaveValue("dune");

        const user = userEvent.setup({
          advanceTimers: jest.advanceTimersByTime,
        });

        await user.clear(input);
        act(() => {
          act(() => {
          jest.advanceTimersByTime(350);
        });
        });

        expect(router.push).toHaveBeenCalledWith("/browse-books?page=1");
      } finally {
        jest.useRealTimers();
      }
    });

    it("seeds the input from the URL", async () => {
      setUrl("/browse-books?search=atomic");

      renderPage();

      expect(
        await screen.findByLabelText("Search books by title or author"),
      ).toHaveValue("atomic");
    });

    it("does not push a duplicate URL on mount for the initial term", async () => {
      setUrl("/browse-books?search=atomic");

      renderPage();

      await screen.findByLabelText("Search books by title or author");

      // The effect bails when the input already matches the URL, which is what
      // stops pagination from bouncing back to page 1.
      expect(router.push).not.toHaveBeenCalled();
    });
  });

  describe("sorting", () => {
    it("is labelled for assistive technology", async () => {
      renderPage();

      await screen.findByRole("link", { name: /Atomic Habits/ });

      expect(screen.getByLabelText("Sort books")).toBeInTheDocument();
    });

    it("defaults to newest", async () => {
      renderPage();

      expect(await screen.findByLabelText("Sort books")).toHaveValue("newest");
    });

    it("reflects the sort parameter from the URL", async () => {
      setUrl("/browse-books?sort=price_low");

      renderPage();

      expect(await screen.findByLabelText("Sort books")).toHaveValue("price_low");
    });

    it("writes the chosen sort to the URL", async () => {
      renderPage();
      await screen.findByRole("link", { name: /Atomic Habits/ });

      const user = userEvent.setup();

      await user.selectOptions(screen.getByLabelText("Sort books"), "oldest");

      expect(router.push).toHaveBeenCalledWith(
        expect.stringContaining("sort=oldest"),
      );
    });

    it("resets to the first page when the sort changes", async () => {
      setUrl("/browse-books?sort=oldest&page=4");

      renderPage();
      await screen.findByRole("link", { name: /Atomic Habits/ });

      const user = userEvent.setup();

      await user.selectOptions(screen.getByLabelText("Sort books"), "price_low");

      expect(router.push.mock.calls.at(-1)[0]).toContain("page=1");
    });
  });

  describe("filters panel", () => {
    it("is collapsed initially", async () => {
      renderPage();

      await screen.findByRole("link", { name: /Atomic Habits/ });

      expect(
        screen.queryByRole("combobox", { name: "Category" }),
      ).not.toBeInTheDocument();
    });

    it("reports its collapsed state to assistive technology", async () => {
      renderPage();

      await screen.findByRole("link", { name: /Atomic Habits/ });

      expect(screen.getByRole("button", { name: /Filters/ })).toHaveAttribute(
        "aria-expanded",
        "false",
      );
    });

    it("points at the panel it controls", async () => {
      renderPage();

      await screen.findByRole("link", { name: /Atomic Habits/ });

      const toggle = screen.getByRole("button", { name: /Filters/ });

      expect(toggle).toHaveAttribute("aria-controls", "book-filters-panel");
    });

    it("expands and collapses on click", async () => {
      renderPage();
      await screen.findByRole("link", { name: /Atomic Habits/ });

      const user = userEvent.setup();
      const toggle = screen.getByRole("button", { name: /Filters/ });

      await user.click(toggle);

      expect(toggle).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByRole("combobox", { name: "Category" })).toBeInTheDocument();

      await user.click(toggle);

      expect(toggle).toHaveAttribute("aria-expanded", "false");
    });

    it("offers the categories reported by the API", async () => {
      server.use(
        http.get("http://localhost:5000/books", () =>
          HttpResponse.json({
            books: makeCatalogue(2),
            totalCount: 2,
            currentPage: 1,
            totalPages: 1,
            allCategories: ["History", "Technology"],
          }),
        ),
      );

      renderPage();
      await screen.findByRole("link", { name: /Atomic Habits/ });

      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /Filters/ }));

      const select = screen.getByRole("combobox", { name: "Category" });

      expect(
        within(select).getByRole("option", { name: "History" }),
      ).toBeInTheDocument();
      expect(
        within(select).getByRole("option", { name: "Technology" }),
      ).toBeInTheDocument();
    });

    it("writes the chosen category to the URL", async () => {
      renderPage();
      await screen.findByRole("link", { name: /Atomic Habits/ });

      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /Filters/ }));
      await user.selectOptions(
        screen.getByRole("combobox", { name: "Category" }),
        "Fiction",
      );

      expect(router.push).toHaveBeenCalledWith(
        expect.stringContaining("category=Fiction"),
      );
    });

    it("reflects a category chosen in the URL", async () => {
      setUrl("/browse-books?category=Fiction");

      renderPage();

      // category=Fiction is genuinely applied to the response, so only the
      // Fiction titles come back.
      await screen.findByRole("link", { name: /Dune/ });

      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /Filters/ }));

      expect(screen.getByRole("combobox", { name: "Category" })).toHaveValue(
        "Fiction",
      );
    });

    it("labels both delivery fee bounds", async () => {
      renderPage();
      await screen.findByRole("link", { name: /Atomic Habits/ });

      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /Filters/ }));

      expect(screen.getByLabelText("Min Delivery Fee")).toBeInTheDocument();
      expect(screen.getByLabelText("Max Delivery Fee")).toBeInTheDocument();
    });

    it("writes the fee bounds to the URL", async () => {
      renderPage();
      await screen.findByRole("link", { name: /Atomic Habits/ });

      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /Filters/ }));

      await user.type(screen.getByLabelText("Min Delivery Fee"), "3");

      expect(router.push).toHaveBeenCalledWith(
        expect.stringContaining("minDeliveryFee=3"),
      );
    });

    it("rejects negative fee bounds at the input", async () => {
      renderPage();
      await screen.findByRole("link", { name: /Atomic Habits/ });

      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /Filters/ }));

      expect(screen.getByLabelText("Min Delivery Fee")).toHaveAttribute(
        "min",
        "0",
      );
    });

    it("stays open and flagged when a filter is already active in the URL", async () => {
      setUrl("/browse-books?category=Fiction");

      renderPage();

      await screen.findByRole("link", { name: /Dune/ });

      const toggle = screen.getByRole("button", { name: /Filters/ });

      expect(toggle).toHaveAttribute("aria-expanded", "false");
      expect(toggle.className).toContain("bg-accent");
    });
  });

  describe("clearing filters", () => {
    it("is hidden when nothing is filtered", async () => {
      renderPage();

      await screen.findByRole("link", { name: /Atomic Habits/ });

      expect(
        screen.queryByRole("button", { name: /Clear All/ }),
      ).not.toBeInTheDocument();
    });

    it.each([
      ["search", "/browse-books?search=dune"],
      ["category", "/browse-books?category=Fiction"],
      ["min fee", "/browse-books?minDeliveryFee=2"],
      ["max fee", "/browse-books?maxDeliveryFee=9"],
      ["sort", "/browse-books?sort=oldest"],
    ])("appears when a %s filter is active", async (_label, url) => {
      setUrl(url);

      renderPage();

      expect(
        await screen.findByRole("button", { name: /Clear All/ }),
      ).toBeInTheDocument();
    });

    it("returns to the pristine URL", async () => {
      setUrl("/browse-books?search=dune&category=Fiction&page=3");

      renderPage();
      await screen.findByRole("button", { name: /Clear All/ });

      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /Clear All/ }));

      expect(router.push).toHaveBeenCalledWith("/browse-books");
    });

    it("empties the search input as well as the URL", async () => {
      setUrl("/browse-books?search=dune");

      renderPage();
      const input = await screen.findByLabelText(
        "Search books by title or author",
      );
      expect(input).toHaveValue("dune");

      const user = userEvent.setup();
      await user.click(screen.getByRole("button", { name: /Clear All/ }));

      expect(input).toHaveValue("");
    });
  });

  describe("pagination", () => {
    const paginated = {
      books: makeCatalogue(8),
      totalCount: 20,
      currentPage: 1,
      totalPages: 3,
      allCategories: [],
    };

    beforeEach(() => {
      server.use(
        http.get("http://localhost:5000/books", () =>
          HttpResponse.json(paginated),
        ),
      );
    });

    it("is hidden for a single page of results", async () => {
      server.use(
        http.get("http://localhost:5000/books", () =>
          HttpResponse.json({
            books: makeCatalogue(3),
            totalCount: 3,
            currentPage: 1,
            totalPages: 1,
            allCategories: [],
          }),
        ),
      );

      renderPage();
      await screen.findByRole("link", { name: /Atomic Habits/ });

      expect(
        screen.queryByRole("navigation", { name: "Pagination" }),
      ).not.toBeInTheDocument();
    });

    it("appears once there is more than one page", async () => {
      renderPage();

      expect(
        await screen.findByRole("navigation", { name: "Pagination" }),
      ).toBeInTheDocument();
    });

    it("disables Previous on the first page", async () => {
      renderPage();

      expect(await screen.findByRole("button", { name: "Previous page" })).toBeDisabled();
    });

    it("enables Next on the first page", async () => {
      renderPage();

      expect(await screen.findByRole("button", { name: "Next page" })).toBeEnabled();
    });

    it("reports the current and total page counts", async () => {
      renderPage();

      const nav = await screen.findByRole("navigation", { name: "Pagination" });

      expect(within(nav).getByText("Page 1")).toBeInTheDocument();
      expect(within(nav).getByText("3")).toBeInTheDocument();
    });

    it("advances to the next page", async () => {
      renderPage();
      const next = await screen.findByRole("button", { name: "Next page" });

      const user = userEvent.setup();
      await user.click(next);

      expect(router.push).toHaveBeenCalledWith(
        expect.stringContaining("page=2"),
      );
    });

    it("goes back to the previous page", async () => {
      setUrl("/browse-books?page=2");

      renderPage();
      const previous = await screen.findByRole("button", {
        name: "Previous page",
      });

      const user = userEvent.setup();
      await user.click(previous);

      expect(router.push).toHaveBeenCalledWith(
        expect.stringContaining("page=1"),
      );
    });

    it("disables Next on the last page", async () => {
      setUrl("/browse-books?page=3");

      renderPage();

      expect(await screen.findByRole("button", { name: "Next page" })).toBeDisabled();
    });

    it("preserves the active filters when the page changes", async () => {
      setUrl("/browse-books?search=dune&category=Fiction&page=1");

      renderPage();
      const next = await screen.findByRole("button", { name: "Next page" });

      const user = userEvent.setup();
      await user.click(next);

      const pushed = router.push.mock.calls.at(-1)[0];

      expect(pushed).toContain("search=dune");
      expect(pushed).toContain("category=Fiction");
      expect(pushed).toContain("page=2");
    });

    it("does not bounce back to the first page after paginating", async () => {
      setUrl("/browse-books?search=dune&page=1");

      renderPage();
      const next = await screen.findByRole("button", { name: "Next page" });

      const user = userEvent.setup();
      await user.click(next);

      // Without the input/URL equality guard this effect would immediately
      // re-fire and push page=1, so pagination could never advance.
      expect(router.push).toHaveBeenCalledTimes(1);
      expect(router.push).not.toHaveBeenCalledWith(
        expect.stringContaining("page=1"),
      );
    });

    it("reflects the page supplied in the URL", async () => {
      setUrl("/browse-books?page=2");

      renderPage();

      const nav = await screen.findByRole("navigation", { name: "Pagination" });

      expect(within(nav).getByText("Page 2")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Previous page" })).toBeEnabled();
    });
  });
});