import { test, expect } from '@playwright/test';
import { AuthApiClient } from '../../src/api/clients/AuthApiClient';
import { readJsonFile } from '../../src/utils/fileUtils';
import { generateUniqueEmail } from '../../src/utils/dataGenerator';
import { logger } from '../../src/utils/logger';
import { User, LoginCredentials } from '../../src/types/user.types';
import { ApiResponse, VerifyLoginResponse } from '../../src/types/api.types';

const userTemplate = readJsonFile<{ dynamicUser: User }>('test-data/users.json').dynamicUser;
const invalidLogin = readJsonFile<{ invalidLogin: LoginCredentials }>('test-data/invalid-users.json').invalidLogin;

test.describe('Verify Login API', () => {
  test('AE-TC-API-007 @api @auth @step14 @smoke Verify login with valid details', async ({ request }) => {
    const authApi = new AuthApiClient(request);
    const user: User = { ...userTemplate, email: generateUniqueEmail('apiverifylogin') };

    const createResponse = await authApi.createAccount(user);
    const createBody = (await createResponse.json()) as ApiResponse;
    if (createResponse.status() !== 200 || createBody.responseCode !== 201) {
      throw new Error(
        `API setup failed: could not create disposable account for AE-TC-API-007. ` +
          `HTTP status=${createResponse.status()}, body.responseCode=${createBody.responseCode}, ` +
          `message=${createBody.message}`
      );
    }

    try {
      const response = await authApi.verifyLogin(user.email, user.password);

      expect(response.status()).toBe(200);
      const body = (await response.json()) as VerifyLoginResponse;
      expect(body.responseCode).toBe(200);
      expect(body.message).toBe('User exists!');
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

  test('AE-TC-API-008 @api @auth @step14 @regression Verify login with invalid details', async ({ request }) => {
    const authApi = new AuthApiClient(request);
    const response = await authApi.verifyLogin(invalidLogin.email, invalidLogin.password);

    expect(response.status()).toBe(200);
    const body = (await response.json()) as ApiResponse;
    expect(body.responseCode).toBe(404);
    expect(body.message).toBe('User not found!');
  });
});
