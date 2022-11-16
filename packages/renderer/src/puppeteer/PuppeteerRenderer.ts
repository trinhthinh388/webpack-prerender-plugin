import puppeteer, { PuppeteerLaunchOptions, Browser } from 'puppeteer';

export type PuppeteerRendererOptions = PuppeteerLaunchOptions;

export class PuppeteerRenderer {
  private _options: PuppeteerRendererOptions = {};
  private _browser: Browser | null = null;
  constructor(opts: PuppeteerRendererOptions = {}) {
    this._options = { ...opts, ...this._options };
  }

  async launch() {
    try {
      this._browser = await puppeteer.launch(this._options);
    } catch (err) {
      console.error(
        '[WebpackPrerenderPlugin] Cannot launch Puppeteer instance.'
      );
      console.error(err);
    }

    return this._browser;
  }

  async destroy() {
    if (this._browser) {
      try {
        this._browser.close();
      } catch (err) {
        console.error(
          '[WebpackPrerenderPlugin] Unable to close Puppeteer instance.'
        );
        console.error(err);
      }
    }
  }
}
