import puppeteer, {
  PuppeteerLaunchOptions,
  Browser,
  WaitForOptions,
  HTTPRequest,
} from 'puppeteer';
import { RenderError } from '../misc';

export interface PuppeteerRendererOptions extends PuppeteerLaunchOptions {
  maxConcurrentRoutes?: number;
  port?: number;
  skipThirdPartyRequests?: boolean;
  navigationOptions?: WaitForOptions & { referer?: string };
  renderAfterElementExists?: string;
}

export const defaultOptions: PuppeteerRendererOptions = {
  maxConcurrentRoutes: 0,
  port: 3000,
  skipThirdPartyRequests: false,
};

export class PuppeteerRenderer {
  private _options: PuppeteerRendererOptions = { ...defaultOptions };
  private _browser: Browser | null = null;
  constructor(opts: PuppeteerRendererOptions = {}) {
    this._options = { ...this._options, ...opts };
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

      await page.goto(`${baseURL}${route}`, {
        waitUntil: 'networkidle0',
        ...(this._options.navigationOptions || {}),
      });

      if (this._options.renderAfterElementExists) {
        await page.waitForSelector(this._options.renderAfterElementExists);
      }

      const result = {
        originalRoute: route,
        renderRoute: await page.evaluate('window.location.pathname'),
        html: await page.content(),
      };

      await page.close();
      return result;
    } catch (err) {
      console.error(`Unable to render route ${route}.`);
      console.error(err);
      throw err;
    }
  }

  interceptRequest(baseURL: string) {
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
