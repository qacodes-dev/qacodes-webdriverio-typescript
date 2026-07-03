import { browser, expect } from '@wdio/globals';
import LoginPage from '../pageobjects/login.page.js';
import ProductsPage from '../pageobjects/products.page.js';
import { standardUser, lockedOutUser, invalidUser } from '../data/users.js';

/**
 * Login journeys: the happy path plus the two failure paths (bad credentials
 * and a server-side locked-out account). Each test opens a fresh login screen
 * in `beforeEach`, so order never matters.
 */
describe('Login', () => {
  beforeEach(async () => {
    await LoginPage.open();
  });

  it('logs a standard user in and lands on the products page', async () => {
    await LoginPage.login(standardUser);

    await ProductsPage.waitForLoaded();
    await expect(ProductsPage.title).toHaveText('Products');
    await expect(browser).toHaveUrl(expect.stringContaining('/inventory.html'));
  });

  it('rejects invalid credentials with an error message', async () => {
    await LoginPage.login(invalidUser);

    await expect(LoginPage.errorMessage).toBeDisplayed();
    await expect(LoginPage.errorMessage).toHaveText(
      expect.stringContaining('Username and password do not match'),
    );
  });

  it('blocks a locked-out user from signing in', async () => {
    await LoginPage.login(lockedOutUser);

    await expect(LoginPage.errorMessage).toBeDisplayed();
    await expect(LoginPage.errorMessage).toHaveText(
      expect.stringContaining('Sorry, this user has been locked out'),
    );
  });
});
