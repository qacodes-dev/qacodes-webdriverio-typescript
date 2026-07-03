import { requireEnv } from '../utils/env.js';

/** A test account for the app under test. */
export interface TestUser {
  username: string;
  password: string;
}

/**
 * The standard, fully-functional account. Credentials are read from the
 * environment (`.env` locally, secrets in CI) so nothing sensitive is committed.
 */
export const standardUser: TestUser = {
  username: requireEnv('TEST_USER_USERNAME'),
  password: requireEnv('TEST_USER_PASSWORD'),
};

/**
 * A Sauce Demo account that is locked out on the server side. It reuses the
 * standard password (all demo accounts share `secret_sauce`) but is expected to
 * be rejected at login — used to exercise the error path.
 */
export const lockedOutUser: TestUser = {
  username: 'locked_out_user',
  password: standardUser.password,
};

/** An account with credentials that are intentionally wrong. */
export const invalidUser: TestUser = {
  username: 'no_such_user',
  password: 'wrong_password',
};
