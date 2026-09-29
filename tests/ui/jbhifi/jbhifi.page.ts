import { expect, Page } from '@playwright/test';
import { dismissMarketingPopups } from '../../../src/utils/popups';

const jbHifiLocators = {
  Buttons: {
    searchButton: 'Start Search',
    logo: 'header-jb-logo',
    cartButton: 'minicart-toggle',
    loginButton: 'header-account',
  },
  productCard: 'product-card-content',
};
const pageTitle = /JB Hi-Fi/;

export const navigateToHomepage = async (page: Page) => {
  // await dismissMarketingPopups(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page).toHaveTitle(pageTitle);
};

export const verifyHeaderElements = async (
  page: Page,
  product: string,
  trackOrder: string,
  stores: string,
) => {
  const { logo, cartButton, loginButton } = jbHifiLocators.Buttons;

  for (const testId of [logo, cartButton, loginButton]) {
    await expect.soft(page.getByTestId(testId), `${testId} should be visible`).toBeVisible();
  }
  for (const name of [product, trackOrder, stores]) {
    await expect
      .soft(page.getByRole('button', { name }), `${name} should be visible`)
      .toBeVisible();
  }
};

export const navigateToProductsMenuAndSelectCategory = async (
  page: Page,
  product: string,
  category: string,
) => {
  const productsButton = page.getByRole('button', { name: product });
  const categoryItem = page.getByRole('menuitem', { name: category });

  // Retry the click until the category actually shows up, because JB Hi-Fi's menu is slow to load and sometimes fails to respond to the first click.
  await expect(async () => {
    await productsButton.click();
    await expect(categoryItem).toBeVisible({ timeout: 2_000 });
  }).toPass({ timeout: 30_000 });

  await categoryItem.click();
};

export const navigateToSubCategory = async (
  page: Page,
  subCategory: string,
  subCategoryType: string,
) => {
  const subCategoryItem = page.getByRole('menuitem', { name: subCategory });
  const subCategoryTypeItem = page.getByRole('menuitem', { name: subCategoryType });

  await expect(async () => {
    await subCategoryItem.click();
    await expect(subCategoryTypeItem).toBeVisible({ timeout: 2_000 });
  }).toPass({ timeout: 30_000 });

  await subCategoryTypeItem.click();

  await expect(page.getByRole('heading', { name: subCategoryType })).toBeVisible({
    timeout: 30_000,
  });
};

export const searchForProduct = async (page: Page, searchTerm: string) => {
  const searchBox = page.getByPlaceholder(/search products/i);
  const searchButton = page.getByRole('button', { name: jbHifiLocators.Buttons.searchButton });

  await expect(async () => {
    await searchBox.fill(searchTerm);
    await searchButton.click();
    await expect(page).toHaveURL(/\/search\?query=/, { timeout: 3_000 });
  }).toPass({ timeout: 30_000 });
};

export const verifySearchResults = async (page: Page, searchTerm: string) => {
  await expect(page.getByRole('heading', { name: `results for "${searchTerm}"` })).toBeVisible();

  // A card's title won't necessarily contain the search term as one exact phrase,
  // so require each word to appear somewhere, in any order.
  const productCards = page.getByTestId(jbHifiLocators.productCard);
  await expect(productCards.first()).toBeVisible();

  const matchingCards = searchTerm
    .split(/\s+/)
    .reduce((cards, word) => cards.filter({ hasText: word }), productCards);
  await expect(matchingCards.first()).toBeVisible();
};
