/*
 * Stand-in for `@/lib/auth-client`.
 *
 * Mapped in globally by `moduleNameMapper` in `jest.config.mjs`, because the
 * real module cannot be loaded in Jest at all: it imports `better-auth/react`,
 * which is published as ESM only, and Jest 30's CommonJS registry cannot
 * `require` it. That is not a test-style preference -- the import simply throws
 * `Must use import to load ES Module`, so any test whose module graph reaches
 * `lib/auth-client` fails to even start. `services/bookService.js` imports it at
 * module scope, which pulls it into every page that lists books.
 *
 * Mapping it centrally means a test file does not need its own `jest.mock`, and
 * adding a new page that transitively imports the auth client will not suddenly
 * break that page's test file.
 *
 * Better Auth runs in the Next.js server (`app/api/auth/[...all]/route.js`), so
 * from the browser's point of view this is a network client. `jest.setup.js`
 * fails any unregistered request under `onUnhandledRequest: "error"`, so
 * reaching for a real endpoint is a loud failure rather than a hang.
 *
 * The methods are plain async functions rather than `jest.fn()`s on purpose:
 * `clearMocks: true` would strip their resolved values between tests and leave
 * callers with `undefined`. Tests that need a specific outcome should
 * `jest.spyOn` the relevant method instead.
 */

const ok = (data = null) => Promise.resolve({ data, error: null });

export const authClient = {
  signIn: {
    email: (payload) => ok({ user: payload?.user ?? null, token: "test-token" }),
    social: () => ok(),
  },
  signUp: {
    email: (payload) => ok({ user: payload?.user ?? null }),
  },
  signOut: () => ok(),
  getSession: () => Promise.resolve({ data: null, error: null }),
  token: () => ok({ token: "test-token" }),
  useSession: () => ({ data: null, isLoading: false, error: null }),
};

/** Some call sites import the factory rather than the instance. */
export const createAuthClient = () => authClient;

export default authClient;