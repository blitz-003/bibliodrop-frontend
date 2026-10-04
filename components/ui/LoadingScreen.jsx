import Spinner from "./Spinner";

/*
 * Full-viewport loading state.
 *
 * Replaces three byte-identical copies (`app/loading.jsx`,
 * `app/browse-books/page.jsx`, `app/books/[id]/page.jsx`) that all reached for
 * the HeroUI `<Spinner>` plus its theme tokens (`bg-background`,
 * `text-foreground`, `text-default-500`) — tokens supplied by `@heroui/styles`
 * rather than by this project's own theme.
 *
 * `aria-busy` announces the pending state, and the reserved min-height means
 * swapping to real content does not shift the page.
 */
export default function LoadingScreen({
  title = "Loading...",
  description = "Please wait while we prepare everything for you.",
  className,
}) {
  return (
    <div
      aria-busy="true"
      className={`flex min-h-screen items-center justify-center bg-page px-6 ${className ?? ""}`}
    >
      <div className="flex flex-col items-center gap-6 text-center">
        <Spinner className="h-9 w-9 scale-150 text-accent md:scale-[1.8]" />

        <div>
          <h1 className="text-2xl font-semibold text-content-strong sm:text-3xl">
            {title}
          </h1>
          <p className="mt-2 text-sm text-content-muted sm:text-base">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}