import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const env = {
  baseUrl: process.env.BASE_URL || 'https://automationexercise.com',
  isCI: !!process.env.CI,
};
