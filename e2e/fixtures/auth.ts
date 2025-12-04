import { test as base } from '@playwright/test'

/**
 * Authentication Fixture for E2E Tests
 * Automatically creates and authenticates a test user before each test
 */
export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    const testEmail = `test-${Date.now()}@example.com`
    const testPassword = 'TestPassword123!'

    // Navigate to signup
    await page.goto('/login')

    // Click sign up button
    const signUpButton = page.locator('button:has-text("Sign up")')
    if (await signUpButton.isVisible()) {
      await signUpButton.click()
    }

    // Fill signup form
    await page.fill('input[type="email"]', testEmail)
    await page.fill('input[type="password"]', testPassword)

    // Submit signup
    await page.click('button:has-text("Sign Up")')

    // Wait for successful authentication (should redirect to onboarding or chat)
    await page.waitForURL(/\/(onboarding|chat)/, { timeout: 10000 })

    // Provide authenticated page to test
    await use(page)

    // Cleanup: logout after test
    // (optional - new test user each time is fine)
  },
})

export { expect } from '@playwright/test'
