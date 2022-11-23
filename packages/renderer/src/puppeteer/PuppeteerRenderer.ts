import puppeteer, { Browser, HTTPRequest, HTTPResponse } from 'puppeteer';
import { CSSOptimizer } from '../CSSOptimizer';
import { RenderError, PuppeteerRendererOptions } from '../misc';

type RendererPlugins = typeof CSSOptimizer;

export const defaultOptions: PuppeteerRendererOptions = {
  maxConcurrentRoutes: 0,
  port: 3000,
  skipThirdPartyRequests: false,
  inlineCSS: false,
  ignoreErrorRequest: true,
};

export class PuppeteerRenderer {
  private _options: PuppeteerRendererOptions = {};
  private _browser: Browser | null = null;
  private _plugins: RendererPlugins[] = [];
  private _resources: HTTPResponse[] = [];
  constructor(opts: PuppeteerRendererOptions = {}) {
    this._options = { ...defaultOptions, ...opts };

    if (this._options.inlineCSS) this._plugins.push(CSSOptimizer);

    this.render = this.render.bind(this);
    this.interceptRequest = this.interceptRequest.bind(this);
    this.interceptResponse = this.interceptResponse.bind(this);
  }

  async launch() {
    try {
      this._browser = await puppeteer.launch(this._options);
    } catch (err) {
      console.error('Cannot launch Puppeteer instance.');
      console.error(err);
      throw err;
    }

    return this._browser;
  }

  async render(route: string) {
    try {
      if (!this._browser) {
        throw new RenderError(
          'Unable to create a new page since no browser instance has been launched.'
        );
      }

      const page = await this._browser.newPage();

      if (this._options.inlineCSS) await page.coverage.startCSSCoverage();

      const baseURL = `http://localhost:${this._options.port}`;

      if (this._options.defaultViewport)
        page.setViewport(this._options.defaultViewport);

      await page.setRequestInterception(true);

      page.on('request', this.interceptRequest(baseURL));

      page.on('response', this.interceptResponse);

      await page.goto(`${baseURL}${route}`, {
        waitUntil: 'networkidle0',
        ...(this._options.navigationOptions || {}),
      });

      if (this._options.renderAfterElementExists) {
        await page.waitForSelector(this._options.renderAfterElementExists);
      }

      const result: any = {
        originalRoute: route,
        renderRoute: await page.evaluate('window.location.pathname'),
        html: await page.content(),
      };

      if (this._options.inlineCSS) {
        let totalBytes = 0;
        let usedBytes = 0;
        const CSSCov = await page.coverage.stopCSSCoverage();
        for (const entry of CSSCov) {
          totalBytes += entry.text.length;
          for (const range of entry.ranges)
            usedBytes += range.end - range.start - 1;
        }
        result.CSSCoverage = (usedBytes / totalBytes) * 100;
      }

      await page.close();
      return result;
    } catch (err) {
      console.error(`Unable to render route ${route}.`);
      console.error(err);
      throw err;
    }
  }

  private interceptRequest(baseURL: string) {
    return (req: HTTPRequest) => {
      // Skip third party requests if needed.
      if (this._options.skipThirdPartyRequests) {
        if (!req.url().startsWith(baseURL)) {
          req.abort();
          return;
        }
      }

      req.continue();
    };
  }

  private interceptResponse(response: HTTPResponse) {
    this._resources.push(response);
  }

  destroy() {
    if (this._browser) {
      try {
        this._browser.close();
      } catch (err) {
        console.error('Unable to close Puppeteer instance.');
        console.error(err);
        throw err;
      }
    }
  }
}
