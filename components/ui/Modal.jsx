"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import Button from "./Button";
import { cn } from "@/lib/cn";

/*
 * Accessible modal dialog.
 *
 * The two hand-rolled modals in `app/dashboard/admin/page.jsx` had no
 * `role="dialog"`, no `aria-modal`, no `aria-labelledby`, no focus trap, no
 * Escape handling and no body scroll lock — so Tab cycled through the page
 * behind the overlay while focus stayed on the trigger underneath.
 *
 * Implemented with the native `<dialog>` element, which gives top-layer
 * stacking, backdrop and inertness of the rest of the page for free, then
 * layered with explicit focus management and Escape handling.
 */
export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  closeLabel = "Cancel",
  confirmLabel = "Confirm",
  onConfirm,
  confirmVariant = "primary",
  confirmDisabled = false,
  confirming = false,
  icon: Icon,
  tone = "neutral",
  className,
}) {
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);
  const uid = useId();
  const titleId = `modal-title-${uid}`;
  const descId = `modal-desc-${uid}`;

  // Show via the native top layer rather than a `fixed` div, so the rest of
  // the document becomes inert without a manual focus trap.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      previouslyFocused.current = document.activeElement;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // `close` also fires on Escape and on backdrop clicks, so route both back
  // through the same handler.
  const handleNativeClose = useCallback(() => {
    previouslyFocused.current?.focus?.();
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    previouslyFocused.current?.focus?.();
  }, []);

  const iconTone =
    tone === "danger"
      ? "bg-red-100 text-red-600"
      : "bg-accent-subtle text-accent";

  return (
    <dialog
      ref={dialogRef}
      onClose={handleNativeClose}
      onCancel={handleNativeClose}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      className={cn(
        "m-auto w-full max-w-sm rounded-card border border-border bg-surface p-6 text-center shadow-panel backdrop:bg-black/40 backdrop:backdrop-blur-sm",
        "open:animate-in open:fade-in",
        className,
      )}
    >
      {Icon && (
        <div
          className={cn(
            "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full",
            iconTone,
          )}
        >
          <Icon aria-hidden="true" className="h-6 w-6" />
        </div>
      )}

      <h2 id={titleId} className="text-lg font-semibold text-content-strong">
        {title}
      </h2>

      {description && (
        <p id={descId} className="mt-1 text-sm text-content-muted">
          {description}
        </p>
      )}

      {children && <div className="mt-4 space-y-4 text-left">{children}</div>}

      <div className="mt-6 flex items-center gap-2">
        <Button
          variant="subtle"
          className="w-1/2"
          onClick={handleNativeClose}
          disabled={confirming}
        >
          {closeLabel}
        </Button>
        <Button
          variant={confirmVariant}
          className="w-1/2"
          onClick={onConfirm}
          disabled={confirmDisabled || confirming}
        >
          {confirming ? "Working..." : confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}