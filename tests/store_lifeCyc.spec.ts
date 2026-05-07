import { test, expect } from '@playwright/test';

test('full store lifecycle: login, create store, edit store, add product, edit product', async ({ page }) => {
    // 1. Authorization phase
    await page.goto('http://localhost:5173/'); 
    await page.fill('input[name="email"]', 'test@gmail.com');
    await page.fill('input[name="password"]', '000000');
    await page.click('.form > button');

    // 2. Navigation to Partnership tab
    const partnershipTab = page.locator('text=Partnership');
    await expect(partnershipTab).toBeVisible();
    await partnershipTab.click();

    // 3. Store Initialization (No-store view)
    // Wait for loader if any, and check for "no-store-view"
    await expect(page.locator('.no-store-view h1')).toHaveText('Your business starts here');
    await page.click('text=Register your brand store');

    // 4. Store Creation
    await page.fill('input[placeholder="Store Name"]', 'Art');
    await page.fill('textarea[placeholder="Description"]', 'Best parts for your motorcycle');
    await page.fill('input[placeholder="Logo URL"]', 'https://motoart.kharkov.ua/wp-content/themes/moto/img/logo_mobile.png');
    await page.click('.btn-save'); 

    // 5. Validation of Dashboard UI
    await expect(page.locator('.store-info h1')).toContainText('Art');
    const editStoreBtn = page.locator('.btn-edit-store');
    await expect(editStoreBtn).toBeVisible();

    // 6. Editing Store Details
    await editStoreBtn.click();
    await page.fill('input[placeholder="Store Name"]', 'ArtMoto');
    await page.click('.btn-save');
    await expect(page.locator('.store-info h1')).toContainText('ArtMoto');

    // 7. Adding a New Product
    // Open ProductModal via the "+" block
    await page.click('.product-card.add-new');
    
    // Filling the form 
    await page.fill('input[placeholder="Name"]', 'Spark SP250SC-3');
    await page.fill('textarea[placeholder="Description"]', 'Стильний скремблер, ідеальний баланс комфорту, маневреності та потужності для міста та легкого бездоріжжя. Створений для яскравих пригод.');
    await page.fill('input[placeholder="Price ($)"]', '1700');
    await page.fill('input[placeholder="Image URL"]', 'https://artmoto.ua/image/cache/catalog/motocikle/dorognue/motorcycle_spark_sp250sc_3/motorcycle_spark_sp250sc_3_1-543x380.jpg');
    
    // Filling characteristics (form-right stats)
    await page.fill('input[placeholder="Displacement (CC)"]', '223');
    await page.fill('input[placeholder="Weight (kg)"]', '132');
    await page.fill('input[placeholder="Horsepower (HP)"]', '16');
    await page.fill('input[placeholder="Torque (NM)"]', '10.5');

    // Save product
    await page.click('.btn-save'); // Selector for "Save Product" button

    // 8. Verifying Product in Grid
    const productCard = page.locator('.product-card').filter({ hasText: 'Spark SP250SC-3' });
    await expect(productCard).toBeVisible();
    await expect(productCard.locator('.product-price')).toContainText('$1700');

    // 9. Editing Product
    // Use stopPropagation aware button
    await productCard.locator('.btn-edit-prod').click();
    
    // Update name to modified
    await page.fill('input[placeholder="Name"]', 'Super Engine Modified');
    await page.click('.btn-save');

    // Final check: check that grid updated instantly without full reload
    await expect(page.locator('.product-card h3')).toContainText('Super Engine Modified');
});