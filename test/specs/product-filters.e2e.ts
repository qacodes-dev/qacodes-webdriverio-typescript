import { expect } from '@wdio/globals';
import LoginPage from '../pageobjects/login.page.js';
import ProductsPage from '../pageobjects/products.page.js';
import { standardUser } from '../data/users.js';
import { PRODUCTS_AZ } from '../data/products.js';

/**
 * Sort behaviour on the product listing. Each test logs in fresh in `before`
 * and the listing is stateless, so the tests are independent and can run in
 * any order or in parallel.
 */
describe('Product sorting and filtering', () => {
  before(async () => {
    await LoginPage.open();
    await LoginPage.login(standardUser);
    await ProductsPage.waitForLoaded();
  });

  it('shows the full catalogue in default A→Z order', async () => {
    const names = await ProductsPage.getItemNames();

    expect(names).toHaveLength(PRODUCTS_AZ.length);
    expect(names).toEqual(PRODUCTS_AZ);
  });

  it('sorts products by name Z→A', async () => {
    await ProductsPage.sortBy('za');

    const names = await ProductsPage.getItemNames();
    expect(names).toEqual([...PRODUCTS_AZ].reverse());
  });

  it('sorts products by price low→high', async () => {
    await ProductsPage.sortBy('lohi');

    const prices = await ProductsPage.getItemPrices();
    const ascending = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(ascending);
  });

  it('sorts products by price high→low', async () => {
    await ProductsPage.sortBy('hilo');

    const prices = await ProductsPage.getItemPrices();
    const descending = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(descending);
  });
});
