/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PuppeteerRenderer, defaultOptions } from '../PuppeteerRenderer';
import puppeteer from 'puppeteer';

describe('PuppeteerRenderer', () => {
  const baseRequest = {
    url: () => 'http://localhost:3000',
    abort: jest.fn(),
    continue: jest.fn(),
  };
  const thirdPartyRequest = {
    url: () => 'http://localhost:3001',
    abort: jest.fn(),
    continue: jest.fn(),
  };
  const newPageFn = {
    setViewport: jest.fn(),
    setRequestInterception: jest.fn(),
    on: jest.fn((_, callback) => {
      callback(baseRequest);
    }),
    goto: jest.fn(),
    evaluate: jest.fn(),
    content: jest.fn(),
    close: jest.fn(),
    waitForSelector: jest.fn(),
  };

  beforeEach(() => {
    // @ts-ignore
    puppeteer.launch = jest.fn(() => ({
      newPage: () => newPageFn,
      close: jest.fn(),
    }));
    console.error = () => void 0;
  });

  it('Should launch an instance', async () => {
    const renderer = new PuppeteerRenderer();
    await renderer.launch();
    expect(puppeteer.launch).toHaveBeenCalledWith({
      ...defaultOptions,
    });
  });

  it('Should launch an instance with custom launch options', async () => {
    const renderer = new PuppeteerRenderer({
      headless: false,
    });
    await renderer.launch();
    expect(puppeteer.launch).toHaveBeenCalledWith({
      headless: false,
      ...defaultOptions,
    });
  });

  it('Should throw an error when launching failed', async () => {
    // @ts-ignore
    puppeteer.launch = jest.fn(() => {
      throw new Error('something unexpected');
    });
    try {
      const renderer = new PuppeteerRenderer({
        headless: false,
      });
      await renderer.launch();
    } catch (err) {
      expect(err).toStrictEqual(new Error('something unexpected'));
    }
  });

  it('Should close browser when calling destroy', async () => {
    const renderer = new PuppeteerRenderer();
    const browser = await renderer.launch();

    renderer.destroy();
    expect(browser.close).toHaveBeenCalled();
  });

  it('Should throw error when calling destroy failed', async () => {
    // @ts-ignore
    puppeteer.launch = jest.fn(() => {
      return {
        close: jest.fn(() => {
          throw new Error('something unexpected');
        }),
      };
    });
    try {
      const renderer = new PuppeteerRenderer();
      await renderer.launch();
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

  it('should render a page', async () => {
    try {
      const renderer = new PuppeteerRenderer();
      await renderer.launch();
      await renderer.render('/');
      expect(newPageFn.setRequestInterception).toHaveBeenCalledWith(true);
      expect(newPageFn.on).toHaveBeenCalled();
      expect(newPageFn.goto).toHaveBeenCalled();
      expect(newPageFn.evaluate).toHaveBeenCalledWith(
        'window.location.pathname'
      );
      expect(newPageFn.content).toHaveBeenCalled();
      expect(newPageFn.close).toHaveBeenCalled();
    } catch (err) {
      expect(err).toBeUndefined();
    }
  });

  it('should set viewport before render', async () => {
    try {
      const renderer = new PuppeteerRenderer({
        defaultViewport: {
          width: 400,
          height: 400,
          deviceScaleFactor: 1.5,
        },
      });
      await renderer.launch();
      await renderer.render('/');
      expect(newPageFn.setViewport).toHaveBeenCalledWith({
        width: 400,
        height: 400,
        deviceScaleFactor: 1.5,
      });
    } catch (err) {
      expect(err).toBeUndefined();
    }
  });

  it('should render after an element is exist', async () => {
    try {
      const renderer = new PuppeteerRenderer({
        renderAfterElementExists: '#app',
      });
      await renderer.launch();
      await renderer.render('/');
      expect(newPageFn.waitForSelector).toHaveBeenCalledWith('#app');
    } catch (err) {
      expect(err).toBeUndefined();
    }
  });

  it('should intercept base requests', async () => {
    const renderer = new PuppeteerRenderer({
      skipThirdPartyRequests: true,
    });
    await renderer.launch();
    await renderer.render('/');
    expect(baseRequest.continue).toHaveBeenCalled();
  });

  it('should ignore base requests', async () => {
    newPageFn.on = jest.fn((_, callback) => {
      callback(thirdPartyRequest);
    });
    const renderer = new PuppeteerRenderer({
      port: 3000,
      skipThirdPartyRequests: true,
    });
    await renderer.launch();
    await renderer.render('/');
    expect(baseRequest.continue).not.toHaveBeenCalled();
    expect(thirdPartyRequest.abort).toHaveBeenCalled();
  });
});
