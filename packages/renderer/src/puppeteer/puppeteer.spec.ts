/* eslint-disable @typescript-eslint/ban-ts-comment */
import { PuppeteerRenderer } from './PuppeteerRenderer';
import puppeteer from 'puppeteer';

beforeAll(() => {
  // @ts-ignore
  puppeteer.launch = jest.fn();
});

describe('PuppeteerRenderer', () => {
  it('Should launch an instance', async () => {
    const renderer = new PuppeteerRenderer();
    await renderer.launch();
    expect(puppeteer.launch).toHaveBeenCalledWith({});
  });

  it('Should launch an instance with custom launch options', async () => {
    const renderer = new PuppeteerRenderer({
      headless: false,
    });
    await renderer.launch();
    expect(puppeteer.launch).toHaveBeenCalledWith({ headless: false });
  });

  it('Should throw an error when launching failed', async () => {
    // @ts-ignore
    puppeteer.launch = jest.fn(() => {
      throw new Error('something unexpected');
    });
    console.error = jest.fn();
    const renderer = new PuppeteerRenderer({
      headless: false,
    });
    await renderer.launch();
    expect(console.error).toHaveBeenCalled();
  });
});
