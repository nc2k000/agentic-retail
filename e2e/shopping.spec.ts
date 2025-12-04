import { test, expect } from './fixtures/auth'

/**
 * E2E Test: Complete Shopping Journey
 * Tests cart operations, bulk deals, checkout flow
 */
test.describe('Shopping Journey', () => {
  test.beforeEach(async ({ authenticatedPage: page }) => {
    // User is authenticated, navigate to chat (skip onboarding for these tests)
    await page.goto('/chat')
  })

  test('should add items to cart through chat', async ({ authenticatedPage: page }) => {
    // Type a shopping query
    await page.fill('textarea[placeholder*="message"]', 'I need milk and eggs')
    await page.click('button[type="submit"]')

    // Wait for AI response with shop block
    await page.waitForSelector('[data-block-type="shop"]', { timeout: 10000 })

    // Click "Add to Cart" on first item
    await page.click('button:has-text("Add to Cart"):first')

    // Cart should update
    await expect(page.locator('[data-cart-count]')).toContainText('1')

    // Open cart sidebar
    await page.click('button:has-text("Cart")')

    // Verify item in cart
    await expect(page.locator('[data-testid="cart-sidebar"]')).toBeVisible()
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1)
  })

  test('should edit item quantities in cart', async ({ authenticatedPage: page }) => {
    // Add item to cart first
    await page.fill('textarea', 'Get me bread')
    await page.press('textarea', 'Enter')

    await page.waitForSelector('[data-block-type="shop"]', { timeout: 10000 })
    await page.click('button:has-text("Add to Cart"):first')

    // Open cart
    await page.click('button:has-text("Cart")')

    // Increase quantity
    await page.click('[data-testid="increase-quantity"]')

    // Verify quantity updated
    await expect(page.locator('[data-testid="item-quantity"]')).toContainText('2')

    // Verify total updated
    const originalTotal = await page.locator('[data-testid="cart-total"]').textContent()

    await page.click('[data-testid="increase-quantity"]')

    const newTotal = await page.locator('[data-testid="cart-total"]').textContent()
    expect(newTotal).not.toBe(originalTotal)
  })

  test('should remove items from cart', async ({ authenticatedPage: page }) => {
    // Add item
    await page.fill('textarea', 'I need cheese')
    await page.press('textarea', 'Enter')

    await page.waitForSelector('[data-block-type="shop"]')
    await page.click('button:has-text("Add to Cart"):first')

    // Open cart
    await page.click('button:has-text("Cart")')

    // Remove item
    await page.click('[data-testid="remove-item"]')

    // Cart should be empty
    await expect(page.locator('text=Your cart is empty')).toBeVisible()
    await expect(page.locator('[data-cart-count]')).toContainText('0')
  })

  test('should show bulk deal opportunities', async ({ authenticatedPage: page }) => {
    // Add item with bulk deal
    await page.fill('textarea', 'Add yogurt')
    await page.press('textarea', 'Enter')

    await page.waitForSelector('[data-block-type="shop"]')
    await page.click('button:has-text("Add to Cart"):first')

    // Check for bulk deal block
    const bulkDealVisible = await page.locator('[data-block-type="bulkdeal"]').isVisible()

    if (bulkDealVisible) {
      // Verify bulk deal details
      await expect(page.locator('[data-block-type="bulkdeal"]')).toContainText('save')

      // Click to add bulk quantity
      await page.click('button:has-text("Add") >> nth=1')

      // Verify quantity updated in cart
      await page.click('button:has-text("Cart")')
      await expect(page.locator('[data-testid="item-quantity"]')).not.toContainText('1')
    }
  })

  test('should complete checkout flow', async ({ authenticatedPage: page }) => {
    // Add items to cart
    await page.fill('textarea', 'Weekly groceries')
    await page.press('textarea', 'Enter')

    await page.waitForSelector('[data-block-type="shop"]', { timeout: 10000 })

    // Add multiple items
    const addButtons = await page.locator('button:has-text("Add to Cart")').all()
    for (let i = 0; i < Math.min(3, addButtons.length); i++) {
      await addButtons[i].click()
      await page.waitForTimeout(500)
    }

    // Open cart
    await page.click('button:has-text("Cart")')

    // Click checkout
    await page.click('button:has-text("Checkout")')

    // Should navigate to checkout page or show confirmation
    await expect(page).toHaveURL(/\/checkout|\/order/)

    // Verify order details shown
    await expect(page.locator('text=Order')).toBeVisible()
  })

  test('should show savings from swaps', async ({ authenticatedPage: page }) => {
    // Request items that might have cheaper alternatives
    await page.fill('textarea', 'I need pasta sauce')
    await page.press('textarea', 'Enter')

    await page.waitForSelector('[data-block-type="shop"]')

    // Check if savings block appears
    const savingsVisible = await page.locator('[data-block-type="savings"]').isVisible()

    if (savingsVisible) {
      // Verify savings amount
      await expect(page.locator('[data-block-type="savings"]')).toContainText('$')

      // Accept swap
      await page.click('button:has-text("Swap"):first')

      // Verify item swapped in cart
      await page.click('button:has-text("Cart")')
      await expect(page.locator('[data-testid="cart-sidebar"]')).toBeVisible()
    }
  })

  test('should preserve cart across page navigation', async ({ authenticatedPage: page }) => {
    // Add item
    await page.fill('textarea', 'Add coffee')
    await page.press('textarea', 'Enter')

    await page.waitForSelector('[data-block-type="shop"]')
    await page.click('button:has-text("Add to Cart"):first')

    // Navigate to different page
    await page.goto('/profile')

    // Navigate back
    await page.goto('/chat')

    // Cart should still have item
    await expect(page.locator('[data-cart-count]')).toContainText('1')
  })

  test('should clear entire cart', async ({ authenticatedPage: page }) => {
    // Add multiple items
    await page.fill('textarea', 'I need bread, milk, and eggs')
    await page.press('textarea', 'Enter')

    await page.waitForSelector('[data-block-type="shop"]')

    const addButtons = await page.locator('button:has-text("Add to Cart")').all()
    for (const btn of addButtons.slice(0, 3)) {
      await btn.click()
      await page.waitForTimeout(300)
    }

    // Open cart
    await page.click('button:has-text("Cart")')

    // Clear cart
    await page.click('button:has-text("Clear Cart")')

    // Confirm if modal appears
    const confirmButton = page.locator('button:has-text("Confirm")')
    if (await confirmButton.isVisible()) {
      await confirmButton.click()
    }

    // Cart should be empty
    await expect(page.locator('text=Your cart is empty')).toBeVisible()
  })
})
