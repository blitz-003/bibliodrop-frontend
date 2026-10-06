import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import BookCard from "@/components/BookCard";
import { makeBook } from "../mocks/fixtures";

function renderCard(overrides = {}) {
  const book = { ...makeBook(), ...overrides };
  const utils = render(<BookCard book={book} />);
  const link = screen.getByRole("link");
  return { book, link, ...utils };
}

describe("BookCard", () => {
  describe("identity and navigation", () => {
    it("is a single link rather than a clickable div", () => {
      // A `<div onClick>` was unreachable by keyboard and announced as nothing.
      const { link } = renderCard();

      expect(link.tagName).toBe("A");
      expect(link).toHaveAttribute("href");
    });

    it("contains no nested interactive control competing with the link", () => {
      const { link } = renderCard();

      expect(within(link).queryAllByRole("button")).toHaveLength(0);
    });

    it("points at the book detail route using _id", () => {
      renderCard({ _id: "book-1", id: "ignored" });

      expect(screen.getByRole("link")).toHaveAttribute("href", "/books/book-1");
    });

    it("falls back to id when _id is absent", () => {
      renderCard({ _id: undefined, id: "legacy-9" });

      expect(screen.getByRole("link")).toHaveAttribute("href", "/books/legacy-9");
    });

    it("takes its accessible name from the card contents", () => {
      renderCard({ title: "Dune", author: "Frank Herbert" });

      const link = screen.getByRole("link", { name: /Dune/ });

      expect(link).toHaveAccessibleName(expect.stringContaining("Frank Herbert"));
    });

    it("renders nothing when the book has no identifier", () => {
      // Without this guard the card renders a link to "/books/undefined".
      const { container } = render(<BookCard book={{ title: "Ghost" }} />);

      expect(container).toBeEmptyDOMElement();
    });

    it("reaches the detail page from the keyboard", async () => {
      const user = userEvent.setup();

      renderCard({ title: "Dune" });
      await user.tab();

      expect(screen.getByRole("link")).toHaveFocus();
    });
  });

  describe("cover art", () => {
    it("renders the image when one is provided", () => {
      const { container } = renderCard({ image: "https://cdn.test/dune.jpg" });

      const img = container.querySelector("img");

      expect(img).toHaveAttribute("src", "https://cdn.test/dune.jpg");
    });

    it.each(["image", "imageUrl", "coverImage"])(
      "accepts %s as the cover source",
      (key) => {
        const { container } = renderCard({
          image: undefined,
          imageUrl: undefined,
          coverImage: undefined,
          [key]: `https://cdn.test/cover-${key}.jpg`,
        });

        expect(container.querySelector("img")).toHaveAttribute(
          "src",
          `https://cdn.test/cover-${key}.jpg`,
        );
      },
    );

    it("treats the cover as decorative, since the title is rendered beside it", () => {
      // Alt text would make a screen reader announce the cover URL before the
      // book title on every single card.
      const { container } = renderCard({ image: "https://cdn.test/dune.jpg" });

      expect(container.querySelector("img")).toHaveAttribute("alt", "");
    });

    it("lazy-loads the cover", () => {
      const { container } = renderCard({ image: "https://cdn.test/dune.jpg" });

      expect(container.querySelector("img")).toHaveAttribute("loading", "lazy");
    });

    it("shows a fallback panel when there is no cover", () => {
      renderCard({ image: undefined, imageUrl: undefined, coverImage: undefined });

      expect(screen.getByText("No Cover Art")).toBeInTheDocument();
    });

    it("hides the fallback icon from assistive technology", () => {
      renderCard({ image: undefined, imageUrl: undefined, coverImage: undefined });

      // "No Cover Art" already says this; announcing the icon would repeat it.
      const label = screen.getByText("No Cover Art");
      const icon = label.parentElement.querySelector("svg");

      expect(icon).toHaveAttribute("aria-hidden", "true");
    });
  });

  describe("category", () => {
    it.each([
      ["Fiction", "bg-purple-50"],
      ["Sci-Fi", "bg-indigo-50"],
      ["Business", "bg-emerald-50"],
      ["History", "bg-amber-50"],
    ])("gives %s its own tone", (category, tone) => {
      renderCard({ category });

      expect(screen.getByText(category).className).toContain(tone);
    });

    it("falls back to General when the book has no category", () => {
      renderCard({ category: undefined });

      expect(screen.getByText("General")).toBeInTheDocument();
    });

    it("uses the default tone for a category outside the map", () => {
      renderCard({ category: "Poetry" });

      expect(screen.getByText("Poetry").className).toContain("bg-blue-50");
    });
  });

  describe("availability", () => {
    it("shows In Stock when the book is available", () => {
      renderCard({ available: true });

      expect(screen.getByText("In Stock")).toBeInTheDocument();
    });

    it("shows Borrowed when the book is explicitly unavailable", () => {
      renderCard({ available: false });

      expect(screen.getByText("Borrowed")).toBeInTheDocument();
    });

    it("colours the badge by availability", () => {
      const { rerender } = renderCard({ available: true });
      expect(screen.getByText("In Stock").className).toContain("bg-green-500");

      rerender(<BookCard book={{ ...makeBook(), available: false }} />);
      expect(screen.getByText("Borrowed").className).toContain("bg-red-500");
    });

    /*
     * Known gap, tracked in README "Known gaps".
     *
     * The backend models stock as `availableStock` / `totalStock`, but this
     * component only reads the legacy `available` boolean. Real API payloads
     * therefore always look available here, so every card in Browse reads
     * "In Stock" even when a book has no copies left.
     *
     * This test pins what the component does today rather than what it ought to
     * do, so that fixing it produces a deliberate, visible failure here instead
     * of a silent change in every catalogue card.
     */
    it("ignores availableStock/totalStock and reads as in stock regardless", () => {
      renderCard({ available: undefined, availableStock: 0, totalStock: 10 });

      expect(screen.getByText("In Stock")).toBeInTheDocument();
    });
  });

  describe("text details", () => {
    it("renders the title as a level-2 heading", () => {
      renderCard({ title: "Dune" });

      expect(
        screen.getByRole("heading", { level: 2, name: "Dune" }),
      ).toBeInTheDocument();
    });

    it("renders the author", () => {
      renderCard({ author: "Frank Herbert" });

      expect(screen.getByText("Frank Herbert")).toBeInTheDocument();
    });

    it("falls back to Unknown Author", () => {
      renderCard({ author: undefined });

      expect(screen.getByText("Unknown Author")).toBeInTheDocument();
    });

    it("hides the author icon from assistive technology", () => {
      const { container } = renderCard({ author: "Frank Herbert" });

      expect(container.querySelector("svg[aria-hidden='true']")).toBeInTheDocument();
    });

    it("formats the delivery fee to two decimal places", () => {
      renderCard({ deliveryFee: 3 });

      expect(screen.getByText("$3.00")).toBeInTheDocument();
    });

    it("keeps cents intact", () => {
      renderCard({ deliveryFee: 2.5 });

      expect(screen.getByText("$2.50")).toBeInTheDocument();
    });

    it("shows 0.00 when there is no fee", () => {
      renderCard({ deliveryFee: undefined });

      expect(screen.getByText("$0.00")).toBeInTheDocument();
    });

    it("renders the View Info affordance as visible text, not only an icon", () => {
      renderCard();

      expect(screen.getByText("View Info")).toBeInTheDocument();
    });

    it("hides the View Info icon from assistive technology", () => {
      renderCard();

      const svg = screen.getByText("View Info").querySelector("svg");

      expect(svg).toHaveAttribute("aria-hidden", "true");
    });
  });

  it("renders a minimal book without crashing", () => {
    render(<BookCard book={{ _id: "bare" }} />);

    expect(screen.getByRole("link")).toHaveAttribute("href", "/books/bare");
  });
});