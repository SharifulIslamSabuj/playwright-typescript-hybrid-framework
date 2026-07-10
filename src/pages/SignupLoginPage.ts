import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { assertVisible, assertTextContains } from '../utils/assertionUtils';
import { User } from '../types/user.types';

export class SignupLoginPage extends BasePage {
  readonly signupNameInput: Locator;
  readonly signupEmailInput: Locator;
  readonly signupButton: Locator;
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginButton: Locator;
  readonly loginErrorMessage: Locator;
  readonly signupErrorMessage: Locator;

  readonly newUserSignupHeading: Locator;
  readonly loginToAccountHeading: Locator;
  readonly enterAccountInfoHeading: Locator;
  readonly titleMr: Locator;
  readonly titleMrs: Locator;
  readonly passwordInput: Locator;
  readonly daysSelect: Locator;
  readonly monthsSelect: Locator;
  readonly yearsSelect: Locator;
  readonly newsletterCheckbox: Locator;
  readonly specialOffersCheckbox: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly companyInput: Locator;
  readonly address1Input: Locator;
  readonly address2Input: Locator;
  readonly countrySelect: Locator;
  readonly stateInput: Locator;
  readonly cityInput: Locator;
  readonly zipcodeInput: Locator;
  readonly mobileNumberInput: Locator;
  readonly createAccountButton: Locator;
  readonly accountCreatedHeading: Locator;
  readonly continueButton: Locator;
  readonly accountDeletedHeading: Locator;
  readonly loggedInAsText: Locator;
  readonly deleteAccountLink: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.signupNameInput = page.locator('input[data-qa="signup-name"]');
    this.signupEmailInput = page.locator('input[data-qa="signup-email"]');
    this.signupButton = page.locator('button[data-qa="signup-button"]');
    this.loginEmailInput = page.locator('input[data-qa="login-email"]');
    this.loginPasswordInput = page.locator('input[data-qa="login-password"]');
    this.loginButton = page.locator('button[data-qa="login-button"]');
    this.loginErrorMessage = page.locator('p:has-text("Your email or password is incorrect!")');
    this.signupErrorMessage = page.locator('p:has-text("Email Address already exist!")');

    this.newUserSignupHeading = page.getByText('New User Signup!');
    this.loginToAccountHeading = page.getByText('Login to your account');
    this.enterAccountInfoHeading = page.getByText('Enter Account Information');
    this.titleMr = page.locator('#id_gender1');
    this.titleMrs = page.locator('#id_gender2');
    this.passwordInput = page.locator('#password');
    this.daysSelect = page.locator('#days');
    this.monthsSelect = page.locator('#months');
    this.yearsSelect = page.locator('#years');
    this.newsletterCheckbox = page.locator('#newsletter');
    this.specialOffersCheckbox = page.locator('#optin');
    this.firstNameInput = page.locator('#first_name');
    this.lastNameInput = page.locator('#last_name');
    this.companyInput = page.locator('#company');
    this.address1Input = page.locator('#address1');
    this.address2Input = page.locator('#address2');
    this.countrySelect = page.locator('#country');
    this.stateInput = page.locator('#state');
    this.cityInput = page.locator('#city');
    this.zipcodeInput = page.locator('#zipcode');
    this.mobileNumberInput = page.locator('#mobile_number');
    this.createAccountButton = page.locator('button[data-qa="create-account"]');
    this.accountCreatedHeading = page.locator('[data-qa="account-created"]');
    this.continueButton = page.locator('[data-qa="continue-button"]');
    this.accountDeletedHeading = page.locator('[data-qa="account-deleted"]');
    this.loggedInAsText = page.getByText(/Logged in as/i);
    this.deleteAccountLink = page.locator('a[href="/delete_account"]');
    this.logoutLink = page.locator('a[href="/logout"]');
  }

  async verifySignupSectionVisible(): Promise<void> {
    await assertVisible(this.newUserSignupHeading);
  }

  async verifyLoginSectionVisible(): Promise<void> {
    await assertVisible(this.loginToAccountHeading);
  }

  async startSignup(name: string, email: string): Promise<void> {
    await this.fill(this.signupNameInput, name);
    await this.fill(this.signupEmailInput, email);
    await this.click(this.signupButton);
  }

  async completeAccountRegistration(user: User): Promise<void> {
    await assertVisible(this.enterAccountInfoHeading);
    await this.click(user.title === 'Mr' ? this.titleMr : this.titleMrs);
    await this.fill(this.passwordInput, user.password);
    await this.daysSelect.selectOption(user.dateOfBirth.day);
    await this.monthsSelect.selectOption(user.dateOfBirth.month);
    await this.yearsSelect.selectOption(user.dateOfBirth.year);
    if (user.newsletter) await this.newsletterCheckbox.check();
    if (user.specialOffers) await this.specialOffersCheckbox.check();
    await this.fill(this.firstNameInput, user.firstName);
    await this.fill(this.lastNameInput, user.lastName);
    if (user.company) await this.fill(this.companyInput, user.company);
    await this.fill(this.address1Input, user.address.address1);
    if (user.address.address2) await this.fill(this.address2Input, user.address.address2);
    await this.countrySelect.selectOption(user.address.country);
    await this.fill(this.stateInput, user.address.state);
    await this.fill(this.cityInput, user.address.city);
    await this.fill(this.zipcodeInput, user.address.zipcode);
    await this.fill(this.mobileNumberInput, user.mobileNumber);
    await this.click(this.createAccountButton);
  }

  async verifyAccountCreated(): Promise<void> {
    await assertVisible(this.accountCreatedHeading);
  }

  async clickContinue(): Promise<void> {
    await this.click(this.continueButton);
  }

  async login(email: string, password: string): Promise<void> {
    await this.fill(this.loginEmailInput, email);
    await this.fill(this.loginPasswordInput, password);
    await this.click(this.loginButton);
  }

  async logout(): Promise<void> {
    await this.click(this.logoutLink);
  }

  async deleteAccount(): Promise<void> {
    await this.click(this.deleteAccountLink);
  }

  async verifyAccountDeleted(): Promise<void> {
    await assertVisible(this.accountDeletedHeading);
    await this.click(this.continueButton);
  }

  async verifyLoggedInAs(username: string): Promise<void> {
    await assertTextContains(this.loggedInAsText, username);
  }

  async verifyInvalidLoginError(): Promise<void> {
    await assertVisible(this.loginErrorMessage);
  }

  async verifyExistingEmailError(): Promise<void> {
    await assertVisible(this.signupErrorMessage);
  }
}
