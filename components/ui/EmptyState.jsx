import { cn } from "@/lib/cn";
import { Layers } from "lucide-react";

/*
 * Empty state.
 *
 * Replaces six hand-built copies that ranged from `py-20 ... rounded-2xl` on
 * the browse page to `p-12 text-center italic` inside table rows. The caption
 * uses `content-subtle` rather than gray-400, which is 2.6:1 on white and
 * fails WCAG AA.
 */
export default function EmptyState({
  title,
  description,
  icon: Icon = Layers,
  compact = false,
  className,
  children,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-card border border-dashed border-border bg-surface text-center",
        compact ? "px-6 py-10" : "py-20",
        className,
      )}
    >
      <Icon aria-hidden="true" className="mb-3 h-10 w-10 text-gray-300" />
      <p className="text-lg font-medium text-content-muted">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-content-subtle">{description}</p>
      )}
      {children}
    </div>
  );
}