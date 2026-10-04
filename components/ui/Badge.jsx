import { cn } from "@/lib/cn";

/*
 * Badge / status pill.
 *
 * Collapses five divergent badge systems into one shape. The old versions
 * disagreed on vertical padding (py-1 vs py-0.5), background shade (-50 vs
 * -100), whether a border existed at all, and whether `inline-flex` was set —
 * the same `pending` state rendered as amber in four files and yellow in a
 * fifth. `warning` is used here so that split cannot recur.
 */

const TONES = {
  neutral: "bg-gray-100 text-content-subtle border-transparent",
  info: "bg-blue-50 text-blue-700 border-blue-200",
  success: "bg-green-50 text-green-700 border-green-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-red-700 border-red-200",
  brand: "bg-indigo-50 text-indigo-700 border-indigo-200",
  muted: "bg-gray-100 text-gray-700 border-transparent",
};

const DELIVERY_STATUS = {
  pending: "warning",
  dispatched: "info",
  delivered: "success",
};

const PUBLISH_STATUS = {
  approved: "success",
  published: "success",
  pending: "warning",
  rejected: "danger",
  unpublished: "neutral",
  draft: "neutral",
};

const ROLE = {
  admin: "brand",
  librarian: "info",
  user: "neutral",
};

export default function Badge({
  tone = "neutral",
  uppercase = false,
  dot = false,
  className,
  children,
  ...props
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
        "text-xs font-semibold whitespace-nowrap",
        uppercase && "uppercase tracking-wide",
        TONES[tone] ?? TONES.neutral,
        className,
      )}
      {...props}
    >
      {dot && (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-current"
        />
      )}
      {children}
    </span>
  );
}

/**
 * Semantic status badge. `deliveryStatus` and `publishStatus` are the two
 * conceptual fields that were previously hand-styled in six places.
 */
export function StatusBadge({ kind = "delivery", value, dot = false, ...props }) {
  const maps = {
    delivery: DELIVERY_STATUS,
    publish: PUBLISH_STATUS,
    role: ROLE,
  };
  const map = maps[kind] ?? DELIVERY_STATUS;
  const key = String(value ?? "").toLowerCase();

  return (
    <Badge tone={map[key] ?? "neutral"} uppercase dot={dot} {...props}>
      {key || "unknown"}
    </Badge>
  );
}