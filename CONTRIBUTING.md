# Contributing

Thanks for helping improve this sample! It's a **reference project** — the POM
structure and WDIO Testrunner patterns are the product — so contributions that
keep page objects thin and specs assertion-only are especially welcome.

## Prerequisites

- **Node.js 20+** and npm
- Google Chrome installed locally (the WDIO service manages the matching driver)

## Setup

```bash
git clone https://github.com/qacodes-dev/qacodes-webdriverio-typescript.git
cd qacodes-webdriverio-typescript
npm install
cp .env.example .env          # then set BASE_URL / credentials if needed
```

## Run the suite

```bash
npx wdio run wdio.conf.ts                                   # full suite
npx wdio run wdio.conf.ts --spec test/specs/login.e2e.ts   # single spec
npx wdio run wdio.conf.ts --suite smoke                    # named suite
HEADLESS=true npx wdio run wdio.conf.ts                    # headless
npm run typecheck                                          # tsc --noEmit (strict) — the first test
npm run allure:generate && npm run allure:open            # build + open the Allure report
```

Before opening a PR, make sure **both** are green:

```bash
npm run typecheck
HEADLESS=true npx wdio run wdio.conf.ts
```

## How to add a test

The project keeps every concern in exactly one layer. Adding coverage usually
touches a spec and (sometimes) a Page Object — never the config for a routine
test.

1. **Need a new page or new element?** Add a Page Object under
   `test/pageobjects/` extending `Page`, or add the `$`/`$$` getter to the
   existing one. Page objects own **getters + single-intent actions only** — no
   assertions, no test data. Use explicit waits (`waitForDisplayed()` /
   `waitForClickable()`), never `browser.pause()`.
2. **Need shared setup or test data?** Read users from env in `test/data/`,
   keep static reference data (product names, totals) in typed constants, and
   generate unique values via `test/utils/data-factory.ts`.
3. **Write the spec** in `test/specs/` as `*.e2e.ts` — one file per user
   journey. Specs contain **journeys + assertions only**: no raw selectors, no
   waits, no driver wiring. Each spec sets up its own state in a Mocha
   `before`/`beforeEach` hook.
4. **Place it in a suite** — add the spec to the `smoke` and/or `regression`
   list in `wdio.conf.ts` so the right CI gate can select it.
5. **Keep tests independent and order-agnostic** so parallel `maxInstances`
   sessions never interfere. No shared mutable state; reset app state between
   tests where the session persists it (see `test/utils/session.ts`).

## Commit & PR conventions

- Keep commits small and focused; write imperative subject lines
  (`Add cart removal spec`, not `added tests`).
- Branch off `main`; open a PR against `main`. The
  [PR template](.github/PULL_REQUEST_TEMPLATE.md) prompts for what/why, type of
  change, and verification steps — fill it in.
- CI (headless Chrome) must be green on the PR before merge.
- Keep TypeScript strict-mode clean — zero `tsc` errors.
