/**
 * Conditional className composition.
 *
 * The codebase previously built all 25 dynamic `className` values by hand as
 * template literals, which is how near-duplicate components drifted apart
 * unnoticed. `cn` gives primitives a single place to merge base styles with
 * caller overrides.
 */
export function cn(...inputs) {
  const classes = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string" || typeof input === "number") {
      classes.push(input);
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) classes.push(inner);
    } else if (typeof input === "object") {
      for (const [key, value] of Object.entries(input)) {
        if (value) classes.push(key);
      }
    }
  }

  return classes.join(" ");
}