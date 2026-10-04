import { cn } from "@/lib/cn";

/*
 * Surface container.
 *
 * Replaces the bare `border` utility appearing 155 times with no colour. In
 * Tailwind v4 an unspecified border colour resolves to `currentColor`, so
 * those rules were being drawn in whatever inherited text colour happened to
 * be — which is why several "grey" dividers looked visibly darker or lighter
 * than their neighbours. This component always resolves to a real token.
 */
export default function Panel({ as: Component = "div", className, children, ...props }) {
  return (
    <Component
      className={cn(
        "rounded-card border border-border bg-surface shadow-card",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}