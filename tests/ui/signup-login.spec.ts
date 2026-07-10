import { test } from '../../src/fixtures/testFixtures';
import { readJsonFile } from '../../src/utils/fileUtils';
import { generateUniqueEmail } from '../../src/utils/dataGenerator';
import { logger } from '../../src/utils/logger';
import { User, LoginCredentials } from '../../src/types/user.types';
import { HomePage } from '../../src/pages/HomePage';
import { SignupLoginPage } from '../../src/pages/SignupLoginPage';

const userTemplate = readJsonFile<{ dynamicUser: User }>('test-data/users.json').dynamicUser;
const invalidLogin = readJsonFile<{ invalidLogin: LoginCredentials }>('test-data/invalid-users.json').invalidLogin;

async function registerNewAccount(
  homePage: HomePage,
  signupLoginPage: SignupLoginPage,
  scenario: string
): Promise<User> {
  const user: User = { ...userTemplate, email: generateUniqueEmail(scenario) };

  await homePage.navigateToHome();
  await homePage.verifyHomePageVisible();
  await homePage.goToSignupLogin();
  await signupLoginPage.verifySignupSectionVisible();
  await signupLoginPage.startSignup(user.name, user.email);
  await signupLoginPage.completeAccountRegistration(user);
  await signupLoginPage.verifyAccountCreated();
  await signupLoginPage.clickContinue();

  return user;
}

async function deleteAccountSafely(
  homePage: HomePage,
  signupLoginPage: SignupLoginPage,
  user: User,
  alreadyLoggedIn: boolean
): Promise<void> {
  try {
    if (!alreadyLoggedIn) {
      await homePage.navigateToHome();
      await homePage.goToSignupLogin();
      await signupLoginPage.login(user.email, user.password);
    }
    await signupLoginPage.deleteAccount();
    await signupLoginPage.verifyAccountDeleted();
  } catch (error) {
    logger.warn(`Cleanup failed for ${user.email}: ${(error as Error).message}`);
  }
}

test.describe('Signup / Login', () => {
  test('AE-TC-UI-001 @ui @signup @smoke @e2e Register new user', async ({ homePage, signupLoginPage }) => {
    let accountCreated = false;
    let deletedViaMainFlow = false;
    // Definite-assignment: only read in `finally`, gated by `accountCreated`, which is
    // only set true after this is assigned.
    let user!: User;

    try {
      user = await registerNewAccount(homePage, signupLoginPage, 'ui001');
      accountCreated = true;

      await signupLoginPage.verifyLoggedInAs(user.name);
      await signupLoginPage.deleteAccount();
      await signupLoginPage.verifyAccountDeleted();
      deletedViaMainFlow = true;
    } finally {
      if (accountCreated && !deletedViaMainFlow) {
        await deleteAccountSafely(homePage, signupLoginPage, user, true);
      }
    }
  });

  test('AE-TC-UI-002 @ui @login @smoke Login with valid credentials', async ({ homePage, signupLoginPage }) => {
    const user = await registerNewAccount(homePage, signupLoginPage, 'loginvalid');
    await signupLoginPage.logout();

    try {
      await signupLoginPage.verifyLoginSectionVisible();
      await signupLoginPage.login(user.email, user.password);
      await signupLoginPage.verifyLoggedInAs(user.name);
    } finally {
      await deleteAccountSafely(homePage, signupLoginPage, user, true);
    }
  });

  test('AE-TC-UI-003 @ui @login @negative @smoke Login with invalid credentials', async ({
    homePage,
    signupLoginPage,
  }) => {
    await homePage.navigateToHome();
    await homePage.goToSignupLogin();
    await signupLoginPage.verifyLoginSectionVisible();
    await signupLoginPage.login(invalidLogin.email, invalidLogin.password);
    await signupLoginPage.verifyInvalidLoginError();
  });

  test('AE-TC-UI-004 @ui @login @smoke Logout user', async ({ homePage, signupLoginPage }) => {
    const user = await registerNewAccount(homePage, signupLoginPage, 'logout');
    await signupLoginPage.logout();

    try {
      await signupLoginPage.verifyLoginSectionVisible();
      await signupLoginPage.login(user.email, user.password);
      await signupLoginPage.verifyLoggedInAs(user.name);
      await signupLoginPage.logout();
      await signupLoginPage.verifyLoginSectionVisible();
    } finally {
      await deleteAccountSafely(homePage, signupLoginPage, user, false);
    }
  });

  test('AE-TC-UI-005 @ui @signup @negative @smoke Register with existing email', async ({
    homePage,
    signupLoginPage,
  }) => {
    const user = await registerNewAccount(homePage, signupLoginPage, 'dupemail');

    try {
      await signupLoginPage.logout();
      await signupLoginPage.verifySignupSectionVisible();
      await signupLoginPage.startSignup(user.name, user.email);
      await signupLoginPage.verifyExistingEmailError();
    } finally {
      await deleteAccountSafely(homePage, signupLoginPage, user, false);
    }
  });
});
