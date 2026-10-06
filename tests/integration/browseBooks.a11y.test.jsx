import { axe } from "jest-axe";

import BrowseBooksPage from "@/app/browse-books/page";
import { renderWithProviders, screen } from "../setup/render";

jest.mock("next/navigation", () => require("../setup/navigationMock"));

const { resetUrl } = require("../setup/navigationMock");

function renderPage() {
  resetUrl("/browse-books");
  return renderWithProviders(<BrowseBooksPage />);
}

describe("Browse Books page accessibility", () => {
  it("has no axe violations on initial load", async () => {
    const { container } = renderPage();

    await screen.findByRole("link", { name: /Atomic Habits/ });
    const results = await axe(container);

    expect(results).toHaveNoViolations();
  });
});
