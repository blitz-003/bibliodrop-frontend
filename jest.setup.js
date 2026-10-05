import "@testing-library/jest-dom";
import { toHaveNoViolations } from "jest-axe";

import "./tests/setup/dialog";
import { server } from "./tests/setup/server";

expect.extend(toHaveNoViolations);

/*
 * `onUnhandledRequest: "error"` is deliberate. Every backend call in this app
 * should be represented by a handler in `tests/mocks/handlers.js`, so a request
 * that escapes to the network is a gap in the mock layer and fails the test
 * that caused it instead of silently hanging or resolving against a live
 * server.
 */
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));

afterEach(() => server.resetHandlers());

afterAll(() => server.close());