// Playwright E2E Test Suite for Xeooo Pizza & Pasta
// Run with: npx playwright test

import { test, expect } from '@playwright/test';

test.describe('Customer Booking & Ordering Flow', () => {
  test('should display home page with branding and navigate tabs', async ({ page }) => {
    await page.goto('/');

    // Check brand header
    await expect(page.locator('text=Xéooo Pizza & Pasta')).toBeVisible();

    // Check booking tab presence
    await expect(page.locator('text=Đặt Bàn Trực Tuyến')).toBeVisible();

    // Open QR menu
    await page.click('text=Thực Đơn QR');
    await expect(page.locator('text=Khám Phá Hương Vị Ý Thượng Hạng')).toBeVisible();
  });

  test('should open command palette with Ctrl+K shortcut', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('Control+KeyK');
    await expect(page.locator('placeholder*="Tìm kiếm trang, mã đặt bàn"')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('placeholder*="Tìm kiếm trang, mã đặt bàn"')).not.toBeVisible();
  });
});
