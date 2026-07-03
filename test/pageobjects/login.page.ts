import { $ } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';
import Page from './page.js';
import type { TestUser } from '../data/users.js';

/**
 * Login page (`/`). Owns the credential `$` getters and a single `login()`
 * action. It performs no assertions — specs decide what a successful or failed
 * login should look like.
 */
class LoginPage extends Page {
  public get inputUsername(): ChainablePromiseElement {
    return $('#user-name');
  }

  public get inputPassword(): ChainablePromiseElement {
    return $('#password');
  }

  public get btnSubmit(): ChainablePromiseElement {
    return $('#login-button');
  }

  /** Red error banner shown for invalid or locked-out credentials. */
  public get errorMessage(): ChainablePromiseElement {
    return $('[data-test="error"]');
  }

  /**
   * Fill the credentials and submit. Waits explicitly for the form to be
   * interactable rather than pausing.
   */
  public async login(user: TestUser): Promise<void> {
    await this.inputUsername.waitForDisplayed();
    await this.inputUsername.setValue(user.username);
    await this.inputPassword.setValue(user.password);
    await this.btnSubmit.waitForClickable();
    await this.btnSubmit.click();
  }

  /** Navigate to the login screen (the app root). */
  public async open(): Promise<void> {
    await super.open('');
  }
}

export default new LoginPage();
