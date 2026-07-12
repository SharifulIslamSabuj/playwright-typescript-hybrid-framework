import { test } from '../../src/fixtures/testFixtures';
import { AuthApiClient } from '../../src/api/clients/AuthApiClient';
import { readJsonFile } from '../../src/utils/fileUtils';
import { generateUniqueEmail } from '../../src/utils/dataGenerator';
import { logger } from '../../src/utils/logger';
import { User } from '../../src/types/user.types';
import { ApiResponse } from '../../src/types/api.types';

const userTemplate = readJsonFile<{ dynamicUser: User }>('test-data/users.json').dynamicUser;

test.describe('Hybrid - Login', () => {
  test('AE-TC-HYBRID-001 @hybrid @login @step15 @smoke Verify login via API-provisioned account', async ({
    request,
    homePage,
    signupLoginPage,
  }) => {
    const authApi = new AuthApiClient(request);
    const user: User = { ...userTemplate, email: generateUniqueEmail('hybridlogin') };

    const createResponse = await authApi.createAccount(user);
    const createBody = (await createResponse.json()) as ApiResponse;
    if (createResponse.status() !== 200 || createBody.responseCode !== 201) {
      throw new Error(
        `API setup failed: could not create disposable account for AE-TC-HYBRID-001. ` +
          `HTTP status=${createResponse.status()}, body.responseCode=${createBody.responseCode}, ` +
          `message=${createBody.message}`
      );
    }

    try {
      await homePage.navigateToHome();
      await homePage.goToSignupLogin();
      await signupLoginPage.verifyLoginSectionVisible();
      await signupLoginPage.login(user.email, user.password);
      await signupLoginPage.verifyLoggedInAs(user.name);
    } finally {
      const deleteResponse = await authApi.deleteAccount(user.email, user.password);
      const deleteBody = (await deleteResponse.json()) as ApiResponse;
      if (deleteResponse.status() !== 200 || deleteBody.responseCode !== 200) {
        logger.warn(
          `API cleanup failed for ${user.email}: HTTP status=${deleteResponse.status()}, ` +
            `body.responseCode=${deleteBody.responseCode}, message=${deleteBody.message}`
        );
      }
    }
  });
});
