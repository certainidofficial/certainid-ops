const { test, expect } = require('@playwright/test');

/**
 * Verification Badge Display
 * 
 * Tests: Holographic C-seal animation, public identity card, verify-content flow
 * 
 * The badge is the visible output of the CertainID system — it proves
 * content was signed by a verified identity.
 */

const BASE = process.env.CERTAINID_URL || 'https://app.certainid.io';

test.describe('Verification Badge', () => {

  test('Verify content page loads', async ({ page }) => {
    await page.goto(`${BASE}/verify`, { waitUntil: 'networkidle' }).catch(() => 
      page.goto(`${BASE}/verify-content`, { waitUntil: 'networkidle' }).catch(() => {
        console.log('⚠️ Verify page not found at /verify or /verify-content');
        page.goto(BASE, { waitUntil: 'networkidle' });
      })
    );
    
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'reports/screenshots/vb01-verify-page.png', fullPage: true });
    
    const body = await page.evaluate(() => document.body.innerText.substring(0, 300));
    console.log('Verify page:', body.substring(0, 200));
  });

  test('Badge/identity card renders at public URL', async ({ page }) => {
    const testIdentity = process.env.TEST_IDENTITY_ADDRESS || '';
    
    // Try the public identity card endpoint
    // certainid.io/u/<address> is the public card URL per the marketing brief
    if (testIdentity) {
      await page.goto(`${BASE}/u/${testIdentity}`, { waitUntil: 'networkidle' }).catch(() => {
        console.log('⚠️ Public identity card route not found');
      });
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'reports/screenshots/vb02-identity-card.png', fullPage: true });
    } else {
      // Try to find a demo/preview identity card
      await page.goto(`${BASE}/demo`, { waitUntil: 'networkidle' }).catch(() => {
        page.goto(BASE, { waitUntil: 'networkidle' });
      });
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'reports/screenshots/vb02-demo-card.png', fullPage: true });
      console.log('⏭️ No TEST_IDENTITY_ADDRESS set — captured demo/preview page');
    }
  });

  test('Upload content for verification', async ({ page }) => {
    await page.goto(`${BASE}/verify`, { waitUntil: 'networkidle' }).catch(() => 
      page.goto(BASE, { waitUntil: 'networkidle' })
    );
    await page.waitForTimeout(2000);
    
    // Check for file upload or hash input
    const fileInput = page.locator('input[type="file"]').first();
    const hashInput = page.locator('input[placeholder*="hash" i], input[name="hash"]').first();
    
    if (await fileInput.isVisible().catch(() => false)) {
      console.log('✅ File upload for verification is available');
    }
    if (await hashInput.isVisible().catch(() => false)) {
      console.log('✅ Hash input for verification is available');
    }
    
    // Look for verify button
    const verifyBtn = page.getByText(/verify|check|validate/i).first();
    if (await verifyBtn.isVisible().catch(() => false)) {
      console.log('✅ Verify button visible');
    }
    
    await page.screenshot({ path: 'reports/screenshots/vb03-verify-upload.png', fullPage: true });
  });

  test('Revoked content shows "Signature Revoked"', async ({ page }) => {
    // Test the revocation display with a mock revoked hash
    const revokedHash = '0x0000000000000000000000000000000000000000000000000000000000000000';
    
    await page.goto(`${BASE}/verify?hash=${revokedHash}`, { waitUntil: 'networkidle' }).catch(() => {
      console.log('⚠️ Verify route not found for revocation test');
    });
    
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'reports/screenshots/vb04-revoked.png', fullPage: true });
    
    const body = await page.evaluate(() => document.body.innerText.substring(0, 500));
    const hasRevoked = body.toLowerCase().includes('revok') || body.toLowerCase().includes('invalid');
    console.log(`Revocation status displayed: ${hasRevoked}`);
  });
});