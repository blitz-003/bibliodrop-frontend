/**
 * Loading skeleton for dashboard overviews.
 *
 * The three overview pages previously disagreed on what loading looked like:
 * the user overview rendered a skeleton grid, while the librarian and admin
 * overviews rendered a single line of pulsing text. That also meant the user
 * overview's heading outline changed between states (the skeleton had no
 * `h1`, the loaded view did).
 *
 * Sized to match the real layout so nothing reflows when data arrives.
 */
export default function DashboardSkeleton() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      className="mx-auto w-full max-w-app animate-pulse space-y-6"
    >
      <div className="space-y-2">
        <div className="h-8 w-1/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-100" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-control border border-border bg-gray-100"
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-80 rounded-card border border-border bg-surface" />
        <div className="h-80 rounded-card border border-border bg-surface" />
      </div>

      <span className="sr-only">Loading dashboard metrics</span>
    </div>
  );
}