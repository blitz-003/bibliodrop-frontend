import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

/**
 * The project ships `jsconfig.json` (not `tsconfig.json`) with a single
 * `"@/*": ["./*"]` alias. `next/jest` feeds `compilerOptions.paths` straight into
 * the SWC transformer, so the alias resolves in tests exactly as it does in the
 * app and needs no hand-maintained `moduleNameMapper` entry.
 *
 * CSS, image imports, `next/font` and `server-only` are already stubbed by
 * `next/jest`; adding them again here would only let the two drift apart.
 */

/** @type {import('jest').Config} */
const customJestConfig = {
  // jsdom plus Node's native fetch classes, which MSW requires. See
  // tests/setup/environment.js.
  testEnvironment: "<rootDir>/tests/setup/environment.js",

  // jest-environment-jsdom resolves packages with the "browser" export
  // condition by default, which makes `@mswjs/interceptors` hand back its
  // browser build (`.../XMLHttpRequest/index.mms`) -- an ESM-only file that
  // CommonJS `require` cannot load. Pinning the condition to "node" selects the
  // Node interceptor that `msw/node` actually depends on.
  testEnvironmentOptions: {
    customExportConditions: ["node"],
  },

  // `env.js` runs before the test framework and before `jest.setup.js`, so the
  // fake API origin is in place before any module reads it at import time.
  setupFiles: ["<rootDir>/tests/setup/env.js"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  moduleNameMapper: {
    // `better-auth/react` is published as an ESM-only entry point, and Jest 30
    // runs this project as CommonJS, so requiring it throws "Must use import to
    // load ES Module" before any test code runs. `lib/auth-client` imports it,
    // `services/bookService.js` imports `authClient` at module scope, and that
    // is enough to make every page listing books fail to load.
    //
    // The dependency is stubbed rather than `@/lib/auth-client`: `next/jest`
    // passes `jsconfig.json` paths to the SWC transformer, which rewrites
    // `@/lib/auth-client` to a relative path before `jest-resolve` ever sees the
    // specifier, so a mapper rule on the alias can never match. A bare package
    // specifier passes through untouched.
    "^better-auth/react$": "<rootDir>/tests/mocks/betterAuthReact.js",
    "^better-auth/client/plugins$": "<rootDir>/tests/mocks/betterAuthReact.js",
  },

  testMatch: ["<rootDir>/tests/**/*.test.js", "<rootDir>/tests/**/*.test.jsx"],

  // A fresh QueryClient per test keeps cache state from leaking sideways, and
  // `clearMocks`/`restoreMocks` stop `jest.fn()` call history surviving a test.
  clearMocks: true,
  restoreMocks: true,

  collectCoverageFrom: [
    "app/**/*.{js,jsx}",
    "components/**/*.{js,jsx}",
    "lib/**/*.{js,jsx}",
    "services/**/*.{js,jsx}",

    // Config, not app logic.
    "!**/*.config.{js,mjs}",

    // Infrastructure that cannot be exercised from jsdom.
    "!app/api/**",
    "!app/layout.js",
    "!app/globals.css",
    "!lib/auth.js",
    "!lib/mongodb.js",
    "!lib/getServerSession.js",

    // Dead code, excluded deliberately and documented in the README:
    // `services/authService.js` is a fake auth stub that nothing imports, and
    // `bookService.js` still carries an unused hard-coded book array plus three
    // unused exports. Testing them would only assert behaviour that no user can
    // reach. See README "Known gaps".
    "!services/authService.js",
    "!components/FeaturedBooks/**",
  ],

  coverageReporters: ["text-summary", "lcov"],
  coverageDirectory: "<rootDir>/coverage",

  coverageThreshold: {
    global: {
      statements: 30,
      branches: 40,
      functions: 25,
      lines: 30,
    },
  },
};

export default createJestConfig(customJestConfig);