/*
 * Runs before the test framework and before `jest.setup.js`, so the fake API
 * origin is in place before any module reads it at import time.
 *
 * The fetch primitives are NOT polyfilled here. They are supplied by
 * `tests/setup/environment.js`, which copies Node's native implementations into
 * the jsdom sandbox. See that file for why.
 *
 * The real `.env` is deliberately NOT loaded. Pulling it in would expose
 * `BETTER_AUTH_SECRET`, the Mongo URI, Cloudinary keys and the Stripe secret to
 * the test process. Tests get an explicit, non-secret stand-in instead.
 */

// Same origin the app talks to in development, so assertions on request URLs
// double as a check that components read NEXT_PUBLIC_API_URL rather than
// hard-coding a host.
process.env.NEXT_PUBLIC_API_URL = "http://localhost:5000";

// Never let a test shell out to the real Stripe test mode.
process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_test_jest_dummy";