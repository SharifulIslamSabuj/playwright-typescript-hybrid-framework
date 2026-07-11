import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { assertVisible } from '../utils/assertionUtils';
import { getDownloadFilePath } from '../utils/fileUtils';
import { CardDetails } from '../types/product.types';

export class PaymentPage extends BasePage {
  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payAndConfirmButton: Locator;
  readonly orderSuccessMessage: Locator;
  readonly downloadInvoiceLink: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.nameOnCardInput = page.locator('input[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('input[data-qa="card-number"]');
    this.cvcInput = page.locator('input[data-qa="cvc"]');
    this.expiryMonthInput = page.locator('input[data-qa="expiry-month"]');
    this.expiryYearInput = page.locator('input[data-qa="expiry-year"]');
    this.payAndConfirmButton = page.locator('button[data-qa="pay-button"]');
    this.orderSuccessMessage = page.locator('p:has-text("Congratulations! Your order has been confirmed!")');
    this.downloadInvoiceLink = page.locator('a:has-text("Download Invoice")');
    this.continueButton = page.locator('a:has-text("Continue")');
  }

  async enterPaymentDetails(card: CardDetails): Promise<void> {
    await this.fill(this.nameOnCardInput, card.cardHolderName);
    await this.fill(this.cardNumberInput, card.cardNumber);
    await this.fill(this.cvcInput, card.cvc);
    await this.fill(this.expiryMonthInput, card.expiryMonth);
    await this.fill(this.expiryYearInput, card.expiryYear);
  }

  async confirmOrder(): Promise<void> {
    await this.click(this.payAndConfirmButton);
  }

  async verifyOrderPlaced(): Promise<void> {
    await assertVisible(this.orderSuccessMessage);
  }

  async downloadInvoice(): Promise<string> {
    const [download] = await Promise.all([this.page.waitForEvent('download'), this.click(this.downloadInvoiceLink)]);
    const downloadPath = getDownloadFilePath(download.suggestedFilename());
    await download.saveAs(downloadPath);
    return downloadPath;
  }

  async clickContinue(): Promise<void> {
    await this.click(this.continueButton);
  }
}
