import { Page, Locator } from '@playwright/test';
import { getScreenshotFilePath } from '../utils/fileUtils';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(path = '/'): Promise<void> {
    // Wait for DOM parsing only, not the full `load` event: this public site's
    // `load` event is gated on third-party ads/fonts/analytics resources that
    // measured 12-15s in real traces, consuming most of the test's overall
    // timeout before any test logic runs. Each page object's own web-first
    // "page loaded" assertion (called immediately after navigation in every
    // test) is what actually gates on real, page-specific readiness.
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('load');
  }

  async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  async fill(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  async getText(locator: Locator): Promise<string> {
    return (await locator.textContent())?.trim() ?? '';
  }

  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }

  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: getScreenshotFilePath(`${name}.png`) });
  }
}
