import { browser, expect } from '@wdio/globals';
import { resetAppState } from '../utils/session.js';
import LoginPage from '../pageobjects/login.page.js';
import ProductsPage from '../pageobjects/products.page.js';
import CheckoutPage from '../pageobjects/checkout.page.js';
import { standardUser } from '../data/users.js';
import { PRODUCTS, TAX_RATE } from '../data/products.js';
import { makeShippingInfo } from '../utils/data-factory.js';

/**
 * End-to-end checkout: add items to the cart, walk the shipping + overview
 * steps, and assert the confirmation. Logs in fresh in `beforeEach` so the
 * cart always starts empty and the test never depends on another spec.
 */
describe('Checkout', () => {
  const items = [PRODUCTS.backpack, PRODUCTS.boltTshirt];

  beforeEach(async () => {
    // The worker session is reused across tests and Sauce Demo persists the
    // cart in localStorage — clear it so every test starts with an empty cart.
    await LoginPage.open();
    await resetAppState();
    await LoginPage.login(standardUser);
    await ProductsPage.waitForLoaded();
  });

  it('add to cart updates the cart badge count', async () => {
    await ProductsPage.addToCart(PRODUCTS.backpack.name);
    await ProductsPage.addToCart(PRODUCTS.boltTshirt.name);

    await expect(ProductsPage.cartBadge).toHaveText('2');
  });

  it('completes the full checkout flow with shipping and confirmation', async () => {
    for (const item of items) {
      await ProductsPage.addToCart(item.name);
    }
    await ProductsPage.openCart();

    await CheckoutPage.proceedToCheckout();
    await CheckoutPage.fillShippingInfo(makeShippingInfo());

    // The overview total includes an 8% tax on the item subtotal.
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const expectedTotal = (subtotal * (1 + TAX_RATE)).toFixed(2);
    const total = await CheckoutPage.getSummaryTotal();
    expect(total).toContain(expectedTotal);

    await CheckoutPage.finishOrder();

    await expect(CheckoutPage.confirmationHeader).toBeDisplayed();
    const confirmation = await CheckoutPage.getConfirmationText();
    expect(confirmation).toContain('Thank you for your order');
    await expect(browser).toHaveUrl(expect.stringContaining('/checkout-complete.html'));
  });
});
