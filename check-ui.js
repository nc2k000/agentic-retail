const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}\n${error.stack}`);
  });

  console.log('🔍 Loading page...');
  await page.goto('http://localhost:3001/chat', { waitUntil: 'networkidle', timeout: 30000 });

  await page.waitForTimeout(3000);

  console.log('\n📊 Results:');
  console.log('==========');

  if (errors.length > 0) {
    console.log(`\n❌ Found ${errors.length} errors:`);
    errors.forEach((err, i) => {
      console.log(`\n${i + 1}. ${err}`);
    });
  } else {
    console.log('\n✅ No console errors!');
  }

  // Check if elements are visible and clickable
  console.log('\n🔍 Checking UI elements:');

  try {
    const buttons = await page.locator('button').count();
    console.log(`  • Found ${buttons} buttons`);

    if (buttons > 0) {
      const firstButton = page.locator('button').first();
      const isVisible = await firstButton.isVisible();
      const isEnabled = await firstButton.isEnabled();
      const text = await firstButton.textContent();
      console.log(`  • First button: "${text?.trim()}" - Visible: ${isVisible}, Enabled: ${isEnabled}`);
    }
  } catch (e) {
    console.log(`  • ❌ Error checking buttons: ${e.message}`);
  }

  // Take a screenshot
  await page.screenshot({ path: '/tmp/screenshot.png', fullPage: true });
  console.log('\n📸 Screenshot saved to /tmp/screenshot.png');

  console.log('\n✅ Check complete! Keeping browser open for 10 seconds...');
  await page.waitForTimeout(10000);

  await browser.close();
})().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
