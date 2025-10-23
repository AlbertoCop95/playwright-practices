## Playwright Practices

## UI Practices

### Critical Paths

- Login/logout
- Tasks
  - CRUD
  - Set/Update priority
  - Set/update timeframe
  - Mark as done/pending
  - Share?
- Projects
  - CRUD
  - Add/remove tasks from projects
  - Share?

## API

### Services

- Login
- Tasks
- Projects

### Tech Stack

- [Playwright]()
- [Typescript]()

## Possible project structure

```
qa-monorepo/
├─ README.md
├─ package.json
├─ tsconfig.json
├─ .env                # local defaults (never commit secrets)
├─ .env.ci             # CI-safe values (non-secret)
├─ playwright.config.ts
├─ configs/
│  ├─ playwright.ui.config.ts      # extends base; UI-only defaults
│  ├─ playwright.api.config.ts     # extends base; API-only defaults
│  └─ k6.options.ts                # shared thresholds/options for k6
├─ tests/
│  ├─ fixtures/
│  │  ├─ auth.ts                   # token/login helpers (UI+API)
│  │  ├─ apiClient.ts              # Playwright APIRequestContext factory
│  │  └─ data.ts                   # test data builders
│  ├─ ui/                          # UI E2E (few, stable)
│  │  ├─ flows/checkout.e2e.spec.ts
│  │  └─ flows/account.e2e.spec.ts
│  ├─ api/                         # service-level HTTP checks
│  │  ├─ orders.api.spec.ts
│  │  ├─ users.api.spec.ts
│  │  └─ payments.api.spec.ts
│  └─ resilience/                  # rate limits, trace IDs, timeouts
│     ├─ rate-limit.spec.ts
│     └─ trace-id.spec.ts
├─ src/                             # optional: POM/Screenplay for UI
│  ├─ pages/
│  │  ├─ ShopPage.ts
│  │  └─ CheckoutPage.ts
│  └─ actors/                       # (if using Screenplay) <--- most likely not
│     └─ shopper.ts
├─ perf/                            # k6 lives here
│  ├─ smoke.js                      # quick CI smoke (p95/error-rate)
│  ├─ checkout.js                   # scenario for a key journey
│  └─ lib/
│     ├─ http.js                    # helpers: auth header, check()
│     └─ env.js                     # reads BASE_URL, TOKENS
├─ reports/
│  ├─ junit/                        # JUnit XML (CI)
│  ├─ html/                         # Playwright HTML reports
│  └─ k6/                           # k6 JSON/summary
└─ .github/
   └─ workflows/
      └─ ci.yml
```

