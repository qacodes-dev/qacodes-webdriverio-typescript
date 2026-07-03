/**
 * Typed access to environment variables. Centralising this keeps `process.env`
 * lookups (and their "is this required?" rules) out of the page objects and
 * specs. Values come from `.env` locally and from GitHub Actions secrets in CI.
 */

/** Read a required env var, throwing a clear error if it is missing. */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === '') {
    throw new Error(
      `Missing required environment variable "${name}". ` +
        'Copy .env.example to .env and fill it in (see the README).',
    );
  }
  return value;
}

/** Read an optional env var, falling back to `fallback` when unset. */
export function optionalEnv(name: string, fallback: string): string {
  const value = process.env[name];
  return value === undefined || value === '' ? fallback : value;
}
