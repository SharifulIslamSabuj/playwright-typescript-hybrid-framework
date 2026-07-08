export interface Address {
  address1: string;
  address2?: string;
  country: string;
  state: string;
  city: string;
  zipcode: string;
}

export interface DateOfBirth {
  day: string;
  month: string;
  year: string;
}

export interface User {
  name: string;
  email: string;
  password: string;
  title: 'Mr' | 'Mrs';
  dateOfBirth: DateOfBirth;
  firstName: string;
  lastName: string;
  company?: string;
  address: Address;
  mobileNumber: string;
  newsletter?: boolean;
  specialOffers?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  uploadFilePath?: string;
}
