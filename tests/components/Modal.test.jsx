import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AlertTriangle } from "lucide-react";

import Modal from "@/components/ui/Modal";

function renderModal(props = {}) {
  const onClose = jest.fn();
  const onConfirm = jest.fn();
  const utils = render(
    <Modal
      open
      title="Delete Book"
      onClose={onClose}
      onConfirm={onConfirm}
      {...props}
    >
      <p>This cannot be undone.</p>
    </Modal>,
  );
  return { onClose, onConfirm, ...utils };
}

describe("Modal", () => {
  it("renders its title and body into a dialog", () => {
    renderModal();

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Delete Book")).toBeInTheDocument();
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
  });

  it("is labelled by its title", () => {
    renderModal();

    expect(screen.getByRole("dialog")).toHaveAccessibleName("Delete Book");
  });

  it("is described by the description only when one is given", () => {
    const { rerender, onClose } = renderModal();

    expect(screen.getByRole("dialog")).not.toHaveAttribute("aria-describedby");

    rerender(
      <Modal
        open
        title="Delete Book"
        description="This removes the record permanently."
        onClose={onClose}
      />,
    );

    expect(screen.getByRole("dialog")).toHaveAccessibleDescription(
      "This removes the record permanently.",
    );
  });

  it("renders title, description, body and both actions", () => {
    renderModal({
      description: "This removes the record permanently.",
      confirmLabel: "Delete",
    });

    const dialog = screen.getByRole("dialog");

    expect(dialog).toHaveTextContent("Delete Book");
    expect(dialog).toHaveTextContent("This removes the record permanently.");
    expect(dialog).toHaveTextContent("This cannot be undone.");
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("hides the whole subtree from assistive technology while closed", () => {
    const onClose = jest.fn();
    const { rerender } = render(
      <Modal open title="Delete Book" onClose={onClose}>
        This cannot be undone.
      </Modal>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    rerender(
      <Modal open={false} title="Delete Book" onClose={onClose}>
        This cannot be undone.
      </Modal>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // The <dialog> element stays mounted; the browser's own stylesheet is what
    // removes it from the page, so assert on visibility rather than presence.
    expect(screen.getByText("This cannot be undone.")).not.toBeVisible();
  });

  it("opens and closes in response to the open prop", () => {
    const onClose = jest.fn();
    const { rerender } = render(
      <Modal open={false} title="Delete Book" onClose={onClose} />,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(<Modal open title="Delete Book" onClose={onClose} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();

    rerender(<Modal open={false} title="Delete Book" onClose={onClose} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  describe("closing", () => {
    it("calls onClose when the cancel button is clicked", async () => {
      const { onClose } = renderModal();
      const user = userEvent.setup();

      await user.click(screen.getByRole("button", { name: "Cancel" }));

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when the native dialog closes", async () => {
      // The native `close` event is what a browser fires for Escape and for a
      // backdrop interaction, so it has to reach `onClose` too.
      const { onClose } = renderModal();

      screen.getByRole("dialog").close();

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("calls onClose when a native cancel event fires", async () => {
      const { onClose } = renderModal();

      screen.getByRole("dialog").dispatchEvent(new Event("cancel"));

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("returns focus to the previously focused element on close", async () => {
      const onClose = jest.fn();

      const { rerender } = render(
        <>
          <button type="button">Open delete</button>
          <Modal open={false} title="Delete Book" onClose={onClose} />
        </>,
      );

      const trigger = screen.getByRole("button", { name: "Open delete" });
      trigger.focus();

      rerender(
        <>
          <button type="button">Open delete</button>
          <Modal open title="Delete Book" onClose={onClose} />
        </>,
      );

      expect(trigger).not.toHaveFocus();

      rerender(
        <>
          <button type="button">Open delete</button>
          <Modal open={false} title="Delete Book" onClose={onClose} />
        </>,
      );

      await waitFor(() => expect(trigger).toHaveFocus());
    });

    it("does not call onClose when the dialog surface itself is clicked", async () => {
      const { onClose } = renderModal();
      const user = userEvent.setup();

      await user.click(screen.getByRole("dialog"));

      // A stray click on the panel must not dismiss a destructive dialog.
      expect(onClose).not.toHaveBeenCalled();
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("does not call onClose when the body is clicked", async () => {
      const { onClose } = renderModal();
      const user = userEvent.setup();

      await user.click(screen.getByText("This cannot be undone."));

      expect(onClose).not.toHaveBeenCalled();
    });

    it("tolerates a missing onClose", async () => {
      const user = userEvent.setup();

      render(
        <Modal open title="Delete Book">
          Body
        </Modal>,
      );

      await expect(
        user.click(screen.getByRole("button", { name: "Cancel" })),
      ).resolves.not.toThrow();
    });
  });

  describe("focus management", () => {
    /*
     * The assertion is "focus is inside the dialog", not "the <dialog> element
     * itself is focused". `showModal()` moves focus to the first focusable
     * descendant, which is the close button here; that is the correct browser
     * behaviour and is what keeps Tab cycling within the dialog.
     */
    function expectFocusInsideDialog() {
      const dialog = screen.getByRole("dialog");
      expect(document.activeElement).not.toBe(document.body);
      expect(dialog.contains(document.activeElement)).toBe(true);
    }

    it("moves focus into the dialog when it is opened from the trigger", async () => {
      const onClose = jest.fn();

      const { rerender } = render(
        <>
          <button type="button">Open delete</button>
          <Modal open={false} title="Delete Book" onClose={onClose} />
        </>,
      );

      const trigger = screen.getByRole("button", { name: "Open delete" });
      trigger.focus();
      expect(trigger).toHaveFocus();

      rerender(
        <>
          <button type="button">Open delete</button>
          <Modal open title="Delete Book" onClose={onClose} />
        </>,
      );

      await waitFor(() => expectFocusInsideDialog());
    });

    it("keeps focus inside the dialog when it mounts already open", async () => {
      const onClose = jest.fn();

      // Changing `key` forces a genuine remount while `open` is already true,
      // so the mount path runs rather than the update path.
      const { rerender } = render(
        <>
          <button type="button">Open delete</button>
          <Modal key="closed" open={false} title="Delete Book" onClose={onClose} />
        </>,
      );

      const trigger = screen.getByRole("button", { name: "Open delete" });
      trigger.focus();

      rerender(
        <>
          <button type="button">Open delete</button>
          <Modal key="open" open title="Delete Book" onClose={onClose} />
        </>,
      );

      // Mounting with `open` already true is the initial-render path, and it is
      // where focus previously escaped straight back to the trigger that was
      // focused beforehand.
      await waitFor(() => expectFocusInsideDialog());
    });

    it("leaves no focus on the trigger once open, from either path", async () => {
      const onClose = jest.fn();

      const { rerender } = render(
        <>
          <button type="button">Open delete</button>
          <Modal key="closed" open={false} title="Delete Book" onClose={onClose} />
        </>,
      );

      const trigger = screen.getByRole("button", { name: "Open delete" });
      trigger.focus();

      rerender(
        <>
          <button type="button">Open delete</button>
          <Modal key="open" open title="Delete Book" onClose={onClose} />
        </>,
      );

      await waitFor(() => expect(trigger).not.toHaveFocus());
    });
  });

  describe("confirm action", () => {
    it("calls onConfirm and not onClose", async () => {
      const { onConfirm, onClose } = renderModal({ confirmLabel: "Delete" });
      const user = userEvent.setup();

      await user.click(screen.getByRole("button", { name: "Delete" }));

      expect(onConfirm).toHaveBeenCalledTimes(1);
      expect(onClose).not.toHaveBeenCalled();
    });

    it("shows a working label and disables both actions while confirming", () => {
      renderModal({ confirming: true });

      expect(screen.getByRole("button", { name: "Working..." })).toBeDisabled();
      expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    });

    it("does not confirm while disabled", async () => {
      const { onConfirm } = renderModal({ confirmDisabled: true });
      const user = userEvent.setup();

      await user.click(screen.getByRole("button", { name: "Confirm" }));

      expect(onConfirm).not.toHaveBeenCalled();
    });
  });

  describe("icon and tone", () => {
    it("hides the icon from assistive technology", () => {
      const { container } = renderModal({ icon: AlertTriangle, tone: "danger" });

      const svg = container.querySelector("svg");

      expect(svg).toHaveAttribute("aria-hidden", "true");
    });

    it("renders no icon element when no icon is given", () => {
      const { container } = renderModal();

      expect(container.querySelector("svg")).toBeNull();
    });

    it("applies the danger tone to the icon holder", () => {
      const { container } = renderModal({ icon: AlertTriangle, tone: "danger" });

      expect(container.querySelector("svg").parentElement.className).toContain(
        "bg-red-100",
      );
    });
  });

  it("renders without children", () => {
    render(
      <Modal open title="Confirm" onClose={jest.fn()} />,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});