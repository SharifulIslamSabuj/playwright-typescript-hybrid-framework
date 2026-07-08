import { BaseApiClient } from './BaseApiClient';
import { apiEndpoints } from '../endpoints';

export class AuthApiClient extends BaseApiClient {
  async verifyLogin(email: string, password: string) {
    return this.post(apiEndpoints.verifyLogin, { email, password });
  }
}
