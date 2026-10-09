import { cn } from "@/lib/cn";

/*
 * Data table.
 *
 * Replaces eight hand-built tables that had drifted into four wrapper
 * variants (`shadow` in three files, `shadow-xl` in three more, plus a HeroUI
 * `<Card>` and a bespoke rounded-lg panel), three cell-padding schemes
 * (`p-4`, `px-6 py-4`, `p-1`), and three border colours.
 *
 * Notable behaviour this fixes:
 *  - The horizontal scroll container is applied consistently, so narrow
 *    viewports no longer clip columns.
 *  - Row hover is `bg-surface-subtle` rather than `hover:bg-white`, which on
 *    the previous white-on-white rows produced no visible affordance at all.
 *  - Headers are uppercase `text-xs`, matching the admin tables and giving
 *    `scope="col"` a consistent target.
 *  - `min-w-[640px]` on the table keeps columns legible instead of crushing
 *    them; the wrapper scrolls instead.
 */

export default function DataTable({
  className,
  wrapperClassName,
  children,
  minWidth = "min-w-[640px]",
  ...props
}) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded-card border border-border bg-surface shadow-panel",
        className,
      )}
    >
      <table
        className={cn("w-full border-collapse text-left", minWidth ?? "min-w-[600px]", wrapperClassName)}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

export function DataTableHead({ children, className }) {
  return (
    <thead className={cn("border-b border-border bg-surface", className)}>
      {children}
    </thead>
  );
}

export function DataTableTh({ children, align = "left", className, ...props }) {
  return (
    <th
      scope="col"
      className={cn(
        "px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-content-muted",
        align === "center" && "text-center",
        align === "right" && "text-right",
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}

export function DataTableBody({ children, className }) {
  return (
    <tbody className={cn("divide-y divide-border-subtle text-sm text-content", className)}>
      {children}
    </tbody>
  );
}

export function DataTableRow({ children, className, ...props }) {
  return (
    <tr
      className={cn(
        "transition-all duration-200 hover:bg-surface-subtle hover:shadow-[0_0_14px_-4px_rgba(37,99,235,0.3)]",
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

export function DataTableCell({ children, align = "left", className, ...props }) {
  return (
    <td
      className={cn(
        "px-3.5 py-2.5 align-middle",
        align === "center" && "text-center",
        align === "right" && "text-right",
        className,
      )}
      {...props}
    >
      {children}
    </td>
  );
}

/**
 * Empty table row. Pass the real column count so the message spans the table
 * and the header does not sit above a blank body.
 */
export function DataTableEmpty({ colSpan, children }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-4 py-10 text-center text-sm text-content-subtle"
      >
        {children}
      </td>
    </tr>
  );
}