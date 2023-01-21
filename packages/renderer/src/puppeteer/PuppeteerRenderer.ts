import puppeteer, { Browser, HTTPRequest, HTTPResponse, Page } from 'puppeteer';
import { CSSOptimizer } from '../CSSOptimizer';
import { RenderError, PuppeteerRendererOptions } from '../misc';
import { RendererServer } from '@webpack-prerender/renderer-server';
import isUndefined from 'lodash/isUndefined';
import omitBy from 'lodash/omitBy';
import chalk from 'chalk';

type RendererPlugins = typeof CSSOptimizer;

export const DEFAULT_OPTS: PuppeteerRendererOptions = {
  port: 3000,
  maxConcurrentRoutes: 0,
  skipThirdPartyRequests: false,
  inlineCSS: false,
  ignoreErrorRequest: true,
};

export class PuppeteerRenderer {
  private _options: PuppeteerRendererOptions = {};
  private _browser: Browser | null = null;
  private _plugins: RendererPlugins[] = [];
  private _resources: HTTPResponse[] = [];
  private _requests: Set<string>;
  private _server: RendererServer;

  constructor(opts: PuppeteerRendererOptions = {}) {
    this._options = { ...DEFAULT_OPTS, ...omitBy(opts, isUndefined) };
    this._requests = new Set();
    this._server = new RendererServer({
      port: this._options.port,
      staticDir: this._options.staticDir,
      indexPath: this._options.indexPath,
    });

    if (this._options.inlineCSS) this._plugins.push(CSSOptimizer);

    this.render = this.render.bind(this);
    this.interceptRequest = this.interceptRequest.bind(this);
    this.interceptResponse = this.interceptResponse.bind(this);
    this.createTracker = this.createTracker.bind(this);
  }

  async launch() {
    try {
      const workingPort = await this._server.initialize();
      if (workingPort !== this._options.port) {
        console.log(
          `Port ${this._options.port} is currently in-use, use port ${workingPort} instead.`
        );
      }
      this._browser = await puppeteer.launch(this._options);
      this._options.port = workingPort;
    } catch (err) {
      console.error(chalk.red('Cannot launch Puppeteer instance.'));
      console.error(chalk.red(err));
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

      const baseURL = `http://localhost:${this._options.port}`;

      const page = await this._browser.newPage();
      const tracker = this.createTracker(page);

      await tracker.track();

      if (this._options.defaultViewport)
        page.setViewport(this._options.defaultViewport);

      await page.goto(`${baseURL}${route}`, {
        waitUntil: 'networkidle0',
        ...(this._options.navigationOptions || {}),
      });

      if (this._options.renderAfterElementExists) {
        await page.waitForSelector(this._options.renderAfterElementExists);
      }

      const html = await page.content();

      const result = {
        originalRoute: route,
        renderRoute: await page.evaluate('window.location.pathname'),
        html,
      };

      await tracker.dispose(html);

      await page.close();

      return result;
    } catch (err) {
      console.error(chalk.red(`Unable to render route ${route}.`));
      console.error(chalk.red(err));
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
    this._requests.delete(response.request().url());
  }

  private async optimize(_html: string, _response: HTTPResponse, _page: Page) {
    let updateHtml = _html;

    for (const Plugin of this._plugins) {
      const p = new Plugin(updateHtml, _response, _page);
      updateHtml = await p.process();
    }

    return updateHtml;
  }

  private createTracker(page: Page) {
    const baseURL = `http://localhost:${this._options.port}`;

    const onFinished = (req: HTTPRequest) => this._requests.add(req.url());
    const onFailed = (req: HTTPRequest) => {
      return this._requests.delete(req.url());
    };

    const track = async () => {
      await page.setRequestInterception(true);
      page.on('request', this.interceptRequest(baseURL));
      page.on('response', this.interceptResponse);
      page.on('requestfinished', onFinished);
      page.on('requestfailed', onFailed);
    };

    const dispose = async (originHtml: string) => {
      page.off('requestfailed', onFailed);
      page.off('requestfinished', onFinished);
      page.off('request', this.interceptRequest(baseURL));
      page.off('response', this.interceptResponse);

      let _html = originHtml;

      for (const r of this._resources) {
        _html = await this.optimize(_html, r, page);
      }
      return _html;
    };

    return {
      dispose,
      track,
    };
  }

  async destroy() {
    await this._server.destroy();
    if (this._browser) {
      try {
        this._browser.close();
      } catch (err) {
        console.error(chalk.red('Unable to close Puppeteer instance.'));
        console.error(chalk.red(err));
        throw err;
      }
    }
  }
}
