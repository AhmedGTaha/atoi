// Vitest runs service-layer modules directly in Node, outside Next's
// bundler, which is the only place that resolves the real `server-only`
// package to a no-op via its "react-server" export condition. This stub
// mirrors that behavior for tests.
export {};
