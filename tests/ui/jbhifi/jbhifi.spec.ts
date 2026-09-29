import { test } from '@playwright/test';
import { HomePageUI, CategoryPageUI, SearchPageUI } from '../../../src/utils/uiTestData';
import {
  navigateToHomepage,
  verifyHeaderElements,
  navigateToProductsMenuAndSelectCategory,
  navigateToSubCategory,
  searchForProduct,
  verifySearchResults,
} from './jbhifi.page';

test.describe('JB Hi-Fi - navigation and search', () => {
  test('Home page shows the key navigation elements', async ({ page }) => {
    await test.step('Navigate to JB Hi-Fi home page', async () => {
      await navigateToHomepage(page);
    });

    await test.step('Verify header elements', async () => {
      await verifyHeaderElements(
        page,
        HomePageUI.productMenu,
        HomePageUI.trackOrderButton,
        HomePageUI.storesButton,
      );
    });
  });

  test('Menu navigation: Products > TVs & Home Theatre > landing page and sub-category', async ({
    page,
  }) => {
    await test.step('Navigate to JB Hi-Fi home page', async () => {
      await navigateToHomepage(page);
    });

    await test.step('Open Products menu and select TVs & Home Theatre', async () => {
      await navigateToProductsMenuAndSelectCategory(
        page,
        HomePageUI.productMenu,
        CategoryPageUI.categoryTitle,
      );
    });

    await test.step('Select TVs by screen size > 40-44 Inch TVs', async () => {
      await navigateToSubCategory(
        page,
        CategoryPageUI.subCategoryTitle,
        CategoryPageUI.subCategoryType,
      );
    });
  });

  test('Search shows results that contain the search term', async ({ page }) => {
    await test.step('Navigate to JB Hi-Fi home page', async () => {
      await navigateToHomepage(page);
    });

    await test.step('Search for a product', async () => {
      await searchForProduct(page, SearchPageUI.searchTerm);
    });
    await test.step('Verify search results', async () => {
      await verifySearchResults(page, SearchPageUI.searchTerm);
    });
  });
});
