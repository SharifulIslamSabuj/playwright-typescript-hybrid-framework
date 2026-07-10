function generateTimestampToken(): string {
  const now = new Date();
  const pad = (value: number, length = 2) => String(value).padStart(length, '0');
  return (
    `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}` +
    `${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}${pad(now.getMilliseconds(), 3)}`
  );
}

export function generateUniqueEmail(scenario: string): string {
  return `ae_${scenario}_${generateTimestampToken()}@testmail.com`;
}

export function generateRandomString(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
