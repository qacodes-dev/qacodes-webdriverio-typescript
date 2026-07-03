import { $, $$ } from '@wdio/globals';
import type { ChainablePromiseElement, ChainablePromiseArray } from 'webdriverio';
import Page from './page.js';

/** Sort options exposed by the product-listing dropdown (option `value`s). */
export type SortOption = 'az' | 'za' | 'lohi' | 'hilo';

/**
 * Products / inventory page (`/inventory.html`). Owns the sort dropdown, the
 * product grid `$$` getters, and add-to-cart / open-cart actions. No assertions.
 */
class ProductsPage extends Page {
  public get title(): ChainablePromiseElement {
    return $('.title');
  }

  public get sortDropdown(): ChainablePromiseElement {
    return $('[data-test="product-sort-container"]');
  }

  public get cartLink(): ChainablePromiseElement {
    return $('.shopping_cart_link');
  }

  public get cartBadge(): ChainablePromiseElement {
    return $('.shopping_cart_badge');
  }

  /** Every product card in the grid. */
  public get inventoryItems(): ChainablePromiseArray {
    return $$('.inventory_item');
  }

  /** The visible name label of every product, in listing order. */
  public get itemNames(): ChainablePromiseArray {
    return $$('.inventory_item_name');
  }

  /** The visible price label of every product, in listing order. */
  public get itemPrices(): ChainablePromiseArray {
    return $$('.inventory_item_price');
  }

  /** Wait until the listing has rendered. */
  public async waitForLoaded(): Promise<void> {
    await this.title.waitForDisplayed();
  }

  /** Choose a sort order from the dropdown. */
  public async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.waitForDisplayed();
    await this.sortDropdown.selectByAttribute('value', option);
  }

  /** The product names as plain strings, in the order they appear. */
  public async getItemNames(): Promise<string[]> {
    return this.itemNames.map((el) => el.getText());
  }

  /** The product prices as numbers (dollar sign stripped), in listing order. */
  public async getItemPrices(): Promise<number[]> {
    const raw = await this.itemPrices.map((el) => el.getText());
    return raw.map((price) => Number(price.replace('$', '')));
  }

  /**
   * Add a single product to the cart by its visible name. Scopes the click to
   * that product's card so the correct button is pressed.
   */
  public async addToCart(productName: string): Promise<void> {
    const id = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const button = $(`[data-test="add-to-cart-${id}"]`);
    await button.waitForClickable();
    await button.click();
  }

  /** Open the cart page. */
  public async openCart(): Promise<void> {
    await this.cartLink.waitForClickable();
    await this.cartLink.click();
  }
}

export default new ProductsPage();
