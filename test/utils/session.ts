import { browser } from '@wdio/globals';

/**
 * Reset the app to a clean, logged-out state. WDIO reuses one browser session
 * per worker across the tests in a spec file, and Sauce Demo persists the cart
 * (and login) in cookies + localStorage. Clearing both keeps each test
 * independent of the ones before it. Call it while on the app's origin (e.g.
 * right after opening the login page) so localStorage is reachable.
 */
export async function resetAppState(): Promise<void> {
  await browser.deleteCookies();
  await browser.execute(() => window.localStorage.clear());
  await browser.refresh();
}
