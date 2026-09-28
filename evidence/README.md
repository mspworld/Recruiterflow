# Test evidence

Recorded with `npm run test:evidence` on 2026-09-28 07:56 UTC.

**Result:** 15 of 15 tests passed (run status: `passed`).

- **UI tests:** preview GIF, full video, a screenshot after every step, and a trace that replays every click and keystroke. Open `trace.zip` at [trace.playwright.dev](https://trace.playwright.dev) or with `npx playwright show-trace <file>`.
- **API tests:** the steps, plus the full request and response of every call.

## UI tests

### ✅ Cart › adding two products updates the cart badge to 2

`2.9s` · [Video](ui/cart-adding-two-products-updates-the-cart-badge-to-2-ff1af0/video.webm) · [Trace](ui/cart-adding-two-products-updates-the-cart-badge-to-2-ff1af0/trace.zip)

<img src="ui/cart-adding-two-products-updates-the-cart-badge-to-2-ff1af0/preview.gif" width="560" alt="Recording of Cart › adding two products updates the cart badge to 2">

| # | Step | Screenshot after the step |
|---|---|---|
| 1 | Given I am logged in as the standard user | <img src="ui/cart-adding-two-products-updates-the-cart-badge-to-2-ff1af0/01-given-i-am-logged-in-as-the-standard-user.png" width="320"> |
| 2 | When I add two products to the cart | <img src="ui/cart-adding-two-products-updates-the-cart-badge-to-2-ff1af0/02-when-i-add-two-products-to-the-cart.png" width="320"> |
| 3 | Then the cart badge shows 2 | <img src="ui/cart-adding-two-products-updates-the-cart-badge-to-2-ff1af0/03-then-the-cart-badge-shows-2.png" width="320"> |

### ✅ Cart › the cart page lists the products that were added

`3.0s` · [Video](ui/cart-the-cart-page-lists-the-products-that-were-added-0b2968/video.webm) · [Trace](ui/cart-the-cart-page-lists-the-products-that-were-added-0b2968/trace.zip)

<img src="ui/cart-the-cart-page-lists-the-products-that-were-added-0b2968/preview.gif" width="560" alt="Recording of Cart › the cart page lists the products that were added">

| # | Step | Screenshot after the step |
|---|---|---|
| 1 | Given I am logged in as the standard user | <img src="ui/cart-the-cart-page-lists-the-products-that-were-added-0b2968/01-given-i-am-logged-in-as-the-standard-user.png" width="320"> |
| 2 | And I have added two products to the cart | <img src="ui/cart-the-cart-page-lists-the-products-that-were-added-0b2968/02-and-i-have-added-two-products-to-the-cart.png" width="320"> |
| 3 | When I open the cart | <img src="ui/cart-the-cart-page-lists-the-products-that-were-added-0b2968/03-when-i-open-the-cart.png" width="320"> |
| 4 | Then the cart lists exactly those products | <img src="ui/cart-the-cart-page-lists-the-products-that-were-added-0b2968/04-then-the-cart-lists-exactly-those-products.png" width="320"> |

### ✅ Checkout › the overview shows the selected products and the correct item total

`3.4s` · [Video](ui/checkout-the-overview-shows-the-selected-products-and-the-co-49e15f/video.webm) · [Trace](ui/checkout-the-overview-shows-the-selected-products-and-the-co-49e15f/trace.zip)

<img src="ui/checkout-the-overview-shows-the-selected-products-and-the-co-49e15f/preview.gif" width="560" alt="Recording of Checkout › the overview shows the selected products and the correct item total">

| # | Step | Screenshot after the step |
|---|---|---|
| 1 | Given I am logged in as the standard user | <img src="ui/checkout-the-overview-shows-the-selected-products-and-the-co-49e15f/01-given-i-am-logged-in-as-the-standard-user.png" width="320"> |
| 2 | And I have two products in my cart | <img src="ui/checkout-the-overview-shows-the-selected-products-and-the-co-49e15f/02-and-i-have-two-products-in-my-cart.png" width="320"> |
| 3 | And I have entered my checkout information | <img src="ui/checkout-the-overview-shows-the-selected-products-and-the-co-49e15f/03-and-i-have-entered-my-checkout-information.png" width="320"> |
| 4 | Then the overview lists the selected products | <img src="ui/checkout-the-overview-shows-the-selected-products-and-the-co-49e15f/04-then-the-overview-lists-the-selected-products.png" width="320"> |
| 5 | And the item total is the sum of their prices | <img src="ui/checkout-the-overview-shows-the-selected-products-and-the-co-49e15f/05-and-the-item-total-is-the-sum-of-their-prices.png" width="320"> |

### ✅ Checkout › finishing the order shows the "Thank you for your order!" message

`3.2s` · [Video](ui/checkout-finishing-the-order-shows-the-thank-you-for-your-or-9aa64f/video.webm) · [Trace](ui/checkout-finishing-the-order-shows-the-thank-you-for-your-or-9aa64f/trace.zip)

<img src="ui/checkout-finishing-the-order-shows-the-thank-you-for-your-or-9aa64f/preview.gif" width="560" alt="Recording of Checkout › finishing the order shows the "Thank you for your order!" message">

| # | Step | Screenshot after the step |
|---|---|---|
| 1 | Given I am logged in as the standard user | <img src="ui/checkout-finishing-the-order-shows-the-thank-you-for-your-or-9aa64f/01-given-i-am-logged-in-as-the-standard-user.png" width="320"> |
| 2 | And I have two products in my cart | <img src="ui/checkout-finishing-the-order-shows-the-thank-you-for-your-or-9aa64f/02-and-i-have-two-products-in-my-cart.png" width="320"> |
| 3 | And I have entered my checkout information | <img src="ui/checkout-finishing-the-order-shows-the-thank-you-for-your-or-9aa64f/03-and-i-have-entered-my-checkout-information.png" width="320"> |
| 4 | When I finish the order | <img src="ui/checkout-finishing-the-order-shows-the-thank-you-for-your-or-9aa64f/04-when-i-finish-the-order.png" width="320"> |
| 5 | Then I see the thank-you message | <img src="ui/checkout-finishing-the-order-shows-the-thank-you-for-your-or-9aa64f/05-then-i-see-the-thank-you-message.png" width="320"> |

### ✅ Checkout › the cart is empty after the order is placed

`2.5s` · [Video](ui/checkout-the-cart-is-empty-after-the-order-is-placed-6092ad/video.webm) · [Trace](ui/checkout-the-cart-is-empty-after-the-order-is-placed-6092ad/trace.zip)

<img src="ui/checkout-the-cart-is-empty-after-the-order-is-placed-6092ad/preview.gif" width="560" alt="Recording of Checkout › the cart is empty after the order is placed">

| # | Step | Screenshot after the step |
|---|---|---|
| 1 | Given I am logged in as the standard user | <img src="ui/checkout-the-cart-is-empty-after-the-order-is-placed-6092ad/01-given-i-am-logged-in-as-the-standard-user.png" width="320"> |
| 2 | And I have two products in my cart | <img src="ui/checkout-the-cart-is-empty-after-the-order-is-placed-6092ad/02-and-i-have-two-products-in-my-cart.png" width="320"> |
| 3 | And I have entered my checkout information | <img src="ui/checkout-the-cart-is-empty-after-the-order-is-placed-6092ad/03-and-i-have-entered-my-checkout-information.png" width="320"> |
| 4 | When I finish the order | <img src="ui/checkout-the-cart-is-empty-after-the-order-is-placed-6092ad/04-when-i-finish-the-order.png" width="320"> |
| 5 | Then the cart badge is gone | <img src="ui/checkout-the-cart-is-empty-after-the-order-is-placed-6092ad/05-then-the-cart-badge-is-gone.png" width="320"> |

### ✅ Login › standard user logs in and lands on the products page

`1.8s` · [Video](ui/login-standard-user-logs-in-and-lands-on-the-products-page-2561c6/video.webm) · [Trace](ui/login-standard-user-logs-in-and-lands-on-the-products-page-2561c6/trace.zip)

<img src="ui/login-standard-user-logs-in-and-lands-on-the-products-page-2561c6/preview.gif" width="560" alt="Recording of Login › standard user logs in and lands on the products page">

| # | Step | Screenshot after the step |
|---|---|---|
| 1 | Given I am on the login page | <img src="ui/login-standard-user-logs-in-and-lands-on-the-products-page-2561c6/01-given-i-am-on-the-login-page.png" width="320"> |
| 2 | When I log in as the standard user | <img src="ui/login-standard-user-logs-in-and-lands-on-the-products-page-2561c6/02-when-i-log-in-as-the-standard-user.png" width="320"> |
| 3 | Then I land on the products page | <img src="ui/login-standard-user-logs-in-and-lands-on-the-products-page-2561c6/03-then-i-land-on-the-products-page.png" width="320"> |

### ✅ Login › locked-out user sees an error and is not logged in

`1.4s` · [Video](ui/login-locked-out-user-sees-an-error-and-is-not-logged-in-7667f6/video.webm) · [Trace](ui/login-locked-out-user-sees-an-error-and-is-not-logged-in-7667f6/trace.zip)

<img src="ui/login-locked-out-user-sees-an-error-and-is-not-logged-in-7667f6/preview.gif" width="560" alt="Recording of Login › locked-out user sees an error and is not logged in">

| # | Step | Screenshot after the step |
|---|---|---|
| 1 | Given I am on the login page | <img src="ui/login-locked-out-user-sees-an-error-and-is-not-logged-in-7667f6/01-given-i-am-on-the-login-page.png" width="320"> |
| 2 | When I log in as the locked-out user | <img src="ui/login-locked-out-user-sees-an-error-and-is-not-logged-in-7667f6/02-when-i-log-in-as-the-locked-out-user.png" width="320"> |
| 3 | Then I see the locked-out error message | <img src="ui/login-locked-out-user-sees-an-error-and-is-not-logged-in-7667f6/03-then-i-see-the-locked-out-error-message.png" width="320"> |
| 4 | And I am still on the login page | <img src="ui/login-locked-out-user-sees-an-error-and-is-not-logged-in-7667f6/04-and-i-am-still-on-the-login-page.png" width="320"> |

### ✅ Product sorting › sorting by price (low to high) shows the cheapest product first

`1.6s` · [Video](ui/product-sorting-sorting-by-price-low-to-high-shows-the-cheap-c4f2d5/video.webm) · [Trace](ui/product-sorting-sorting-by-price-low-to-high-shows-the-cheap-c4f2d5/trace.zip)

<img src="ui/product-sorting-sorting-by-price-low-to-high-shows-the-cheap-c4f2d5/preview.gif" width="560" alt="Recording of Product sorting › sorting by price (low to high) shows the cheapest product first">

| # | Step | Screenshot after the step |
|---|---|---|
| 1 | Given I am logged in as the standard user | <img src="ui/product-sorting-sorting-by-price-low-to-high-shows-the-cheap-c4f2d5/01-given-i-am-logged-in-as-the-standard-user.png" width="320"> |
| 2 | When I sort by price, low to high | <img src="ui/product-sorting-sorting-by-price-low-to-high-shows-the-cheap-c4f2d5/02-when-i-sort-by-price-low-to-high.png" width="320"> |
| 3 | Then the first product has the lowest price | <img src="ui/product-sorting-sorting-by-price-low-to-high-shows-the-cheap-c4f2d5/03-then-the-first-product-has-the-lowest-price.png" width="320"> |

### ✅ Product sorting › every product is in order when sorted by "Name (A to Z)"

`1.9s` · [Video](ui/product-sorting-every-product-is-in-order-when-sorted-by-nam-6d5ddc/video.webm) · [Trace](ui/product-sorting-every-product-is-in-order-when-sorted-by-nam-6d5ddc/trace.zip)

<img src="ui/product-sorting-every-product-is-in-order-when-sorted-by-nam-6d5ddc/preview.gif" width="560" alt="Recording of Product sorting › every product is in order when sorted by "Name (A to Z)"">

| # | Step | Screenshot after the step |
|---|---|---|
| 1 | Given I am logged in as the standard user | <img src="ui/product-sorting-every-product-is-in-order-when-sorted-by-nam-6d5ddc/01-given-i-am-logged-in-as-the-standard-user.png" width="320"> |
| 2 | When I sort by "Name (A to Z)" | <img src="ui/product-sorting-every-product-is-in-order-when-sorted-by-nam-6d5ddc/02-when-i-sort-by-name-a-to-z.png" width="320"> |
| 3 | Then the whole list is in the expected order | <img src="ui/product-sorting-every-product-is-in-order-when-sorted-by-nam-6d5ddc/03-then-the-whole-list-is-in-the-expected-order.png" width="320"> |

### ✅ Product sorting › every product is in order when sorted by "Name (Z to A)"

`1.8s` · [Video](ui/product-sorting-every-product-is-in-order-when-sorted-by-nam-30af1e/video.webm) · [Trace](ui/product-sorting-every-product-is-in-order-when-sorted-by-nam-30af1e/trace.zip)

<img src="ui/product-sorting-every-product-is-in-order-when-sorted-by-nam-30af1e/preview.gif" width="560" alt="Recording of Product sorting › every product is in order when sorted by "Name (Z to A)"">

| # | Step | Screenshot after the step |
|---|---|---|
| 1 | Given I am logged in as the standard user | <img src="ui/product-sorting-every-product-is-in-order-when-sorted-by-nam-30af1e/01-given-i-am-logged-in-as-the-standard-user.png" width="320"> |
| 2 | When I sort by "Name (Z to A)" | <img src="ui/product-sorting-every-product-is-in-order-when-sorted-by-nam-30af1e/02-when-i-sort-by-name-z-to-a.png" width="320"> |
| 3 | Then the whole list is in the expected order | <img src="ui/product-sorting-every-product-is-in-order-when-sorted-by-nam-30af1e/03-then-the-whole-list-is-in-the-expected-order.png" width="320"> |

### ✅ Product sorting › every product is in order when sorted by "Price (low to high)"

`1.6s` · [Video](ui/product-sorting-every-product-is-in-order-when-sorted-by-pri-c50683/video.webm) · [Trace](ui/product-sorting-every-product-is-in-order-when-sorted-by-pri-c50683/trace.zip)

<img src="ui/product-sorting-every-product-is-in-order-when-sorted-by-pri-c50683/preview.gif" width="560" alt="Recording of Product sorting › every product is in order when sorted by "Price (low to high)"">

| # | Step | Screenshot after the step |
|---|---|---|
| 1 | Given I am logged in as the standard user | <img src="ui/product-sorting-every-product-is-in-order-when-sorted-by-pri-c50683/01-given-i-am-logged-in-as-the-standard-user.png" width="320"> |
| 2 | When I sort by "Price (low to high)" | <img src="ui/product-sorting-every-product-is-in-order-when-sorted-by-pri-c50683/02-when-i-sort-by-price-low-to-high.png" width="320"> |
| 3 | Then the whole list is in the expected order | <img src="ui/product-sorting-every-product-is-in-order-when-sorted-by-pri-c50683/03-then-the-whole-list-is-in-the-expected-order.png" width="320"> |

### ✅ Product sorting › every product is in order when sorted by "Price (high to low)"

`1.4s` · [Video](ui/product-sorting-every-product-is-in-order-when-sorted-by-pri-98ab72/video.webm) · [Trace](ui/product-sorting-every-product-is-in-order-when-sorted-by-pri-98ab72/trace.zip)

<img src="ui/product-sorting-every-product-is-in-order-when-sorted-by-pri-98ab72/preview.gif" width="560" alt="Recording of Product sorting › every product is in order when sorted by "Price (high to low)"">

| # | Step | Screenshot after the step |
|---|---|---|
| 1 | Given I am logged in as the standard user | <img src="ui/product-sorting-every-product-is-in-order-when-sorted-by-pri-98ab72/01-given-i-am-logged-in-as-the-standard-user.png" width="320"> |
| 2 | When I sort by "Price (high to low)" | <img src="ui/product-sorting-every-product-is-in-order-when-sorted-by-pri-98ab72/02-when-i-sort-by-price-high-to-low.png" width="320"> |
| 3 | Then the whole list is in the expected order | <img src="ui/product-sorting-every-product-is-in-order-when-sorted-by-pri-98ab72/03-then-the-whole-list-is-in-the-expected-order.png" width="320"> |

## API tests

### ✅ Users API › GET /api/users?page=2 returns a list of users with the required fields

`0.3s`

1. When I request page 2 of users
2. Then the status is 200
3. And the response has a "data" array
4. And every user has id, email, first_name and last_name

<details><summary><code>GET /api/users</code> → 200</summary>

```json
{
  "request": {
    "method": "GET",
    "path": "/api/users",
    "params": {
      "page": 2
    }
  },
  "response": {
    "status": 200,
    "body": {
      "page": 2,
      "per_page": 6,
      "total": 12,
      "total_pages": 2,
      "data": [
        {
          "id": 7,
          "email": "michael.lawson@reqres.in",
          "first_name": "Michael",
          "last_name": "Lawson",
          "avatar": "https://reqres.in/img/faces/7-image.jpg"
        },
        {
          "id": 8,
          "email": "lindsay.ferguson@reqres.in",
          "first_name": "Lindsay",
          "last_name": "Ferguson",
          "avatar": "https://reqres.in/img/faces/8-image.jpg"
        },
        {
          "id": 9,
          "email": "tobias.funke@reqres.in",
          "first_name": "Tobias",
          "last_name": "Funke",
          "avatar": "https://reqres.in/img/faces/9-image.jpg"
        },
        {
          "id": 10,
          "email": "byron.fields@reqres.in",
          "first_name": "Byron",
          "last_name": "Fields",
          "avatar": "https://reqres.in/img/faces/10-image.jpg"
        },
        {
          "id": 11,
          "email": "george.edwards@reqres.in",
          "first_name": "George",
          "last_name": "Edwards",
          "avatar": "https://reqres.in/img/faces/11-image.jpg"
        },
        {
          "id": 12,
          "email": "rachel.howell@reqres.in",
          "first_name": "Rachel",
          "last_name": "Howell",
          "avatar": "https://reqres.in/img/faces/12-image.jpg"
        }
      ],
      "support": {
        "url": "https://benhowdle.im/first-cto-playbook?utm_source=reqres&utm_medium=json&utm_campaign=referral",
        "text": "Become a better CTO. A playbook of painful stories and practical advice from a two-time startup CTO."
      },
      "_meta": {
        "powered_by": "ReqRes",
        "docs_url": "https://app.reqres.in/documentation",
        "upgrade_url": "https://app.reqres.in/upgrade",
        "example_url": "https://app.reqres.in/examples/notes-app",
        "variant": "v1_a",
        "message": "Your data persists here. Add auth, logs, and custom schemas to build a real backend.",
        "cta": {
          "label": "See example app",
          "url": "https://app.reqres.in/examples/notes-app"
        },
        "context": "legacy_success"
      }
    }
  }
}
```

</details>

### ✅ Users API › POST /api/users creates a user and echoes back name and job

`0.3s`

1. When I create the user "morpheus"
2. Then the status is 201
3. And the response has the same name and job, plus an id and createdAt

<details><summary><code>POST /api/users</code> → 201</summary>

```json
{
  "request": {
    "method": "POST",
    "path": "/api/users",
    "data": {
      "name": "morpheus",
      "job": "leader"
    }
  },
  "response": {
    "status": 201,
    "body": {
      "name": "morpheus",
      "job": "leader",
      "id": "744",
      "createdAt": "2026-09-28T07:56:23.157Z",
      "_meta": {
        "powered_by": "ReqRes",
        "docs_url": "https://app.reqres.in/documentation",
        "upgrade_url": "https://app.reqres.in/upgrade",
        "example_url": "https://app.reqres.in/examples/notes-app",
        "variant": "v1_a",
        "message": "Your data persists here. Add auth, logs, and custom schemas to build a real backend.",
        "cta": {
          "label": "See example app",
          "url": "https://app.reqres.in/examples/notes-app"
        },
        "context": "legacy_success"
      }
    }
  }
}
```

</details>

### ✅ Users API › create-then-verify: the created user is saved and checked in the next step

`0.3s`

1. Given I have a new user to create
2. When I create the user and save the result
3. Then the saved user matches what I sent

<details><summary><code>POST /api/users</code> → 201</summary>

```json
{
  "request": {
    "method": "POST",
    "path": "/api/users",
    "data": {
      "name": "qa-user-1790582182972",
      "job": "developer"
    }
  },
  "response": {
    "status": 201,
    "body": {
      "name": "qa-user-1790582182972",
      "job": "developer",
      "id": "204",
      "createdAt": "2026-09-28T07:56:23.159Z",
      "_meta": {
        "powered_by": "ReqRes",
        "docs_url": "https://app.reqres.in/documentation",
        "upgrade_url": "https://app.reqres.in/upgrade",
        "example_url": "https://app.reqres.in/examples/notes-app",
        "variant": "v1_a",
        "message": "Your data persists here. Add auth, logs, and custom schemas to build a real backend.",
        "cta": {
          "label": "See example app",
          "url": "https://app.reqres.in/examples/notes-app"
        },
        "context": "legacy_success"
      }
    }
  }
}
```

</details>
