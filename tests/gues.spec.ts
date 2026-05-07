import { test, expect } from '@playwright/test';


test('guest login and product view check', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // 1.login as guest
  await page.click('button:has-text("Continue as Guest")');
  await expect(page.locator('.popup-overlay')).not.toBeVisible();

  // 2.  eng: wait for loader to disappear 
  //  wait for the products grid to appear (this means loading is done)
  const grid = page.locator('.products-grid');
  await expect(grid).toBeVisible({ timeout: 15000 });

  // 3.  open product card 
  const firstProduct = page.locator('.product-item-card').first();
  await firstProduct.click();

  // 4. check that product page opened 
  // check that URL changed to product page path 
  await expect(page).toHaveURL(/.*product/); 

  // 5.  go back to main page
  await page.goBack();

  // 6.  try to access profile as guest (should trigger alert)
  const profileBtn = page.getByRole('button', { name: 'Profile' });
   
  // catch alerrt for guests
  page.once('dialog', async dialog => {
    expect(dialog.message()).toContain('Guests cannot access the profile');
    await dialog.accept();
  });
  
  await profileBtn.click();
});