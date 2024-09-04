import PlaywrightClassification from './src'
import { expect, PlaywrightTestConfig } from '@playwright/test';

expect.extend(PlaywrightClassification);

const config: PlaywrightTestConfig = {
  reporter: process.env.CI ? 'github' : 'list',
  webServer: {
    command: 'npm start',
    port: 3000,
    timeout: 60 * 1000,
  },
  use: {
    baseURL: 'http://localhost:3000/',
  },
};

export default config;