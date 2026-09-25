# Recruiterflow QA Assignment — Playwright + TypeScript

UI tests for [saucedemo.com](https://www.saucedemo.com) and API tests for [reqres.in](https://reqres.in), in one Playwright project.

## Install and run

Requires Node.js 18 or newer.

```bash
npm install
npx playwright test
```

`npm install` also downloads Chromium. No `.env` file is needed; every setting has a default.

| Command | What it does |
|---|---|
| `npx playwright test` or `npm test` | Run everything (UI + API) |
| `npm run test:ui` / `npm run test:api` | Run one part only |
| `npm run test:watch` | UI tests in a visible browser, one at a time, slowed down |
| `npm run test:evidence` | Run with a screenshot and video for every UI test |
| `npm run report` | Open the HTML report of the last run |
| `npm run typecheck` | Type-check the project |

## What is covered

| # | Scenario from the brief | Test |
|---|---|---|
| 1 | Standard user logs in and lands on the products page | `tests/ui/login.spec.ts` |
| 2 | Locked-out user sees the error and is not logged in | `tests/ui/login.spec.ts` |
| 3 | Add two products, cart badge shows 2 | `tests/ui/cart.spec.ts` |
| 4 | Checkout ends with "Thank you for your order!" | `tests/ui/checkout.spec.ts` |
| 5 | Sort by price (low to high), first product is the cheapest | `tests/ui/sorting.spec.ts` |
| 6 | `GET /api/users?page=2`: 200, `data` array, required user fields | `tests/api/users.spec.ts` |
| 7 | `POST /api/users`: 201, echoes name and job, has id and createdAt | `tests/api/users.spec.ts` |
| 8 | Bonus: create-then-verify flow | `tests/api/users.spec.ts` |

A few small extra checks, each its own test:
- the cart page lists exactly the added products
- the checkout overview shows those products and the correct item total
- the cart is emptied after the order
- all four sort options produce a fully ordered list

## Project structure

```
├── tests/
│   ├── ui/            login, cart, checkout, sorting
│   └── api/           users
├── pages/             Page objects: BasePage → SecurePage → one class per page
├── components/        Header (cart badge and link), ProductList (product rows shared by 3 pages)
├── fixtures/          Injects page objects, API client, loginAs, addToCart and scenario context into tests
├── api/               BaseApiClient, UsersClient, endpoints, response types, reusable assertions
├── models/            Product, Customer, UserCredentials, CreatedUser
├── test-data/         Users, product names, expected messages, sort options, API payloads
├── config/            GlobalConfig and environment profiles
├── core/              BDD step helpers, ScenarioContext, retry, error wrapping, test-data generator
├── utils/             Price parsing
└── playwright.config.ts   Two projects: "ui" (Chromium) and "api" (no browser)
```

## How the suite is built

**Page objects and fixtures.** Tests never construct page objects. They ask for `loginPage`, `productsPage`, `cartPage` and so on, and the fixtures in `fixtures/` provide them.
- `BasePage` checks the URL and a landmark element.
- `SecurePage` adds the shared header and the title check for logged-in pages.
- `loginAs(user)` and `addToCart(names)` remove repeated setup steps.

**Locators.**
- `getByTestId` for saucedemo's `data-test` attributes (enabled with `testIdAttribute: 'data-test'`).
- `getByRole` for buttons, by their visible name (Login, Checkout, Continue, Finish, Add to cart).
- No CSS or XPath selectors.

**Assertions.** Each test checks one behaviour, using web-first assertions (`toHaveText`, `toHaveURL`, `toHaveCount`, `expect.poll`) so they wait instead of racing the page.
- **Expected values are calculated from the page, not hard-coded:** the lowest listed price, the sum of the selected products' prices, the sorted order.
- **Assertions carry messages**, so a failure says what was expected.

**Independent tests.** Every test logs in and builds its own state. The suite runs fully in parallel and in any order.

**API tests** use Playwright's `request` fixture only, through a small `UsersClient`. Paths live in `api/endpoints.ts`, response shapes in `api/types/`, and shared checks in `api/assertions/`.

## Beyond the brief

These are small additions that make the suite easier to extend and debug:

- **BDD-style steps.** `Given / When / Then / And` wrap `test.step`, so the HTML report reads like a scenario, and a failure points at the step that broke.
- **Passing data between steps.** Models are small classes with getters and setters. A per-test `ScenarioContext` stores them with typed `set` / `get`:
  - the cart step saves the selected products, and the overview step reads them to check the item total
  - the API bonus test saves the created user and verifies it in the next step
  - reading a key that was never set fails with a clear message
- **One config class.** `config/GlobalConfig.ts` reads every setting (environment, URLs, API key, evidence, headed mode, retries, timeouts) from environment variables or `.env`, falling back to the profile in `config/environments.ts`. Invalid values stop the run with a clear message. Adding a `staging` environment means one new entry.
- **Switchable evidence.**
  - `npm test` keeps a screenshot and trace only when a test fails.
  - `npm run test:evidence` records a screenshot and video of every UI test.
  - `EVIDENCE=off` records nothing.
- **Readable failures.**
  - UI actions are wrapped so an error names the page and action, for example `Could not add "Sauce Labs Backpack" to the cart on ProductsPage`, and keeps the original error.
  - The API client reports non-JSON responses with method, path, status and body.
- **API evidence.** Every request and response (params, body, status, duration) is attached to the HTML report as JSON.
- **API retry.** Network errors and 408/429/5xx responses are retried with backoff, controlled by `API_MAX_RETRIES`. Other statuses are returned as-is, so the tests assert on them.

Settings (all optional, see `.env.example`): `TEST_ENV`, `UI_BASE_URL`, `API_BASE_URL`, `REQRES_API_KEY`, `SAUCE_PASSWORD`, `EVIDENCE` (`off` / `failure` / `full`), `HEADED`, `SLOW_MO`, `RETRIES`, `WORKERS`, `API_MAX_RETRIES`, `API_RETRY_DELAY_MS`, and the timeout values.

Note: reqres.in has at times required an `x-api-key` header. The public free key is sent by default, so the API tests work either way.

## Trade-offs and what I would do next

- **Login runs through the UI in every test.** This is simple and keeps tests independent. For a bigger suite, I would log in once in a setup project and reuse `storageState`.
- **The product names are fixed** in `test-data/products.ts` so runs are repeatable. The prices are still read from the page.
- **Chromium only**, as the brief allows. Firefox or WebKit is one extra entry in `projects`.
- **Next:**
  - `problem_user` scenarios
  - checkout form validation (empty fields)
  - JSON-schema validation for API responses
  - ESLint with `eslint-plugin-playwright` to catch missing `await`s
  - a CI job that publishes the HTML report
