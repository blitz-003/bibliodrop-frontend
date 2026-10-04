import { cn } from "@/lib/cn";

/*
 * Chart panel + its empty state.
 *
 * Replaces six wrappers that disagreed on padding (`p-5` on the user overview
 * versus `p-4 md:p-5` elsewhere) and on the dashed fallback border, which was
 * left uncoloured on the user overview and therefore resolved to
 * `currentColor` — roughly 40% darker than the sibling dashboards.
 *
 * `h-64` is reserved on both branches so swapping between the empty state and
 * a loaded chart does not shift the page. Tick colour and font size are
 * passed down so all six charts share one axis treatment.
 */

export const CHART_HEIGHT_CLASS = "h-64";
export const AXIS_COLOR = "#9CA3AF";
export const GRID_COLOR = "#F3F4F6";
export const BRAND_HEX = "#635BFF";

/** Shared recharts tooltip chrome, so all six dashboard charts match. */
export const TOOLTIP_STYLE = {
  fontSize: 12,
  borderRadius: 12,
  border: "1px solid #E5E7EB",
};

export function ChartCanvas({ children, className }) {
  return (
    <div className={cn(CHART_HEIGHT_CLASS, "w-full text-xs", className)}>
      {children}
    </div>
  );
}

export function ChartEmptyState({ children }) {
  return (
    <div className="flex h-full w-full items-center justify-center rounded-card border border-dashed border-border bg-surface text-sm text-content-subtle">
      {children}
    </div>
  );
}

export default function ChartPanel({ title, icon: Icon, action, children, className }) {
  return (
    <section
      className={cn(
        "rounded-card border border-border bg-surface p-4 shadow-card md:p-5",
        className,
      )}
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-content-strong">
          {Icon && <Icon aria-hidden="true" className="h-4 w-4 text-content-muted" />}
          {title}
        </h2>
        {action}
      </div>

      {/*
        Fixed-height slot: the empty state and the chart occupy the same box,
        so neither reserves different space and neither causes layout shift.
      */}
      <div className={CHART_HEIGHT_CLASS}>{children}</div>
    </section>
  );
}