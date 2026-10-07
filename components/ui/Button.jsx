import { cn } from "@/lib/cn";

/*
 * Single button primitive.
 *
 * Replaces four hand-written variants that had drifted apart (including the
 * hardcoded `bg-[#635BFF] hover:bg-[#5249E0]` brand pair repeated across the
 * book details, admin books, admin users and payment success pages).
 *
 * Sizes are responsive so touch targets grow on small viewports.
 */

const VARIANTS = {
  primary:
    "bg-accent text-white border border-transparent hover:bg-accent-hover shadow-sm",
  brand:
    "bg-brand text-white border border-transparent hover:bg-brand-hover shadow-sm active:scale-[0.99]",
  secondary:
    "bg-white text-content border border-border hover:bg-surface-subtle shadow-sm",
  subtle:
    "bg-surface-subtle text-content border border-transparent hover:bg-border-subtle",
  ghost:
    "bg-transparent text-content-muted border border-transparent hover:bg-surface-subtle hover:text-content-strong",
  success:
    "bg-success text-white border border-transparent hover:bg-success-hover shadow-sm",
  danger:
    "bg-danger-subtle text-danger border border-red-100 hover:bg-red-100",
  dangerSolid:
    "bg-danger text-white border border-transparent hover:bg-danger-hover shadow-sm",
  neutral:
    "bg-neutral-900 text-white border border-transparent hover:bg-neutral-700 shadow-sm",
};

const SIZES = {
  sm: "px-2.5 py-1 text-xs gap-1.25 min-h-7",
  md: "px-3.5 py-2 text-sm gap-1.75 min-h-9",
  lg: "px-4 py-2.5 text-sm gap-1.75 min-h-10",
};

export default function Button({
  as: Component = "button",
  variant = "secondary",
  size = "md",
  className,
  children,
  type,
  ...props
}) {
  const isNativeButton = Component === "button";

  return (
    <Component
      // Only set a default type on real <button>; setting it on an <a> or
      // next/link would emit invalid markup. Prevents accidental form submits.
      type={isNativeButton ? (type ?? "button") : undefined}
      className={cn(
        "inline-flex items-center justify-center rounded-control font-semibold",
        "transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
        VARIANTS[variant] ?? VARIANTS.secondary,
        SIZES[size] ?? SIZES.md,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}