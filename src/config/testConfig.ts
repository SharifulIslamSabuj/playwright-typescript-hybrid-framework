export const testConfig = {
  timeouts: {
    default: 30_000,
    short: 5_000,
    long: 60_000,
    apiRequest: 15_000,
    assertion: 10_000,
  },
  retries: {
    ci: 2,
    local: 0,
  },
  dummyCard: {
    number: '4111111111111111',
    cvc: '123',
  },
} as const;
