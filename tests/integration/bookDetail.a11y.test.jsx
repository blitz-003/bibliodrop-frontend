import { axe } from "jest-axe";
import { http, HttpResponse } from "msw";

import BookDetailsPage from "@/app/books/[id]/page";
import { makeBook } from "../mocks/fixtures";
import { renderWithProviders, screen } from "../setup/render";
import { server } from "../setup/server";

jest.mock("next/navigation", () => require("../setup/navigationMock"));

const { resetUrl } = require("../setup/navigationMock");

function renderPage(id = "book-1") {
  resetUrl(`/books/${id}`, { id });
  return renderWithProviders(<BookDetailsPage />);
}

describe("Book Details page accessibility", () => {
  it("has no axe violations on initial load", async () => {
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

    const { container } = renderPage("book-1");

    await screen.findByRole("heading", { level: 1, name: /Meditations/ });
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
