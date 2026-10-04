import { cn } from "@/lib/cn";

/*
 * Dashboard metric tile.
 *
 * Replaces twelve hand-copied stat cards across the user, librarian and admin
 * overviews. The base class string was byte-identical in all twelve; only the
 * hue and the icon changed.
 *
 * `unit` is rendered as a separate element rather than interpolated into the
 * value. Six of the twelve previously rendered strings like `{1} Items`
 * inside the 24px bold numeral slot, which made the metric unreadable as a
 * number and pushed those tiles onto two lines.
 */

const TONES = {
  emerald: {
    card: "bg-emerald-50/60 border-emerald-100",
    label: "text-emerald-700",
    value: "text-emerald-900",
    icon: "bg-emerald-100 text-emerald-600",
  },
  indigo: {
    card: "bg-indigo-50/60 border-indigo-100",
    label: "text-indigo-700",
    value: "text-indigo-900",
    icon: "bg-indigo-100 text-indigo-600",
  },
  amber: {
    card: "bg-amber-50/60 border-amber-100",
    label: "text-amber-700",
    value: "text-amber-900",
    icon: "bg-amber-100 text-amber-600",
  },
  sky: {
    card: "bg-sky-50/60 border-sky-100",
    label: "text-sky-700",
    value: "text-sky-900",
    icon: "bg-sky-100 text-sky-600",
  },
  blue: {
    card: "bg-blue-50/60 border-blue-100",
    label: "text-blue-700",
    value: "text-blue-900",
    icon: "bg-blue-100 text-blue-600",
  },
  slate: {
    card: "bg-slate-50 border-slate-200",
    label: "text-slate-700",
    value: "text-slate-900",
    icon: "bg-slate-200 text-slate-600",
  },
};

export default function StatCard({ label, value, unit, icon: Icon, tone = "blue" }) {
  const t = TONES[tone] ?? TONES.blue;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 rounded-control border p-5 shadow-card",
        t.card,
      )}
    >
      <div className="min-w-0 space-y-1">
        <span
          className={cn(
            "block text-xs font-semibold uppercase tracking-wide",
            t.label,
          )}
        >
          {label}
        </span>
        <p className={cn("text-xl font-bold tabular-nums md:text-2xl", t.value)}>
          <span className="break-words">{value}</span>
          {unit && (
            <span className="ml-1 text-sm font-medium opacity-80">{unit}</span>
          )}
        </p>
      </div>

      {Icon && (
        <div className={cn("shrink-0 rounded-control p-3", t.icon)}>
          <Icon aria-hidden="true" className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}