# Recruiterflow QA Assignment

Playwright + TypeScript tests for the saucedemo.com shop (UI) and the reqres.in users API.

## How to run

You need Node.js 18 or newer.

```bash
npm install
npx playwright test
```

`npm install` also downloads Chromium, so nothing else needs to be set up.

Other useful commands:

| Command | What it does |
|---|---|
| `npm run test:ui` | Only the UI tests |
| `npm run test:api` | Only the API tests |
| `npm run test:watch` | Opens the browser and runs the UI tests slowly, one by one, so you can watch |
| `npm run test:evidence` | Records a screenshot and video of every UI test |
| `npm run report` | Opens the HTML report from the last run |

## What is in each folder

```
tests/
  ui/             login, cart, checkout and sorting tests
  api/            users API tests
pages/            one class per saucedemo page
components/       parts that appear on several pages (header, product list)
fixtures/         gives each test the pages and helpers it needs
api/              API client, endpoints, response types, reusable API checks
models/           small data classes (Product, Customer, CreatedUser, ...)
test-data/        users, product names, expected messages, API payloads
config/           GlobalConfig: URLs, API key, evidence mode, environment
core/             small helpers: BDD steps, scenario data, retry, error messages
utils/            price helpers
```

**tests/** only describe *what* is tested. They hold no locators and no URLs, so they read like the scenario in the brief.

**pages/** hold the locators and actions for each page.
- `BasePage` knows how to open a page and check you are on it (by URL).
- `SecurePage` is for pages after login. It adds the header (cart badge) and checks the page title.
- `LoginPage`, `ProductsPage`, `CartPage` and the three checkout pages each hold only their own buttons and fields.

**components/** avoid repeating code that appears on more than one page.
- `Header` is the cart icon and badge, shown on every page after login.
- `ProductList` reads product names and prices. The products page, cart and checkout overview all use the same product rows, so this is written once.

**fixtures/** are the glue. A test just asks for `loginPage` or `cartPage` and gets a ready object. There are also two helpers:
- `loginAs(user)` opens the login page, logs in and waits for the products page.
- `addToCart(names)` adds products and remembers which ones were added.

**api/** does for the API what `pages/` does for the UI.
- `BaseApiClient` sends the request, reads the JSON and attaches the request and response to the report.
- `UsersClient` has one method per endpoint.

**config/GlobalConfig.ts** is the one place where settings are read. Every value has a default, so no `.env` file is needed.

## How one test runs

Take the checkout test "finishing the order shows the thank-you message":

1. `beforeEach` runs first:
   - `loginAs(users.standard)` logs in.
   - `addToCart(cartProductNames)` adds the two products from `test-data/products.ts`, reads their prices from the page, and saves them with `uiContext.set('selectedProducts', ...)`.
   - It then fills in a random customer and moves on to the overview page.
2. The test then:
   - clicks **Finish**
   - checks the complete page loaded
   - checks the header text is exactly "Thank you for your order!"
3. Each step is written as `Given / When / Then`, so the HTML report shows the steps in plain English, and a failure points to the step that broke.

The overview test in the same file reads `uiContext.get('selectedProducts')` to check that the item total equals the sum of those prices. That's how data passes from one step to the next.

## How I approached each task

| # | Task | What the test checks |
|---|---|---|
| 1 | Standard user logs in | After login, the URL is `/inventory.html` and the page title is "Products". |
| 2 | Locked-out user | The error text matches exactly, **and** the user is still on the login page. Seeing an error alone doesn't prove they weren't logged in. |
| 3 | Two products → badge shows 2 | Adds two products, and after each one waits for the button to change to "Remove". Then checks the badge text is `2`. |
| 4 | Full checkout | Log in, add products and fill the customer details in `beforeEach`. The test itself only finishes the order and checks the thank-you message. |
| 5 | Sort by price, low to high | Reads all prices after sorting and checks the first one equals the lowest. The lowest price is worked out from the page, not hard-coded, so the test doesn't break if prices change. |
| 6 | `GET /api/users?page=2` | Status 200, `data` is a non-empty array, and every user has `id`, `email`, `first_name` and `last_name`. |
| 7 | `POST /api/users` | Status 201, the response has the same name and job, `id` is not empty, and `createdAt` is a valid date close to when the request was sent. |
| 8 | Bonus: create-then-verify | Step 1 builds a new payload and saves it. Step 2 creates the user and saves the response as a `CreatedUser`. Step 3 reads both back and compares them. The same pattern would work for a real API that stores data. |

I also added a few small tests, each checking one thing:
- the cart page lists the added products
- the overview total is correct
- the cart is empty after the order
- all four sort options give a correctly ordered list

## Choices I made

**Locators.**
- I use `getByTestId` for saucedemo's `data-test` attributes. `testIdAttribute` is set to `data-test` in the config.
- I use `getByRole` for buttons, by their visible text (Login, Checkout, Continue, Finish, Add to cart).
- There's no CSS or XPath.

**Assertions.**
- I use Playwright's waiting assertions (`toHaveText`, `toHaveURL`, `toBeHidden`), so tests wait for the page instead of using sleeps.
- Each test checks one behaviour.

**Independent tests.** Every test logs in and sets up its own cart, so tests can run in any order and in parallel.

**Test data.**
- Users, product names, messages and payloads live in `test-data/`, not inside tests.
- Product names are fixed so runs are repeatable.
- Prices are read from the page.

**Error messages.** Actions with several steps (login, add to cart, sort, checkout form) are wrapped in a try/catch that rethrows with the page and action name. For example: `Could not add "Sauce Labs Backpack" to the cart on ProductsPage`. The API client does the same when a response isn't JSON.

**Retries.**
- Playwright retries a failed test once locally, twice on CI.
- The API client retries network errors and 408/429/5xx responses up to 2 times.
- Any other status is returned as-is, so the test can check it.

**Evidence.**
- A normal run keeps a screenshot and trace only when a test fails.
- `npm run test:evidence` records a screenshot and video of every UI test.
- API requests and responses, and the data each test used, are attached to the HTML report.

## Settings

All optional. Set them as environment variables, or copy `.env.example` to `.env`.

| Setting | Default | Used for |
|---|---|---|
| `TEST_ENV` | `production` | Which profile in `config/environments.ts` to use |
| `UI_BASE_URL` / `API_BASE_URL` | saucedemo / reqres | Point the tests at another site |
| `REQRES_API_KEY` | `reqres-free-v1` | reqres has sometimes required this header; sent just in case |
| `SAUCE_PASSWORD` | `secret_sauce` | Password for the test users |
| `EVIDENCE` | `failure` | `off`, `failure` or `full` |
| `HEADED` / `SLOW_MO` | `false` / `0` | Show the browser and slow it down |
| `API_RETRIES` | `2` | Retries for network errors and 5xx |

To add another environment, add one entry to `config/environments.ts` and run with `TEST_ENV=<name>`.

## Trade-offs and next steps

- **Every UI test logs in through the login page.** This is simple and keeps tests independent, but it's slower. With a bigger suite, I'd log in once in a setup project and reuse the saved session (`storageState`).
- **Chromium only**, as the brief allows. Firefox or WebKit is one more entry in `playwright.config.ts`.
- **With more time, I would add:**
  - `problem_user` tests
  - checkout form validation (empty fields)
  - JSON-schema checks for API responses
  - ESLint with the Playwright plugin to catch missing `await`s
  - a CI job that publishes the report
