import {playwrightTables} from './src'
import { expect, PlaywrightTestConfig } from '@playwright/test';

expect.extend(playwrightTables);

const config: PlaywrightTestConfig = {
  reporter: process.env.CI ? 'github' : 'list',
  webServer: {
    command: 'npm start',
    port: 3000,
    timeout: 60 * 1000,
  },
  use: {
    baseURL: 'http://localhost:3000/',
    testIdAttribute: "data-test-id",
  },
};

export default config;