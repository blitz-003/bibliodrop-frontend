/*
 * Stub for `better-auth/react`.
 *
 * `better-auth` publishes `better-auth/react` as an ESM-only entry point
 * (`dist/client/react/index.mjs`). Jest 30 runs this project as CommonJS, so
 * `require("better-auth/react")` throws "Must use import to load ES Module" --
 * and because `lib/auth-client.js` imports it, and `services/bookService.js`
 * imports `authClient` at module scope, every page that lists books fails to
 * even load in a test.
 *
 * Mapping the dependency itself is the durable fix. Mapping `@/lib/auth-client`
 * does not work: `next/jest` hands `jsconfig.json` paths to the SWC transformer,
 * which rewrites `@/lib/auth-client` to a relative path before `jest-resolve`
 * ever sees the specifier, so a `moduleNameMapper` rule on the alias can never
 * match. `better-auth/react` is a bare package specifier and passes through
 * untouched.
 *
 * Only the factory is needed; nothing under test asserts on better-auth
 * internals. Real authentication behaviour is covered by the server-side and
 * end-to-end suites, not here.
 */

const noop = () => {};

export function createAuthClient() {
  return {
    signIn: { email: noop, social: noop },
    signUp: { email: noop },
    signOut: noop,
    getSession: noop,
    useSession: noop,
  };
}

export function createAuthQueryClient() {
  return {};
}

/**
 * `lib/auth-client.js` also pulls in `better-auth/client/plugins` for `jwtClient`.
 * Same ESM-only problem, same fix.
 */
export function jwtClient() {
  return { id: "jwt" };
}

export default { createAuthClient };