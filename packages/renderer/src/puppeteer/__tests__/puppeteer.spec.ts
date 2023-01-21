/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PuppeteerRenderer } from '../PuppeteerRenderer';
import puppeteer, { Browser, HTTPRequest, Page } from 'puppeteer';
import path from 'path';
import { PuppeteerRendererOptions } from '../../misc';

const STATIC_DIR = path.resolve(__dirname, '../../../../app/example');

describe('PuppeteerRenderer', () => {
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

  it('Should launch an instance', async () => {
    const launch = jest.spyOn(puppeteer, 'launch');
    const renderer = new PuppeteerRenderer({});
    await renderer.launch();
    expect(launch).toHaveBeenCalled();
  });

  it('Should launch an instance with custom launch options', async () => {
    const launch = jest.spyOn(puppeteer, 'launch');
    const renderer = new PuppeteerRenderer({
      args: ['--test'],
    });
    await renderer.launch();
    expect(
      (launch.mock.lastCall?.[0] as PuppeteerRendererOptions).args
    ).toEqual(['--test']);
  });

  it('Should throw an error when launching failed', async () => {
    try {
      const launch = jest.spyOn(puppeteer, 'launch');
      launch.mockImplementation(() => {
        throw new Error('something unexpected');
      });
      const renderer = new PuppeteerRenderer();
      await renderer.launch();
    } catch (err) {
      expect(err).toStrictEqual(new Error('something unexpected'));
    }
  });

  it('Should close browser when calling destroy', async () => {
    const renderer = new PuppeteerRenderer({
      staticDir: STATIC_DIR,
    });
    const browser = await renderer.launch();
    const close = jest.spyOn(browser, 'close');
    await renderer.destroy();
    expect(close).toHaveBeenCalled();
  });

  it('Should log error when browser destroy failed', async () => {
    const err = new Error('Test');
    const renderer = new PuppeteerRenderer({
      staticDir: STATIC_DIR,
    });
    console.error = jest.fn();
    const browser = await renderer.launch();
    const close = jest.spyOn(browser, 'close');
    close.mockImplementation(() => {
      throw err;
    });
    try {
      await renderer.destroy();
    } catch (_) {
      expect(close).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledTimes(2);
      expect(
        (
          console.error as unknown as jest.SpyInstance
        ).mock.lastCall[0].includes('Test')
      ).toBe(true);
    }
  });

  it('Should throw error when calling destroy failed', async () => {
    try {
      const renderer = new PuppeteerRenderer();
      const browser = await renderer.launch();
      const close = jest.spyOn(browser, 'close');
      close.mockImplementation(() => {
        throw new Error('something unexpected');
      });
      renderer.destroy();
    } catch (err) {
      expect(err).toStrictEqual(new Error('something unexpected'));
    }
  });

  it('should throw error when no browser found', async () => {
    try {
      const renderer = new PuppeteerRenderer();
      await renderer.render('/');
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  it('should set viewport before render', async () => {
    const renderer = new PuppeteerRenderer({
      defaultViewport: {
        width: 400,
        height: 400,
        deviceScaleFactor: 1.5,
      },
    });

    const browser = await renderer.launch();
    const newPage = jest.spyOn(browser, 'newPage');
    newPage.mockImplementation(async () => page);
    const setViewport = jest.spyOn(page, 'setViewport');
    await renderer.render('/');

    expect(setViewport).toHaveBeenCalledWith({
      width: 400,
      height: 400,
      deviceScaleFactor: 1.5,
    });
  });

  it('should render after an element is exist', async () => {
    const renderer = new PuppeteerRenderer({
      renderAfterElementExists: '#root',
      staticDir: STATIC_DIR,
    });
    const browser = await renderer.launch();
    const newPage = jest.spyOn(browser, 'newPage');
    newPage.mockImplementation(async () => page);
    const waitForSelector = jest.spyOn(page, 'waitForSelector');
    await renderer.render('/');

    expect(waitForSelector).toHaveBeenCalledWith('#root');
  });

  it('should intercept requests', async () => {
    const req = {
      url: () => 'http://localhost:3000',
      abort: jest.fn(),
      continue: jest.fn(),
    };
    const renderer = new PuppeteerRenderer();
    // @ts-ignore
    renderer.interceptRequest('http://localhost:3000')(
      req as unknown as HTTPRequest
    );

    expect(req.continue).toHaveBeenCalled();
  });

  it('should ingore 3rd requests', async () => {
    const req = {
      url: () => 'http://localhost:3001',
      abort: jest.fn(),
      continue: jest.fn(),
    };
    const renderer = new PuppeteerRenderer({
      skipThirdPartyRequests: true,
    });
    // @ts-ignore
    renderer.interceptRequest('http://localhost:3000')(
      req as unknown as HTTPRequest
    );

    expect(req.abort).toHaveBeenCalled();
  });

  it('Should have an CSSOptimizer', () => {
    const renderer = new PuppeteerRenderer({
      inlineCSS: true,
    });

    // @ts-ignore
    expect(renderer._plugins).toHaveLength(1);
  });

  it('Should start optimizing process', async () => {
    const renderer = new PuppeteerRenderer({
      inlineCSS: true,
      staticDir: STATIC_DIR,
    });

    // @ts-ignore
    jest.spyOn(renderer, 'optimize');

    await renderer.launch();
    await renderer.render('/');

    // @ts-ignore
    expect(renderer.optimize).toHaveBeenCalled();
  });
});
