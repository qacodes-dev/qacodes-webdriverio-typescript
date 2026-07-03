/**
 * Static reference data for the Sauce Demo catalogue. Keeping product names and
 * prices in typed constants keeps assertions in the specs readable and makes a
 * catalogue change a one-line edit here rather than a hunt through the specs.
 */

export const PRODUCTS = {
  backpack: { name: 'Sauce Labs Backpack', price: 29.99 },
  bikeLight: { name: 'Sauce Labs Bike Light', price: 9.99 },
  boltTshirt: { name: 'Sauce Labs Bolt T-Shirt', price: 15.99 },
  fleeceJacket: { name: 'Sauce Labs Fleece Jacket', price: 49.99 },
  onesie: { name: 'Sauce Labs Onesie', price: 7.99 },
  redTshirt: { name: 'Test.allTheThings() T-Shirt (Red)', price: 15.99 },
} as const;

/** All product names in the app's default (A→Z) listing order. */
export const PRODUCTS_AZ: string[] = [
  PRODUCTS.backpack.name,
  PRODUCTS.bikeLight.name,
  PRODUCTS.boltTshirt.name,
  PRODUCTS.fleeceJacket.name,
  PRODUCTS.onesie.name,
  PRODUCTS.redTshirt.name,
];

/** Sauce Demo applies an 8% tax; used to derive expected checkout totals. */
export const TAX_RATE = 0.08;
