import { Locator, Page } from "@playwright/test";
import { navigationRoutes } from "../utils/routes";

export class LandingPage {
  readonly page: Page;
  readonly loginButton: Locator;

  constructor (page: Page) {
    this.page = page;
    this.loginButton = page.locator('li[class*="navbarItem"] a[href*="login"]')
  }

  async goto () {
    await this.page.goto(navigationRoutes.HOME)
  }

  async openLoginScreen () {
    await this.loginButton.click();
  }
}
