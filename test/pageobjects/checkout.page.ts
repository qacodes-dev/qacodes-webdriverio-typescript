import { $ } from '@wdio/globals';
import type { ChainablePromiseElement } from 'webdriverio';
import Page from './page.js';

/** Shipping details entered on the checkout information step. */
export interface ShippingInfo {
  firstName: string;
  lastName: string;
  postalCode: string;
}

/**
 * Multi-step checkout: cart → information (address) → overview → confirmation.
 * Owns the `$` getters and single-intent actions for each step. No assertions.
 */
class CheckoutPage extends Page {
  // --- Cart step -----------------------------------------------------------
  public get cartItems(): ReturnType<typeof $> {
    return $('.cart_item');
  }

  public get checkoutButton(): ChainablePromiseElement {
    return $('[data-test="checkout"]');
  }

  // --- Information (address) step ------------------------------------------
  public get inputFirstName(): ChainablePromiseElement {
    return $('[data-test="firstName"]');
  }

  public get inputLastName(): ChainablePromiseElement {
    return $('[data-test="lastName"]');
  }

  public get inputPostalCode(): ChainablePromiseElement {
    return $('[data-test="postalCode"]');
  }

  public get continueButton(): ChainablePromiseElement {
    return $('[data-test="continue"]');
  }

  // --- Overview step -------------------------------------------------------
  public get summaryTotal(): ChainablePromiseElement {
    return $('.summary_total_label');
  }

  public get finishButton(): ChainablePromiseElement {
    return $('[data-test="finish"]');
  }

  // --- Confirmation step ---------------------------------------------------
  public get confirmationHeader(): ChainablePromiseElement {
    return $('.complete-header');
  }

  /** Move from the cart into the information step. */
  public async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.waitForClickable();
    await this.checkoutButton.click();
  }

  /** Fill the shipping form and advance to the overview step. */
  public async fillShippingInfo(info: ShippingInfo): Promise<void> {
    await this.inputFirstName.waitForDisplayed();
    await this.inputFirstName.setValue(info.firstName);
    await this.inputLastName.setValue(info.lastName);
    await this.inputPostalCode.setValue(info.postalCode);
    await this.continueButton.waitForClickable();
    await this.continueButton.click();
  }

  /** Confirm the order from the overview step. */
  public async finishOrder(): Promise<void> {
    await this.finishButton.waitForClickable();
    await this.finishButton.click();
  }

  /** The total shown on the overview step, e.g. "Total: $32.39". */
  public async getSummaryTotal(): Promise<string> {
    await this.summaryTotal.waitForDisplayed();
    return this.summaryTotal.getText();
  }

  /** The confirmation banner text, e.g. "Thank you for your order!". */
  public async getConfirmationText(): Promise<string> {
    await this.confirmationHeader.waitForDisplayed();
    return this.confirmationHeader.getText();
  }
}

export default new CheckoutPage();
