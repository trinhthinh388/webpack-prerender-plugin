import type {
  HTTPResponse,
  PuppeteerLaunchOptions,
  WaitForOptions,
  Page,
} from 'puppeteer';
import type { RendererServerOpts } from '@webpack-prerender/renderer-server';

export interface PuppeteerRendererOptions
  extends PuppeteerLaunchOptions,
    RendererServerOpts {
  maxConcurrentRoutes?: number;
  skipThirdPartyRequests?: boolean;
  navigationOptions?: WaitForOptions & { referer?: string };
  renderAfterElementExists?: string;
  inlineCSS?: boolean;
  port?: number;
  ignoreErrorRequest?: boolean;
}

export abstract class RendererPlugin {
  protected originHtmlTemplate: string;
  protected response: HTTPResponse;
  protected page: Page;

  constructor(_html: string, _response: HTTPResponse, _page: Page) {
    this.originHtmlTemplate = _html;
    this.response = _response;
    this.page = _page;
  }

  abstract process(): Promise<string>;
}
