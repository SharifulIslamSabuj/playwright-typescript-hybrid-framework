import { readJsonFile } from './fileUtils';
import { generateUniqueEmail } from './dataGenerator';
import { logger } from './logger';
import { User } from '../types/user.types';
import { HomePage } from '../pages/HomePage';
import { SignupLoginPage } from '../pages/SignupLoginPage';

const userTemplate = readJsonFile<{ dynamicUser: User }>('test-data/users.json').dynamicUser;

export async function registerNewAccount(
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

export async function deleteAccountSafely(
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
