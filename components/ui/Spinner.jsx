import { cn } from "@/lib/cn";

/** Indeterminate loading indicator. Replaces the HeroUI `<Spinner>`. */
export default function Spinner({ className, label = "Loading", ...props }) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        "inline-block shrink-0 rounded-full border-2 border-current border-t-transparent align-middle motion-safe:animate-spin",
        className,
      )}
      {...props}
    />
  );
}