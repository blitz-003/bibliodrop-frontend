import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Button from "@/components/ui/Button";

describe("Button", () => {
  it("renders its children as the accessible name", () => {
    render(<Button>Save changes</Button>);

    expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
  });

  it("defaults to type=button so it cannot submit a form by accident", () => {
    render(<Button>Cancel</Button>);

    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("honours an explicit type", () => {
    render(<Button type="submit">Create Account</Button>);

    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("does not emit a type attribute when rendering as an anchor", () => {
    // `type` is invalid on <a>; emitting it produces invalid markup that some
    // assistive technology reads as a submit button.
    render(
      <Button as="a" href="/dashboard">
        Go to Dashboard
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Go to Dashboard" });

    expect(link).not.toHaveAttribute("type");
  });

  it("omits type when rendering through a component, not a host tag", () => {
    function FakeLink({ children, ...rest }) {
      return <span {...rest}>{children}</span>;
    }

    render(<Button as={FakeLink}>Wrapper</Button>);

    expect(screen.getByText("Wrapper")).not.toHaveAttribute("type");
  });

  it("falls back to the secondary variant for an unknown variant name", () => {
    const { rerender } = render(<Button variant="secondary">A</Button>);
    const secondary = screen.getByRole("button").className;

    rerender(<Button variant="does-not-exist">A</Button>);
    const unknown = screen.getByRole("button").className;

    // An unrecognised variant must resolve to `secondary`, not render unstyled.
    expect(unknown).toBe(secondary);
  });

  it("gives a known variant a different palette than the fallback", () => {
    render(<Button variant="danger">Delete</Button>);

    expect(screen.getByRole("button").className).toContain("text-danger");
  });

  it("applies the size classes and falls back for an unknown size", () => {
    const { rerender } = render(<Button size="lg">A</Button>);
    expect(screen.getByRole("button").className).toContain("min-h-10");

    rerender(<Button size="enormous">A</Button>);
    expect(screen.getByRole("button").className).toContain("min-h-9");
  });

  it("calls onClick when activated", async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={onClick}>Go</Button>);
    await user.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick while disabled", async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();

    render(
      <Button onClick={onClick} disabled>
        Go
      </Button>,
    );

    await user.click(screen.getByRole("button"));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("is activatable from the keyboard", async () => {
    const onClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={onClick}>Go</Button>);
    await user.tab();
    await user.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("merges caller className after the base classes", () => {
    render(<Button className="w-full">Wide</Button>);

    expect(screen.getByRole("button").className).toContain("w-full");
  });
});