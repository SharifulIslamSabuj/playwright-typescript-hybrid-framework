import { BaseApiClient } from './BaseApiClient';
import { apiEndpoints } from '../endpoints';
import { User } from '../../types/user.types';

export class AuthApiClient extends BaseApiClient {
  async verifyLogin(email: string, password: string) {
    return this.post(apiEndpoints.verifyLogin, { email, password });
  }

  /** Setup-only helper for AE-TC-API-007: creates a disposable account, not a tested scenario itself. */
  async createAccount(user: User) {
    return this.post(apiEndpoints.createAccount, {
      name: user.name,
      email: user.email,
      password: user.password,
      title: user.title,
      birth_date: user.dateOfBirth.day,
      birth_month: user.dateOfBirth.month,
      birth_year: user.dateOfBirth.year,
      firstname: user.firstName,
      lastname: user.lastName,
      company: user.company ?? '',
      address1: user.address.address1,
      address2: user.address.address2 ?? '',
      country: user.address.country,
      zipcode: user.address.zipcode,
      state: user.address.state,
      city: user.address.city,
      mobile_number: user.mobileNumber,
    });
  }

  /** Cleanup-only helper for AE-TC-API-007: removes the disposable account, not a tested scenario itself. */
  async deleteAccount(email: string, password: string) {
    return this.delete(apiEndpoints.deleteAccount, { email, password });
  }
}
