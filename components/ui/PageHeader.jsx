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
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="flex items-center gap-1.5 text-xl font-semibold tracking-tight text-content-strong sm:text-2xl">
          {Icon && <Icon aria-hidden="true" className="h-5 w-5 text-accent" />}
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 text-xs text-content-muted sm:text-sm">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex shrink-0 items-center gap-3">{action}</div>}
    </div>
  );
}