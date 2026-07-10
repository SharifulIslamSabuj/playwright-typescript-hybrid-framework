import { test } from '../../src/fixtures/testFixtures';
import { readJsonFile } from '../../src/utils/fileUtils';
import { ContactFormData } from '../../src/types/user.types';

const contactData = readJsonFile<ContactFormData>('test-data/contact-us.json');

test.describe('Contact Us', () => {
  // AE-TC-UI-006 runs in Regression, not Smoke: automationexercise.com has an
  // application-level readiness race in its Contact Us submit handling that has
  // no deterministic, black-box, retry-free fix (see ContactUsPage.submitContactForm
  // and the AE-TC-UI-006 architecture review). Smoke gates every commit for every
  // engineer, so it must not carry a test whose stability depends on a known,
  // unfixable-at-the-framework-level timing race in the AUT itself.
  test('AE-TC-UI-006 @ui @contact @regression Submit Contact Us form', async ({ homePage, contactUsPage }) => {
    await homePage.navigateToHome();
    await homePage.goToContactUs();
    await contactUsPage.verifyGetInTouch();
    await contactUsPage.submitContactForm(contactData);
    await contactUsPage.verifySuccessMessage();
  });
});
