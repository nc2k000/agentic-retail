import { test, expect } from '@playwright/test'

test('diagnostic - check for console errors and UI interactions', async ({ page }) => {
  const consoleErrors: string[] = []
  const consoleWarnings: string[] = []

  // Capture console messages
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text())
    } else if (msg.type() === 'warning') {
      consoleWarnings.push(msg.text())
    }
  })

  // Capture page errors
  page.on('pageerror', error => {
    consoleErrors.push(`Page Error: ${error.message}`)
  })

  console.log('🔍 Starting diagnostic test...')

  // Navigate to the chat page
  console.log('📍 Navigating to /chat...')
  await page.goto('http://localhost:3001/chat', { waitUntil: 'networkidle' })

  // Wait a bit for React to hydrate
  await page.waitForTimeout(2000)

  console.log('\n📊 Test Results:')
  console.log('================')

  // Check if page loaded
  const title = await page.title()
  console.log(`✅ Page title: ${title}`)

  // Report console errors
  if (consoleErrors.length > 0) {
    console.log(`\n❌ Console Errors (${consoleErrors.length}):`)
    consoleErrors.forEach((err, i) => {
      console.log(`${i + 1}. ${err}`)
    })
  } else {
    console.log('\n✅ No console errors')
  }

  // Check for specific elements
  console.log('\n🔍 Checking UI Elements:')

  try {
    const welcomeText = await page.locator('text=/Good (morning|afternoon|evening)/').first()
    const isVisible = await welcomeText.isVisible()
    console.log(`  • Welcome message: ${isVisible ? '✅ Visible' : '❌ Not visible'}`)
  } catch (e) {
    console.log(`  • Welcome message: ❌ Not found`)
  }

  try {
    const chatInput = page.locator('textarea, input[type="text"]').first()
    const isVisible = await chatInput.isVisible()
    const isEnabled = await chatInput.isEnabled()
    console.log(`  • Chat input: ${isVisible ? '✅ Visible' : '❌ Not visible'}, ${isEnabled ? '✅ Enabled' : '❌ Disabled'}`)
  } catch (e) {
    console.log(`  • Chat input: ❌ Not found`)
  }

  // Try clicking on a button
  console.log('\n🖱️  Testing Interactions:')
  try {
    const buttons = page.locator('button')
    const buttonCount = await buttons.count()
    console.log(`  • Found ${buttonCount} buttons`)

    if (buttonCount > 0) {
      const firstButton = buttons.first()
      const buttonText = await firstButton.textContent()
      const isClickable = await firstButton.isEnabled()
      console.log(`  • First button: "${buttonText?.trim()}" - ${isClickable ? '✅ Clickable' : '❌ Not clickable'}`)

      if (isClickable) {
        console.log(`  • Attempting to click...`)
        await firstButton.click({ timeout: 5000 })
        console.log(`  • ✅ Click successful!`)
      }
    }
  } catch (e: any) {
    console.log(`  • ❌ Button interaction failed: ${e.message}`)
  }

  // Check if there's a z-index issue or overlay blocking clicks
  console.log('\n🎨 Checking for UI blocking issues:')
  const overlays = await page.locator('[style*="position: fixed"], [style*="position: absolute"]').count()
  console.log(`  • Found ${overlays} fixed/absolute positioned elements`)

  // Check for high z-index elements that might be blocking
  const highZIndex = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('*'))
    const highZ = elements.filter(el => {
      const zIndex = window.getComputedStyle(el).zIndex
      return zIndex !== 'auto' && parseInt(zIndex) > 1000
    })
    return highZ.map(el => ({
      tag: el.tagName,
      class: el.className,
      zIndex: window.getComputedStyle(el).zIndex
    }))
  })

  if (highZIndex.length > 0) {
    console.log(`  • High z-index elements:`)
    highZIndex.forEach(el => {
      console.log(`    - ${el.tag}.${el.class} (z-index: ${el.zIndex})`)
    })
  }

  console.log('\n================')
  console.log('✅ Diagnostic complete!\n')

  // Fail test if there are errors
  if (consoleErrors.length > 0) {
    throw new Error(`Found ${consoleErrors.length} console errors`)
  }
})
