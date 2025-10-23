import { Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitLoginButton: Locator;

  constructor (page: Page) {
    this.page = page;
    this.usernameInput = page.locator('input[placeholder="Enter your email..."]')
    this.passwordInput = page.locator('input[placeholder="Enter your password..."]')
    this.submitLoginButton = page.locator('button[aria-describedby="agreement-footnote"]')
  }

  async login (username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitLoginButton.click();
  }
}
