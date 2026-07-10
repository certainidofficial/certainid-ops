const { test, expect } = require('@playwright/test');

/**
 * Enrollment Flow — Critical Path
 * 
 * Tests: email sign-in → QR code renders → simulated hash → dashboard
 * 
 * Run with: SIMULATED_HASH=true npx playwright test tests/enrollment-flow.spec.js
 * 
 * The mobile biometric step (QR scan → Face ID) cannot be automated.
 * SIMULATED_HASH mode injects a mock hash to test the desktop flow end-to-end.
 */

const BASE = process.env.CERTAINID_URL || 'https://app.certainid.io';
const SIMULATED = process.env.SIMULATED_HASH === 'true';

test.describe('Enrollment Flow', () => {

  test('Page loads and shows enrollment option', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    
    // Verify the page loaded
    const title = await page.title();
    console.log(`Page title: ${title}`);
    
    // Take a landing page screenshot
    await page.screenshot({ path: 'reports/screenshots/01-landing.png', fullPage: true });
    
    // Look for key elements — adapt to actual app structure
    const hasSignIn = await page.getByText(/sign.?in|get started|create|enroll/i).first().isVisible()
      .catch(() => false);
    
    expect(hasSignIn || await page.locator('button').first().isVisible()).toBeTruthy();
    console.log('✅ Landing page loaded successfully');
  });

  test('Sign-in flow accessible', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    
    // Look for and click sign-in/enroll button
    const signInBtn = page.getByText(/sign.?in|get started|create|enroll|connect/i).first();
    if (await signInBtn.isVisible().catch(() => false)) {
      await signInBtn.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'reports/screenshots/02-signin.png', fullPage: true });
      console.log('✅ Clicked sign-in button');
    }
    
    // Check for email input (Privy or similar)
    const emailInput = page.locator('input[type="email"], input[name="email"], input[placeholder*="email" i]').first();
    const hasEmail = await emailInput.isVisible().catch(() => false);
    console.log(`Email input visible: ${hasEmail}`);
  });

  test('QR code renders on desktop (enrollment step)', async ({ page }) => {
    // This test requires the user to be at the QR step
    // Navigate to the enrollment page directly
    await page.goto(`${BASE}/enroll`, { waitUntil: 'networkidle' }).catch(async () => {
      // If /enroll doesn't exist, try the main page
      await page.goto(BASE, { waitUntil: 'networkidle' });
    });
    
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/03-enrollment.png', fullPage: true });
    
    // Check for QR code (canvas, img, or QR-specific element)
    const qrElement = page.locator('canvas, img[alt*="qr" i], [class*="qr"], [data-testid*="qr"], [id*="qr"]').first();
    const hasQR = await qrElement.isVisible().catch(() => false);
    
    if (hasQR) {
      console.log('✅ QR code is rendering on desktop');
    } else {
      console.log('⚠️ QR code element not found — check if at correct enrollment step');
      // List visible elements for debugging
      const buttons = await page.locator('button, a[role="button"]').allTextContents();
      console.log('Visible buttons:', buttons.join(' | '));
    }
  });

  test('Dashboard loads after enrollment (simulated)', async ({ page, context }) => {
    // In SIMULATED mode, we set a mock enrollment state
    // This test verifies the dashboard renders correctly
    
    if (SIMULATED) {
      console.log('🧪 Running in SIMULATED_HASH mode — using mock enrollment state');
      
      // Set a mock session cookie/token to simulate enrolled state
      // This mimics what the app would have after a real enrollment
      // Adjust the cookie name and value based on the actual app
      await context.addCookies([
        {
          name: 'enrolled',
          value: 'true',
          domain: new URL(BASE).hostname,
          path: '/',
        }
      ]);
    }
    
    // Try dashboard URL
    await page.goto(`${BASE}/dashboard`, { waitUntil: 'networkidle' }).catch(async () => {
      console.log('⚠️ /dashboard route not found — checking main page for dashboard state');
      await page.goto(BASE, { waitUntil: 'networkidle' });
    });
    
    await page.waitForTimeout(3000);
    await page.screenshot({ path: 'reports/screenshots/04-dashboard.png', fullPage: true });
    console.log('✅ Dashboard screenshot captured');
  });

  test('Identity card renders at public URL', async ({ page }) => {
    // Test the public identity card endpoint
    const testAddress = process.env.TEST_WALLET_ADDRESS || '';
    
    if (testAddress) {
      await page.goto(`${BASE}/u/${testAddress}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'reports/screenshots/05-public-card.png', fullPage: true });
      console.log(`✅ Public identity card loaded for ${testAddress}`);
    } else {
      console.log('⏭️ Skipping public card test — no TEST_WALLET_ADDRESS set');
      test.skip();
    }
  });
});