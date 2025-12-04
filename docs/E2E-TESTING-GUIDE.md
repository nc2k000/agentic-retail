# End-to-End (E2E) Testing Guide

Complete user journey testing with Playwright covering all major flows through the Agentic Retail app.

## Setup

E2E tests are configured and ready to run. Playwright uses Chromium browser to simulate real user interactions.

**Prerequisites:**
- Playwright installed (`npm install` already did this)
- Chromium browser (`npx playwright install chromium`)
- Local dev server running

## Running Tests

### Basic Commands

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI (visual test runner)
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed

# Debug tests step-by-step
npm run test:e2e:debug

# Run all tests (unit + E2E)
npm run test:all
```

### Run Specific Test Files

```bash
# Run only onboarding tests
npx playwright test e2e/onboarding.spec.ts

# Run only shopping tests
npx playwright test e2e/shopping.spec.ts

# Run only recipe import tests
npx playwright test e2e/recipe-import.spec.ts

# Run only profile tests
npx playwright test e2e/profile-and-memory.spec.ts
```

### Run Specific Tests

```bash
# Run single test by name
npx playwright test -g "should complete full onboarding flow"

# Run tests matching pattern
npx playwright test -g "cart"
```

---

## Test Coverage

### 1. Onboarding Journey (`e2e/onboarding.spec.ts`)

**Tests:** 4 scenarios

- ✅ Complete full onboarding flow (7 steps)
- ✅ Skip optional steps
- ✅ Field validation
- ✅ Navigation back/forward with state preservation

**User Flow:**
1. Welcome screen
2. Name input
3. Household size
4. Household members (age, dietary, allergies)
5. Pets
6. Dietary preferences
7. Allergies
8. Brand preferences
9. → Redirect to chat

**What's Tested:**
- Step-by-step progression
- Form validation (required fields)
- Skip functionality
- Back button with state persistence
- Final redirect to `/chat`

---

### 2. Shopping Journey (`e2e/shopping.spec.ts`)

**Tests:** 8 scenarios

- ✅ Add items to cart through chat
- ✅ Edit item quantities
- ✅ Remove items from cart
- ✅ Bulk deal opportunities
- ✅ Complete checkout flow
- ✅ Savings from swaps
- ✅ Cart persistence across navigation
- ✅ Clear entire cart

**User Flow:**
1. Send shopping query via chat
2. AI responds with shop block
3. Add items to cart
4. Edit quantities / Remove items
5. View bulk deal suggestions
6. Accept swaps for savings
7. Checkout
8. Order confirmation

**What's Tested:**
- Chat → AI response → Shop block rendering
- Cart operations (add, edit, remove, clear)
- Bulk deal detection and application
- Swap suggestions and acceptance
- Cart persistence (localStorage/session)
- Checkout flow completion

---

### 3. Recipe Import Journey (`e2e/recipe-import.spec.ts`)

**Tests:** 7 scenarios

- ✅ Open recipe import modal
- ✅ Import from URL (AllRecipes, Food Network)
- ✅ Error handling for social media URLs
- ✅ Import from text (paste recipe)
- ✅ Import from image (Claude Vision)
- ✅ Close modal
- ✅ Add recipe ingredients to cart

**User Flow:**
1. Click floating recipe button
2. Choose import method (URL / Image / Text)
3. Submit recipe
4. AI extracts ingredients
5. Shop block displays ingredients
6. Add all to cart

**What's Tested:**
- Modal open/close
- URL import (server-side fetch)
- Social media URL error handling
- Text parsing
- Image upload with Claude Vision
- Ingredient extraction
- Bulk "Add All to Cart"

---

### 4. Profile & Memory Journey (`e2e/profile-and-memory.spec.ts`)

**Tests:** 10 scenarios

- ✅ Navigate to profile page
- ✅ Display user preferences
- ✅ Edit dietary preferences
- ✅ Add household member
- ✅ Delete preference
- ✅ Show maturity score
- ✅ Respect dietary restrictions in AI
- ✅ Avoid allergens in suggestions
- ✅ Navigate to order history
- ✅ Display past orders
- ✅ Replenishment suggestions

**User Flow:**
1. Navigate to `/profile`
2. View/edit preferences (dietary, allergies, brands)
3. Add/edit household members
4. Return to chat
5. AI respects preferences in suggestions
6. View order history
7. See replenishment suggestions

**What's Tested:**
- Profile navigation
- Preference CRUD operations
- Household member management
- Memory maturity score
- AI personalization (dietary restrictions, allergens)
- Order history display
- Replenishment chip suggestions

---

## Test Results & Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

This opens an interactive report with:
- Pass/fail status for each test
- Screenshots on failure
- Execution traces
- Performance metrics

---

## Debugging Failed Tests

### 1. Run in Debug Mode

```bash
npm run test:e2e:debug
```

- Pauses at each step
- Inspect DOM
- Console logs visible
- Step through code

### 2. View Screenshots

Failed tests automatically capture screenshots:
```
test-results/
  <test-name>/
    test-failed-1.png
