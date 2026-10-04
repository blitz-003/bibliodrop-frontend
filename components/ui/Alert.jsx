import { cn } from "@/lib/cn";

/*
 * Inline status banner.
 *
 * Collapses the login / register error box (which was byte-identical between
 * the two pages) and the two status banners on the book details page.
 *
 * `role="alert"` on the error tone gives these live-region semantics; the
 * async variants previously announced nothing at all.
 */

const TONES = {
  info: "bg-blue-50 border-blue-100 text-blue-800",
  success: "bg-green-50 border-green-100 text-green-800",
  warning: "bg-amber-50 border-amber-100 text-amber-800",
  danger: "bg-red-50 border-red-100 text-red-700",
};

export default function Alert({
  tone = "info",
  title,
  children,
  icon: Icon,
  action,
  className,
}) {
  return (
    <div
      role={tone === "danger" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-3 rounded-control border p-4 text-sm",
        TONES[tone] ?? TONES.info,
        className,
      )}
    >
      {Icon && <Icon aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />}

      <div className="min-w-0 flex-1">
        {title && <p className="font-semibold">{title}</p>}
        {children && <div className={cn(title && "mt-1")}>{children}</div>}
      </div>

      {action}
    </div>
  );
}