import { cn } from "@/lib/cn";

/*
 * Page heading.
 *
 * Replaces nine separate treatments that disagreed on size (text-xl through
 * text-3xl), weight (font-black vs font-semibold) and subtitle size
 * (text-xs text-gray-400 vs text-sm text-gray-500). Browse is the reference:
 * `text-3xl sm:text-4xl font-semibold tracking-tight` with a `text-base`
 * subtitle.
 */

export default function PageHeader({
  title,
  subtitle,
  action,
  icon: Icon,
  className,
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight text-content-strong sm:text-3xl">
          {Icon && <Icon aria-hidden="true" className="h-6 w-6 text-accent" />}
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-content-muted sm:text-base">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex shrink-0 items-center gap-3">{action}</div>}
    </div>
  );
}