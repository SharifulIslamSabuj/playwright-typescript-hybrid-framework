export function generateUniqueEmail(prefix = 'testuser'): string {
  return `${prefix}.${Date.now()}@example.com`;
}

export function generateRandomString(length = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
