import { render, screen, within } from "@testing-library/react";
import { BookOpen, Users } from "lucide-react";

import ChartPanel, {
  CHART_HEIGHT_CLASS,
  ChartEmptyState,
} from "@/components/ui/ChartPanel";
import DashboardSkeleton from "@/components/ui/DashboardSkeleton";
import LoadingScreen from "@/components/ui/LoadingScreen";
import PageHeader from "@/components/ui/PageHeader";
import Panel from "@/components/ui/Panel";
import StatCard from "@/components/ui/StatCard";

describe("Panel", () => {
  it("renders children inside a bordered surface", () => {
    render(<Panel>Book details</Panel>);

    expect(screen.getByText("Book details")).toBeInTheDocument();
  });

  it("renders as a section when asked", () => {
    render(
      <Panel as="section" aria-label="Book details">
        Details
      </Panel>,
    );

    expect(screen.getByRole("region", { name: "Book details" })).toBeInTheDocument();
  });

  it("always resolves a real border colour token", () => {
    // An unspecified border colour in Tailwind v4 resolves to currentColor,
    // which is why this primitive exists.
    render(<Panel>Details</Panel>);

    expect(screen.getByText("Details").className).toContain("border-border");
  });
});

describe("PageHeader", () => {
  it("renders the title as the page's only h1", () => {
    render(<PageHeader title="Browse Books" />);

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Browse Books",
    );
  });

  it("renders the subtitle", () => {
    render(<PageHeader title="Browse" subtitle="Find your next read" />);

    expect(screen.getByText("Find your next read")).toBeInTheDocument();
  });

  it("hides the icon from assistive technology", () => {
    const { container } = render(<PageHeader title="Browse" icon={BookOpen} />);

    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  });

  it("renders the action slot", () => {
    render(
      <PageHeader
        title="Manage Users"
        action={<button type="button">Invite</button>}
      />,
    );

    expect(screen.getByRole("button", { name: "Invite" })).toBeInTheDocument();
  });
});

describe("StatCard", () => {
  it("renders the label and value", () => {
    render(<StatCard label="Total Users" value={42} />);

    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders the unit as a separate element from the numeral", () => {
    // Interpolating the unit into the value put strings like "1 Items" in the
    // 24px bold slot, which read as a single number to the eye and to a screen
    // reader alike.
    render(<StatCard label="Books" value={1} unit="Items" />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Items")).toBeInTheDocument();
    expect(screen.getByText("Items").tagName).toBe("SPAN");
  });

  it("omits the unit element when no unit is given", () => {
    const { container } = render(<StatCard label="Books" value={12} />);

    expect(container.querySelector(".opacity-80")).toBeNull();
  });

  it("hides the decorative icon", () => {
    const { container } = render(<StatCard label="Users" value={3} icon={Users} />);

    expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
  });

  it("falls back to the blue tone for an unknown tone", () => {
    const { rerender } = render(<StatCard label="A" value={1} tone="blue" />);
    const blue = screen.getByText("1").closest("p").className;

    rerender(<StatCard label="A" value={1} tone="chartreuse" />);

    expect(screen.getByText("1").closest("p").className).toBe(blue);
  });
});

describe("LoadingScreen", () => {
  it("marks itself busy for assistive technology", () => {
    render(<LoadingScreen />);

    expect(screen.getByRole("heading", { name: "Loading..." })).toBeInTheDocument();
    expect(document.querySelector("[aria-busy='true']")).toBeInTheDocument();
  });

  it("renders a single loading indicator, not two competing ones", () => {
    render(<LoadingScreen />);

    // The page previously combined a bare spinner with a themed HeroUI spinner.
    expect(screen.getAllByRole("status")).toHaveLength(1);
  });

  it("accepts a custom title and description", () => {
    render(<LoadingScreen title="Loading books" description="Fetching the catalogue." />);

    expect(screen.getByRole("heading", { name: "Loading books" })).toBeInTheDocument();
    expect(screen.getByText("Fetching the catalogue.")).toBeInTheDocument();
  });
});

describe("DashboardSkeleton", () => {
  it("announces the pending state politely rather than assertively", () => {
    render(<DashboardSkeleton />);

    const root = document.querySelector("[aria-busy='true']");

    expect(root).toHaveAttribute("aria-live", "polite");
  });

  it("describes itself for screen reader users", () => {
    render(<DashboardSkeleton />);

    expect(screen.getByText("Loading dashboard metrics")).toBeInTheDocument();
  });

  it("renders no heading, so the outline does not change once data loads", () => {
    render(<DashboardSkeleton />);

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });
});

describe("ChartPanel", () => {
  it("renders the title as a level-2 heading", () => {
    render(
      <ChartPanel title="Borrows per month">
        <svg data-testid="chart" />
      </ChartPanel>,
    );

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Borrows per month",
    );
  });

  it("renders the chart when one is supplied", () => {
    render(
      <ChartPanel title="Borrows">
        <svg data-testid="chart" />
      </ChartPanel>,
    );

    expect(screen.getByTestId("chart")).toBeInTheDocument();
  });

  it("renders an empty state with no chart at all", () => {
    render(
      <ChartPanel title="Borrows">
        <ChartEmptyState>No data yet</ChartEmptyState>
      </ChartPanel>,
    );

    expect(screen.getByText("No data yet")).toBeInTheDocument();
  });

  it("gives the chart slot a reserved height on both branches", () => {
    // Otherwise swapping an empty state for a chart shifts the page.
    const { rerender } = render(
      <ChartPanel title="Borrows">
        <svg data-testid="chart" />
      </ChartPanel>,
    );

    const withChart = screen.getByRole("heading", { level: 2 })
      .closest("section")
      .querySelector(`.${CHART_HEIGHT_CLASS}`);

    rerender(
      <ChartPanel title="Borrows">
        <ChartEmptyState>No data yet</ChartEmptyState>
      </ChartPanel>,
    );

    const withEmpty = screen.getByRole("heading", { level: 2 })
      .closest("section")
      .querySelector(`.${CHART_HEIGHT_CLASS}`);

    expect(withChart).not.toBeNull();
    expect(withEmpty).not.toBeNull();
  });

  it("renders the action slot inside the header row", () => {
    render(
      <ChartPanel title="Borrows" action={<button type="button">Export</button>}>
        <svg />
      </ChartPanel>,
    );

    const section = screen.getByRole("heading", { level: 2 }).closest("section");

    expect(within(section).getByRole("button", { name: "Export" })).toBeInTheDocument();
  });
});