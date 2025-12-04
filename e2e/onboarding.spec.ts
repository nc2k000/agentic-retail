import { test, expect } from '@playwright/test'

/**
 * E2E Test: Complete Onboarding Flow (FTUX)
 * Tests the entire first-time user experience from landing to completion
 */
test.describe('Onboarding Journey', () => {
  test('should complete full onboarding flow as new user', async ({ page }) => {
    // Navigate to app
    await page.goto('/')

    // Should redirect to onboarding if no profile
    await expect(page).toHaveURL(/\/onboarding/)

    // Step 1: Welcome screen
    await expect(page.locator('h1')).toContainText('Welcome')
    await page.click('button:has-text("Get Started")')

    // Step 2: Name input
    await expect(page.locator('h2')).toContainText('name')
    await page.fill('input[type="text"]', 'John Doe')
    await page.click('button:has-text("Continue")')

    // Step 3: Household size
    await expect(page.locator('h2')).toContainText('household')
    await page.fill('input[type="number"]', '4')
    await page.click('button:has-text("Continue")')

    // Step 4: Household members
    await expect(page.locator('h2')).toContainText('members')

    // Add first member
    await page.fill('input[placeholder*="Name"]', 'Sarah')
    await page.fill('input[placeholder*="Age"]', '8')
    await page.click('button:has-text("Add Member")')

    // Verify member was added
    await expect(page.locator('text=Sarah')).toBeVisible()
    await page.click('button:has-text("Continue")')

    // Step 5: Pets
    await expect(page.locator('h2')).toContainText('pets')
    await page.click('button[value="dog"]')
    await page.fill('input[placeholder*="pet"]', 'Max')
    await page.click('button:has-text("Continue")')

    // Step 6: Dietary preferences
    await expect(page.locator('h2')).toContainText('Dietary')
    await page.click('button:has-text("Vegetarian")')
    await page.click('button:has-text("Continue")')

    // Step 7: Allergies
    await expect(page.locator('h2')).toContainText('allergies')
    await page.click('button:has-text("Peanuts")')
    await page.click('button:has-text("Continue")')

    // Step 8: Brand preferences
    await expect(page.locator('h2')).toContainText('brand')
    await page.click('button:has-text("Skip")')

    // Should complete and redirect to chat
    await expect(page).toHaveURL(/\/chat/)
    await expect(page.locator('text=Welcome, John')).toBeVisible()
  })

  test('should allow skipping optional steps', async ({ page }) => {
    await page.goto('/onboarding')

    // Welcome
    await page.click('button:has-text("Get Started")')

    // Name
    await page.fill('input[type="text"]', 'Jane Smith')
    await page.click('button:has-text("Continue")')

    // Household size
    await page.fill('input[type="number"]', '1')
    await page.click('button:has-text("Continue")')

    // Skip members
    await page.click('button:has-text("Skip")')

    // Skip pets
    await page.click('button:has-text("Skip")')

    // Skip dietary
    await page.click('button:has-text("Skip")')

    // Skip allergies
    await page.click('button:has-text("Skip")')

    // Skip brands
    await page.click('button:has-text("Skip")')

    // Should still complete
    await expect(page).toHaveURL(/\/chat/)
  })

  test('should validate required fields', async ({ page }) => {
    await page.goto('/onboarding')

    await page.click('button:has-text("Get Started")')

    // Try to continue without name
    await page.click('button:has-text("Continue")')

    // Should show error or stay on same page
    await expect(page.locator('h2')).toContainText('name')
  })

  test('should save progress and allow navigation back', async ({ page }) => {
    await page.goto('/onboarding')

    await page.click('button:has-text("Get Started")')
    await page.fill('input[type="text"]', 'Test User')
    await page.click('button:has-text("Continue")')

    // Go back
    await page.click('button:has-text("Back")')

    // Name should still be filled
    await expect(page.locator('input[type="text"]')).toHaveValue('Test User')
  })
})
