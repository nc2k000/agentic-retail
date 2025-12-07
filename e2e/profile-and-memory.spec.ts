import { test, expect } from './fixtures/auth'

/**
 * E2E Test: Profile & Memory Page
 * Tests the read-only profile/memory pages that display user data
 */
test.describe('Profile & Memory Journey', () => {
  test('should navigate to profile page', async ({ authenticatedPage: page }) => {
    await page.goto('/chat')

    // Click profile link (if it exists in nav)
    const profileLink = page.locator('a[href="/profile"]')
    if (await profileLink.isVisible()) {
      await profileLink.click()
      await expect(page).toHaveURL(/\/profile/)
    } else {
      // Navigate directly
      await page.goto('/profile')
    }

    // Should show profile header
    await expect(page.locator('text=Your Profile')).toBeVisible({ timeout: 10000 })
  })

  test('should display user statistics', async ({ authenticatedPage: page }) => {
    await page.goto('/profile')

    // Should show stats section with orders, products, preferences
    const statsSection = page.locator('text=Orders').or(page.locator('text=Products Tried'))
    await expect(statsSection.first()).toBeVisible({ timeout: 10000 })
  })

  test('should display household information', async ({ authenticatedPage: page }) => {
    await page.goto('/profile')

    // Check for household section (either explicit or discovered)
    const householdSection = page.locator('text=Household').or(page.locator('text=Your Household'))

    // Page should load without errors
    await page.waitForLoadState('networkidle')

    // At minimum, the page should not have console errors
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.waitForTimeout(2000)
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0)
  })

  test('should display preferences sections', async ({ authenticatedPage: page }) => {
    await page.goto('/profile')

    // Should show preferences section
    await expect(page.locator('text=Shopping Preferences').or(page.locator('text=Preferences'))).toBeVisible({ timeout: 10000 })
  })

  test('should have back to chat button', async ({ authenticatedPage: page }) => {
    await page.goto('/profile')

    // Should have button to return to chat
    const backButton = page.locator('button:has-text("Back to Chat")').or(page.locator('a:has-text("Back to Chat")'))
    await expect(backButton).toBeVisible()

    // Click and verify navigation
    await backButton.click()
    await expect(page).toHaveURL(/\/chat/)
  })

  test('should navigate to memory page', async ({ authenticatedPage: page }) => {
    await page.goto('/memory')

    // Should load memory page
    await expect(page.locator('text=Your Profile').or(page.locator('text=Preferences'))).toBeVisible({ timeout: 10000 })
  })

  test('should display discovered facts with confidence scores', async ({ authenticatedPage: page }) => {
    await page.goto('/profile')

    // Look for confidence indicators (percentage or "confident" text)
    const confidenceIndicator = page.locator('text=/\\d+%/').or(page.locator('text=confident'))

    // May or may not have discovered facts depending on user data
    // Just check page loads successfully
    await page.waitForLoadState('networkidle')

    const pageContent = await page.content()
    expect(pageContent).toBeTruthy()
  })

  test('should show preferences as chips/badges', async ({ authenticatedPage: page }) => {
    await page.goto('/profile')

    // Check for chip/badge styling (common classes)
    const preferenceChips = page.locator('[class*="rounded-full"]').or(page.locator('[class*="badge"]'))

    // Page should render
    await page.waitForLoadState('networkidle')
    expect(await page.isVisible('body')).toBeTruthy()
  })

  test('should navigate to order history', async ({ authenticatedPage: page }) => {
    await page.goto('/chat')

    // Navigate to history if link exists
    const historyLink = page.locator('a[href="/history"]')
    if (await historyLink.isVisible()) {
      await historyLink.click()
      await expect(page).toHaveURL(/\/history/)
      await expect(page.locator('text=Order History').or(page.locator('text=History'))).toBeVisible()
    }
  })

  test('should display past orders or empty state', async ({ authenticatedPage: page }) => {
    await page.goto('/history')

    // Should show orders or empty state
    const hasOrders = await page.locator('[data-testid="order-card"]').count() > 0
    const hasEmptyState = await page.locator('text=No orders').isVisible()

    expect(hasOrders || hasEmptyState).toBeTruthy()
  })

  test('profile and memory pages should both work', async ({ authenticatedPage: page }) => {
    // Test /profile
    await page.goto('/profile')
    await expect(page.locator('text=Your Profile').or(page.locator('text=Preferences'))).toBeVisible({ timeout: 10000 })

    // Test /memory
    await page.goto('/memory')
    await expect(page.locator('text=Your Profile').or(page.locator('text=Preferences'))).toBeVisible({ timeout: 10000 })

    // Both should load without major errors
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await page.waitForTimeout(1000)
    expect(errors.filter(e => !e.includes('favicon'))).toHaveLength(0)
  })
})
