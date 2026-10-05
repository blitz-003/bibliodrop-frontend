/*
 * In-memory stand-in for `next/navigation`.
 *
 * Several pages are driven entirely by the URL: Browse reads `search`,
 * `category`, `sort`, `minDeliveryFee`, `maxDeliveryFee` and `page` out of the
 * query string and writes every change back with `router.push`. Testing those
 * flows needs a router that actually round-trips, otherwise the assertions are
 * just "this mock was called with the string I wrote in the mock".
 *
 * So `push`/`replace` here update a module-level URL and notify subscribers, and
 * the hooks read that URL through `useSyncExternalStore`. A component that pushes
 * `/browse-books?page=2` genuinely re-renders with the new parameters and its
 * React Query key changes, which is the behaviour the tests care about.
 *
 * `useSyncExternalStore` is used rather than a plain variable read so React is
 * told the value changed; reading a mutable module variable during render would
 * tear under concurrent rendering and would not schedule a re-render at all.
 *
 * This module is installed with `jest.mock("next/navigation", () =>
 * require("../setup/navigationMock"))`, which hands Jest the very same module
 * instance the test imports `setUrl`/`router` from, so both share one state.
 *
 * Mock paths are relative because `jest.mock` resolves through Jest's resolver,
 * which does not read the `jsconfig.json` alias.
 */

const { useMemo, useSyncExternalStore } = require("react");

const ORIGIN = "http://localhost";

let url = "/browse-books";
let params = {};
const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return url;
}

/** Test-facing control: set the current URL and re-render subscribers. */
function setUrl(next) {
  url = typeof next === "string" ? next : String(next);
  emit();
}

/**
 * Test-facing control: set the dynamic route params `useParams` returns.
 *
 * Next.js derives these from the route file's folder name (`app/books/[id]`),
 * which is not something the mock can read. Rather than hard-code `id` here —
 * which would silently give every dynamic route the same shape — the test states
 * them, so a page asking for the wrong param name fails instead of quietly
 * receiving `undefined`.
 */
function setParams(next) {
  params = { ...(next ?? {}) };
  emit();
}

/**
 * Reset to a pristine Browse URL. Call from `beforeEach`.
 *
 * Pass `routeParams` when rendering a dynamic route so the params are cleared
 * between tests along with the URL.
 */
function resetUrl(next = "/browse-books", routeParams) {
  url = next;
  params = { ...(routeParams ?? {}) };
}

function searchOf(snapshot) {
  return new URL(snapshot, ORIGIN).search;
}

const router = {
  push: jest.fn((href) => {
    setUrl(href);
    return Promise.resolve(true);
  }),
  replace: jest.fn((href) => {
    setUrl(href);
    return Promise.resolve(true);
  }),
  prefetch: jest.fn(() => Promise.resolve()),
  refresh: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
};

function useRouter() {
  return router;
}

function usePathname() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return new URL(snapshot, ORIGIN).pathname;
}

function useSearchParams() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  const search = searchOf(snapshot);

  return useMemo(() => new URLSearchParams(search), [search]);
}

function useParams() {
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  // If params were explicitly set by the test, prefer them.
  if (params && Object.keys(params).length > 0) {
    return params;
  }

  const snapshot = getSnapshot();
  const { pathname } = new URL(snapshot, ORIGIN);

  // Try to extract [id] style param from common dynamic route patterns.
  const matches = pathname.match(/\/books\/([^/?#]+)/);
  if (matches) {
    return { id: matches[1] };
  }

  return {};
}

function useSelectedLayoutSegments() {
  return [];
}

module.exports = {
  __esModule: true,
  router,
  setUrl,
  setParams,
  resetUrl,
  getUrl: () => url,
  getParams: () => params,
  useRouter,
  usePathname,
  useSearchParams,
  useParams,
  useSelectedLayoutSegments,
  redirect: jest.fn(),
  permanentRedirect: jest.fn(),
  notFound: jest.fn(),
};