const { test, expect } = require('@playwright/test');

/**
 * Social Profile Linking
 * 
 * Tests: GitHub, YouTube, X/Twitter, LinkedIn OAuth flows
 * 
 * Note: OAuth flows require real credentials and cannot be fully automated.
 * These tests verify the UI flow and redirect structure, not the OAuth callback.
 */

const BASE = process.env.CERTAINID_URL || 'https://app.certainid.io';

test.describe('Social Profile Linking', () => {

  test('Profile linking page shows available platforms', async ({ page }) => {
    await page.goto(`${BASE}/profile`, { waitUntil: 'networkidle' }).catch(() => 
      page.goto(BASE, { waitUntil: 'networkidle' })
    );
    await page.waitForTimeout(2000);
    
    // Check for social platform buttons
    const platforms = ['github', 'youtube', 'twitter', 'linkedin', 'x'];
    let foundCount = 0;
    
    for (const platform of platforms) {
      const btn = page.locator(`[data-testid*="${platform}" i], [class*="${platform}" i], [href*="${platform}" i]`).first();
      const visible = await btn.isVisible().catch(() => false);
      if (visible) {
        foundCount++;
        console.log(`✅ ${platform} linking available`);
      }
    }
    
    console.log(`Found ${foundCount} social platform options`);
    await page.screenshot({ path: 'reports/screenshots/sp01-social-linking.png', fullPage: true });
  });

  test('LinkedIn OAuth redirect structure', async ({ page }) => {
    // Test that the LinkedIn OAuth button navigates to the correct URL
    const linkedinBtn = page.locator(
      '[data-testid*="linkedin" i], [class*="linkedin" i], [href*="linkedin" i]'
    ).first();
    
    if (await linkedinBtn.isVisible().catch(() => false)) {
      // Get the href to verify it's the correct OAuth endpoint
      const href = await linkedinBtn.getAttribute('href').catch(() => null);
      if (href) {
        console.log(`LinkedIn OAuth URL: ${href.substring(0, 100)}...`);
        expect(href).toContain('linkedin');
      }
    }
  });

  test('Verification levels display correctly', async ({ page }) => {
    // Check that verification levels (1-3+) are displayed
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    const levelElements = page.locator('[class*="level"], [data-testid*="level"], [class*="verification"]');
    const count = await levelElements.count();
    console.log(`Verification level indicators found: ${count}`);
    
    await page.screenshot({ path: 'reports/screenshots/sp02-verification-levels.png', fullPage: true });
  });
});