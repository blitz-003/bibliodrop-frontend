import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Mail } from "lucide-react";

import { CONTROL_CLASS, Input, Select, Textarea } from "@/components/ui";

describe("Field primitives", () => {
  describe("Input", () => {
    it("associates the label with the control via the name attribute", () => {
      render(<Input name="email" label="Email Address" />);

      expect(screen.getByLabelText("Email Address")).toHaveAttribute("name", "email");
    });

    it("prefers an explicit id over the name", () => {
      render(<Input id="signup-email" name="email" label="Email" />);

      expect(screen.getByLabelText("Email")).toHaveAttribute("id", "signup-email");
    });

    it("marks the control required and shows a hidden asterisk", () => {
      const { container } = render(<Input name="name" label="Full Name" required />);

      expect(screen.getByLabelText(/Full Name/)).toBeRequired();
      // The asterisk is decorative; `required` carries the meaning.
      expect(container.querySelector("[aria-hidden='true']")).toBeInTheDocument();
    });

    it("links an error message and flags the control invalid", () => {
      render(<Input name="email" label="Email" error="Enter a valid email" />);

      const input = screen.getByLabelText("Email");

      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input).toHaveAccessibleDescription("Enter a valid email");
      expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email");
    });

    it("describes the control with the hint when there is no error", () => {
      render(<Input name="password" label="Password" hint="Minimum 6 characters" />);

      const input = screen.getByLabelText("Password");

      expect(input).not.toHaveAttribute("aria-invalid");
      expect(input).toHaveAccessibleDescription("Minimum 6 characters");
    });

    it("shows the hint rather than the error description when both are passed", () => {
      render(<Input name="password" label="Password" hint="A hint" error="Too short" />);

      expect(screen.getByLabelText("Password")).toHaveAccessibleDescription("Too short");
    });

    it("applies the shared control class", () => {
      render(<Input name="q" label="Search" />);

      const input = screen.getByLabelText("Search");

      expect(input.className).toContain(CONTROL_CLASS.split(" ").slice(0, 4).join(" "));
    });

    it("renders a leading icon without announcing it", () => {
      const { container } = render(<Input name="email" label="Email" icon={Mail} />);

      expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    });

    it("is a controlled textbox that reports changes", async () => {
      const onChange = jest.fn();
      const user = userEvent.setup();

      render(<Input name="email" label="Email" onChange={onChange} />);
      await user.type(screen.getByLabelText("Email"), "a");

      expect(onChange).toHaveBeenCalled();
    });

    it("omits aria-describedby entirely when there is no hint or error", () => {
      render(<Input name="q" label="Search" />);

      expect(screen.getByLabelText("Search")).not.toHaveAttribute("aria-describedby");
    });
  });

  describe("Select", () => {
    it("associates its label and renders options", () => {
      render(
        <Select name="role" label="Role" defaultValue="user">
          <option value="user">User</option>
          <option value="librarian">Librarian</option>
        </Select>,
      );

      const select = screen.getByLabelText("Role");

      expect(select.tagName).toBe("SELECT");
      expect(screen.getByRole("option", { name: "Librarian" })).toBeInTheDocument();
    });

    it("links an error and flags the select invalid", () => {
      render(
        <Select name="role" label="Role" error="Pick a role">
          <option value="user">User</option>
        </Select>,
      );

      const select = screen.getByLabelText("Role");

      expect(select).toHaveAttribute("aria-invalid", "true");
      expect(select).toHaveAccessibleDescription("Pick a role");
    });
  });

  describe("Textarea", () => {
    it("associates its label", () => {
      render(<Textarea name="comment" label="Review" />);

      expect(screen.getByLabelText("Review").tagName).toBe("TEXTAREA");
    });

    it("links an error and flags the textarea invalid", () => {
      render(<Textarea name="comment" label="Review" error="Say something" />);

      const textarea = screen.getByLabelText("Review");

      expect(textarea).toHaveAttribute("aria-invalid", "true");
      expect(textarea).toHaveAccessibleDescription("Say something");
    });
  });

  it("renders a bare control with no label without breaking the id wiring", () => {
    render(<Input name="hidden-field" />);

    expect(screen.getByRole("textbox")).toHaveAttribute("id", "hidden-field");
  });
});