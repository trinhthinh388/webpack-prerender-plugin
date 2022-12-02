/* eslint-disable no-var */
import type { Browser } from 'puppeteer';

declare global {
  declare namespace globalThis {
    var __BROWSER_GLOBAL__: Browser;
  }
}
