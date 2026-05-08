// import { test, expect } from '@playwright/test';

// test('new user registration', async ({ page }) => {
//   // 1. ok to each dialog (alert, confirm, prompt)
//   page.on('dialog', dialog => dialog.accept());

//   await page.goto('http://localhost:5173/'); 
  
//   // 2. click to "Register" tab
//   await page.click('button:has-text("Register")'); 
  
//   // 3. generate a unique email (so that we don't get the error "User already exists")
//   const uniqueEmail = `user_${Date.now()}@test.com`;
  
//   await page.fill('input[name="name"]', 'TestUser');
//   await page.fill('input[name="email"]', uniqueEmail);
//   await page.fill('input[name="password"]', 'password123');
  
//   // 4. push reg button.
//   await page.click('.form > button');

//   // 5. wait for timer
//   const timerLocator = page.locator('p.timer');
//   await expect(timerLocator).toBeVisible();
  
//   // 6. check that the code entry text is visible
//   await expect(page.locator('text=Enter the code received at')).toBeVisible();
// });
