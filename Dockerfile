# Pinned to the exact version matching "@playwright/test" in package.json (1.61.1).
# Verified to exist via `docker manifest inspect mcr.microsoft.com/playwright:v1.61.1-noble`
# before this file was written. Bump this tag whenever @playwright/test is upgraded.
FROM mcr.microsoft.com/playwright:v1.61.1-noble

WORKDIR /app

# Installed before copying the rest of the source so this layer is cached and only
# re-run when package.json/package-lock.json actually change.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Default: run the full Chromium suite. Override at `docker run` time with any
# existing project command, e.g. `npm run test:api -- --project=chromium --grep "@step14"`.
CMD ["npx", "playwright", "test", "--project=chromium"]
