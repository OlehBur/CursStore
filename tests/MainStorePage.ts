import { Page, Locator } from '@playwright/test';

export class MainStorePage {
    readonly page: Page;
    readonly productsGrid: Locator;
    readonly productCards: Locator;
    readonly productPageUrl = /.*product/;

    constructor(page: Page) {
        this.page = page;
        this.productsGrid = page.getByTestId('products-grid');
        this.productCards = page.getByTestId('product-card');
    }

    async openFirstProduct() {
        await this.productCards.first().click();
    }

    async getProfileBtn() {
        return this.page.getByRole('button', { name: 'Profile' });
    }
}