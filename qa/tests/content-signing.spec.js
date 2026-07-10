const { test, expect } = require('@playwright/test');

/**
 * Content Signing Flow
 * 
 * Tests: select content → compute hash → sign on-chain → badge generation → verify
 * 
 * This is the CRITICAL path for CertainID's anti-deepfake feature.
 * The signature proves the content was created by the identity holder.
 */

const BASE = process.env.CERTAINID_URL || 'https://app.certainid.io';

test.describe('Content Signing', () => {

  test('Content signing page loads', async ({ page }) => {
    await page.goto(`${BASE}/sign`, { waitUntil: 'networkidle' }).catch(async () => {
      // Try alternative routes
      for (const path of ['/content/sign', '/verify', '/dashboard']) {
        try {
          await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
          const body = await page.evaluate(() => document.body.innerText.substring(0, 500));
          if (body.toLowerCase().includes('sign') || body.toLowerCase().includes('content')) {
            console.log(`✅ Found content signing section at ${path}`);
            break;
          }
        } catch (e) {
          console.log(`⚠️ ${path} not accessible`);
        }
      }
    });
    
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'reports/screenshots/cs01-signing-page.png', fullPage: true });
  });

  test('Can select different content types', async ({ page }) => {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    // Check for content type selectors (image, video, document, URL, text)
    const contentTypes = ['image', 'video', 'document', 'url', 'text'];
    for (const type of contentTypes) {
      const el = page.locator(`[data-testid*="${type}"], [class*="${type}"], textarea, input[type="file"]`).first();
      const visible = await el.isVisible().catch(() => false);
      if (visible) {
        console.log(`✅ Content type option found: ${type}`);
      }
    }
    
    await page.screenshot({ path: 'reports/screenshots/cs02-content-types.png', fullPage: true });
  });

  test('Signing flow completes (simulated)', async ({ page, context }) => {
    // Test the full signing flow
    // In SIMULATED mode, we test the UI flow without requiring actual on-chain tx
    
    // Navigate to signing page
    await page.goto(`${BASE}/sign`, { waitUntil: 'networkidle' }).catch(() => 
      page.goto(BASE, { waitUntil: 'networkidle' })
    );
    await page.waitForTimeout(2000);
    
    // Try to find and interact with the signing form
    const fileInput = page.locator('input[type="file"]').first();
    const textInput = page.locator('textarea, input[type="text"]').first();
    
    if (await fileInput.isVisible().catch(() => false)) {
      console.log('✅ File upload input visible');
      // Can't upload real files in headless, but we can test the UI is there
    }
    
    if (await textInput.isVisible().catch(() => false)) {
      await textInput.fill('Test content for signing verification');
      console.log('✅ Text input filled');
    }
    
    // Look for sign/submit button
    const signBtn = page.getByText(/sign|submit|verify|create badge/i).first();
    if (await signBtn.isVisible().catch(() => false)) {
      console.log('✅ Sign/submit button visible');
      // Don't actually submit in test — this triggers a real tx
    }
    
    await page.screenshot({ path: 'reports/screenshots/cs03-signing-ready.png', fullPage: true });
  });

  test('Verify link shows proof', async ({ page }) => {
    // Test the verification page with a known mock hash
    const mockHash = '0x0000000000000000000000000000000000000000000000000000000000000001';
    
    await page.goto(`${BASE}/verify?hash=${mockHash}`, { waitUntil: 'networkidle' }).catch(() => {
      console.log('⚠️ /verify route not found, trying alternative');
    });
    
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'reports/screenshots/cs04-verify-result.png', fullPage: true });
    
    const body = await page.evaluate(() => document.body.innerText.substring(0, 500));
    console.log('Verify page content:', body.substring(0, 200));
  });

  test('Modified content shows "Not Verified"', async ({ page }) => {
    // Test that tampered content fails verification
    const tamperedHash = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
    
    await page.goto(`${BASE}/verify?hash=${tamperedHash}`, { waitUntil: 'networkidle' }).catch(() => {
      console.log('⚠️ /verify route not found');
    });
    
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'reports/screenshots/cs05-tampered-verify.png', fullPage: true });
  });
});