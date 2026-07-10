# CertainID QA — Playwright Test Suite

Automated E2E testing for the CertainID platform. Runs in headless Chromium via Playwright.

## Setup

```bash
cd certainid-ops/qa
npm install
npx playwright install chromium
```

## Running Tests

```bash
# All tests
npm test

# Individual flows
npm run test:enrollment
npm run test:content
npm run test:social
npm run test:verify

# With simulated hash (skips mobile QR step)
SIMULATED_HASH=true npm test

# Against a specific URL
CERTAINID_URL=https://app.certainid.io npm test

# With a test wallet address for public card verification
TEST_WALLET_ADDRESS=0xYourAddressHere npm test
```

## Test Structure

| Test File | What It Covers | Automation % |
|-----------|---------------|:---:|
| `enrollment-flow.spec.js` | Landing page → sign-in → QR render → dashboard | ~70% |
| `content-signing.spec.js` | Content type selection → hash → sign → badge → verify | ~80% |
| `social-linking.spec.js` | Platform buttons → OAuth redirect → verification levels | ~50% |
| `verify-badge.spec.js` | Public identity card → verify upload → revocation | ~80% |

## What's Automated vs Manual

### ✅ Automated
- Page load and rendering checks
- UI element visibility and structure
- Button/input interaction
- Screenshot comparison
- Route navigation
- Error state detection

### ❌ Requires Manual (or real credentials)
- Mobile QR scan + biometric capture (Face ID / fingerprint)
- OAuth callbacks (GitHub, YouTube, X, LinkedIn)
- Real on-chain transactions (gasless testnet)
- Mobile PWA testing (iPhone, Android)

## SIMULATED_HASH Mode

When `SIMULATED_HASH=true`, the tests use a mock enrollment state to bypass the mobile QR/biometric step. This lets you test the full desktop flow — dashboard, content signing UI, verification badges — without needing a phone.

## Reports

After running tests, view the HTML report:

```bash
npm run report
```

Screenshots are saved to `reports/screenshots/` on failure.

## Adding Tests

1. Create a new `.spec.js` file in `tests/`
2. Add a script entry in `package.json`
3. Run it and verify

## CI Integration (Future)

Once GitHub Actions or similar CI is set up, these tests can run automatically on every push to the main branch. The test suite is designed to be CI-compatible out of the box.