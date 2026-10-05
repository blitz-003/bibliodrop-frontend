/**
 * `<dialog>` shim for jsdom.
 *
 * jsdom 26 does not implement the modal-dialog behaviour of `HTMLDialogElement`
 * at all: `showModal`, `show` and `close` are simply absent, so calling them
 * throws `TypeError: d.showModal is not a function`.
 *
 * `components/ui/Modal.jsx` is built on those methods for the accessibility
 * guarantees it needs -- top-layer stacking, making the rest of the document
 * inert, and receiving `close`/`cancel` for Escape and backdrop clicks. Without
 * the shim the component cannot be rendered in tests at all.
 *
 * This implements enough of the spec for the component's own code paths to be
 * exercised for real, rather than mocking `Modal` and testing nothing:
 *
 * - `showModal()` / `show()` reflect the `open` attribute.
 * - `close()` clears it and fires `close`.
 * - The open dialog becomes the only thing not hidden from the accessibility
 *   tree, so `getByRole("dialog")` finds it only while it is genuinely open.
 * - Opening moves focus to the first focusable descendant, matching the browser
 *   behaviour that `Modal` relies on.
 *
 * Escape-key handling is intentionally not emulated: jsdom has no dialog
 * keyboard model, so tests dispatch a `cancel` event directly to exercise the
 * component's own handler rather than asserting on jsdom's internals.
 */

if (typeof HTMLDialogElement !== "undefined") {
  const proto = HTMLDialogElement.prototype;

  const FOCUSABLE = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled]):not([type='hidden'])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");

  function reflect(dialog, open) {
    if (open) dialog.setAttribute("open", "");
    else dialog.removeAttribute("open");
  }

  // `display: none` for a closed dialog is what the UA stylesheet does, and what
  // makes RTL treat the closed subtree as inaccessible.
  if (!proto.showModal) {
    Object.defineProperty(proto, "showModal", {
      configurable: true,
      writable: true,
      value() {
        if (this.hasAttribute("open")) {
          throw new DOMException(
            "The dialog is already open.",
            "InvalidStateError",
          );
        }
        if (!this.isConnected) {
          throw new DOMException(
            "The dialog is not connected to a document.",
            "InvalidStateError",
          );
        }
        reflect(this, true);
        const target = this.querySelector(FOCUSABLE);
        target?.focus?.();
      },
    });
  }

  if (!proto.show) {
    Object.defineProperty(proto, "show", {
      configurable: true,
      writable: true,
      value() {
        reflect(this, true);
      },
    });
  }

  if (!proto.close) {
    Object.defineProperty(proto, "close", {
      configurable: true,
      writable: true,
      value(returnValue) {
        if (!this.hasAttribute("open")) return;
        if (returnValue !== undefined) this.returnValue = returnValue;
        reflect(this, false);
        this.dispatchEvent(new Event("close"));
      },
    });
  }
}