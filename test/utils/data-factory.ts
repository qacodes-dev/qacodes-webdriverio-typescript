import type { ShippingInfo } from '../pageobjects/checkout.page.js';

/**
 * Small data factory for values that must be unique across parallel sessions.
 * Using a timestamp + counter suffix avoids collisions when several runner
 * instances execute the same spec at the same time.
 */

let counter = 0;

/** A process-unique token, e.g. `1720000000000-3`. */
function uniqueToken(): string {
  counter += 1;
  return `${Date.now()}-${counter}`;
}

/** A unique, timestamped email address — handy for sign-up style flows. */
export function uniqueEmail(prefix = 'wdio'): string {
  return `${prefix}+${uniqueToken()}@qa.codes`;
}

/**
 * Build shipping info with a unique postal code so parallel checkout runs never
 * submit identical form payloads. Overrides let a spec pin any field.
 */
export function makeShippingInfo(overrides: Partial<ShippingInfo> = {}): ShippingInfo {
  return {
    firstName: 'Ada',
    lastName: 'Lovelace',
    postalCode: `E2E-${uniqueToken()}`,
    ...overrides,
  };
}