```

### 3. View Traces

Enable trace on failure (already configured):
```typescript
use: {
  trace: 'on-first-retry',
}
```

View traces:
```bash
npx playwright show-trace test-results/<test-name>/trace.zip
```

### 4. Run Headed Mode

See the browser during test execution:
```bash
npm run test:e2e:headed
```

---

## Writing New E2E Tests

### Test Structure

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup (navigate, login, etc.)
    await page.goto('/chat')
  })

  test('should do something', async ({ page }) => {
    // Arrange
    await page.click('button')

    // Act
    await page.fill('input', 'value')
    await page.press('Enter')

    // Assert
    await expect(page.locator('text=Success')).toBeVisible()
  })
})
```

### Best Practices

1. **Use data-testid attributes** for stable selectors
   ```typescript
   await page.click('[data-testid="cart-button"]')
   ```

2. **Wait for elements properly**
   ```typescript
   await page.waitForSelector('[data-block-type="shop"]', { timeout: 10000 })
   ```

3. **Assert visibility before interactions**
   ```typescript
   await expect(page.locator('button')).toBeVisible()
   await page.click('button')
   ```

4. **Use meaningful test names**
   ```typescript
   test('should add item to cart when clicking Add to Cart button', ...)
   ```

5. **Keep tests independent**
   - Don't rely on test execution order
   - Clean up state in `afterEach` if needed

---

## Continuous Integration (CI)

To run E2E tests in GitHub Actions:

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx playwright install --with-deps
      - run: npm run build
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Coverage Summary

| Test Suite | Tests | Coverage |
|------------|-------|----------|
| Onboarding | 4 | Full FTUX flow, validation, navigation |
| Shopping | 8 | Cart ops, bulk deals, checkout, swaps |
| Recipe Import | 7 | URL/Image/Text import, error handling |
| Profile & Memory | 10 | Preferences, personalization, history |
| **TOTAL** | **29** | **Complete user journeys** |

---

## What's NOT Tested (Yet)

**Future E2E Tests:**
- Voice input/output (STT/TTS)
- Compare blocks (high-consideration shopping)
- Mobile responsive testing
- Cross-browser testing (Firefox, Safari)
- Performance testing (Lighthouse CI)
- Accessibility testing (axe-core)
- Real payment processing (requires test mode API keys)

---

## Troubleshooting

### Tests timeout

Increase timeout in `playwright.config.ts`:
```typescript
use: {
  timeout: 30000, // 30 seconds
}
```

### Browser not launching

```bash
npx playwright install --with-deps chromium
```

### "Cannot find module" errors

```bash
npm install --save-dev @playwright/test
```

### Tests pass locally but fail in CI

- Ensure consistent Node version
- Install system dependencies: `npx playwright install-deps`
- Check for race conditions (add explicit waits)

---

## Quick Reference

```bash
# Development
npm run test:e2e:ui          # Visual test runner
npm run test:e2e:headed      # See browser

# Debugging
npm run test:e2e:debug       # Step-by-step debugger
npx playwright show-trace    # View trace
npx playwright show-report   # View HTML report

# CI/Production
npm run test:e2e             # Headless mode
npm run test:all             # Unit + E2E
```

---

**Next Steps:**
1. Run tests: `npm run test:e2e:ui`
2. Review report: `npx playwright show-report`
3. Add more tests as you build features
4. Set up CI/CD pipeline
