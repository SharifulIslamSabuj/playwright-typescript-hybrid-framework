import { expect, Locator, Page } from '@playwright/test';

export async function assertVisible(locator: Locator): Promise<void> {
  await expect(locator).toBeVisible();
}

export async function assertTextContains(locator: Locator, expectedText: string): Promise<void> {
  await expect(locator).toContainText(expectedText);
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function assertUrlContains(page: Page, expectedFragment: string): Promise<void> {
  await expect(page).toHaveURL(new RegExp(escapeRegExp(expectedFragment)));
}
