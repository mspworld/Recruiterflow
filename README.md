# Recruiterflow QA Assignment — Playwright + TypeScript

UI tests for [saucedemo.com](https://www.saucedemo.com) and API tests for [reqres.in](https://reqres.in), in one Playwright project.

## Quick start

Requires Node.js 18 or newer.

```bash
git clone <this-repo-url>
cd recruiterflow-qa-assignment
npm install
npm test
```

`npm install` also downloads Chromium (via `postinstall`), so nothing else needs to be set up. No `.env` file is required — every setting has a working default.

## Commands

| Command | What it does |
|---|---|
| `npm test` | Run the whole suite (UI + API) |
| `npm run test:ui` | Run only the UI tests |
| `npm run test:api` | Run only the API tests |
| `npm run test:evidence` | Run everything with a screenshot and video for every UI test |
| `npm run test:headed` | Run UI tests with the browser visible |
| `npm run test:watch` | Run UI tests visible, one at a time, slowed down so each action can be followed |
| `npm run test:debug` | Run with the Playwright inspector |
| `npm run report` | Open the HTML report from the last run |
| `npm run typecheck` | Type-check the whole project |

## Report and evidence

After a run, `npm run report` opens the HTML report. Evidence is controlled by the `EVIDENCE` setting:

| `EVIDENCE` | Screenshot | Video | Trace | Used by |
|---|---|---|---|---|
| `failure` (default) | on failure | off | on failure | `npm test` |
| `full` | every test | every test | on failure | `npm run test:evidence` |
| `off` | off | off | off | fastest local runs |

In every mode the report also shows:

- **BDD steps**: each `Given / When / Then` as its own step, with timing
- **API exchanges**: every request and response (method, path, params, body, status, duration, attempts) attached as JSON
- **Scenario data**: the products, customer or payload a test generated, attached as JSON

Raw files are written to `test-results/`.

## Scenario coverage

| # | Scenario | Spec |
|---|---|---|
| 1 | Standard user logs in and lands on the products page | `tests/ui/login.spec.ts` |
| 2 | Locked-out user sees the error and is not logged in | `tests/ui/login.spec.ts` |
| 3 | Add two products, cart badge shows 2 | `tests/ui/cart.spec.ts` |
| 4 | Full checkout ends with "Thank you for your order!" | `tests/ui/checkout.spec.ts` |
| 5 | Sort by price (low to high), first product is the cheapest | `tests/ui/sorting.spec.ts` |
| 6 | `GET /api/users?page=2` — 200, `data` array, required fields | `tests/api/users.spec.ts` |
| 7 | `POST /api/users` — 201, echoes name/job, has id and createdAt | `tests/api/users.spec.ts` |
| 8 | Bonus: create-then-verify flow | `tests/api/users.spec.ts` |

Extra: `sorting.spec.ts` also checks the full order for all four sort options (data-driven), and the checkout test verifies the cart contents and the item total before finishing.

## Project structure

```
├── playwright.config.ts        Two projects: "ui" (browser) and "api" (no browser)
├── src/
│   ├── config/
│   │   ├── GlobalConfig.ts     Single config class: environment, URLs, run mode, evidence, timeouts
│   │   └── environments.ts     One profile per environment (URLs, key, password)
│   ├── core/                   Shared, framework-level helpers
│   │   ├── bdd.ts              Given / When / Then / And → test.step
│   │   ├── ScenarioContext.ts  Typed set/get store for passing data between steps
│   │   ├── DataFactory.ts      Random test data and random sampling
│   │   ├── locators.ts         resilient(): primary locator with fallbacks
│   │   ├── perform.ts          Wraps an action and rethrows with context
│   │   ├── retry.ts            Retry with exponential backoff
│   │   ├── errors.ts           ActionError
│   │   └── evidence.ts         Attach JSON to the report
│   ├── ui/
│   │   ├── pages/              Page objects (BasePage → SecurePage → concrete pages)
│   │   ├── components/         Header (cart badge/link), ProductList (shared product rows)
│   │   ├── models/             Product, Customer, UserCredentials (get/set classes)
│   │   ├── data/               Users, expected messages, page titles, sort options
│   │   └── utils/price.ts      Price parsing and summing
│   ├── api/
│   │   ├── core/               BaseApiClient, ApiError, request/response types
│   │   ├── clients/            UsersClient
│   │   ├── endpoints.ts        All API paths in one place
│   │   ├── types/              Response and request types
│   │   ├── models/             CreatedUser (get/set class)
│   │   ├── data/               Request payloads (fixed and generated)
│   │   └── assertions/         Reusable API assertions
│   └── fixtures/               test.extend: injects pages, clients, loginAs and contexts
└── tests/
    ├── ui/                     login, cart, checkout, sorting
    └── api/                    users
```

## Design decisions

**Built on Playwright's own features.** Waiting, retrying assertions, screenshots, video, traces, reporting and HTTP calls all come from Playwright. The framework only adds structure on top.

**Page Object Model + fixtures.** Tests never create page objects themselves. Fixtures in `src/fixtures` inject them, so a test just asks for `loginPage` or `cartPage`. Adding a new page means one class plus one line in `ui.fixtures.ts`. The `loginAs(user)` fixture removes the repeated login steps.

**Page hierarchy.**
- `BasePage` holds the page path, `open()`, `expectLoaded()` (checks the URL and a landmark element) and error wrapping.
- `SecurePage` adds the shared header and the page-title check for every logged-in page.
- Each concrete page only declares its own locators and actions.

**Locators.** They're based on saucedemo's `data-test` attributes, via `testIdAttribute: 'data-test'` and `getByTestId`. Each important locator is built with `resilient(primary, ...fallbacks)`, which uses Playwright's `locator.or()`:
- if the test id is renamed, the role, placeholder or text fallback still finds the element
- CSS class fallbacks are used only as a last resort

**Dynamic, not hard-coded.**
- Products for the cart and checkout tests are picked at random from the live list.
- Checkout customer details and API payloads are generated.
- Assertions are calculated from real data, never fixed values: the lowest price, the sum of the selected prices, the expected sort order.
- The generated data is attached to the report, so any failure can be reproduced.

**Passing data between steps.** Models (`Product`, `Customer`, `CreatedUser`) are classes with getters and setters. A per-test `ScenarioContext` stores them with typed `set(key, value)` and `get(key)`:
- the cart step saves the chosen products, and the overview step reads them to check the item total
- reading a key that was never set fails with a clear message

Each test gets a fresh context, so tests stay independent.

**BDD style.** Steps are written as `Given / When / Then / And`, which map to `test.step` with `box: true`. The report reads like a scenario, and a failure points at the step that failed. There's no Gherkin layer, which keeps the suite small and easy to follow.

**Error handling.**
- UI actions run through `perform()`, which catches the Playwright error and rethrows it as an `ActionError` naming the page and the action (for example `Could not add "Sauce Labs Backpack" to the cart on InventoryPage`), with the original error kept as the cause.
- The API client catches network failures and non-JSON bodies and rethrows an `ApiError` with the method, path, status and a slice of the body.
- Nothing is silently swallowed: every catch rethrows, so tests fail loudly and clearly.

**Retries at three levels.**
1. **Element level:** Playwright auto-waiting and web-first assertions (`toHaveText`, `toHaveCount`, `expect.poll`) retry until the timeout.
2. **Request level:** `BaseApiClient` retries network errors and statuses 408/429/5xx, with exponential backoff (`API_MAX_RETRIES`, default 2).
3. **Test level:** `retries` in `playwright.config.ts` (1 locally, 2 on CI).

**Independent and parallel.** Every test logs in and builds its own data. There's no shared state and no ordering between tests, and `fullyParallel` is on.

## Configuration

All settings live in one class, `src/config/GlobalConfig.ts`, and every value has a default. The order of precedence is:

1. environment variable
2. `.env` file (copy `.env.example`)
3. the selected environment profile in `src/config/environments.ts`
4. built-in default

Invalid values (for example `EVIDENCE=maybe`) stop the run with a clear message.

| Variable | Default | Purpose |
|---|---|---|
| `TEST_ENV` | `production` | Which profile in `environments.ts` to use |
| `UI_BASE_URL` | from profile | Override the saucedemo URL |
| `API_BASE_URL` | from profile | Override the reqres URL |
| `REQRES_API_KEY` | from profile | `x-api-key` header for reqres |
| `SAUCE_PASSWORD` | from profile | Password for the saucedemo users |
| `EVIDENCE` | `failure` | `off`, `failure` or `full` |
| `HEADED` | `false` | Show the browser |
| `SLOW_MO` | `0` | Delay in ms between browser actions |
| `RETRIES` | `1` (`2` on CI) | Test-level retries |
| `WORKERS` | Playwright default (`2` on CI) | Parallel workers |
| `API_MAX_RETRIES` | `2` | Retries for network errors and 408/429/5xx |
| `API_RETRY_DELAY_MS` | `500` | First retry delay, doubled on each attempt |
| `TEST_TIMEOUT_MS` / `EXPECT_TIMEOUT_MS` / `ACTION_TIMEOUT_MS` / `NAVIGATION_TIMEOUT_MS` | `30000` / `7000` / `10000` / `20000` | Timeouts |

To add an environment (for example `staging`), add one entry to `environments.ts` and run with `TEST_ENV=staging`.

Note: reqres.in has at times required an `x-api-key` header. The public free key is sent by default so the API tests keep working either way.

## Trade-offs and next steps

- **Login through the UI in every test.** This is realistic and keeps tests independent. For a larger suite, I'd log in once in a setup project and reuse `storageState`.
- **Chromium only**, as the brief allows. Adding Firefox or WebKit is one entry each in `projects`.
- **No response-schema library.** Field checks use `expect.objectContaining`. With more endpoints I'd add JSON-schema validation (for example `zod` or `ajv`).
- **Possible next additions:**
  - `problem_user` scenarios (broken images, wrong sort)
  - negative checkout validation (empty fields)
  - ESLint with `eslint-plugin-playwright` to catch missing `await`s
  - a CI workflow that publishes the HTML report
