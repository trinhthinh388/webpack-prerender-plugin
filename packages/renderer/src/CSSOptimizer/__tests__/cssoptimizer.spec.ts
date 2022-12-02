import { CSSOptimizer } from '../CSSOptimizer';
import puppeteer, { Browser, HTTPResponse, Page } from 'puppeteer';
import csstree from 'css-tree';

describe('CSSOptimizer', () => {
  let page: Page;
  let browser: Browser;
  beforeAll(async () => {
    console.error = () => void 0;
    browser = globalThis.__BROWSER_GLOBAL__;
    const launch = jest.spyOn(puppeteer, 'launch');
    launch.mockImplementation(async () => browser);
  });

  beforeEach(async () => {
    page = await globalThis.__BROWSER_GLOBAL__.newPage();
  });

  afterEach(async () => {
    jest.restoreAllMocks();
    if (!page.isClosed()) {
      await page.close();
    }
  });
  beforeEach(async () => {
    page = await globalThis.__BROWSER_GLOBAL__.newPage();
  });

  afterEach(async () => {
    jest.restoreAllMocks();
  });
  it('Should return original HTML when request failed', async () => {
    const optimizer = new CSSOptimizer(
      'test',
      {
        status() {
          return 400;
        },
      } as HTTPResponse,
      page
    );

    const res = await optimizer.process();
    expect(res).toBe('test');
  });
});
