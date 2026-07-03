# WebdriverIO + TypeScript E2E

[![WDIO E2E](https://github.com/qacodes-dev/qacodes-webdriverio-typescript/actions/workflows/wdio.yml/badge.svg)](https://github.com/qacodes-dev/qacodes-webdriverio-typescript/actions/workflows/wdio.yml)

A production-style **WebdriverIO + TypeScript** end-to-end suite built against
[**Sauce Demo**](https://www.saucedemo.com), a stable public e-commerce demo. It
shows how the WDIO Testrunner ties everything together through a single
`wdio.conf.ts` — capabilities, services, hooks, framework (Mocha), and reporters
— using the **Page Object Model** with WebdriverIO's chainable `$`/`$$` element
getters, parallel browser sessions, and rich **Allure** reports alongside the
console **spec** reporter.

> Part of the [qa.codes](https://qa.codes) project samples —
> [WebdriverIO + TypeScript E2E](https://qa.codes/practice/project-samples/webdriverio-typescript).

## Overview

- **Page Object Model** — page objects own `$`/`$$` getters and single-intent
  actions; specs contain only user journeys and assertions.
- **WDIO Testrunner (Mocha)** — `wdio.conf.ts` is the single source of truth for
  capabilities, `maxInstances`, framework, services, reporters, hooks, and suites.
- **Parallel sessions** — multiple runner instances (`maxInstances`) execute
  specs concurrently without test interference.
- **Service-managed driver** — WebdriverIO downloads the Chrome driver that
  matches the installed browser automatically; nothing is pinned by hand.
- **Explicit waits** — `waitForDisplayed()` / `waitForClickable()` everywhere;
  never `browser.pause()`.
- **Allure + spec reporting** — a live console summary on every run plus a rich
  HTML report with a screenshot attached on failure.
- **TypeScript strict mode** with WebdriverIO's types wired in, so `browser` and
  `$` are fully typed.

## Prerequisites

- Node.js 18 or later (this repo is developed and CI-tested on Node 20)
- npm 9 or later
- Git
- Google Chrome installed locally
- Familiarity with TypeScript basics (async/await, classes) and Mocha's
  `describe`/`it`

## Install

```bash
# 1. Clone
git clone https://github.com/qacodes-dev/qacodes-webdriverio-typescript.git
cd qacodes-webdriverio-typescript

# 2. Install dependencies
npm install

# 3. Copy environment config
cp .env.example .env

# 4. Set BASE_URL and test credentials in .env (defaults already work for Sauce Demo)

# 5. Chrome is required; the WDIO service manages the matching driver automatically

# 6. Verify with a dry run
npx wdio run wdio.conf.ts --spec test/specs/login.e2e.ts
```

## Run commands

| Purpose | Command |
| --- | --- |
| Run the full suite | `npx wdio run wdio.conf.ts` |
| Run a single spec | `npx wdio run wdio.conf.ts --spec test/specs/checkout.e2e.ts` |
| Run a named suite | `npx wdio run wdio.conf.ts --suite smoke` |
| Run headless | `HEADLESS=true npx wdio run wdio.conf.ts` |
| Filter by test name | `npx wdio run wdio.conf.ts --mochaOpts.grep "add to cart"` |
| Generate the Allure report | `npm run allure:generate` |
| Open the Allure report | `npm run allure:open` |

- Full-suite runs use the capabilities and `maxInstances` defined in `wdio.conf.ts`.
- Named suites come from the `suites` map in `wdio.conf.ts` (`smoke`, `regression`).
- `HEADLESS=true` appends `--headless=new` to the Chrome capabilities via an env
  check in the config.

## Environment configuration

Copy `.env.example` to `.env` and fill it in. `.env` is gitignored; CI injects
these as GitHub Actions secrets.

| Variable | Required | Example | Purpose |
| --- | --- | --- | --- |
| `BASE_URL` | yes | `https://www.saucedemo.com` | Root URL of the app under test; used by the base page `open()` helper |
| `BROWSER` | no | `chrome` | Browser name used to build WDIO capabilities |
| `HEADLESS` | no | `true` | Set to `'true'` to append `--headless=new` to the Chrome capabilities |
| `TEST_USER_USERNAME` | yes | `standard_user` | Username for the standard test account; injected into test data |
| `TEST_USER_PASSWORD` | yes | `secret_sauce` | Password for the standard test account; kept out of source control |

## Folder structure

```
wdio.conf.ts                        Testrunner config: capabilities, maxInstances, framework, services, reporters, hooks, suites
.env.example                        Template for environment variables — copy to .env
test/specs/                         Mocha spec files (*.e2e.ts) — one file per user journey
  login.e2e.ts                      Login: happy path, invalid credentials, locked-out user
  checkout.e2e.ts                   Add-to-cart and full checkout flow with shipping and confirmation
  product-filters.e2e.ts            Sort and filter behaviour on the product listing page
test/pageobjects/                   Page Object Model classes
  page.ts                           Base Page class with a shared open() helper and common getters
  login.page.ts                     Login page: username/password $ getters and a login() action
  products.page.ts                  Product listing: sort dropdown, filters, add-to-cart actions
  checkout.page.ts                  Multi-step checkout: cart, address, and confirmation getters
test/data/                          Static and generated test data
  users.ts                          Typed test-user records read from environment variables
  products.ts                       Typed catalogue constants (names, prices, tax rate)
test/utils/                         Shared helpers not tied to a page
  env.ts                            Typed environment-variable access
  data-factory.ts                   Generates unique values (timestamped) to avoid collisions
  session.ts                        Reset-app-state helper for independent tests
tsconfig.json                       TypeScript config with WebdriverIO and @wdio/globals types wired in
.github/workflows/wdio.yml          GitHub Actions pipeline: headless Chrome run plus Allure artifact upload
```

## Architecture

**Page Object Model on the WDIO Testrunner.** The Testrunner reads
`wdio.conf.ts`, launches one or more browser sessions defined by capabilities,
and executes Mocha specs.

- `test/specs/` — Mocha spec files; user journeys and assertions only.
- `test/pageobjects/` — Page Object classes wrapping `$`/`$$` getters and page
  actions. A base `Page` class provides the shared `open()` helper.
- `wdio.conf.ts` — capabilities, `maxInstances`, framework, services, reporters,
  hooks, and the `suites` map.
- **Hooks** — `before` sets the viewport; `afterTest` captures a screenshot on
  failure and attaches it to the Allure report.

Each spec sets up its own state in a Mocha `before`/`beforeEach` hook and does
not depend on the order of other specs, so they run safely in parallel.

## Reporting

- `@wdio/allure-reporter` writes raw results to `./allure-results` during the run.
- The **spec** reporter prints a live pass/fail summary to the console.
- Generate the HTML report: `npm run allure:generate`
  (`allure generate ./allure-results --clean -o ./allure-report`).
- Open it locally: `npm run allure:open` (`allure open ./allure-report`).
- On a test failure the `afterTest` hook captures a screenshot and attaches it to
  the Allure report for quick triage.

## Continuous integration

`.github/workflows/wdio.yml` runs on every `push` and `pull_request`:

- `actions/setup-node@v4` pinned to **Node 20** with npm caching.
- Chrome runs headless via `HEADLESS=true` (`--headless=new`).
- `npx wdio run wdio.conf.ts`; the WDIO driver service resolves the matching
  Chrome driver automatically.
- `allure-results` is uploaded with `actions/upload-artifact@v4` and
  `if: always()`, so the report can be generated from CI output.
- `BASE_URL`, `TEST_USER_USERNAME`, and `TEST_USER_PASSWORD` are supplied as
  repository secrets (with Sauce Demo defaults as a fallback).

## License

[MIT](./LICENSE) © qa.codes
