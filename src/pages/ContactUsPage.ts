import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { assertVisible, assertTextContains } from '../utils/assertionUtils';
import { ContactFormData } from '../types/user.types';

export class ContactUsPage extends BasePage {
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageTextArea: Locator;
  readonly uploadFileInput: Locator;
  readonly submitButton: Locator;
  readonly successMessage: Locator;
  readonly getInTouchHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.nameInput = page.locator('input[data-qa="name"]');
    this.emailInput = page.locator('input[data-qa="email"]');
    this.subjectInput = page.locator('input[data-qa="subject"]');
    this.messageTextArea = page.locator('textarea[data-qa="message"]');
    this.uploadFileInput = page.locator('input[name="upload_file"]');
    this.submitButton = page.locator('input[data-qa="submit-button"]');
    this.successMessage = page.locator('.status.alert-success');
    this.getInTouchHeading = page.getByText(/get in touch/i);
  }

  async verifyGetInTouch(): Promise<void> {
    await assertVisible(this.getInTouchHeading);
  }

  // KNOWN LIMITATION (AE-TC-UI-006): automationexercise.com binds its Contact Us
  // submit handling (confirm() dialog + client-side success update) via a script
  // that attaches after page load. If Submit is clicked before that attachment
  // completes, the browser falls through to a native form POST the site never
  // intended, and the success message never appears (confirmed via network/trace
  // analysis: no `dialog` event fires in that case). This is an application-level
  // readiness race in the demo site itself, not a defect in this framework.
  // No deterministic, black-box, retry-free fix exists for it, which is why this
  // test runs in the Regression tier rather than Smoke — see AE-TC-UI-006 review.
  async submitContactForm(data: ContactFormData): Promise<void> {
    await this.fill(this.nameInput, data.name);
    await this.fill(this.emailInput, data.email);
    await this.fill(this.subjectInput, data.subject);
    await this.fill(this.messageTextArea, data.message);
    if (data.uploadFilePath) {
      await this.uploadFileInput.setInputFiles(data.uploadFilePath);
    }

    this.page.once('dialog', async (dialog) => {
      if (dialog.type() === 'confirm' && /press ok to proceed/i.test(dialog.message())) {
        await dialog.accept();
      } else {
        await dialog.dismiss();
      }
    });
    await this.click(this.submitButton);
  }

  async verifySuccessMessage(): Promise<void> {
    await assertVisible(this.successMessage);
    await assertTextContains(this.successMessage, 'Success! Your details have been submitted successfully.');
  }
}
