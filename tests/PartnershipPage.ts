import { Page, Locator, expect } from '@playwright/test';

export class PartnershipPage {
    readonly page: Page;
    private readonly registerBrandBtn: Locator;
    private readonly storeHeading: Locator;
    private readonly editStoreBtn: Locator;
    private readonly addProductBtn: Locator;
    private readonly productList: Locator;

    constructor(page: Page) {
        this.page = page;

        this.registerBrandBtn = page.getByRole('button', { name: 'Register your brand store' });
        this.storeHeading = page.getByRole('heading', { level: 1 });
        this.editStoreBtn = page.getByRole('button', { name: 'Edit Details' });
        this.addProductBtn = page.getByTestId('add-product-block');     //
        this.productList = page.getByTestId('product-card');            //
    }

    async navigate() {
        await this.page.getByRole('button', { name: 'Partnership' }).click();
    }

    async createStore(name: string, desc: string, logo: string) {
        await this.registerBrandBtn.click();
        await this.fillStoreForm(name, desc, logo);
    }

    async updateStore(name: string, desc: string, logo: string) {
        await this.editStoreBtn.click();
        await this.fillStoreForm(name, desc, logo);
    }

    private async fillStoreForm(name: string, desc: string, logo: string) {
        const modal = this.page.getByTestId('modal-content-store');
        await modal.getByPlaceholder('Store Name').fill(name);
        await modal.getByPlaceholder('Description').fill(desc);
        await modal.getByPlaceholder('Logo URL').fill(logo);
        await modal.getByRole('button', { name: 'Save' }).click();
    }

    async addNewProduct(data: any) {
        await this.addProductBtn.click();
        await this.fillProductForm(data);
    }

    // async editProduct(oldName: string, newData: any) {
    async editProductName(oldName: string, newName: string) {
        const card = this.productList.filter({ hasText: oldName });
        const modal = this.page.getByTestId('modal-content-product');

        await card.getByRole('button', { name: 'Edit' }).click();
        // await this.fillProductForm(newData);
        await modal.getByPlaceholder('Name').fill(newName);
        await modal.getByRole('button', { name: 'Save Product' }).click();
    }

    private async fillProductForm(data: any) {
        const modal = this.page.getByTestId('modal-content-product');
        // if (data.name !== undefined) 
        //     await modal.getByPlaceholder('Name').fill(data.name);

        await modal.getByPlaceholder('Name').fill(data.name || '');
        await modal.getByPlaceholder('Description').fill(data.desc || '');
        await modal.getByPlaceholder('Price ($)').fill(data.price || '');
        await modal.getByPlaceholder('Image URL').fill(data.img || '');
        await modal.getByPlaceholder('CC').fill(data.cc || '');
        await modal.getByPlaceholder('Weight (kg)').fill(data.weight || '');
        await modal.getByPlaceholder('Horsepower (hp)').fill(data.hp || '');
        await modal.getByPlaceholder('Torque (nm)').fill(data.nm || '');
        await modal.getByRole('button', { name: 'Save Product' }).click();
    }

    get storeTitle() {
        return this.storeHeading;
    }

    productCard(name: string) {
        return this.productList.filter({ hasText: name });
    }
}