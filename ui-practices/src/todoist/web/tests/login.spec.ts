import { test, expect } from '@playwright/test';
import { LandingPage } from '../page_objects/landing.page';
import { LoginPage } from '../page_objects/login.page';
import { HomePage } from '../page_objects/home.page';
import { PASSWORD, USERNAME } from '../utils/data';

test.describe('Todoist Login Cases', async () => {

  let landingPage: LandingPage;
  let loginPage: LoginPage;
  let homePage: HomePage;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
  })

  test('Happy Path', async ({ page }) => {
    await landingPage.goto();
    await landingPage.openLoginScreen();
    await loginPage.login(USERNAME, PASSWORD);
    await page.waitForLoadState('load');

    await expect(homePage.sideBar).toBeVisible();
  });
});
