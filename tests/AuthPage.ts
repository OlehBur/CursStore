import { Page, Locator } from '@playwright/test';

export class AuthPage {
    readonly page: Page;
    readonly loginTab: Locator;
    readonly registerTab: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitBtn: Locator;
    readonly guestBtn: Locator;
    readonly confirmationInput: Locator;

    constructor(page: Page) {
        this.page = page;
        // this.loginTab = page.getByRole('button', { name: 'Login' }); 
        // this.registerTab = page.getByRole('button', { name: 'Register' });
        this.loginTab = page.getByTestId('login-tab');
        this.registerTab = page.getByTestId('register-tab');
        this.emailInput = page.getByRole('textbox', { name: 'Email' });

        this.passwordInput = page.locator('input[name="password"]');
        // this.submitBtn = page.getByRole('button').filter({ hasText: /Login|Register|Confirm/ });
        this.submitBtn = page.getByTestId('auth-submit-button');
        this.guestBtn = page.getByRole('button', { name: 'Continue as Guest' });
        this.confirmationInput = page.getByTestId('confirmation-code-input');
    }

    async open() {
        await this.page.goto('http://localhost:5173/');
    }

    generateUniqueEmail() {
        return `user_${Date.now()}@test.com`;
    }

    async register(name: string, email: string, pass: string) {
        await this.registerTab.click();
        await this.page.getByPlaceholder('Name').fill(name);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(pass);
        await this.submitBtn.click();
    }

    async login(email: string, pass: string) {
        await this.loginTab.click();
        await this.emailInput.fill(email);
        await this.passwordInput.fill(pass);
        await this.submitBtn.click();
    }
}