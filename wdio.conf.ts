import 'dotenv/config';

/**
 * Single source of truth for the WDIO Testrunner.
 *
 * Everything the runner needs lives here: capabilities (selected per
 * environment via env vars), maxInstances for parallel sessions, the Mocha
 * framework, the driver-managing runner, reporters (spec + Allure) and the
 * lifecycle hooks (session setup, screenshot on failure).
 */

const BASE_URL = process.env.BASE_URL ?? 'https://www.saucedemo.com';
const BROWSER = process.env.BROWSER ?? 'chrome';
const HEADLESS = process.env.HEADLESS === 'true';

/**
 * Chrome args. In CI (or when HEADLESS=true) we append the modern
 * `--headless=new` flag plus the stability flags a containerised runner needs.
 */
const chromeArgs = [
  '--disable-gpu',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--window-size=1280,1024',
  ...(HEADLESS ? ['--headless=new'] : []),
];

export const config: WebdriverIO.Config = {
  runner: 'local',

  // WebdriverIO auto-detects TypeScript and transpiles specs on the fly using
  // this tsconfig — no separate build step is required.
  tsConfigPath: './tsconfig.json',

  //
  // ==================
  // Specs & suites
  // ==================
  specs: ['./test/specs/**/*.e2e.ts'],
  exclude: [],

  // Named suites — run with `--suite smoke` / `--suite regression`.
  suites: {
    smoke: ['./test/specs/login.e2e.ts'],
    regression: [
      './test/specs/login.e2e.ts',
      './test/specs/product-filters.e2e.ts',
      './test/specs/checkout.e2e.ts',
    ],
  },

  //
  // ==================
  // Capabilities
  // ==================
  // Start conservative: 5 parallel sessions is safe on most laptops and CI
  // runners. Increase only once the suite is proven stable in parallel.
  maxInstances: 5,

  capabilities: [
    {
      browserName: BROWSER,
      'goog:chromeOptions': {
        args: chromeArgs,
      },
      // Cap per-capability parallelism to match the global budget.
      'wdio:maxInstances': 5,
    },
  ],

  //
  // ==================
  // Test configuration
  // ==================
  logLevel: 'warn',
  bail: 0,
  baseUrl: BASE_URL,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  // No chromedriver service is registered: WebdriverIO manages the driver
  // automatically and downloads the build that matches the installed Chrome,
  // so the driver never drifts out of sync with the browser.
  services: [],

  framework: 'mocha',

  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: './allure-results',
        disableWebdriverStepsReporting: true,
        disableWebdriverScreenshotsReporting: false,
      },
    ],
  ],

  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
    // Built-in retries absorb the occasional network blip against the public
    // demo without resorting to hard sleeps.
    retries: 1,
  },

  //
  // ==================
  // Hooks
  // ==================

  /**
   * Runs once per worker session before any spec. A single place to set the
   * viewport so headed and headless runs render identically.
   */
  before: async function () {
    await browser.setWindowSize(1280, 1024);
  },

  /**
   * Screenshot-on-failure: capture the browser state for any failed test and
   * attach it to the Allure report for fast triage.
   */
  afterTest: async function (_test, _context, { passed }) {
    if (!passed) {
      await browser.takeScreenshot();
    }
  },
};
