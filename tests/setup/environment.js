const jsdomEnv = require("jest-environment-jsdom");

const JSDOMEnvironment = jsdomEnv.default ?? jsdomEnv;

/*
 * jsdom implements neither `fetch` nor the Fetch Standard classes it is built on
 * (`Request`, `Response`, `Headers`), and MSW's interceptor reads `Request` at
 * import time -- without them the setup file throws
 * "Request is not defined" and every suite fails to load.
 *
 * This environment file is evaluated in the *outer* Node context, so the real
 * implementations are reachable as properties of `globalThis` here even though
 * they are absent from the jsdom sandbox Jest hands to test files. Copying them
 * across gives the tests Node's own fetch stack, which is exactly what MSW
 * inspects and serialises.
 *
 * Only missing keys are copied, so anything jsdom does implement well (notably
 * its DOM) is left alone. The previous alternative, polyfilling inside
 * `setupFiles` from the `undici` package, had to be ordered around
 * `TextDecoder` and then `MessagePort` -- both read at import time by undici
 * itself -- and that ordering is exactly the kind of thing that breaks silently
 * on a Node upgrade.
 */

const NODE_GLOBALS = [
  "fetch",
  "Headers",
  "Request",
  "Response",
  "FormData",
  "Blob",
  "File",
  "ReadableStream",
  "WritableStream",
  "TransformStream",
  "TextDecoder",
  "TextEncoder",
  "MessageChannel",
  "MessagePort",
  "BroadcastChannel",
  "structuredClone",
  "crypto",
  "queueMicrotask",
  "setImmediate",
  "clearImmediate",
];

class JSDOMEnvironmentWithFetch extends JSDOMEnvironment {
  constructor(config, context) {
    super(config, context);

    for (const key of NODE_GLOBALS) {
      const fromNode = globalThis[key];

      if (fromNode === undefined) continue;
      if (this.global[key] !== undefined) continue;

      Object.defineProperty(this.global, key, {
        value: fromNode,
        configurable: true,
        writable: true,
        enumerable: false,
      });
    }
  }
}

module.exports = JSDOMEnvironmentWithFetch;