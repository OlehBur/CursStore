import { test, expect } from '@playwright/test';
import { AuthPage } from './AuthPage.ts';
import { MainStorePage } from './MainStorePage.ts';
import { PartnershipPage } from './PartnershipPage';


//page object model -test (share link in tg   )
//network layer
//state management


test('Full registration', async ({ page }) => {
    const auth = new AuthPage(page);
    const email = auth.generateUniqueEmail();

    await auth.open();

    await auth.register('Test' + email, email, 'passwordddD');

    await expect(auth.confirmationInput).toBeVisible({ timeout: 10000 });
});

test('Guest navigation check', async ({ page }) => {
    const auth = new AuthPage(page);
    const store = new MainStorePage(page);

    await auth.open();
    await auth.guestBtn.click();
    await expect(store.productsGrid).toBeVisible();

    await store.openFirstProduct();
    await expect(page).toHaveURL(store.productPageUrl);
});

test('Full store lifecycle', async ({ page }) => {
    const auth = new AuthPage(page);
    const store = new PartnershipPage(page);

    const prodName = 'Spark SP250SC';
    const prodModifiedName = 'Spark SP250SC-3';
    const prodDesc = 'Стильний скремблер, ідеальний баланс комфорту, маневреності та потужності для міста та легкого бездоріжжя. Створений для яскравих пригод.';
    const prodPrice = '1700';
    const prodImg = 'https://artmoto.ua/image/cache/catalog/motocikle/dorognue/motorcycle_spark_sp250sc_3/motorcycle_spark_sp250sc_3_1-543x380.jpg';
    const prodCC = '223';
    const prodWeight = '132';
    const prodHP = '16';
    const prodNM = '10.5';

    const storeName = 'Art';
    const storeModifiedName = 'ArtMoto';
    const storeDesc = 'Best parts for your motorcycle';
    const storeImg = 'https://motoart.kharkov.ua/wp-content/themes/moto/img/logo_mobile.png';


    await auth.open();
    await auth.login('test@gmail.com', '000000');
    await store.navigate();

    await store.createStore(storeName, storeDesc, storeImg);
    await expect(store.storeTitle).toContainText(storeName);

    await store.updateStore(storeModifiedName, storeDesc, storeImg);
    await expect(store.storeTitle).toContainText(storeModifiedName);

    await store.addNewProduct({
        name: prodName,
        desc: prodDesc,
        price: prodPrice,
        img: prodImg,
        cc: prodCC,
        weight: prodWeight,
        hp: prodHP,
        nm: prodNM
    });
    await expect(store.productCard(prodName)).toBeVisible();

    await store.editProductName(prodName, prodModifiedName);
    await expect(store.productCard(prodModifiedName)).toBeVisible();
});