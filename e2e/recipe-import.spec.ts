import { test, expect } from '@playwright/test'

/**
 * E2E Test: Recipe Import Journey
 * Tests URL, Image, and Text recipe import flows
 */
test.describe('Recipe Import Journey', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/chat')
  })

  test('should open recipe import modal', async ({ page }) => {
    // Click floating recipe button
    await page.click('button[aria-label*="Import recipe"]')

    // Modal should open
    await expect(page.locator('text=Import Recipe')).toBeVisible()

    // Should show three tabs
    await expect(page.locator('button:has-text("URL")')).toBeVisible()
    await expect(page.locator('button:has-text("Image")')).toBeVisible()
    await expect(page.locator('button:has-text("Text")')).toBeVisible()
  })

  test('should import recipe from URL', async ({ page }) => {
    // Open modal
    await page.click('button[aria-label*="Import recipe"]')

    // URL tab should be active by default
    await page.fill('input[placeholder*="https://"]', 'https://www.allrecipes.com/recipe/12345/test-recipe/')

    // Submit
    await page.click('button:has-text("Import")')

    // Should close modal and show processing message
    await expect(page.locator('text=Import Recipe')).not.toBeVisible()

    // Wait for AI response with recipe ingredients
    await expect(page.locator('text=recipe', { timeout: 15000 })).toBeVisible()

    // Should show shop block with ingredients
    await page.waitForSelector('[data-block-type="shop"]', { timeout: 10000 })
  })

  test('should show error for social media URLs', async ({ page }) => {
    await page.click('button[aria-label*="Import recipe"]')

    // Try Instagram URL
    await page.fill('input[placeholder*="https://"]', 'https://www.instagram.com/reel/test123/')
    await page.click('button:has-text("Import")')

    // Should show error message
    await expect(page.locator('text=can\'t access', { timeout: 5000 })).toBeVisible()
  })

  test('should import recipe from text', async ({ page }) => {
    await page.click('button[aria-label*="Import recipe"]')

    // Switch to Text tab
    await page.click('button:has-text("Text")')

    // Paste recipe text
    const recipeText = `
Chocolate Chip Cookies

Ingredients:
- 2 cups flour
- 1 cup butter
- 1 cup sugar
- 2 eggs
- 1 tsp vanilla
- 2 cups chocolate chips

Instructions:
1. Mix butter and sugar
2. Add eggs and vanilla
3. Mix in flour
4. Fold in chocolate chips
5. Bake at 350°F for 12 minutes
    `

    await page.fill('textarea[placeholder*="Paste"]', recipeText)
    await page.click('button:has-text("Import")')

    // Wait for processing
    await expect(page.locator('text=Import Recipe')).not.toBeVisible()

    // Should show ingredients in shop block
    await page.waitForSelector('[data-block-type="shop"]', { timeout: 10000 })
    await expect(page.locator('text=flour')).toBeVisible()
  })

  test('should import recipe from image', async ({ page }) => {
    await page.click('button[aria-label*="Import recipe"]')

    // Switch to Image tab
    await page.click('button:has-text("Image")')

    // Set up file chooser handler
    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.click('input[type="file"]')

    const fileChooser = await fileChooserPromise

    // Create a mock image file
    const buffer = Buffer.from('mock image data')
    await fileChooser.setFiles({
      name: 'recipe.jpg',
      mimeType: 'image/jpeg',
      buffer
    })

    // Image preview should appear
    await expect(page.locator('img[alt*="Preview"]')).toBeVisible()

    // Submit
    await page.click('button:has-text("Import")')

    // Wait for AI to process (vision API)
    await page.waitForSelector('[data-block-type="shop"]', { timeout: 15000 })
  })

  test('should close modal when clicking cancel', async ({ page }) => {
    await page.click('button[aria-label*="Import recipe"]')

    await expect(page.locator('text=Import Recipe')).toBeVisible()

    // Click X or Cancel
    await page.click('button[aria-label="Close"]')

    await expect(page.locator('text=Import Recipe')).not.toBeVisible()
  })

  test('should add recipe ingredients to cart', async ({ page }) => {
    await page.click('button[aria-label*="Import recipe"]')

    await page.click('button:has-text("Text")')
    await page.fill('textarea', 'Ingredients:\n- Milk\n- Eggs\n- Butter')
    await page.click('button:has-text("Import")')

    // Wait for shop block
    await page.waitForSelector('[data-block-type="shop"]', { timeout: 10000 })

    // Add all items to cart
    await page.click('button:has-text("Add All to Cart")')

    // Verify cart updated
    await expect(page.locator('[data-cart-count]')).toContainText('3')
  })
})
