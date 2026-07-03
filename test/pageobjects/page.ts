import { browser } from '@wdio/globals';

/**
 * Base Page — the class every page object extends.
 *
 * It owns the cross-cutting concerns shared by every page: a single `open()`
 * helper (paths are resolved against `baseUrl` from wdio.conf.ts) and small
 * URL helpers. Concrete pages add their own `$`/`$$` getters and intent-level
 * actions on top; assertions never live here (or in any page object).
 */
export default class Page {
  /**
   * Open a sub-path of the app under test. `path` is appended to the configured
   * `baseUrl`, so callers pass `''` for the root or e.g. `'inventory.html'`.
   */
  public async open(path = ''): Promise<void> {
    await browser.url(`/${path}`);
  }

  /** The current browser URL — handy for page objects that expose readiness. */
  public async getCurrentUrl(): Promise<string> {
    return browser.getUrl();
  }
}
