import { test, expect } from '@playwright/test'

/**
 * E2E Test: Profile Management & Memory System
 * Tests profile editing, preferences, and AI personalization
 */
test.describe('Profile & Memory Journey', () => {
  test('should navigate to profile page', async ({ page }) => {
    await page.goto('/chat')

    // Click profile link
    await page.click('a[href="/profile"]')

    // Should navigate to profile
    await expect(page).toHaveURL(/\/profile/)
    await expect(page.locator('h1:has-text("Profile")')).toBeVisible()
  })

  test('should display user preferences', async ({ page }) => {
    await page.goto('/profile')

    // Should show preference sections
    await expect(page.locator('text=Dietary')).toBeVisible()
    await expect(page.locator('text=Allergies')).toBeVisible()
    await expect(page.locator('text=Household')).toBeVisible()
  })

  test('should edit dietary preferences', async ({ page }) => {
    await page.goto('/profile')

    // Add dietary preference
    await page.click('button:has-text("Add Dietary")')
    await page.click('button:has-text("Vegan")')

    // Save
    await page.click('button:has-text("Save")')

    // Reload and verify persistence
    await page.reload()
    await expect(page.locator('text=Vegan')).toBeVisible()
  })

  test('should add household member', async ({ page }) => {
    await page.goto('/profile')

    // Click add member
    await page.click('button:has-text("Add Member")')

    // Fill form
    await page.fill('input[placeholder*="Name"]', 'Emma')
    await page.fill('input[placeholder*="Age"]', '6')

    // Add dietary restriction for member
    await page.click('button:has-text("Vegetarian")')

    // Save
    await page.click('button:has-text("Save")')

    // Verify member appears
    await expect(page.locator('text=Emma')).toBeVisible()
    await expect(page.locator('text=6 years')).toBeVisible()
  })

  test('should delete preference', async ({ page }) => {
    await page.goto('/profile')

    // Find and click delete on first preference
    const deleteButton = page.locator('button[aria-label*="Delete"]:first')

    if (await deleteButton.isVisible()) {
      await deleteButton.click()

      // Confirm deletion
      const confirmButton = page.locator('button:has-text("Delete")')
      if (await confirmButton.isVisible()) {
        await confirmButton.click()
      }

      // Preference should be removed
      await page.waitForTimeout(500)
    }
  })

  test('should show maturity score', async ({ page }) => {
    await page.goto('/profile')

    // Profile should show memory maturity
    const maturityElement = page.locator('text=%', { hasText: /\d+%/ })
    await expect(maturityElement).toBeVisible()
  })

  test('should respect dietary restrictions in AI responses', async ({ page }) => {
    // Set dietary preference
    await page.goto('/profile')
    await page.click('button:has-text("Add Dietary")')
    await page.click('button:has-text("Vegetarian")')
    await page.click('button:has-text("Save")')

    // Go to chat
    await page.goto('/chat')

    // Ask for meal suggestions
    await page.fill('textarea', 'Suggest dinner ideas')
    await page.press('textarea', 'Enter')

    // Wait for response
    await page.waitForSelector('[data-block-type="shop"]', { timeout: 15000 })

    // Response should not include meat products
    const responseText = await page.locator('[data-block-type="shop"]').textContent()
    expect(responseText?.toLowerCase()).not.toContain('chicken')
    expect(responseText?.toLowerCase()).not.toContain('beef')
    expect(responseText?.toLowerCase()).not.toContain('pork')
  })

  test('should avoid allergens in suggestions', async ({ page }) => {
    // Set allergy
    await page.goto('/profile')
    await page.click('button:has-text("Add Allergy")')
    await page.click('button:has-text("Peanuts")')
    await page.click('button:has-text("Save")')

    // Go to chat
    await page.goto('/chat')

    // Ask for snack ideas
    await page.fill('textarea', 'Healthy snacks')
    await page.press('textarea', 'Enter')

    await page.waitForSelector('[data-block-type="shop"]', { timeout: 15000 })

    // Response should not include peanut products
    const responseText = await page.locator('[data-block-type="shop"]').textContent()
    expect(responseText?.toLowerCase()).not.toContain('peanut')
  })

  test('should navigate to order history', async ({ page }) => {
    await page.goto('/chat')

    // Click history link
    await page.click('a[href="/history"]')

    // Should show order history
    await expect(page).toHaveURL(/\/history/)
    await expect(page.locator('h1:has-text("Order History")')).toBeVisible()
  })

  test('should display past orders', async ({ page }) => {
    await page.goto('/history')

    // Should show orders or empty state
    const hasOrders = await page.locator('[data-testid="order-card"]').count() > 0
    const hasEmptyState = await page.locator('text=No orders yet').isVisible()

    expect(hasOrders || hasEmptyState).toBeTruthy()
  })

  test('should show replenishment suggestions on welcome screen', async ({ page }) => {
    await page.goto('/chat')

    // Check welcome screen for replenishment chips
    const replenishmentChips = page.locator('[data-testid="replenishment-chip"]')

    if ((await replenishmentChips.count()) > 0) {
      // Click first suggestion
      await replenishmentChips.first().click()

      // Should trigger shopping query
      await page.waitForSelector('[data-block-type="shop"]', { timeout: 10000 })
    }
  })
})
