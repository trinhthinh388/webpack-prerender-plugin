import puppeteer, { Browser, HTTPRequest, HTTPResponse, Page } from 'puppeteer';
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

      for (const r of this._resources) {
        await this.optimize(result.html, r, page);
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

  private async optimize(_html: string, _response: HTTPResponse, _page: Page) {
    let updateHtml = _html;

    for (const Plugin of this._plugins) {
      const p = new Plugin(updateHtml, _response, _page);
      updateHtml = await p.process();
    }

    return updateHtml;
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
