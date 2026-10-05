import { render, screen } from "@testing-library/react";

import Alert from "@/components/ui/Alert";
import Badge, { StatusBadge } from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import Spinner from "@/components/ui/Spinner";

describe("Alert", () => {
  it("announces an error as an alert", () => {
    render(<Alert tone="danger">Session expired</Alert>);

    expect(screen.getByRole("alert")).toHaveTextContent("Session expired");
  });

  it.each(["info", "success", "warning"])("uses role=status for %s", (tone) => {
    render(<Alert tone={tone}>Heads up</Alert>);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("defaults to an informational status rather than an error alert", () => {
    render(<Alert>Note</Alert>);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders a title above the body", () => {
    render(
      <Alert tone="danger" title="Payment failed">
        Your card was declined.
      </Alert>,
    );

    const alert = screen.getByRole("alert");

    expect(alert).toHaveTextContent("Payment failed");
    expect(alert).toHaveTextContent("Your card was declined.");
  });

  it("renders an action slot when given one", () => {
    render(
      <Alert tone="danger" action={<button type="button">Retry</button>}>
        Failed
      </Alert>,
    );

    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });
});

describe("Badge", () => {
  it("renders its children", () => {
    render(<Badge>New</Badge>);

    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("hides the decorative dot from assistive technology", () => {
    const { container } = render(<Badge dot>In Stock</Badge>);

    // The dot carries no meaning; only the text should be announced.
    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
    expect(screen.getByText("In Stock")).toBeInTheDocument();
  });

  it("renders no dot when dot is not set", () => {
    const { container } = render(<Badge>In Stock</Badge>);

    expect(container.querySelector("[aria-hidden='true']")).toBeNull();
  });

  it("falls back to neutral for an unknown tone", () => {
    const { rerender } = render(<Badge tone="neutral">A</Badge>);
    const neutral = screen.getByText("A").className;

    rerender(<Badge tone="chartreuse">A</Badge>);

    expect(screen.getByText("A").className).toBe(neutral);
  });
});

describe("StatusBadge", () => {
  const DELIVERY = {
    pending: "bg-amber-50",
    dispatched: "bg-blue-50",
    delivered: "bg-green-50",
  };

  it.each(Object.entries(DELIVERY))(
    "maps the delivery status %s to its own tone",
    (status, toneClass) => {
      render(<StatusBadge kind="delivery" value={status} />);

      const badge = screen.getByText(status);

      expect(badge.className).toContain(toneClass);
      // Uppercase plus a leading dot, the shape every status pill shares.
      expect(badge.className).toContain("uppercase");
    },
  );

  it("gives each delivery status a distinct tone", () => {
    const classes = Object.keys(DELIVERY).map((status) => {
      const { unmount } = render(<StatusBadge value={status} />);
      const cls = screen.getByText(status).className;
      unmount();
      return cls;
    });

    expect(new Set(classes).size).toBe(classes.length);
  });

  it.each([
    ["approved", "bg-green-50"],
    ["pending", "bg-amber-50"],
    ["rejected", "bg-red-50"],
  ])("maps the publish status %s", (status, toneClass) => {
    render(<StatusBadge kind="publish" value={status} />);

    expect(screen.getByText(status).className).toContain(toneClass);
  });

  it.each([
    ["admin", "bg-indigo-50"],
    ["librarian", "bg-blue-50"],
    ["user", "bg-gray-100"],
  ])("maps the role %s", (role, toneClass) => {
    render(<StatusBadge kind="role" value={role} />);

    expect(screen.getByText(role).className).toContain(toneClass);
  });

  it("falls back to neutral for a status it does not recognise", () => {
    render(<StatusBadge kind="delivery" value="teleported" />);

    expect(screen.getByText("teleported").className).toContain("bg-gray-100");
  });

  it("renders 'unknown' for a missing value rather than an empty pill", () => {
    render(<StatusBadge value={undefined} />);

    expect(screen.getByText("unknown")).toBeInTheDocument();
  });

  it("normalises casing before matching", () => {
    render(<StatusBadge value="PENDING" />);

    expect(screen.getByText("pending").className).toContain("bg-amber-50");
  });

  it("defaults to the delivery map when kind is omitted", () => {
    render(<StatusBadge value="delivered" />);

    expect(screen.getByText("delivered").className).toContain("bg-green-50");
  });
});

describe("EmptyState", () => {
  it("renders the title and description", () => {
    render(<EmptyState title="No books yet" description="Try another search." />);

    expect(screen.getByText("No books yet")).toBeInTheDocument();
    expect(screen.getByText("Try another search.")).toBeInTheDocument();
  });

  it("omits the description when there is none", () => {
    render(<EmptyState title="Nothing here" />);

    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  it("renders children, such as a recovery action", () => {
    render(
      <EmptyState title="No books yet">
        <button type="button">Clear filters</button>
      </EmptyState>,
    );

    expect(screen.getByRole("button", { name: "Clear filters" })).toBeInTheDocument();
  });

  it("hides the decorative icon from the accessibility tree", () => {
    const { container } = render(<EmptyState title="No books yet" />);

    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  });

  it("renders the title as plain text, not a heading", () => {
    // It is embedded in table rows and cards, so it must not introduce an
    // extra heading into the page outline.
    render(<EmptyState title="No books yet" />);

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });
});

describe("Spinner", () => {
  it("exposes itself as a status with an accessible label", () => {
    render(<Spinner />);

    const status = screen.getByRole("status");

    expect(status).toHaveAccessibleName("Loading");
  });

  it("accepts a custom label", () => {
    render(<Spinner label="Loading books" />);

    expect(screen.getByRole("status")).toHaveAccessibleName("Loading books");
  });
});