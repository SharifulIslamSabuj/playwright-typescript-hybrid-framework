import { test } from '../../src/fixtures/testFixtures';
import { readJsonFile } from '../../src/utils/fileUtils';
import { User, LoginCredentials } from '../../src/types/user.types';
import { registerNewAccount, deleteAccountSafely } from '../../src/utils/accountHelpers';

const invalidLogin = readJsonFile<{ invalidLogin: LoginCredentials }>('test-data/invalid-users.json').invalidLogin;

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
