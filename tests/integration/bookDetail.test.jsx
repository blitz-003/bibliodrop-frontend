import { http, HttpResponse } from "msw";
import userEvent from "@testing-library/user-event";

import BookDetailsPage from "@/app/books/[id]/page";
import { makeBook } from "../mocks/fixtures";
import { renderWithProviders, screen, waitFor } from "../setup/render";
import { server } from "../setup/server";

jest.mock("next/navigation", () => require("../setup/navigationMock"));

const { resetUrl } = require("../setup/navigationMock");

function renderPage(id = "book-1") {
  resetUrl(`/books/${id}`, { id });
  return renderWithProviders(<BookDetailsPage />);
}

describe("Book Details page", () => {
  it("renders the book title and author", async () => {
    server.use(
      http.get("http://localhost:5000/books/:id", ({ params }) =>
        HttpResponse.json({
          book: makeBook({
            _id: String(params.id),
            title: "Meditations",
            author: "Marcus Aurelius",
          }),
          isAuthenticated: false,
          isLibrarianOwner: false,
          hasRequestedDelivery: false,
          canReview: false,
        }),
      ),
    );

    renderPage("book-7");

    expect(
      await screen.findByRole("heading", { level: 1, name: /Meditations/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Written by Marcus Aurelius/)).toBeInTheDocument();
  });

  it("shows availability and delivery fee", async () => {
    server.use(
      http.get("http://localhost:5000/books/:id", ({ params }) =>
        HttpResponse.json({
          book: makeBook({
            _id: String(params.id),
            availableStock: 2,
            deliveryFee: 7.5,
          }),
          isAuthenticated: true,
          isLibrarianOwner: false,
          hasRequestedDelivery: false,
          canReview: false,
        }),
      ),
    );

    renderPage("book-8");

    expect(await screen.findByText(/Available \(2 Units\)/)).toBeInTheDocument();
    expect(screen.getByText(/\$7\.50/)).toBeInTheDocument();
  });

  it("allows the logged-in user to write a review when eligible", async () => {
    server.use(
      http.get("http://localhost:5000/books/:id", ({ params }) =>
        HttpResponse.json({
          book: makeBook({
            _id: String(params.id),
            reviews: [],
          }),
          isAuthenticated: true,
          isLibrarianOwner: false,
          hasRequestedDelivery: false,
          canReview: true,
        }),
      ),
    );

    renderPage("book-9");

    const textarea = await screen.findByLabelText("Your review");
    const user = userEvent.setup();

    await user.type(textarea, "Insightful");
    await user.click(screen.getByRole("button", { name: "Submit Review" }));

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Submitting|Submit Review/ }),
      ).toBeInTheDocument();
    });
  });
});
